# /visa — readers and referrals

Two separate lists in the D1 database `visa-referrals` (bound to the Pages project as `DB`):

- **readers**: the "Read the guide" email box posts to `functions/api/read.js`, which logs the email,
  sets a `reader` cookie and redirects to the PDF. `functions/visa/guide/[[path]].js` only serves
  `visa/guide/*` to browsers with that cookie; everyone else is sent back to the box. Soft gate: the
  repo is public, so the file itself is on GitHub. The old URL `/visa/rejected-then-approved.pdf`
  redirects to the box (`_redirects`).
- **referrals**: the "Want the former officer on your case?" form posts to `functions/api/refer.js`.

`functions/api/referrals.csv.js` serves **referrals only** as CSV behind the `REFERRALS_KEY` Pages
secret. A Google Sheet reads it with IMPORTDATA, and the coach ticks a Paid column beside it.

The readers list deliberately has no export: it's stored, not viewed, and the coach can see the sheet.
To read it anyway (owner only, from this machine):
`npx wrangler d1 execute visa-referrals --remote --command "SELECT created_at, email, ip_country FROM readers ORDER BY id"`

**The key is part of that sheet's formula. Do not rotate or delete it, and do not delete or recreate
the database, without updating the sheet in the same change** — either breaks the sheet (#N/A) or
misaligns the Paid checkboxes.

- Key: login keychain, `security find-generic-password -a priyamraj -s visa-referrals-key -w`
- Rotate (only on a leak): `npx wrangler pages secret put REFERRALS_KEY --project-name priyamraj`,
  update the keychain item, then the sheet's A1 formula.
- Local dev: `npx wrangler pages dev . --port 8790 --d1 DB=visa-referrals --binding REFERRALS_KEY=testkey`
