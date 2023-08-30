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

export function clean(text: any): string {
    if (typeof (text) === 'string') {
        return text.replace(/@/g, '@​');
    }
    return text;
}

// #region Error handling helper
// source: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

type ErrorWithMessage = {
    message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
}

export function getErrorMessage(error: unknown): string {
    return toErrorWithMessage(error).message;
}
// #endregion
