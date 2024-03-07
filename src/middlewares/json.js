export const json = async (req, res) => {
  const buffers = [];

  for await (const chunck of req) {
    buffers.push(Buffer.from(chunck));
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = [];
  }

  res.setHeader('Content-Type', 'application/json');
};
