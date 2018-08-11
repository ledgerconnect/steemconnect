const express = require('express');
const serveStatic = require('serve-static');

const app = express();
app.use(serveStatic(`${__dirname}/web-dist`));

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/web-dist/index.html`);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
