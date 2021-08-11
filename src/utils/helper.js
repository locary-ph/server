// @param query - returned query by mongoose
// @param object - object to return if query is truthy
function checkDocument(res, query, object, errorMessage = "Product not found") {
  if (query) {
    res.json(object);
  } else {
    res.status(404);
    throw new Error(errorMessage);
  }
}

module.exports = { checkDocument };
