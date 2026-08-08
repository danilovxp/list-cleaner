# Deal-Hunter HQ (internal ops console)

Vlad's internal console for the off-market acquisition machine — published via GitHub Pages at
https://danilovxp.github.io/list-cleaner/

8 pages, one shared sidebar: Dashboard · History · Playbook · Filter Picker · Expander ·
Inspector · Funnel · Scoreboard. All data processing is client-side; no lead data lives in
this repo (aggregates only in history-data.js).

Source of truth + the shell builder (`build_shell.py`) live in the private skills repo
(`claude-skills/skills/deal-hunter/tools/list-cleaner/`); this repo is the mirrored deploy
target — push = live.
