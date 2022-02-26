import query from '../db';

export function getAllBookmarks() {
  const sql = 'SELECT * FROM bookmarks';

  return query(sql);
}

export function getBookmarkById({ id }) {
  const sql = 'SELECT * FROM bookmarks WHERE id = $1';

  const values = [id];

  return query(sql, values);
}

export function createBookmark({ url, title }) {
  const sql = `
    INSERT INTO
      bookmarks(
        url,
        created_at,
        updated_at,
        ${ title ? 'title' : ''}
      )
    VALUES (
      $1,
      to_timestamp(${Date.now()} / 1000.0),
      to_timestamp(${Date.now()} / 1000.0),
      ${ title ? `$2` : ''}
    )
  `;

  const values = [url];

  if (title) {
    values.push(title);
  }

  return query(sql, values);
}

export function updateBookmark({ url, title, id }) {
  const sql = `
    UPDATE
      bookmarks as b
    SET
      url = $1,
      title = $2,
      updated_at = to_timestamp(${Date.now()} / 1000.0)
    WHERE
      id = $3
    RETURNING b.url, b.title, b.updated_at
  `;

  const values = [url, title, id];

  return query(sql, values);
}

export function destroyBookmark({ id }) {
  const sql = `
    DELETE
    FROM
      bookmarks as b
    WHERE
      id = $1
    RETURNING b.url, b.title, b.updated_at
  `;

  const values = [id];

  return query(sql, values);
}

