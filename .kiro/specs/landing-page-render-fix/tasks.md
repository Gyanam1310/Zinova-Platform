# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - ThemeProvider Infinite Loop, Favicon 404, Dashboard Stale Read
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior — they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope each property to the concrete failing case to ensure reproducibility
  - Test 1 — ThemeProvider render count: mount `ThemeProvider` with `localStorage.theme = "dark"`, assert render count ≤ 2 (from Bug Condition: `useEffect.deps CONTAINS "theme" AND useEffect CALLS setTheme`)
  - Test 2 — Favicon href: parse `index.html`, assert `link[rel="icon"]` href equals `/Zinova_logo.png` (from Bug Condition: `faviconPath ENDS_WITH ".PNG"`)
  - Test 3 — Dashboard token read location: mount `Dashboard`, assert `localStorage.getItem("authToken")` is NOT called at the top level of the component body (from Bug Condition: `Dashboard.tokenRead IS_OUTSIDE useEffect`)
  - Run all tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found (e.g., render count > 2, href = `/Zinova_logo.PNG`, token read outside effect)
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Theme Toggle, Routing, and Auth Redirect Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: toggling theme on unfixed code persists to `localStorage` and applies/removes `dark` class on `document.documentElement`
  - Observe: navigating to `/login`, `/signup`, `/dashboard` renders the correct page on unfixed code
  - Observe: accessing `/dashboard` without a token redirects to `/login` on unfixed code
  - Write PBT 1: for all sequences of `toggleTheme()` calls, the DOM class always matches the final theme state and `localStorage.theme` is updated (from Preservation Requirements 3.4)
  - Write PBT 2: for all auth token states (present / absent), `Dashboard` redirects when token is absent and renders when present (from Preservation Requirements 3.3)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.3, 3.4, 3.7_

- [x] 3. Fix landing page render bugs

  - [x] 3.1 Fix ThemeProvider infinite re-render loop
    - Split the single `useEffect` into two separate effects
    - Effect 1: `[]` dependency — reads `localStorage.getItem("theme")` and calls `setTheme` only if a saved value exists; handles `null` case without calling `setTheme`
    - Effect 2: `[theme]` dependency — only applies/removes `dark` class on `document.documentElement`; NO `setTheme` call
    - Remove `setTheme` from the `[theme]` effect entirely
    - _Bug_Condition: `ThemeProvider.useEffect.deps CONTAINS "theme" AND useEffect CALLS setTheme`_
    - _Expected_Behavior: `ThemeProvider` mounts, reads localStorage once, applies DOM class, does NOT trigger further re-renders_
    - _Preservation: `toggleTheme` continues to persist theme to localStorage and apply the `dark` class_
    - _Requirements: 2.2, 2.3, 3.4_

  - [x] 3.2 Fix favicon href casing in index.html
    - Change `href="/Zinova_logo.PNG"` to `href="/Zinova_logo.png"` in the `<link rel="icon">` tag
    - _Bug_Condition: `index.html.faviconPath ENDS_WITH ".PNG"`_
    - _Expected_Behavior: favicon resolves without 404 on case-sensitive file systems_
    - _Requirements: 2.1, 2.4_

  - [x] 3.3 Move Dashboard authToken read inside useEffect
    - Remove `const token = localStorage.getItem("authToken")` from the component body
    - Read the token inside the existing `useEffect` and perform the redirect check there
    - Remove `token` from the `useEffect` dependency array (replace with `navigate` only)
    - _Bug_Condition: `Dashboard.tokenRead IS_OUTSIDE useEffect`_
    - _Expected_Behavior: token read occurs after mount, eliminating stale closure risk_
    - _Preservation: unauthenticated access to `/dashboard` still redirects to `/login`_
    - _Requirements: 2.5, 3.3_

  - [x] 3.4 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - ThemeProvider Infinite Loop, Favicon 404, Dashboard Stale Read
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - **EXPECTED OUTCOME**: All three tests PASS (confirms all bugs are fixed)
    - _Requirements: 2.2, 2.4, 2.5_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Theme Toggle, Routing, and Auth Redirect Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass; ask the user if questions arise
