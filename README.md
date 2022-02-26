# Bookmarkly

Bookmarkly is a bookmarking tool built on Koa and React.

## Dependencies

There a 2 hard dependencies for this project:

Postgresql@13
Node@14

## Development quick start

1. Copy `.env.example` into `.env` and fill in / check the default varibles
2. Create the test and dev databases in Postgres (for reference, see `.env` file)
3. Run `npm i`
4. Check `package.json` and run the 'up' migration(s) for your database(s)
5. Run the tests: `npm run test`

If the tests pass, it means you're good to go! The server can be run using `npm run watch`. Check `package.json` for other options.
