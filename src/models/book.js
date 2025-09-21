class Book {
  constructor({ id, title, description, pageCount, excerpt, publishDate } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.pageCount = pageCount;
    this.excerpt = excerpt;
    this.publishDate = publishDate;
  }
}

module.exports = Book;
