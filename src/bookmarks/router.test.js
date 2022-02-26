import request from 'supertest'
import server from '../app'
import query from '../db'

beforeEach(async () => {
  await query('TRUNCATE TABLE bookmarks')
})

afterEach(async () => {
  await query('TRUNCATE TABLE bookmarks')
})

afterAll(async () => {
  await server.close()
})

async function getBookmarkURL () {
  const bookmarks = await query('SELECT * FROM bookmarks')
  const id = `${bookmarks[0].id}`
  const url = `/${id}`

  return url
}

async function seedBookmark (url, title) {
  return query(`
    INSERT INTO
      bookmarks(
        url,
        created_at,
        updated_at,
        title
      )
    VALUES (
      $1,
      to_timestamp(${Date.now()} / 1000.0),
      to_timestamp(${Date.now()} / 1000.0),
      $2
    )
  `, [url, title])
}

describe('Bookmarks route tests', () => {
  test('It should return 404 if no bookmarks', async () => {
    const response = await request(server).get('/')
    const { status, body } = response

    expect(status).toEqual(404)
    expect(body.status).toEqual('error')
  })

  test('It should return 404 if no bookmarks for given id', async () => {
    const response = await request(server).get('/4')
    const { status, body } = response

    expect(status).toEqual(404)
    expect(body.status).toEqual('error')
  })

  test('It should create a new bookmark', async () => {
    const response = await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        url: 'https://example.com/test',
        title: 'This one was created in a test'
      })

    const { status } = response

    expect(status).toEqual(201)
  })

  test('It should fail creating a new bookmark if the url is invalid', async () => {
    const response = await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        url: 'examplecom/test',
        title: 'This one was created in a test'
      })

    const { status, text } = response

    expect(status).toEqual(403)
    expect(text).toEqual('Validation failed')
  })

  test('It should return all the bookmarks', async () => {
    await seedBookmark('https://example.com/test2', 'This is another test')
    await seedBookmark('https://awesome.com', 'The Awesome Website')

    const response = await request(server).get('/')
    const { status, body } = response

    expect(status).toEqual(200)
    expect(body.data[0].title).toEqual('This is another test')
    expect(body.data[0].url).toEqual('https://example.com/test2')
    expect(body.data[1].title).toEqual('The Awesome Website')
    expect(body.data[1].url).toEqual('https://awesome.com')
  })

  test('It should get a bookmark by id', async () => {
    await seedBookmark('https://example.com/test3', 'This is yet another test')
    const bookmarkURL = await getBookmarkURL()

    const response = await request(server).get(bookmarkURL)

    expect(response.status).toEqual(200)
    expect(response.body.data.length).toEqual(1)
    expect(response.body.data[0].url).toEqual('https://example.com/test3')
    expect(response.body.data[0].title).toEqual('This is yet another test')
  })

  test('It should update a bookmark', async () => {
    await seedBookmark('https://example.com/test3', 'This is yet another test')
    const bookmarkURL = await getBookmarkURL()

    const response = await request(server)
      .put(bookmarkURL)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        id: bookmarkURL.substring(1),
        url: 'https://example.com/updated',
        title: 'I have been updated'
      })

    expect(response.status).toEqual(200)
    expect(response.body.data[0].title).toEqual('I have been updated')
  })

  test('It should not update a bookmark if the url is invalid', async () => {
    await seedBookmark('https://example.com/test5', 'This is yet another test again')
    const bookmarkURL = await getBookmarkURL()
    const response = await request(server)
      .put(bookmarkURL)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        url: 'examplecom/test'
      })

    const { status, text } = response

    expect(status).toEqual(403)
    expect(text).toEqual('Validation failed')
  })

  test('It should not update a bookmark which doesn\'t exist', async () => {
    const nonExistentBookmarkURL = '/99999'

    const response = await request(server)
      .put(nonExistentBookmarkURL)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        id: nonExistentBookmarkURL.substring(1),
        url: 'https://example.com/updated-not-found',
        title: 'I should not be updated'
      })

    expect(response.status).toEqual(404)
    expect(response.body.data.length).toEqual(0)
  })

  test('It should delete a bookmark', async () => {
    await seedBookmark('https://example.com/test3', 'This is yet another test')
    const bookmarkURL = await getBookmarkURL()

    const response = await request(server).del(bookmarkURL)

    expect(response.status).toEqual(204)
  })

  test('It should not delete a bookmark that doesn\'t exist', async () => {
    const nonExistentBookmarkURL = '/99999'

    const response = await request(server).del(nonExistentBookmarkURL)

    expect(response.status).toEqual(404)
  })
})
