const http = require('http');

const data = 'cardnumber=4111111111111111';

const req = http.request({
  host: '127.0.0.1',
  port: 8081,
  path: '/charge',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
}, (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => console.log('サーバーからの返事:', body));
});

req.write(data);
req.end();