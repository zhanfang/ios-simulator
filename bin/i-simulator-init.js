#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const ora = require('ora');
const download = require('download');
const dir = require('../config').root;
const Simulator = require('../lib/simulator');
const _ = require('../lib/helper');

let appname = '';
let url = '';
let schemas = [];

async function isConfig() {
    const exists = await fse.pathExists(`${dir}/ios-simulator.config.json`);
    if (!exists) {
        throw 'please run config command first';
    }
}

async function downloadApp() {
    await fse.ensureDir(dir);
    const exists = await fse.pathExists(`${dir}/${appname}.app`);
    if (!exists) {
        try {
            const zipExists = await fse.pathExists(`${dir}/${appname}.zip`);
            if (!zipExists) {
                const spinner1 = ora(`Downloding ${appname}`).start();
                const data = await download(url);
                fse.writeFileSync(`${dir}/${appname}.zip`, data);
                spinner1.succeed();
            }
    
            const spinner2 = ora(`tar ${appname}`).start();
            await _.exec(`tar -zvxf ${dir}/${appname}.zip -C ${dir}`);
            spinner2.succeed();
        } catch (error) {
            console.error(error);
        }
        
    }
}

async function openIOS() {
    const res = await Simulator.getDevices();
    const devices = res.filter(item => item.available);
    const choices = devices.reduce((arr, item, index) => {
        let temp = {
            name: item.name,
            value: item.udid
        }
        arr.push(temp);
        return arr;
    }, []);
    const answers = await inquirer.prompt([{
        type: 'list',
        name: 'device',
        message: 'What device you want to open?',
        choices: choices
    }]);

    await Simulator.launchByUDID(answers.device);

    await _.sleep(10000);

    await _.exec(`xcrun simctl install booted ${dir}/${appname}.app`);

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
    try {
        await isConfig();
        const obj = await fse.readJson(`${dir}/ios-simulator.config.json`);
        url = obj.url;
        appname = obj.appname;
        schemas = obj.schemas;
        await downloadApp();
        await openIOS();
    }
    catch (e) {
        console.log(e);
    }
}

main();
