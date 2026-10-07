# way2good signup API

The GitHub Pages site posts JSON to `https://way2good-signup.vercel.app/api/subscribe`.
The independent Vercel project is `geekthon/way2good-signup`, backed by the **private** Blob store `way2good-subscribers`.

Records contain only email, language, signup time, consent version and source. A SHA-256 pathname deduplicates retries. A successful response is sent only after a write, or after confirming the record already exists. Credentials stay in the backend environment; neither Pages nor Git contains them. Automated sending is not implemented.

The API enforces consent, email validation, a honeypot, a 4 KB input limit, an origin allowlist and a per-instance burst limit. The burst limit does not coordinate across serverless instances. Before larger campaigns, use a shared limiter or challenge service.

## Export the list

In this directory:

```sh
vercel env pull .env.local --scope geekthon
node --env-file=.env.local tools/export-subscribers.mjs --out=../data/subscribers.csv
```

The CSV lives in the Git-ignored `data/` directory. Do not publish it. You can also inspect or remove individual records in the project's Storage tab. Stop future contact and remove the owner's record when requested.

## Update the API

```sh
npm ci
npm test
vercel deploy --prod --scope geekthon
```

Allowed browser origins default to `https://wujiajunhahah.github.io`. Set `SIGNUP_ALLOWED_ORIGINS` as a comma-separated list when moving the frontend to a new origin. A subpath on the same GitHub origin does not require a change.
