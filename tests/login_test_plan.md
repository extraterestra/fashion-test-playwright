# Login Page Test Plan

## Executive summary

This document contains a comprehensive test plan for the login page at:

http://localhost:4000/fashionhub/login.html

Credentials provided for positive tests:
- Username: `demouser`
- Password: `fashion123`

Purpose: validate functional correctness, input validation, error handling, security, accessibility, and usability for the login page. Tests assume a fresh browser session (no existing authentication state) unless a scenario states otherwise.

## Application / Page overview

Assumptions (inferred from typical login pages — adjust if your implementation differs):
1. The page contains a username (or email) input field, a password input field, and a login button.
2. There may be auxiliary elements: "Remember me" checkbox, "Forgot password" link, password visibility toggle, and an area for error messages.
3. Successful login redirects the user to an authenticated landing page (dashboard/home) and sets a session cookie.
4. Running on `localhost` may not use HTTPS; security expectations are relative to local dev environment.

Starting state for every scenario: a fresh browser or incognito context, no stored cookies/session, and the app server running at `http://localhost:4000`.

## Test setup / prerequisites

- The web server must be running and serving `login.html` at the URL above.
- Tester has the credentials listed earlier.
- Use supported browsers (Chrome/Chromium via Playwright, Firefox, Safari) for cross-browser checks.
- For automated tests, reset storage between tests (clear cookies, localStorage, sessionStorage).

## Success criteria

- All critical flows (happy path, validation, error messages) behave as expected.
- No sensitive data is leaked in URLs or page source in an accessible way.
- Accessibility basic checks pass (labels, keyboard navigation, focus order).
- Performance: page and login response should be reasonably fast (suggested: response < 2s on dev machine).

## High-level user journeys / critical paths

1. Successful login with valid credentials.
2. Failed login with invalid credentials (username or password wrong).
3. Input validation (empty inputs, too long, whitespace-only, invalid characters).
4. Security edge cases (SQL injection, XSS attempt, password leakage in URL).
5. Usability & accessibility (keyboard-only navigation, focus states, form labels).
6. Session behavior (cookies set, logout works, protected pages blocked when not authenticated).

---

## Test scenarios

Each scenario contains:
- Title
- Assumptions / starting state (fresh state unless noted)
- Steps (numbered)
- Expected results / verification
- Success / failure criteria

### 1. Happy path — Successful login

Assumptions: server running, no prior session.

Steps:
1. Navigate to `http://localhost:4000/fashionhub/login.html`.
2. Verify page loaded (HTTP 200) and login form is visible.
3. Enter `demouser` into the username field.
4. Enter `fashion123` into the password field.
5. Click the Login button (or press Enter while focus in password field).

Expected results:
- The page performs authentication and navigates away from the login page to an authenticated landing page (URL changes from `/login.html`).
- No visible error messages are shown.
- A session cookie (or other authentication token) is set in the browser.
- The landing page shows an element that indicates a successful login (e.g., "Logout", "My account", or a welcome message).

Success criteria: Presence of a valid session cookie and display of authenticated UI. Failure: still on login page and an error message shown.

---

### 2. Negative — Incorrect password

Assumptions: fresh session.

Steps:
1. Open the login page.
2. Enter `demouser` as username.
3. Enter `wrongpassword` as password.
4. Click Login.

Expected results:
- Login fails.
- An accessible error message is shown (e.g., "Invalid username or password").
- User remains on the login page.
- No session cookie for authenticated session is set.

Success criteria: Error message displayed and no authentication granted.

---

### 3. Negative — Unknown username

Assumptions: fresh session.

Steps:
1. Open login page.
2. Enter `unknownuser` as username.
3. Enter `fashion123` as password.
4. Click Login.

Expected results:
- Login fails with appropriate error message.
- No session cookie set.

Success criteria: Authentication not granted; meaningful error message.

---

### 4. Validation — Empty Username and/or Password

Assumptions: fresh session.

Scenarios:
4.1 Empty username, non-empty password
4.2 Non-empty username, empty password
4.3 Both fields empty

Steps (generic):
1. Open login page.
2. Leave field(s) empty according to sub-scenario.
3. Click Login.

Expected results:
- Client-side validation (if present) prevents submission and shows inline validation for the empty field(s).
- If no client-side validation, server responds with an error message, and user remains on login page.
- No session cookie set.

Success criteria: Clear, accessible validation messages for empty fields.

---

### 5. Validation — Whitespace-only and trimming

Steps:
1. Open login page.
2. Enter username as `   demouser   ` (leading/trailing spaces) and valid password, click Login.

Expected results:
- The app either trims input and allows login (recommended), or rejects input with a clear message. It should not create ambiguous user accounts.

Success criteria: Behavior is consistent and documented. If trimming is implemented, login succeeds.

---

### 6. Boundary / Length testing

Steps:
1. Open page.
2. Enter extremely long username (e.g., 1,000 characters) and/or password.
3. Click Login.

Expected results:
- Input length is either constrained client-side or the server rejects the request with a controlled error.
- No unhandled errors or stack traces are displayed.

Success criteria: App handles long input gracefully without exposing stack traces.

---

### 7. Special characters and encoding

Steps:
1. Try usernames and passwords with special characters: `<>"'%;()&`, unicode characters, and emojis.
2. Click Login.

Expected results:
- The server handles input safely and does not interpret these characters as markup or SQL commands.
- No XSS or injection occurs and any error messaging is encoded/escaped.

Success criteria: No reflected XSS or abnormal behavior.

---

### 8. Security — SQL injection attempt (negative test)

Steps:
1. Open login page.
2. Enter username: `demouser' OR '1'='1` and password: `anything`.
3. Click Login.

Expected results:
- Authentication fails or the input is safely handled; the app does not authenticate based on injection.
- No DB error or stack trace is shown to the user.

Success criteria: Injection attempt does not result in authentication or error leakage.

---

### 9. Security — XSS attempt (negative test)

Steps:
1. Open login page.
2. Enter a payload like `<script>alert(1)</script>` in username or password fields and submit.

Expected results:
- Input is not executed as script when echoed back; any reflected content is safely escaped.
- No popups, no script execution.

Success criteria: No script execution and safe handling of user input.

---

### 10. UI/UX — Password masking & reveal

Steps:
1. Verify the password field masks input by default.
2. If a password visibility toggle exists, click it to reveal password, and click again to re-mask.

Expected results:
- Password is masked by default.
- Visibility toggle toggles the input type between `password` and `text` and is keyboard accessible.

Success criteria: Toggle works and is accessible.

---

### 11. Accessibility — Labels, ARIA, and keyboard navigation

Steps:
1. Inspect that the username and password fields have associated labels (or aria-labels).
2. Navigate the page using keyboard only (Tab to focus fields, Enter to submit).
3. Check that error messages are announced or linked to fields (e.g., aria-describedby).

Expected results:
- Form controls have accessible labels.
- Focus order is logical and keyboard submit works.
- Error messages are accessible to screen readers.

Success criteria: No critical accessibility issues in login flow.

---

### 12. Remember Me behavior (if present)

Assumptions: If a "Remember me" checkbox is present, this scenario validates persistence.

Steps:
1. Open login page.
2. Enter valid credentials and check "Remember me".
3. Login and verify successful login.
4. Close browser or context, reopen, and navigate to the site.

Expected results:
- With "Remember me" checked, either the session persists across browser restarts or the site offers a persistent login token.
- With it unchecked, session does not persist beyond the session.

Success criteria: Persistence matches expectation and is secure (e.g., token stored securely).

---

### 13. Rate limiting / brute-force protection (if implemented)

Steps:
1. From a fresh session, attempt multiple failed logins (e.g., 10 attempts) using invalid passwords for the same user.

Expected results:
- The system should throttle or temporarily block further attempts after a threshold, or show increasing delays/warnings.
- No sensitive information is leaked in error messages.

Success criteria: Rate-limiting or lockout behavior is present and documented.

---

### 14. Session management & protected pages

Steps:
1. Login successfully.
2. Navigate to a known protected page (e.g., dashboard).
3. Click Logout.
4. Attempt to access the protected page again.

Expected results:
- After logout, protected pages should redirect back to login.
- Session cookie is cleared or invalidated.

Success criteria: Logout invalidates the session and blocks protected pages.

---

### 15. Logging and error handling (observability)

Steps:
1. Trigger an authentication error (invalid password) and review server logs if accessible.

Expected results:
- The system logs authentication failures in a way that doesn't expose sensitive info.
- No stack traces or internal errors are returned to the client.

Success criteria: Errors are logged safely and client-facing messages are user-friendly.

---

## Test data matrix (quick reference)

- Valid: `demouser` / `fashion123`
- Invalid password: `demouser` / `wrongpassword`
- Invalid username: `unknownuser` / `fashion123`
- SQL injection: `demouser' OR '1'='1`
- XSS sample: `<script>alert(1)</script>`
- Long input: 1000+ characters
- Whitespace: `   demouser   `

## Execution notes

- Automate happy path and common negative tests using Playwright (or your preferred E2E framework). Keep tests independent and reset storage between tests.
- For security tests, run them against test/staging environments where exploit attempts are safe and permitted.
- Accessibility checks can be automated with axe-core or Playwright accessibility snapshot assertions.

## Deliverables

- This test plan (this file) for manual or automated execution.
- Suggested next step: convert these scenarios into Playwright tests. I can generate a starter Playwright test file that implements the happy path and a few negative tests.

## Appendix: Quick Playwright test checklist (automation hints)

- BeforeEach: create new browser context, navigate to `login.html`.
- AfterEach: clear cookies and context.
- Assertions:
  - `expect(page).toHaveURL(/login.html/).not()` for post-login redirect checks (or use a positive assertion for expected landing path).
  - `expect(page.locator('text=Invalid')).toBeVisible()` for error messages.
  - `expect(context.cookies()).toContainEqual(expect.objectContaining({ name: 'session' }))` to assert cookie presence (adjust name as used by your app).

---

End of test plan.
