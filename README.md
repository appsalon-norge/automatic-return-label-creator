# Automatic Return Label Creator

## Table of Contents

1. [Basic Information](#basic-information)
2. [What Works (POC)](#what-works)
3. [Secrets / Environment Variables](#secrets)
4. [Setup](#setup)
5. [Development](#development)
6. [Documentation](#documentation)
7. [Testing](#testing)
8. [Future / Later Features](#later-features)
9. [References](#references)

## Basic Information

This app connects to a shopify store and the Logistra api, to create return labels for packages.

The use case is to automate the first part of self returns. By automatically accepting returns, and sending them to the customer.
With some small changes, the app can work by using on return/accepted instead of return/requested.

The app is not 100% finished yet, there are alot of features to be made, but the core concept works.

### What Works

In this POC version of the app the following works

- automatically accepts self serviced returns when requested
- creates labels from the Logistra XML api
- download and store pdf of shipping label on the app
- sends pdf label for each consignment in a return to the customer.
- The customer can follow the provided link and download or print out the label.

## Secrets / Environment Variables

We need some variables from the Logistra/caargonizer API, For that we need the Logistra/Cargonizer api key, if the store has Cargonizer connect installed, you can find it there.

> **_NOTE:_** Right now, the easiest way to access some of the needed secrets is to retrieve them from the cargonizer connect app, We need the key and sender id.

Some other variables we need is better of fetching with postman for now.
[Cargonizer documentation](https://github.com/logistra/cargonizer-documentation/wiki/Transport-Agreements)
For that we need the Api key and sender id.

Inside postman you need to find the correct transport agreement id, and the return product identifier you want to use

See full list of secrets needed in the [env.example file](.env.example)
The return secrets is needed so the the package will be shipped to the correct place, the feature only works with one return store for now...

> **_NOTE:_** It might be possible to get this information from shopify, it can be good to check this out!

## Setup

Remember to set all secrets as the app will fail without them.

## Development

Start dev server

```bash
npm run dev
```

Start test environment

```bash
npm run test
```

Get graphql code-gen

```bash
npm run graphql-codegen
```

The webhook is defined in [the Shopify Toml file](shopify.app.toml)
To check that they are added, test in a devstore by requesting a return as a customer in the /account.
The Webhook should trigger and run the process

## Documentation

Generated with [TypeDoc](https://typedoc.org/).

Generate docs:

```bash
npm run docs
```

Config file: `typedoc.config.json` (entry points: `app/utils`, `app/graphql`, strategy: `expand`). Output: `docs/`.

Add new code under those folders for automatic inclusion. Excluded: tests, generated types, `*.d.ts`.

## Testing

Testing uses [Vitest](https://vitest.dev/) and [MSW](https://mswjs.io/) for HTTP mocking.

Highlights:

- Strict MSW setup: unhandled external requests fail, ensuring mocks are explicit.
- `cargonizer.test.ts` covers consignment POST + XML flow.
- Label PDF fetch mocked with a hardcoded GET handler returning fake PDF bytes.
- Environment variables in tests use the `LOGISTRA_` prefix (e.g. `LOGISTRA_BASE_URL`).
- MSW handlers live in `app/tests/msw/` with a setup import required at test start.

Run tests:

```bash
npm test
```

Add tests for:

- `buildConsignments` (XML shape, values block, items array)
- `prepareLabels` (matching RFO IDs, file saving logic)
- Error cases (missing env, failed fetch, save error)

Mocking tips:

- Use `server.use()` inside a test to override a single endpoint (e.g. a specific label URL with query params).
- Keep handlers minimal—return only what code paths assert.

## Later Features

Planned improvements:

- Multiple return locations (dynamic address resolution)
- Retry & resilience for external API failures
- Admin UI to view generated labels & statuses
- Fine‑grained logging/observability
- Improved webhook deduplication & idempotency
- Configuration UI to select sender IDs, transport agreement IDs, and return product identifiers (remove reliance on manual env edits)
- Persist selectable sender/agreement/return product settings in the database (per shop) instead of environment variables for dynamic multi‑tenant configuration

## References

- Cargonizer docs: https://github.com/logistra/cargonizer-documentation/wiki/Transport-Agreements
- Shopify Apps: https://shopify.dev/docs/apps
- Reverse Fulfillment / Returns GraphQL: Shopify Admin API
