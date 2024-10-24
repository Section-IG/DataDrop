import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { ConsoleLogger, type DefaultLogger } from "@hunteroi/advanced-logger";

const console = new ConsoleLogger();

export async function readFilesFrom<T>(
    directory: string,
    callback: (name: string, props: T) => void,
    logger: DefaultLogger = console,
): Promise<void> {
    try {
        logger.debug(`Lecture du répertoire ${directory}`);

        const files = await fsp.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fsp.stat(filePath);

            if (stats.isDirectory()) {
                await readFilesFrom(filePath, callback, logger);
                continue;
            }

            if (stats.isFile() && !file.endsWith(".js")) continue;

            logger.debug(`Lecture du fichier ${filePath}`);

            const props = await import(filePath);
            callback(file.replace(".js", ""), props.default as T);
        }
    } catch (err) {
        logger.error(getErrorMessage(err));
    }
}

// biome-ignore lint/suspicious/noExplicitAny: evaluated code is of type "any"
export function clean(text: any): string {
    if (typeof text === "string") {
        return text.replace(/@/g, "@​");
    }
    return text;
}

// #region Error handling helper
// source: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

type ErrorWithMessage = {
    message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
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
