import { DatadropClient } from '../datadrop';

module.exports = async (client: DatadropClient, error: Error) => {
    client.logger.error(`${error.name}: ${error.message}\n${error.cause}\n${error.stack}`);
};
