# /visa — referral log

The "Want the former officer on your case?" form posts to `functions/api/refer.js`, which stores
`date · email · country` in the D1 database `visa-referrals` (bound to the Pages project as `DB`).
`functions/api/referrals.csv.js` serves it as CSV behind the `REFERRALS_KEY` Pages secret.

A Google Sheet reads it with IMPORTDATA using that key, and the coach ticks a Paid column beside it.

**The key is part of that sheet's formula. Do not rotate or delete it, and do not delete or recreate
the database, without updating the sheet in the same change** — either breaks the sheet (#N/A) or
misaligns the Paid checkboxes.

- Key: login keychain, `security find-generic-password -a priyamraj -s visa-referrals-key -w`
- Rotate (only on a leak): `npx wrangler pages secret put REFERRALS_KEY --project-name priyamraj`,
  update the keychain item, then the sheet's A1 formula.
- Local dev: `npx wrangler pages dev . --port 8790 --d1 DB=visa-referrals --binding REFERRALS_KEY=testkey`
