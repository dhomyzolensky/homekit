# Contributing to Homekit

Thank you for your interest in contributing to Homekit! This guide explains how to get started.

## Ways to contribute

- **Report bugs** — Open a [bug report](https://github.com/dhomyzolensky/homekit/issues/new?template=bug_report.yml)
- **Request features** — Open a [feature request](https://github.com/dhomyzolensky/homekit/issues/new?template=feature_request.yml)
- **Fix bugs** — Browse [issues labeled `bug`](https://github.com/dhomyzolensky/homekit/labels/bug)
- **Build features** — Browse [issues labeled `enhancement`](https://github.com/dhomyzolensky/homekit/labels/enhancement)
- **Improve docs** — Typos, clarity, examples — all welcome

## Development setup

### Prerequisites

- macOS 13 (Ventura) or later
- Node.js 18+
- Apple Home configured on your Mac

### Setup

```bash
# Fork the repo, then clone your fork
git clone https://github.com/<your-username>/homekit.git
cd homekit

# Install dependencies
npm install

# Build all packages
npm run build

# Run in watch mode during development
npm run dev
```

### Project structure

```
homekit/
├── packages/
│   ├── cli/        homekit-cli — Terminal interface
│   ├── mcp/        homekit-mcp — MCP server
│   └── openclaw/   @openclaw/homekit — Plugin
├── apps/
│   └── macos/      Native macOS app (Swift/SwiftUI)
└── docs/           Documentation
```

## Making a change

1. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/my-bug
   # or
   git checkout -b feat/my-feature
   ```

2. **Make your changes** and commit with a clear message:
   ```bash
   git commit -m "fix(cli): handle missing auth token gracefully"
   ```
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation only
   - `refactor:` — code change, no feature/fix
   - `test:` — adding or updating tests
   - `chore:` — tooling, CI, dependencies

3. **Update `CHANGELOG.md`** under `[Unreleased]`

4. **Open a Pull Request** against `main`

## Code style

- TypeScript everywhere
- Run `npm run lint` before committing
- Keep functions small and named clearly
- Add JSDoc comments to all exported symbols

## Reporting security issues

Please **do not** open a public issue for security vulnerabilities. Instead, use [GitHub's private security advisory](https://github.com/dhomyzolensky/homekit/security/advisories/new). See [SECURITY.md](SECURITY.md) for details.

## License

By contributing, you agree your contributions will be licensed under the [MIT License](LICENSE).
