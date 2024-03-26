class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering (gt, gte, ...)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // find method will return a query and we can chain other methods on it
    // if we use await before above, the query will then execute and come back with the document and at the end await the query

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      // to sortBy multiple fields: '-price ratingsAverage' we add space between. so we should replace , with ' '
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    // 1-10 page 1, 11-20 page 2, 21-30 page 3 => page 2 -> skip 10
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   // error for page number too large
    //   const toursLength = await this.query.countDocuments();
    //   if (skip >= toursLength) {
    //     throw new Error("This page does not exist");
    //   }
    // }

    return this;
  }
}

module.exports = APIFeatures;
