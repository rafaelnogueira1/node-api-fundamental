import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes/routes.js';
import { extractQueryParams } from './shared/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  res.writeHead(404).end('Not Found');
});

console.log('Server is running on http://localhost:3333 🚀');

server.listen(3333);
