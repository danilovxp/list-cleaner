// Deal-hunter operations log — the "database" behind history.html.
// Claude APPENDS an entry for every meaningful operation (pull, filter, verify, upload,
// campaign change, infra, decision). NEVER put PII here (no addresses, no emails, no names) —
// this file is public. Aggregates, filters, and numbers only. Newest entries LAST (page
// renders newest-first). Git history of this file is the tamper-proof backup log.
const HISTORY = [
  {
    date: "2026-08-06", type: "pull",
    title: "Batch #1 — 7 motivation-lane pulls from DealMachine",
    lists: "utility_liens · tax_delinquent · mechanics_liens · expired · tax_liens_judgments · vacant · preprobate",
    filters: "Base Stack v1 (target zips + SFR, server-side) + ONE motivation filter per lane — exact UI recipes in the Playbook. Server lot filter is broken (silent no-op) so lot is NOT filtered at pull.",
    results: "1,637 raw records → 1,620 unique properties (17 cross-lane dups merged into a lanes tag)",
    numbers: "2,042 DealMachine credits (searches via record_ids lists)",
    notes: "Lists visible in DealMachine UI. Record ids kept in dm_lane_ids.json."
  },
  {
    date: "2026-08-06", type: "pull",
    title: "Skip-trace via export (the 2,756-credit surprise)",
    lists: "all 7 lanes",
    filters: "none — DealMachine exports FORCE-attach up to 5 likely-owner contacts per property; cannot be suppressed",
    results: "owner names + emails + phones attached to all 1,620 properties",
    numbers: "2,756 DealMachine people credits (unplanned — now a documented gotcha + the reason for the hard approval rule)",
    notes: "Silver lining: skip trace was needed anyway. Rule since: no billable call without explicit approval."
  },
  {
    date: "2026-08-07", type: "filter",
    title: "Stage A cleaning — buy-box + legal + hygiene filters",
    lists: "master (all 7 lanes merged)",
    filters: "lot ≥ 0.25 ac (LOCAL — server filter broken) · drop §1695 pre-foreclosure+owner-occupied · drop MLS active/pending · drop no-email · drop role emails · dedupe exact emails · suppression list",
    results: "1,620 → 533 properties · 1,783 emails to verify. Drops: lot 1,027 · no-email 40 · MLS 13 · §1695 7 · dup emails 68 · role 1",
    numbers: "0 credits (local processing)",
    notes: "Row-level fate of every property: *_audit_stageA.csv (open in Inspector)."
  },
  {
    date: "2026-08-07", type: "verify",
    title: "MillionVerifier full run (after 9-email tiny test)",
    lists: "1,783 emails from stage A",
    filters: "bulk API upload → poll → download; only result=ok proceeds (catch-all/unknown/invalid all dropped — bounces burn domains)",
    results: "1,194 ok (67%) · 223 catch-all · 177 unknown · 189 invalid · 0 disposable",
    numbers: "1,392 MV credits (unknowns not billed) · balance 34,478",
    notes: "Fate of every email: *_audit_stageB.csv."
  },
  {
    date: "2026-08-07", type: "upload",
    title: "Stage B merge + split + upload to Instantly (drafts)",
    lists: "4 campaigns: Big Lot 507 · Tax Delinquent 208 · Vacant 24 · Pre-Probate 7",
    filters: "one row per PERSON (best valid email each; 448 valid-but-redundant emails retired) · routing priority vacant > tax_delinquent > preprobate > lien/expired lanes · Big Lot gate lot ≥ 8,000 sf · Pre-Probate gate tenure ≥ 10 yrs · gate rejects fall to Tax Delinquent · duplicate-skip ON",
    results: "746 people across 495 properties uploaded, server-verified 746/746, zero failures. 300 people reachable only via 2nd+ contact",
    numbers: "0 credits (Instantly upload is free) · campaigns stay DRAFT",
    notes: "Nothing sends until Vlad presses Start (planned 2026-08-18)."
  },
  {
    date: "2026-08-07", type: "campaign",
    title: "Campaign architecture: 4 campaigns (one per copy type), v3.1 sequences",
    lists: "PHS — Big Lot · Tax Delinquent · Vacant Homes · Pre-Probate",
    filters: "campaign = COPY TYPE, lane attribution via `lanes` lead field · v3.1 short-spun sequences (~55–75 words, 5–7 spin slots, spun subjects) · T1 A/B size test (~60w vs ~35w micro) · 3 touches days 0/4/10 · Tue–Thu 10–2 PT · tracking OFF · text-only · stop-on-reply",
    results: "consolidated from 7 → 4 campaigns (Vlad: fewer campaigns, easier to manage; small CSVs accumulate fine)",
    numbers: "9-agent adversarial copy review: 13 must-fixes applied; panel risk scores 2.5–3.5/10",
    notes: "Copy library: skill references/email-sequences-v3-short.md."
  },
  {
    date: "2026-08-07", type: "infra",
    title: "Reply→Telegram webhook + API-driven site deploys",
    lists: "—",
    filters: "Instantly webhook (reply_received, workspace-wide) → site worker /api/instantly-reply (secret-key gated) → Telegram bot pings Vlad instantly on every seller reply",
    results: "live-tested 3×: lead form ok · parsed reply ok · raw-JSON fallback ok · wrong key 403",
    numbers: "Cloudflare env secrets set via API; deploys now via wrangler (drag-drop zip retired)",
    notes: "First real reply: check the notification parsed fields (not raw JSON); tune parser if needed."
  },
  {
    date: "2026-08-07", type: "decision",
    title: "Launch plan locked + automation scheduled + spend-control rule",
    lists: "—",
    filters: "ramp: week 1 = 7 new leads/day (1/mailbox) → week 2 = 15 → week 3 = 28, each bump gated on bounce < 3% · placement test ≥ 90% inbox required before launch",
    results: "5 scheduled tasks: Aug 16 placement-test day · Aug 18 launch day · Aug 25 + Sep 1 ramp bumps · monthly cycle (1st, 9:30) with scoreboard + pull proposal",
    numbers: "HARD RULE: nothing billable on any service without Vlad's explicit per-run approval; tiny-test (<10) every new billable op",
    notes: "First send 2026-08-18 (Vlad presses Start) · monthly new-only cycle from Sep 1."
  },
  {
    date: "2026-08-07", type: "site",
    title: "HQ site: Funnel + Inspector + row-level audit trail + History",
    lists: "—",
    filters: "pipeline now writes *_audit_stageA/B.csv on every run (fate of every property + email) · Inspector renders any pipeline CSV client-side (PII never uploaded) · Funnel = batch totals + credit accounting · this History log added",
    results: "6 pages: Expander · Playbook · Scoreboard · Funnel · Inspector · History — one nav everywhere",
    numbers: "—",
    notes: "Convention: every future operation appends an entry to history-data.js (both repo copies)."
  },
  {
    date: "2026-08-07", type: "site",
    title: "HQ v2 — real app shell (Vlad: 'the navigation is terrible')",
    lists: "—",
    filters: "persistent left sidebar on every page, grouped Overview / Monthly pipeline / Results, active page highlighted, mobile collapse · new Dashboard home (launch countdown, staged leads, ramp, credits, weekly checklist, automation calendar) · Expander moved to expander.html",
    results: "7 pages, one shell: Dashboard · History · Playbook · Expander · Inspector · Funnel · Scoreboard",
    numbers: "—",
    notes: "Shell maintained by tools/list-cleaner/build_shell.py — add a page to PAGES and run it; it re-shells everything and mirrors to the deploy repo."
  },
  {
    date: "2026-08-07", type: "campaign",
    title: "Copy v5 — Vlad's voice rules applied to all 4 sequences",
    lists: "all 4 campaigns (12 emails, 16 variants incl. T1 A/B)",
    filters: "no 'investor' anywhere · signature cut to 2 lines '— Vlad · phone' + compliance line (never 'Danilov') · first-name greeting on every touch · {{address}} FIRST in every subject · lean bodies, no intro/outro padding · fresh spin pools (4–7 slots/email) · sender display name on all 6 mailboxes → 'Vlad'",
    results: "deployed via API + GET-verified (bodies survived the sanitizer, banned words absent). Bug fixed: pre-probate T2 used {{year_built}} — a token never uploaded (would render blank) — now uses {{years_owned}}",
    numbers: "0 credits · campaigns still draft",
    notes: "Operative library: skill references/email-sequences-v5.md · edit + redeploy via scripts/deploy_sequences_v5.py."
  },
  {
    date: "2026-08-07", type: "campaign",
    title: "Copy v6 — sentence-level spintax (super-unique emails) + minimal signature",
    lists: "all 4 campaigns (16 email variants)",
    filters: "every sentence = spin among 3–4 complete alternatives, word spins kept inside · merge tokens never inside spin blocks · signature cut to '— Vlad / Prime Home Strategies · (916) 999-9947' (postal address dropped by Vlad's decision, CAN-SPAM tradeoff logged)",
    results: "verified stored: per-email template combinations 243–26,244 (campaign sizes 7–507 → byte-identical emails effectively impossible, merge fields differ on top)",
    numbers: "0 credits · campaigns still draft",
    notes: "Edit + redeploy: skill scripts/deploy_sequences_v6.py (prints uniqueness math on every run)."
  },
  {
    date: "2026-08-07", type: "filter",
    title: "Filter verification round + Roseville sizing (all free, 0 credits)",
    lists: "candidates only — nothing pulled",
    filters: "verified: booleans need operator is_boolean (undocumented) · locations = {type:zip_code, code} · lot filter STILL broken server-side (−3% instead of −65%) · relative_time exact · zombie filter dead (0) · Roseville condition data garbage (95% 'Poor/Fair') · Placer feed near-empty on tax-delq/vacant/probate",
    results: "Roseville (95661/95678/95747): 52,582 SFRs — likely_to_move 1,097 · utility liens 672 · corner+ten15+absentee 324 · expired 270 · private_lender 245 · mechanics 146. Base-zip new signals: likely_to_move 892 · poor/unsound 748 · private_lender 393 · corner-stack 322",
    numbers: "0 credits spent (estimate_cost dry-runs). Proposed: Pull A (Roseville ~2,500 props ≈ 6,800 cr) + Pull B (base new signals ~1,900 ≈ 5,200 cr) — awaiting Vlad's approval; credits expire Aug 31",
    notes: "Separate signal searches merged into one list cost the same as OR (cycle dedupe) and keep lanes attribution. Playbook updated with Roseville recipes."
  },
];
