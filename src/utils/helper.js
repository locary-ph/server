// @param query - returned query by mongoose
// @param object - object to return if query is truthy
function checkDocument(res, query, object) {
  if (query) {
    res.json(object);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}

module.exports = { checkDocument };
