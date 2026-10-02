# Gotchas

- `src/index.css` is plain CSS: `//` comments silently swallow the next rule. Use `/* */`.
- Ad-hoc puppeteer scripts must run from the project root so `node_modules` resolves; scratchpad scripts fail on import.
- Browser tests need headful Chrome: `xvfb-run -a npm test`.
- Absolute ::before insets start at the padding box; add border width when sizing invisible tap areas.
- Kill leftover `vite preview` servers after hung scripts; a stale one blocks the port and makes scripts wait forever.
- Art motion custom properties (--move, --tint, --reach…) are registered non-inheriting via @property; otherwise children of a swaying group double-animate.
- Art motion rules must be scoped `.project-art .art-x`; bare `.art-x` loses to the base `[class*="art-"]` rule on specificity.
