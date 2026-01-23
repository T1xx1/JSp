import process from 'node:process';

import { compileDir } from '../compiler/index.js';
import { getConfig, mergeConfig } from '../config/index.js';

const args = process.argv.slice(2);

const config = mergeConfig(getConfig() ?? {});

/* main */

compileDir(config);
