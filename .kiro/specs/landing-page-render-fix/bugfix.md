# Bugfix Requirements Document

## Introduction

The Zinova React + Vite TypeScript app fails to render the landing page correctly after merge conflicts were resolved. The browser tab shows "Untitled", the landing page does not render, and the app may reload continuously. The root causes are: a `useEffect` dependency loop in `ThemeProvider`, a broken favicon path (case mismatch), and residual import/export issues introduced during the merge. No components need to be rewritten — only targeted fixes are required.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the app loads in the browser THEN the browser tab displays "Untitled" instead of the correct page title

1.2 WHEN `ThemeProvider` mounts THEN the `useEffect` runs with `[theme]` as a dependency, reads `savedTheme` from `localStorage`, calls `setTheme(savedTheme)` which changes `theme`, which re-triggers the effect, causing a continuous re-render loop

1.3 WHEN the app is in the re-render loop THEN the landing page components (Hero, Navbar, Features, etc.) never fully mount and the page appears blank

1.4 WHEN the browser requests the favicon THEN it fails because `index.html` references `/Zinova_logo.PNG` (uppercase extension) but the file on disk is `Zinova_logo.png` (lowercase), causing a 404 on case-sensitive file systems

1.5 WHEN `Dashboard` mounts THEN it reads `localStorage.getItem("authToken")` outside of `useEffect`, which is evaluated on every render and can cause stale closure issues

### Expected Behavior (Correct)

2.1 WHEN the app loads in the browser THEN the browser tab SHALL display "Zinova - Empowering Sustainability Through Technology"

2.2 WHEN `ThemeProvider` mounts THEN the `useEffect` SHALL run only once on mount to read `localStorage` and set the initial theme, and a separate `useEffect` with `[theme]` SHALL only apply the `dark` class to `document.documentElement` without calling `setTheme`

2.3 WHEN the app loads without a re-render loop THEN the landing page SHALL render all sections (Navbar, Hero, About, Features, FoodFlow, ValueProposition, ImpactCalculator, GlobalImpact, CallToAction, Contact, Footer)

2.4 WHEN the browser requests the favicon THEN it SHALL resolve correctly using the lowercase path `/Zinova_logo.png`

2.5 WHEN `Dashboard` mounts THEN the `authToken` check SHALL occur inside `useEffect` so it does not contribute to render instability

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user navigates to `/login` THEN the system SHALL CONTINUE TO render the Login page with OTP flow

3.2 WHEN a user navigates to `/signup` THEN the system SHALL CONTINUE TO render the Signup page with OTP flow

3.3 WHEN a user navigates to `/dashboard` without an auth token THEN the system SHALL CONTINUE TO redirect to `/login`

3.4 WHEN a user toggles the theme THEN the system SHALL CONTINUE TO persist the theme choice in `localStorage` and apply the correct `dark` class

3.5 WHEN the `CallToAction` form is submitted THEN the system SHALL CONTINUE TO validate inputs and call the FastAPI submission endpoint

3.6 WHEN any route is not found THEN the system SHALL CONTINUE TO render the NotFound page

3.7 WHEN the app loads THEN all existing components (ScrollReveal, AnimatedCounter, MobileMenu, etc.) SHALL CONTINUE TO function without errors

---

## Bug Condition Pseudocode

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type AppState
  OUTPUT: boolean

  RETURN (
    ThemeProvider.useEffect.deps CONTAINS "theme"
    AND ThemeProvider.useEffect CALLS setTheme
  )
  OR (index.html.faviconPath ENDS_WITH ".PNG")
END FUNCTION
```

```pascal
// Property: Fix Checking
FOR ALL X WHERE isBugCondition(X) DO
  result ← renderApp'(X)
  ASSERT result.tabTitle = "Zinova - Empowering Sustainability Through Technology"
  AND result.landingPageVisible = true
  AND result.renderLoopDetected = false
END FOR
```

```pascal
// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderApp(X) = renderApp'(X)
END FOR
```
