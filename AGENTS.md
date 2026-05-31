# AGENTS.md — Malom Invest Project
## Standing Instructions for Antigravity AI

This file governs agent behavior for every session on the **Malom Invest** project.
Located at: `C:\dev\malom-invest\AGENTS.md`

---

## Project Identity

| Field | Value |
|-------|-------|
| **Project** | Malom Invest corporate landing page |
| **Stack** | Static HTML + Tailwind CSS v3 (CLI) + Vanilla JS |
| **Build tool** | `npm run build` → `dist/output.css` |
| **Deploy targets** | Vercel (primary), Netlify (alternative) |
| **Working directory** | `C:\dev\malom-invest` |
| **Source backup** | `G:\Мой диск\AIMAX\МАЛОМ\Сайт 2` (read-only, do not delete) |
| **Form backend** | Formspree (no server code, ever) |

---

## Autonomy Rules

### ✅ ALWAYS EXECUTE WITHOUT ASKING

These command categories are pre-approved for this project. Execute immediately,
log what you did, continue:

```
npm run *              # build, dev, serve, lint — all npm scripts
npm install            # add dependencies (within project)
npx *                  # any npx invocation for project tooling
tailwindcss *          # Tailwind CLI — build, watch, minify
node *.js              # Run local Node scripts
git add *              # Stage files
git commit *           # Commit (any message)
git status             # Check status
git log *              # Read history
git diff *             # View diffs
git branch *           # List/create branches
git checkout *         # Switch branches
git stash *            # Stash changes
git remote -v          # View remotes
git fetch *            # Fetch remote refs
git pull               # Pull (non-force)
robocopy *             # File mirroring
New-Item *             # Create dirs/files
Copy-Item *            # Copy files
Move-Item *            # Move files
Remove-Item *          # Delete (within project dir only)
Get-Content *          # Read files
Get-ChildItem *        # List files
Test-Path *            # Check existence
Select-String *        # grep equivalent
npx serve *            # Local dev server
npx lighthouse *       # Lighthouse audit
vercel *               # Vercel CLI (except --prod push if unsure)
```

### ⛔ ALWAYS ASK BEFORE EXECUTING

```
git push --force       # Force push — requires explicit approval
git reset --hard       # Destructive history rewrite
rm -rf /               # Recursive delete from root
npm install -g *       # Global npm installs (system-wide change)
curl/wget from unknown domains  # Unknown external downloads
Any command modifying C:\Windows\, C:\Program Files\, or system32
sudo / Run-As Administrator     # Elevated system commands
```

---

## Build Reference

```powershell
# Development (watch mode)
npm run dev

# Production build (minified)
npm run build

# Verify output exists
Test-Path dist\output.css

# Local preview
npx serve . -p 3000
```

---

## Architecture Decisions (Do Not Change)

- **No frameworks** — vanilla HTML only, no React/Vue/Next/Astro
- **No backend** — form goes through Formspree, no server code
- **No CMS** — content lives directly in `index.html`
- **No Tailwind CDN** — always use compiled `dist/output.css`
- **No redesign** — design is approved, only production-hardening changes
- **Logos** are in `Логотипы/` — use them as-is, do not regenerate

---

## Design System Quick Reference

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#315972` | Malom Blue — CTA, headings |
| `tatar-sage` | `#A2A094` | Tatar Hill accent |
| `bronze` | `#8B6F47` | Premium decorative |
| `warm-white` | `#FAFAF8` | Page background |
| `stone` | `#F5F4F1` | Section alternation |
| `inverse-surface` | `#2b303d` | Dark contact section |
| Font display | Merriweather 300 | Headlines, 64px |
| Font body | Inter 400 | Body text, 18px |
| Font label | Inter 600 uppercase | Labels, 12px |

---

## Files That Must Not Be Modified Without Explicit Instruction

- `index.html` — content is approved, structural changes need approval
- `tailwind.config.js` — design tokens are locked
- `Логотипы/` — brand assets, never regenerate
- `DESIGN_SYSTEM (1).md` — source of truth, read-only reference

---

## Pending Tasks (as of session start)

- [ ] Fix Tailwind build error (line 84 in input.css — complex peer selector in @apply)
- [ ] Run `npm run build` — verify `dist/output.css` generated successfully
- [ ] Run git init + initial commit
- [ ] Verify site renders correctly in browser
- [ ] Provide GitHub push instructions

---

## Session Log Format

When executing commands autonomously, log output as:
```
▶ [COMMAND] npm run build
✓ [OK] dist/output.css generated (142 KB → 18 KB minified)
```
Or for failures:
```
▶ [COMMAND] npm run build
✗ [FAIL] Error on line 84 of src/input.css — peer selector in @apply
→ [FIX] Removed complex peer-[] selectors, moving to inline classes in HTML
```
