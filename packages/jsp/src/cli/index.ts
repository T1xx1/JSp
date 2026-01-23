import { compileDir } from '../compiler/index.js';
import { getConfig, mergeConfig } from '../config/index.js';

const config = mergeConfig(getConfig() ?? {});

/* main */

compileDir(config);
