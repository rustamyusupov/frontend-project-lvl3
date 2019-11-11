import { promises as fs } from 'fs';
import path from 'path';
import init from '../src/init';

beforeEach(async () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = await fs.readFile(pathToHtml, 'utf8');

  // eslint-disable-next-line no-undef
  document.body.innerHTML = html;
});

// eslint-disable-next-line jest/expect-expect
test('init', () => {
  init();
});
