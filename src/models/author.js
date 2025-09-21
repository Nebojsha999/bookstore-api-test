class Author {
  constructor({ id, idBook, firstName, lastName } = {}) {
    this.id = id;
    this.idBook = idBook;      // association to a Book
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

module.exports = Author;