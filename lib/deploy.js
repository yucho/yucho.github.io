#!/usr/bin/env node

const cp = require('child_process');
const spawn = cp.spawn;
const path = (...args) => require('path').resolve(...args);
const tmp = require('tmp');

const deploy = () => {
  buildWebpack()
    .then(createTempDir)
    .then(pushToGitHub)
    .then(removeTempDir)
    .catch((err) => {
      console.error(err);
      if (tmpObj) {
        removeTempDir();
      }
    });
};

const run = (command, args = [], opts = {}) => {
  const options = Object.assign({ stdio: 'inherit' }, opts);
  return new Promise((resolve, reject) => {
    const cp = spawn(command, args, options);
    cp.on('close', (code) => {
      if (code !== 0) {
        console.error(`${command} process exited with code ${code}`);
        reject();
      }
      resolve();
    });
  });
};

const buildWebpack = () => run('npm', ['run', 'build']);

let tmpObj;
const createTempDir = () => tmpObj = tmp.dirSync();

const pushToGitHub = () => {
  const tempDir = path(tmpObj.name);
  const runTemp = (...args) => run(...args, { cwd: tempDir })
  return run('cp', [path('dist', 'interactive-resume.js'), 'README.md', tempDir])
    .then(() => runTemp('git', ['init']))
    .then(() => runTemp('git', ['remote', 'add', 'origin', 'https://github.com/yucho/interactive-resume.git']))
    .then(() => runTemp('git', ['add', '.']))
    .then(() => runTemp('git', ['commit', '-m', '"Deploy to GitHub page"']))
    .then(() => runTemp('git', ['push', '--force', 'origin', 'master']))
};

const removeTempDir = () => tmpObj.removeCallback();

deploy();
