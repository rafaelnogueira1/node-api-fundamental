import { randomUUID } from 'node:crypto';
import { Database } from '../database.js';
import { buildRoutePath } from '../shared/build-route-path.js';
import { run } from '../shared/import-file.js';

const database = new Database();
const tableName = 'tasks';

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select(tableName, req.query);

      res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const task = database.selectById(tableName, req.params.id);

      res.end(JSON.stringify(task));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: 'Title is required',
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: 'Description is required',
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.create(tableName, task);

      res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: 'Title is required',
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: 'Description is required',
          })
        );
      }

      const data = database.selectById(tableName, req.params.id);

      if (!data) {
        return res.writeHead(404).end('Task not found');
      }

      const task = {
        title,
        description,
        updated_at: new Date(),
      };

      database.update(tableName, req.params.id, task);

      res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const data = database.selectById(tableName, req.params.id);

      if (!data) {
        return res.writeHead(404).end('Task not found');
      }

      const task = {
        completed_at: data.completed_at ? null : new Date(),
        updated_at: new Date(),
      };

      database.update(tableName, req.params.id, task);

      res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const data = database.selectById(table, req.params.id);

      if (!data) {
        return res.writeHead(404).end('Task not found');
      }

      database.delete(table, req.params.id);

      res.writeHead(204).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/import-tasks'),
    handler: async (req, res) => {
      await run();
      res.writeHead(201).end('Imported tasks');
    },
  },
];
