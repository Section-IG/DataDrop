// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs/promises');

const path = `${__dirname}/..`;

function stringifyOnSingleLine(json) {
    const object = JSON.parse(json);
    return JSON.stringify(object);
}

function extractEnvironmentName(envContent) {
    const regex = /NODE_ENV=(\w+)/;
    const matches = regex.exec(envContent);
    return matches && matches.length >= 2 && matches[1];
}

async function asASingleVariable() {
    const templatedEnv = await fs.readFile(`${path}/.env`, 'utf-8');
    const environment = (extractEnvironmentName(templatedEnv) || 'development').toLowerCase();
    const json = await fs.readFile(`${path}/config.${environment}.json`, 'utf-8');

    console.log(`Loading configuration for ${environment}`);
    await fs.writeFile(`${path}/.env`, `CONFIG=${stringifyOnSingleLine(json)}\n${templatedEnv}`);
}

asASingleVariable();
