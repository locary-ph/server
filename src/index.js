const app = require("./app");

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`App running on port ${port}`);
  /* eslint-enable no-console */
});
