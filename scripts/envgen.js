// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs/promises');

const environment = (process.env.NODE_ENV ?? 'development').toLowerCase();
const path = `${__dirname}/..`;

function stringifyOnSingleLine(json) {
    const object = JSON.parse(json);
    return JSON.stringify(object);
}

function asASingleVariable() {
    console.log(`Loading configuration for ${environment}`);
    fs.readFile(`${path}/config.${environment}.json`, 'utf-8').then(json => {
        fs.readFile(`${path}/templated.env`, 'utf-8').then((templatedenv) => {
            fs.writeFile(`${path}/.env`, `CONFIG=${stringifyOnSingleLine(json)}\n${templatedenv}`);
        });
    });
}

asASingleVariable();
