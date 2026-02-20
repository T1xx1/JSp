import { copyFileSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
export const recursiveCopySync = (sourceDir, targetDir) => {
    const sourceEntities = readdirSync(sourceDir);
    for (const entityName of sourceEntities) {
        const sourceEntityPath = join(sourceDir, entityName);
        const targetEntityPath = join(targetDir, entityName);
        /* subfolders */
        if (lstatSync(sourceEntityPath).isDirectory()) {
            mkdirSync(targetEntityPath, { recursive: true });
            recursiveCopySync(sourceEntityPath, targetEntityPath);
            continue;
        }
        copyFileSync(sourceEntityPath, targetEntityPath);
    }
};
