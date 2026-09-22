# /visa — referral log

The "Want the former officer on your case?" form on /visa posts each email to `functions/api/refer.js`,
which stores it in the D1 database `visa-referrals`. The binding (`DB`) and the `REFERRALS_KEY` secret
live on the Pages project itself (Settings → Bindings), so nothing in the repo needs to change.

Local dev with the functions: `npx wrangler pages dev --port 8790 --d1 DB=visa-referrals --binding REFERRALS_KEY=testkey`

Read it back as CSV, keyed by the `REFERRALS_KEY` secret on the Pages project:

    https://priyamraj.com/api/referrals.csv?key=<REFERRALS_KEY>            all rows
    https://priyamraj.com/api/referrals.csv?key=<REFERRALS_KEY>&month=2026-09

Google Sheets: in a tab named for the month, put in A1

    =IMPORTDATA("https://priyamraj.com/api/referrals.csv?key=<REFERRALS_KEY>&month=2026-09")

Sheets refreshes it on its own. One tab per month, share the sheet view-only with the coach.
The key is also in the login keychain: `security find-generic-password -a priyamraj -s visa-referrals-key -w`.
Rotate it with `npx wrangler pages secret put REFERRALS_KEY --project-name priyamraj`.
