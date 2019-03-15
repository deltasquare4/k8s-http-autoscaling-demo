const app = require('express')();
const client = require('prom-client');

const counter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests handled by the server'
});

app.use((req, res, next) => {
  counter.inc();
  next();
})

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send('Hello Kubernetes Ahmedabad\n');
  }, Math.random() * 100);
});

app.get('/metrics', (req, res) => {
  res.type('text/plain');
  res.send(client.register.metrics());
});

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Handle SIGNIT
process.on('SIGINT', () => {
  process.exit();
});

// Handle Termination Signal from Kubernetes
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit();
  });
});
