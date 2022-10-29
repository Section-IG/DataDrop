import * as fs from 'fs';

export function readFilesFrom(path: string, callback: (name: string, props: any) => void): void {
    fs.readdir(path, async (err, files) => {
        if (err) return console.error;
        for (const file of files) {
            if (!file.endsWith('.js')) return;
            const props = await import(`${path}/${file}`);
            const fileName = file.split('.')[0];
            callback(fileName, props.default);
        }
    });
}