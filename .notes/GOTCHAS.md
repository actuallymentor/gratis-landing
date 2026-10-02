# Gotchas

- `src/index.css` is plain CSS: `//` comments silently swallow the next rule. Use `/* */`.
- Ad-hoc puppeteer scripts must run from the project root so `node_modules` resolves; scratchpad scripts fail on import.
- Browser tests need headful Chrome: `xvfb-run -a npm test`.
