import { list, get } from '@vercel/blob';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const outArg = process.argv.find(a => a.startsWith('--out='));
if (!outArg) throw new Error('Provide --out=/path/to/private/subscribers.csv');
const output = resolve(outArg.slice(6));
const rows = [['email', 'language', 'createdAt', 'consentVersion', 'source']];
let cursor;
do {
  const result = await list({ prefix: 'subscribers/', cursor });
  for (const blob of result.blobs) {
    const response = await get(blob.pathname, { access: 'private', useCache: false });
    if (!response || response.statusCode !== 200) throw new Error('A record could not be read; export stopped.');
    const record = JSON.parse(await new Response(response.stream).text());
    rows.push(rows[0].map(key => record[key] || ''));
  }
  cursor = result.hasMore ? result.cursor : undefined;
} while (cursor);
// Prevent a submitted value from becoming a spreadsheet formula when opened in Excel.
const cell = value => '"' + (/^[=+@-]/.test(String(value)) ? "'" : '') + String(value).replaceAll('"', '""') + '"';
await mkdir(dirname(output), { recursive: true, mode: 0o700 });
await writeFile(output, '\ufeff' + rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n', { mode: 0o600 });
console.log(`Exported ${rows.length - 1} subscriber records to ${output}`);
