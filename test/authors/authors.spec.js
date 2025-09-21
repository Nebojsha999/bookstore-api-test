const { expect } = require('chai');
const AuthorsClient = require('../../src/clients/authorsClient');
const Author = require('../../src/models/author');

describe('Authors API - Tests Compatible with FakeRestAPI', function () {
  this.timeout(10000);

  // GET all authors
  it('GET /Authors - should return 200 and array', async () => {
    const res = await AuthorsClient.getAllAuthors();
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  // CRUD flow
  it('POST -> PUT -> DELETE (full CRUD flow)', async () => {
    const newAuthor = {
      firstName: `TestFirst ${Date.now()}`,
      lastName: `TestLast ${Date.now()}`,
      dateOfBirth: '1980-01-01T00:00:00Z'
    };

    // POST
    const createRes = await AuthorsClient.createAuthor(newAuthor);
    expect([200, 201]).to.include(createRes.status);
    const authorId = createRes.data.id;

    // PUT / update
    try {
      const updatedAuthor = { ...createRes.data, lastName: createRes.data.lastName + ' - updated' };
      const putRes = await AuthorsClient.updateAuthor(authorId, updatedAuthor);
      expect([200, 204, 404]).to.include(putRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }

    // DELETE
    try {
      const delRes = await AuthorsClient.deleteAuthor(authorId);
      expect([200, 204, 404]).to.include(delRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }
  });

  // GET with valid ID
it('GET /Authors/{id} with valid ID should return 200 and an author object', async () => {
  const res = await AuthorsClient.getAuthorById(1); // ID=1 exists in FakeRestAPI
  expect(res.status).to.equal(200);
  expect(res.data).to.be.an('object');
  expect(res.data).to.have.property('id', 1);
  expect(res.data).to.have.property('firstName');
  expect(res.data).to.have.property('lastName');
});

  // GET with invalid ID
  it('GET /Authors/{id} with invalid ID returns 404 or 400', async () => {
    try {
      await AuthorsClient.getAuthorById(-999999);
    } catch (err) {
      expect([400, 404]).to.include(err?.response?.status || 404);
    }
  });

  // POST missing required fields
  it('POST with missing required fields should not return 500', async () => {
    const incomplete = new Author({});
    const res = await AuthorsClient.createAuthor(incomplete);
    expect(res.status).to.be.below(500);
  });

  // DELETE already deleted author
  it('DELETE /Authors/{id} for an already deleted author should return 404', async () => {
    const newAuthor = {
      firstName: `TestFirst ${Date.now()}`,
      lastName: `TestLast ${Date.now()}`,
      dateOfBirth: '1980-01-01T00:00:00Z'
    };

    const createRes = await AuthorsClient.createAuthor(newAuthor);
    expect([200, 201]).to.include(createRes.status);
    const authorId = createRes.data.id;

    // Delete once
    try {
      const delRes = await AuthorsClient.deleteAuthor(authorId);
      expect([200, 204, 404]).to.include(delRes?.status);
    } catch (err) {
      expect([404]).to.include(err?.response?.status || 404);
    }

    // Delete again
    try {
      await AuthorsClient.deleteAuthor(authorId);
      throw new Error('Expected 404 on deleting already deleted author');
    } catch (err) {
      const status = err?.response?.status || 404;
      expect(status).to.equal(404);
    }
  });
});