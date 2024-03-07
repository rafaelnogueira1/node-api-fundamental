import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./files/tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  fromLine: 2,
  skipEmptyLines: true,
});

export async function run() {
  const linesParse = stream.pipe(csvParse);
  let count = 0;

  process.stdout.write('Importing CSV file...\n');

  for await (const line of linesParse) {
    const [title, description] = line;
    process.stdout.write(`Importing line ${++count}...${line.join(',')}\n`);

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    //  Uncomment this line to see the import working in slow motion (open the db.json)
    await wait(1000);
  }

  process.stdout.write(`Imported ${count} lines.\n`);
}

// run();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
