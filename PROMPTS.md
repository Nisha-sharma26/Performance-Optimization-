# PROMPTS.md - AI Prompt Traceability Log

**Ticket ID:** ENG-84718  
**Epic:** Core Infrastructure Overhaul  
**Assignee:** Nisha Sharma [PDIT-INT-1154]  
**Reporter:** Amit Sharma (Senior Staff Engineer)  
**Project:** Performance Optimization for News Blog  

---

## Overview & Workflow Strategy

This project followed a strict **Test-Driven Development (TDD) Vibe Coding Workflow** in partnership with **Antigravity AI**:

1. **Prompt 1: Test-Driven Development Setup (Vitest + Acceptance Criteria)**
2. **Prompt 2: Component Architecture & Domain Logic Implementation**
3. **Prompt 3: Monochromatic Corporate Design System & Accessibility Polish**
4. **Prompt 4: Type-Checking, Linting, & Production Build Verification**

---

## Sequence of Prompts

### Prompt 1: TDD Test Suite Creation
> **User Instructions:**  
> *"Feed the Acceptance Criteria and NFRs for ENG-84718 to Antigravity. Instruct the AI to write the test suite first (using Vitest) to verify all Happy Path stories, Unhappy Path edge cases (Empty States, Bad Connectivity loading indicators, Invalid Input red highlighting), and NFRs (Accessibility, Telemetry logging, XSS sanitization). Do not write the final code until the tests are written and failing."*

**Outcome:**  
- Created `src/test/PerformanceOptimization.test.tsx` covering all 9 test scenarios.
- Executed `npm run test` to verify that all 9 tests failed prior to implementation (TDD Red phase).

---

### Prompt 2: Core Domain Implementation & Edge Case Handling
> **User Instructions:**  
> *"Implement the Performance Optimization application for News Blog floor staff to replace manual paper and Excel systems. Wrap heavy calculations in `useMemo` and event handlers in `useCallback`. Ensure input validation highlights missing/malformed fields in red (`.input-error`, `aria-invalid="true"`), sanitize text inputs with DOMPurify against XSS, handle Slow 3G connectivity with a visual loading indicator (`data-testid="loading-indicator"`), display a friendly 'No performance records found' empty state when search filters return zero results, and log telemetry pings `[Analytics] User interacted with Performance Optimization`."*

**Outcome:**  
- Created `src/types/performance.ts` domain models.
- Created `src/utils/security.ts` with DOMPurify XSS sanitization helper.
- Created `src/utils/telemetry.ts` logger emitting console analytics pings and live UI event stream.
- Created `src/components/MetricsOverview.tsx` (wrapped in `useMemo`).
- Created `src/components/NetworkSimulator.tsx` (Online, Slow 3G, Offline mode).
- Created `src/components/PerformanceTable.tsx` (sorting, filtering, empty state, async audit trigger).
- Created `src/components/RecordFormModal.tsx` (form validation, red error highlighting, sanitization).
- Created `src/components/TelemetryDrawer.tsx` (live log drawer).
- Assembled full application state in `src/App.tsx`.

---

### Prompt 3: Monochromatic Corporate Design System & Accessibility
> **User Instructions:**  
> *"Adhere strictly to a clean, monochromatic corporate design system. Do not introduce rogue hex colors. Maintain consistent 16px/32px spacing steps. Ensure 100% WCAG AAA high-contrast readability for floor staff under factory/newsroom lighting. Implement complete ARIA labeling, roles, and keyboard focusability."*

**Outcome:**  
- Written `src/index.css` with CSS custom properties `--mono-950` to `--mono-50`.
- Applied clear focus outlines, high-contrast badges, status pills, dark/light contrast cards, and modal overlay backdrop blur.

---

### Prompt 4: Verification, Type-Safety & Build Alignment
> **User Instructions:**  
> *"Ensure all type imports use `import type` for TypeScript `verbatimModuleSyntax` compatibility. Fix any test assertion matchers, run `oxlint` with 0 warnings, run `vitest` with 100% pass rate, and execute `npm run build` to verify clean production compilation."*

**Outcome:**  
- Updated type imports across all TSX files.
- Configured `@testing-library/jest-dom/vitest` in `src/test/setup.ts`.
- **Vitest Result:** 9/9 tests passed (100%).
- **Oxlint Result:** 0 warnings, 0 errors across 14 files.
- **Vite Build Result:** Clean bundle output (`dist/assets/index-CRxeFxSC.js`).

---

## Definition of Done (DoD) Checklist

- [x] Code compiles and runs successfully without fatal errors (`npm run build`).
- [x] Passes Linting (Zero ESLint/Oxlint warnings, no unused imports).
- [x] Matches all Happy and Unhappy Path Acceptance Criteria.
- [x] The `PROMPTS.md` file is included in the root directory.
- [x] No real API keys or sensitive PII are hardcoded in the source.
