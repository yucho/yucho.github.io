const fs = require('fs');
const upath = require('upath');
const jst = require('jstransformer');
const fm = require('front-matter');
const {scanDirSync, toPath} = require('./util.js');

const defaults = {
  exts: ['.eco', '.md'],
  layoutsDir: 'src/layouts',
  layoutsExt: '.layout',
  outPath: 'dest',
  partialsDir: 'src/partials',
  partialsExt: '.partial',
  renderPath: 'src/render'
};

const buildOpts = (opts = {}) => Object.assign({}, defaults, opts);

const renderDirSync = (src, dest, opts) => {
  opts = buildOpts(opts);
  const collections = collectRenderFiles(toPath(src), opts);
  console.log(collections);
};

const collectRenderFiles = (dirPath, opts) => {
  const collections = { files: {}, renders: {}, layouts: {}, partials: {} };
  scanDirSync(dirPath, (entryPath, type, preventScan) => {
    if (type === 'file') {
      const ext = upath.extname(entryPath);
      addFileToCollection(entryPath, collections, { name:
        ext === opts.layoutsExt ? 'layouts' :
        ext === opts.partialsExt ? 'partials' : 'renders'
      });
    } else if (type === 'dir') {
      const dir = upath.relative(dirPath, entryPath);
      const collectionName = dir === opts.layoutsDir ? 'layouts' :
        dir === opts.partialsDir ? 'partials' : null;
      if (collectionName) {
        preventScan();
        scanDirSync(entryPath, (filePath, type) => {
          if (type === 'file') {
            addFileToCollection(filePath, collections, {
              path: upath.relative(entryPath, filePath), collectionName
            });
          }
        });
      }
    }
  });
  return collections;
};

const addFileToCollection = (fullPath, collections, {path, name}) => {
  path = path || fullPath;
  collections.files[fullPath] = fm(fs.readFileSync(fullPath, { encoding: 'utf8' }));
  if (name) {
    collections[name][path] = collections.files[fullPath];
  }
};

module.exports = {
  renderDirSync
};
