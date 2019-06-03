const fs = require('fs');
const path = require('path');
const jst = require('jstransformer');
const fm = require('front-matter');
const {scanDirSync} = require('./util.js');

const renderDirSync = (src, dest, exts) => {
  exts = exts || ['.eco', '.md'];
  const collection = collectRenderFiles(src, exts);
  console.log(collection);
};

const collectRenderFiles = (dirPath, exts) => {
  const collection = {};
  scanDirSync(dirPath, (filePath, type) => {
    if (type === 'file' && exts.includes(path.extname(filePath))) {
      collection[filePath] = fm(fs.readFileSync(filePath, {encoding: 'utf8'}));
    }
  });
  return collection;
};

module.exports = {
  renderDirSync
};
