# Binance Order Book

Binance-inspired live crypto order book built with Bun, React, TypeScript, and Tailwind CSS.

## Overview

Live crypto order book for three spot markets, built as a close functional and visual replica of the Binance order book.

**Markets:** BTC/USDT · ETH/USDT · SOL/USDT

**Features:**

- Live bids and asks via Binance partial-depth WebSocket stream
- Market switching with proper socket teardown and reconnect
- Tick size selector (price grouping / decimals)
- Price rounding toggle
- Amount and Cumulative depth visualization modes
- Buy/Sell ratio bar (show/hide)
- Row hover with overlay stats (avg price, total amount, total value)
- Hover highlighting — rows closer to the center are visually distinguished
- _(Bonus)_ Row flash animations on price/quantity change

## Run Locally

```bash
bun install   # installs deps + runs `prepare` which registers git hooks via Husky
bun dev       # starts dev server at http://localhost:3000 (src/index.html entrypoint, hot reload)
bun test      # runs the full test suite (~164 tests, ~500ms)
```

Frontend runs on **port 3000**. No environment variables required.

> Deployment to Netlify or a similar service was not included in this submission.

## Architecture

The feature is split across these boundaries:

1. Feature composition at the page level
2. Market configuration
3. Exchange transport and normalized book state
4. Pure selector-based derivation for display data
5. Table-specific UI state
6. Presentational UI components

This keeps composition, data ingestion, transformation, interaction state, and rendering concerns separate.

## Implementation Notes

The implementation uses Binance partial-depth websocket streams directly from the browser.

A fuller local-book synchronization model using REST snapshot plus diff-depth reconciliation was considered, but not selected for this task because it adds substantially more protocol and synchronization complexity. The simpler partial-depth approach keeps the solution focused on:

- React architecture
- websocket lifecycle management
- market switching correctness
- UI fidelity
- rendering performance
- maintainable, explainable code

The code is organized to preserve a future upgrade path toward a deeper local-book implementation without rewriting the presentation layer.

## Assumptions And Tradeoffs

- Because the source stream is partial depth, grouped output can produce fewer display rows than a deeper local-book implementation would.
- At larger tick sizes, multiple streamed levels can collapse into the same price bucket, so the table may show fewer filled rows than Binance, which has access to deeper book state.
- The center price is derived from the best bid and ask available in the current streamed slice.
- UI paint cadence is intentionally calmer than raw incoming event cadence to avoid overly aggressive visual churn.

## Libraries Used

**Runtime**

- `react` / `react-dom`: component model and browser rendering.
- `tailwindcss` + `bun-plugin-tailwind`: utility-first styling integrated into the Bun build.
- `@radix-ui/react-popover`: accessible popover primitives — the only UI interaction complex enough to justify a third-party component.
- `clsx`: conditional class name composition.

**Dev / Testing**

- `husky`: git hook management, installed automatically on `bun install`.
- `@testing-library/react`: `renderHook` for hook integration tests.
- `happy-dom`: lightweight DOM environment for the test runner.
- `@biomejs/biome`: linter + formatter (replaces ESLint + Prettier).

## Tooling Config

| File                       | Purpose                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `biome.json`               | Linter + formatter (replaces ESLint + Prettier). 2-space indent, space style.                                                      |
| `tsconfig.json`            | Strict TypeScript — `strict`, `noUncheckedIndexedAccess`, `bundler` module resolution, path aliases (`@pages/*`, `@components/*`). |
| `bunfig.toml`              | Bun config — `happy-dom` test environment, test setup preload.                                                                     |
| `.husky/`                  | Git hook scripts tracked in the repo.                                                                                              |
| `.github/workflows/ci.yml` | CI pipeline definition.                                                                                                            |

## Tests

Run with:

```bash
bun test
```

**What is tested:** pure utility functions (`depth.ts`, `format.ts`), the selector pipeline (`orderBookSelectors.ts`), the table reducer and all 16 of its action types, WebSocket state factories and socket helpers, and hook-level integration for both `useBinancePartialDepth` and `useOrderBookTable`.

**Tools:** Bun's built-in test runner (Jest-compatible API), `@testing-library/react` for `renderHook`, `happy-dom` as the DOM environment.

**Why these:** the chosen modules contain all the meaningful logic — data transformation, bucketing, state transitions, WebSocket lifecycle. Presentational components are thin wrappers with no branching logic, so rendering tests would only assert markup and add noise rather than safety.

## Git Hooks

Managed by [Husky](https://typicode.github.io/husky). Installed automatically on `bun install` via the `prepare` script.

- **pre-commit** — runs `biome check --write src` and re-stages any auto-fixed files. Commits always land clean.
- **pre-push** — runs the full test suite. Blocks the push on failure.

Hooks can be bypassed with `git push --no-verify` — CI is the authoritative gate.

## CI

GitHub Actions workflow at `.github/workflows/ci.yml`. Runs on every push and pull request to `main`:

1. `bunx tsc --noEmit` — type check
2. `bunx @biomejs/biome ci src` — lint and format check (no auto-fix, fails on violations)
3. `bun test` — full test suite
