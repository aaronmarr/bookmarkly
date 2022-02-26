import Koa from'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv/config';
import db from './db';
import bookmarksRouter from './bookmarks/router';

const app = new Koa();

if (process.env.NODE_ENV === 'dev') {
  app.use(logger());
}

app.use(bodyParser());
app.use(bookmarksRouter.routes());
app.use(bookmarksRouter.allowedMethods());

const server = app.listen(3000);

export default server;
