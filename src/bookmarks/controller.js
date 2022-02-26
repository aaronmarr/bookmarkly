import {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  destroyBookmark,
} from './db';

export async function index(ctx, next) {
  let bookmarks = [];

  try {
    bookmarks = await getAllBookmarks();

    if (bookmarks.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: bookmarks,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'No bookmarks were found',
      }
    }
  } catch(err) {
    next(err);
  }
}

export async function create(ctx, next) {
  try {
    await createBookmark(ctx.request.body);

    ctx.status = 201;
    ctx.body = {
      status: 'success',
    }
  } catch(err) {

    next(err);
  }
}

export async function show(ctx, next) {
  try {
    const bookmark = await getBookmarkById(ctx.params);

    if (bookmark.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: bookmark,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'No bookmarks were found',
      }
    }
  } catch (err) {
    next(err);
  }
}

export async function update(ctx, next) {
  try {
    const updatedBookmark = await updateBookmark(ctx.request.body);

    if (updatedBookmark.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: updatedBookmark,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'not-found',
        data: updatedBookmark,
      };
    }
  } catch(err) {
    next(err);
  }
}

export async function destroy(ctx, next) {
  try {
    const bookmark = await destroyBookmark(ctx.params);

    if (bookmark.length) {
      ctx.status = 204;
      ctx.body = {
        status: 'success',
        data: [],
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'not-found',
        data: [],
      }
    }
  } catch(err) {
    next(err);
  }
}
