// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs/promises');

const environment = (process.env.NODE_ENV ?? 'development').toLowerCase();
const path = `${__dirname}/..`;

function stringifyOnSingleLine(json) {
    const object = JSON.parse(json);
    return JSON.stringify(object);
}

async function asASingleVariable() {
    console.log(`Loading configuration for ${environment}`);

    const json = await fs.readFile(`${path}/config.${environment}.json`, 'utf-8');
    const templatedEnv = await fs.readFile(`${path}/templated.env`, 'utf-8');

    await fs.writeFile(`${path}/.env`, `CONFIG=${stringifyOnSingleLine(json)}\nNODE_ENV=${environment}\n${templatedEnv}`);
}

asASingleVariable();
