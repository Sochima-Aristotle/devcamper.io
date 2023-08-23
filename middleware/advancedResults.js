const advancedResults = (model, populate) => async(req, res, next) => {
    let query;

    // copy reqest query
    const reqQuery = { ...req.query };
  
    // field execute
    const removeFields = ["select", "sort", "page", "limit"];
  
    // loop over removeField and delete them from the reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
  
    // create string query
    let queryStr = JSON.stringify(reqQuery);
  
    // Operate the request query
    queryStr = queryStr.replace(
      /\b(gt|gte|it|ite|in)\b/g,
      (match) => `$${match}`
    );
  
    // find resources
    query = model.find(JSON.parse(queryStr))
    // select fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
  
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
  
    // pagination;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate)
    }
    // Executing query
    const results  = await query;
  
    // pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    } else if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
}

module.exports = advancedResults;