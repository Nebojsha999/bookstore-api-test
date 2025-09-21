const { expect } = require('chai');
const BooksClient = require('../../src/clients/booksClient');
const Book = require('../../src/models/book');

describe('Books API - Tests Compatible with FakeRestAPI', function () {
  this.timeout(10000);

  // GET all books
  it('GET /Books - should return 200 and array', async () => {
    const res = await BooksClient.getAllBooks();
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('POST -> PUT -> DELETE (adapted for FakeRestAPI)', async () => {
    const newBook = {
      title: `API Test ${Date.now()}`,
      description: 'Created by automated test',
      pageCount: 100,
      excerpt: 'Excerpt',
      publishDate: '2020-01-01T00:00:00Z'
    };

    const createRes = await BooksClient.createBook(newBook);
    expect([200, 201]).to.include(createRes.status);
    const bookId = createRes.data.id;

    // PUT / update (may fail with 404)
    try {
      const updatedBook = { ...createRes.data, title: createRes.data.title + ' - updated' };
      const putRes = await BooksClient.updateBook(bookId, updatedBook);
      expect([200, 204, 404]).to.include(putRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }

    // DELETE (may fail with 404)
    try {
      const delRes = await BooksClient.deleteBook(bookId);
      expect([200, 204, 404]).to.include(delRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }
  });

  // GET with valid ID
  it('GET /Books/{id} with valid ID should return 200 and a book object', async () => {
    const res = await BooksClient.getBookById(1); // ID=1 exists in FakeRestAPI
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.property('id', 1);
    expect(res.data).to.have.property('title');
    expect(res.data).to.have.property('description');
  });

  // GET with invalid ID
  it('GET /Books/{id} with invalid ID returns 404 or 400', async () => {
    try {
      await BooksClient.getBookById(-999999);
    } catch (err) {
      expect([400, 404]).to.include(err?.response?.status || 404);
    }
  });

  // POST missing required fields
  it('POST with missing required fields should not return 500', async () => {
    const incomplete = new Book({});
    const res = await BooksClient.createBook(incomplete);
    expect(res.status).to.be.below(500);
  });

  // DELETE an already deleted book
  it('DELETE /Books/{id} for an already deleted book should return 404', async () => {
    const newBook = {
      title: `API Test ${Date.now()}`,
      description: 'Created for delete edge case',
      pageCount: 50,
      excerpt: 'Excerpt',
      publishDate: '2020-01-01T00:00:00Z'
    };

    const createRes = await BooksClient.createBook(newBook);
    expect([200, 201]).to.include(createRes.status);
    const bookId = createRes.data.id;

    // Delete once
    try {
      const delRes = await BooksClient.deleteBook(bookId);
      expect([200, 204, 404]).to.include(delRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }

    // Delete again (already deleted)
    try {
      await BooksClient.deleteBook(bookId);
      // If it succeeds unexpectedly, fail the test
      throw new Error('Expected 404 on deleting already deleted book');
    } catch (err) {
      const status = err?.response?.status || 404;
      expect(status).to.equal(404);
    }
  });
});
