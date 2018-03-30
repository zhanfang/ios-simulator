#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const Simulator = require('../lib/simulator');
const _ = require('../lib/helper');
const dir = require('../config').root;

let appname = '';
let url = '';
let schemas = [];

async function isConfig() {
    const exists = await fse.pathExists(`${dir}/ios-simulator.config.json`);
    if (!exists) {
        throw 'please run config command first';
    }
}

async function openIOS() {
    const answers2 = await inquirer.prompt([{
        type: 'list',
        name: 'schema',
        message: 'What schema you want to open?',
        choices: schemas
    }]);

    const answers3 = await inquirer.prompt([{
        type: 'input',
        name: 'openurl',
        message: 'What url you want to open?',
        default: 'http://po.baidu.com/opcenter/index.html'
    }]);

    const openurl = answers2.schema + encodeURIComponent(answers3.openurl);
    await _.exec(`xcrun simctl openurl booted '${openurl}'`);
}

async function main() {
    try{
        await isConfig();
        const obj = await fse.readJson(`${dir}/ios-simulator.config.json`);
        url = obj.url;
        appname = obj.appname;
        schemas = obj.schemas;
        await openIOS();
    }
    catch(e) {
        console.log(e);
    }
}

main();
