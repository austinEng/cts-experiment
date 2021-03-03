import * as fs from 'fs';
import * as path from 'path';

import { crawl } from './crawl.js';

function usage(rc: number): void {
  console.error('Usage:');
  console.error('  tools/gen_listings [OUT_DIR] [SUITES...]');
  console.error('  tools/gen_listings generated/ webgpu unittests');
  process.exit(rc);
}

if (process.argv.length <= 3) {
  usage(0);
}

const myself = 'src/common/tools/gen_listings.ts';
// if (!fs.existsSync(myself)) {
//   console.error('Must be run from repository root');
//   usage(1);
// }

const outDir = process.argv[2];

(async () => {
  for (const suite of process.argv.slice(3)) {
    const listing = await crawl(path.join(path.dirname(path.dirname(__dirname)), suite));

    const outFile = path.normalize(path.join(outDir, `${suite}/listing.js`));
    fs.mkdirSync(path.join(outDir, suite), { recursive: true });
    fs.writeFileSync(
      outFile,
      `\
// AUTO-GENERATED - DO NOT EDIT. See ${myself}.

export const listing = ${JSON.stringify(listing, undefined, 2)};
`
    );
    try {
      fs.unlinkSync(outFile + '.map');
      /* eslint-disable-next-line no-empty */
    } catch (ex) {}
  }
})();
