#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const dir = require('../config').root;
const _ = require('../lib/helper');
const inquirer = require('inquirer');

program
    .option('-n, --appname <name>', 'app name')
    .option('-u, --url <url>', 'app download url')
    .option('-s, --schema <schema>', 'app schema')
    .parse(process.argv);

const configPath = `${dir}/ios-simulator.config.json`;

async function main() {
    const exists = await fs.pathExists(configPath);
    if (!exists) {
        await fs.ensureFile(configPath);
        await fs.writeJson(configPath, {appname: '', url: '', schemas: []});
    }

    const obj = await fs.readJson(configPath);

    const appname = program.name;
    if (appname) {
        obj.appname = appname;
    }

    const url = program.url;
    if (url) {
        obj.url = url;
    }

    const schema = program.schema;
    const isExist = obj.schemas.filter(item => item === schema);
    if (schema && isExist) {
        obj.schemas.push(schema);
    }

    await fs.writeJson(configPath, obj);
}

async function init() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'appname',
            message: 'input you appname',
            default: 'BaiduBoxApp'
        }, {
            type: 'input',
            name: 'url',
            message: 'download app url',
        }, {
            type: 'input',
            name: 'schema',
            message: 'open schema header',
        }
    ]);
    const obj = {
        appname: answers.appname,
        url: answers.url,
        schemas: [answers.schema]
    }
    await fs.ensureFile(configPath);
    await fs.writeJson(configPath, obj);
}

const isInit = !program.schema && !program.appname && !program.url;
if (isInit) {
    init();
}
else {
    main();
}
