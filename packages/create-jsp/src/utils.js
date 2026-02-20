import { lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
        writeFileSync(targetEntityPath, readFileSync(sourceEntityPath, 'utf8'), 'utf8');
    }
};
