#!/usr/bin/env node

const program = require('commander');
const version = require('../package').version

program
    .version(version)
    .usage('<command> [options]')
    .command('init', 'init a ios simulator project')
    .command('open', 'open a url in simulator')
    .command('config [option]', 'config app download url and open schemas')
    .parse(process.argv);
