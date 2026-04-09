# Landing Page Render Fix — Bugfix Design

## Overview

The Zinova app fails to render its landing page correctly after merge conflict resolution. Three bugs are responsible:

1. **ThemeProvider infinite loop** — `useEffect` has `[theme]` as a dependency and calls `setTheme` inside it, creating a cycle: state change → effect → state change → effect → ...
2. **Favicon 404 / "Untitled" tab** — `index.html` references `/Zinova_logo.PNG` (uppercase) but the file on disk is `Zinova_logo.png` (lowercase), causing a 404 on case-sensitive file systems. The tab title is unaffected by this bug directly, but the broken favicon is a visible symptom alongside the blank page.
3. **Dashboard localStorage read outside useEffect** — `localStorage.getItem("authToken")` is called at the component's top level, making it susceptible to stale closure issues on re-renders.

The fix is surgical: split the ThemeProvider effect, correct the favicon path casing, and move the Dashboard token read inside `useEffect`. No components need to be rewritten.

---

## Glossary

- **Bug_Condition (C)**: The set of code states that trigger the defective behavior — specifically: a `useEffect` with `[theme]` dependency that calls `setTheme`, OR a favicon `href` ending in `.PNG`
- **Property (P)**: The desired behavior when the bug condition holds — the app renders without looping, the tab shows the correct title, and the favicon resolves
- **Preservation**: All existing behaviors unrelated to the three bugs that must remain unchanged after the fix
- **ThemeProvider**: The component in `src/components/ThemeProvider.tsx` that manages light/dark theme state and applies the `dark` class to `document.documentElement`
- **isBugCondition**: Pseudocode function that returns `true` when the current code state contains any of the three bugs
- **renderLoop**: A React re-render cycle that never terminates because a `useEffect` unconditionally triggers a state update that re-runs the same effect

---

## Bug Details

### Bug Condition

The bug manifests in three distinct code locations. The most severe is the `ThemeProvider` effect loop — it causes the landing page to never fully mount. The favicon path mismatch causes a 404 and a broken icon. The Dashboard localStorage read is a render-stability risk.

**Formal Specification:**

```
FUNCTION isBugCondition(X)
  INPUT: X of type CodeState
  OUTPUT: boolean

  RETURN (
    ThemeProvider.useEffect.deps CONTAINS "theme"
    AND ThemeProvider.useEffect CALLS setTheme(savedTheme)
  )
  OR (
    index.html.faviconHref ENDS_WITH ".PNG"
  )
  OR (
    Dashboard.tokenRead IS_OUTSIDE useEffect
  )
END FUNCTION
```

### Examples

- **Bug 1 (ThemeProvider loop)**: On mount, `theme` is `"light"`. The effect reads `savedTheme = "light"` from localStorage and calls `setTheme("light")`. This triggers a re-render, which re-runs the effect, which calls `setTheme("light")` again — infinite loop. Expected: effect runs once on mount to read localStorage, then a separate effect applies the DOM class.
- **Bug 2 (Favicon 404)**: Browser requests `/Zinova_logo.PNG`. On Linux/macOS (case-sensitive FS), the file `public/Zinova_logo.png` is not found → 404. Expected: `href="/Zinova_logo.png"` resolves correctly.
- **Bug 3 (Dashboard stale read)**: `const token = localStorage.getItem("authToken")` runs on every render. If the component re-renders before the token is set, `token` is stale. Expected: token read inside `useEffect` so it runs after mount.
- **Edge case**: If `localStorage` has no saved theme, the effect still runs with `theme = "light"`, applies the class, and loops. The fix must handle the `null` case without calling `setTheme`.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Theme toggle via `ThemeToggle` component must continue to persist the chosen theme to `localStorage` and apply/remove the `dark` class on `document.documentElement`
- Login, Signup, and Dashboard routes must continue to render and function as before
- Redirect from `/dashboard` to `/login` when no auth token is present must continue to work
- All landing page sections (Navbar, Hero, About, Features, FoodFlow, ValueProposition, ImpactCalculator, GlobalImpact, CallToAction, Contact, Footer) must continue to render
- Form submission via `CallToAction` must continue to call the FastAPI endpoint
- `NotFound` page must continue to render for unmatched routes

**Scope:**
All inputs that do NOT involve the three bug conditions should be completely unaffected by this fix. This includes:
- Mouse/touch interactions with any component
- Route navigation between `/`, `/login`, `/signup`, `/dashboard`
- Theme toggle interactions
- Form submissions

---

## Hypothesized Root Cause

1. **Single useEffect doing two jobs (ThemeProvider)**: The effect was written to both initialize theme from localStorage AND apply the DOM class in one block. Adding `[theme]` to the dependency array (correct for the DOM class update) also causes the initialization logic (`setTheme`) to re-run on every theme change, creating the loop.

2. **Case mismatch from file system inconsistency (favicon)**: The file was likely uploaded or committed as `Zinova_logo.PNG` on a case-insensitive system (Windows/macOS), then the reference was written as `.PNG`. On a case-sensitive system (Linux, Docker), the file resolves as `.png` but the HTML still points to `.PNG`.

3. **Top-level side effect in Dashboard**: `localStorage.getItem` was placed outside `useEffect` for convenience, but this means it runs synchronously on every render pass. During the ThemeProvider loop, Dashboard may re-render multiple times, making the stale read a compounding issue.

---

## Correctness Properties

Property 1: Bug Condition — ThemeProvider Renders Without Loop

_For any_ app state where `isBugCondition` returns true (specifically: the ThemeProvider useEffect has `[theme]` dependency and calls `setTheme`), the fixed `ThemeProvider` SHALL mount, read localStorage once, apply the correct DOM class, and NOT trigger further re-renders — resulting in the landing page fully rendering.

**Validates: Requirements 2.2, 2.3**

Property 2: Bug Condition — Favicon Resolves Correctly

_For any_ app state where `isBugCondition` returns true (specifically: favicon href ends with `.PNG`), the fixed `index.html` SHALL reference `/Zinova_logo.png` (lowercase), resolving without a 404 on case-sensitive file systems.

**Validates: Requirements 2.1, 2.4**

Property 3: Bug Condition — Dashboard Token Read Is Stable

_For any_ render of `Dashboard` where `isBugCondition` returns true (specifically: token read is outside `useEffect`), the fixed `Dashboard` SHALL read `authToken` inside `useEffect` only, eliminating stale closure risk.

**Validates: Requirements 2.5**

Property 4: Preservation — Non-Buggy Behaviors Unchanged

_For any_ input where the bug condition does NOT hold (isBugCondition returns false), the fixed code SHALL produce exactly the same behavior as the original code, preserving theme toggling, routing, form submission, and all landing page section rendering.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

---

## Fix Implementation

### Changes Required

**File 1**: `src/components/ThemeProvider.tsx`

**Function**: `ThemeProvider`

**Specific Changes**:
1. **Split the single useEffect into two**:
   - Effect 1: dependency array `[]` (mount only) — reads `localStorage.getItem("theme")` and calls `setTheme` if a saved value exists
   - Effect 2: dependency array `[theme]` — only applies/removes the `dark` class on `document.documentElement`, no `setTheme` call
2. **Remove `setTheme` from the `[theme]` effect** entirely — this is the root cause of the loop

```tsx
// Effect 1: initialize from localStorage (runs once on mount)
useEffect(() => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

// Effect 2: apply DOM class when theme changes
useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [theme]);
```

---

**File 2**: `index.html`

**Specific Changes**:
1. **Fix favicon href casing**: Change `href="/Zinova_logo.PNG"` → `href="/Zinova_logo.png"`

---

**File 3**: `src/pages/Dashboard.tsx`

**Function**: `Dashboard`

**Specific Changes**:
1. **Move token read inside useEffect**: Remove `const token = localStorage.getItem("authToken")` from the component body and read it inside the existing `useEffect`

```tsx
useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/login", { replace: true });
  }
}, [navigate]);
```

---

## Testing Strategy

### Validation Approach

Two-phase approach: first surface counterexamples on unfixed code to confirm root cause analysis, then verify the fix works and preserves all existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Demonstrate the bugs on UNFIXED code to confirm root cause analysis. If tests don't fail as expected, re-hypothesize.

**Test Plan**: Write tests that mount `ThemeProvider` and count renders, check favicon href value, and check where the token read occurs. Run on unfixed code to observe failures.

**Test Cases**:
1. **ThemeProvider render count test**: Mount `ThemeProvider` with a mock localStorage containing a saved theme. Assert render count stays ≤ 2. Will fail on unfixed code (render count grows unbounded).
2. **ThemeProvider DOM class test**: Mount `ThemeProvider` with `savedTheme = "dark"`. Assert `document.documentElement.classList.contains("dark")` is true after mount. Will fail on unfixed code due to loop.
3. **Favicon path test**: Parse `index.html` and assert `link[rel="icon"]` href equals `/Zinova_logo.png`. Will fail on unfixed code (`.PNG`).
4. **Dashboard stability test**: Mount `Dashboard` with a valid token. Assert it renders without redirect. May surface stale read issues on unfixed code.

**Expected Counterexamples**:
- `ThemeProvider` render count exceeds threshold (loop confirmed)
- Favicon href contains `.PNG` (case mismatch confirmed)
- Possible causes: single effect doing two jobs, file uploaded on case-insensitive OS

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behavior.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition(X) DO
  result := renderApp_fixed(X)
  ASSERT result.renderLoopDetected = false
  ASSERT result.tabTitle = "Zinova - Empowering Sustainability Through Technology"
  ASSERT result.faviconHref ENDS_WITH ".png"
  ASSERT result.landingPageVisible = true
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderApp_original(X) = renderApp_fixed(X)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many input combinations (theme values, auth states, route paths) automatically and catches edge cases that manual tests miss.

**Test Cases**:
1. **Theme toggle preservation**: Observe that toggling theme on unfixed code persists to localStorage and applies the DOM class. Write PBT to verify this continues after fix across arbitrary toggle sequences.
2. **Route preservation**: Verify `/login`, `/signup`, `/dashboard`, `*` routes render correctly before and after fix.
3. **Dashboard redirect preservation**: Verify unauthenticated access to `/dashboard` still redirects to `/login` after fix.

### Unit Tests

- Test `ThemeProvider` mounts without triggering more than 2 renders
- Test `ThemeProvider` applies `dark` class when `savedTheme = "dark"` in localStorage
- Test `ThemeProvider` removes `dark` class when `savedTheme = "light"`
- Test `ThemeProvider` defaults to `"light"` when localStorage is empty
- Test `Dashboard` reads token inside `useEffect` (not at top level)
- Test favicon `href` in `index.html` is lowercase `.png`

### Property-Based Tests

- Generate arbitrary sequences of `toggleTheme()` calls and verify the DOM class always matches the final theme state
- Generate arbitrary localStorage states (theme present/absent, various values) and verify `ThemeProvider` never causes more than 2 renders on mount
- Generate arbitrary auth token states and verify `Dashboard` always redirects when token is absent and renders when present

### Integration Tests

- Full app mount: verify landing page renders all sections without blank screen
- Theme persistence: toggle theme, reload app, verify theme is restored from localStorage
- Auth flow: navigate to `/dashboard` without token → redirected to `/login` → log in → redirected to `/dashboard`
- Favicon: verify browser network request for favicon returns 200 (not 404)
