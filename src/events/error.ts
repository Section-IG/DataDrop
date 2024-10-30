import type { DatadropClient } from "../datadrop.js";

export default async function error(client: DatadropClient, error: Error) {
    client.logger.error(
        `${error.name}: ${error.message}\n${error.cause}\n${error.stack}`,
    );
}
