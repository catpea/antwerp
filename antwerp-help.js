#!/usr/bin/env node

import { Command, Option } from 'commander/esm.mjs';
const program = new Command();

program.option('-f, --force', 'force installation');
program.parse(process.argv);

// const pkgs = program.args;
// if (!pkgs.length) { console.error('packages required'); process.exit(1); }
// if (program.opts().force) console.log('  force: install');
// pkgs.forEach(function(pkg) { console.log('  install : %s', pkg); });

console.log(`cat README.md`);
