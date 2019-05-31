const express = require('express');
const frameguard = require('frameguard');
const serveStatic = require('serve-static');

const app = express();
app.use(frameguard({ action: 'deny' }));
app.use(serveStatic(`${__dirname}/www`));

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/www/index.html`);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
