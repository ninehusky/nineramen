const app = require('./index');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});