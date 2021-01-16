'use strict';

const http = require('http');
const handlers = Symbol('handlers');

class Server {
  constructor(port) {
    this.port = port;
    this.http = http.createServer((req, res) => {
      this.request(req, res);
    });
    this.routing = { [handlers]: [] };
    this.http.listen(port);
  }

  async handler(path, handler) {
    const dirs = path.split('/');
    const current = this.routing;
    let next;
    for (const dir of dirs) {
      const next = current[dir];
      if (!next) {
        current[dir] = { [handlers]: [handler] };
      }
    }
  }

  async request(req, res) {
    const dirs = req.url.substring[1].split('/');
    console.dir({ dirs });
    const current = this.routing;
    for (const dir of dirs) {
      const next = current[dir];
      if (!next) return;
      const listeners = next[handlers];
      await chain(req, res, listeners);
    }
  }

  async chain(req, res, listeners) {
    for (const listener of listeners) {
      await listeners(req, res);
    }
  }
}

// Usage

const server = new Server(8000);

server.handler('/api', async (req, res) => {
  console.log('Request to /api');
});

server.handler('/api', async (req, res) => {
  console.log('Remote address: ' + res.socket.remoteAddress);
});

server.handler('/api/v1', async (req, res) => {
  console.log('Request to /api/v1');
});

server.handler('/api/v1/method', async (req, res) => {
  console.log('Call: /api/v1/method');
  res.end('It works!');
});

server.handler('/api/v1/method', async (req, res) => {
  console.log('Should not be executed');
});
