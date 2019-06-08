const fs = require('fs');
const upath = require('upath');
const fm = require('front-matter');
const {scanDirSync, toPath} = require('./util.js');

const defaults = {
  exts: ['.md', '.mustache'],
  layoutsPath: 'src/layouts',
  layoutsExt: '.layout',
  outPath: 'dest',
  partialsPath: 'src/partials',
  partialsExt: '.partial',
  renderPath: 'src/render'
};

const defaultPaths = ['layoutsPath', 'outPath', 'partialsPath', 'renderPath'];

const renderDirSync = (opts = {}) => {
  opts = buildOpts(opts);
  const collections = collectRenderFiles(opts);
  console.log(collections);
};

const buildOpts = (opts = {}) => {
  opts = Object.assign({}, defaults, opts);
  const seen = {};
  for (const key of defaultPaths) {
    opts[key] = toPath(opts[key]);
    if (seen[opts[key]]) throw `Duplicate path '${opts[key]}' found in ${seen[opts[key]]} and ${key}`
    seen[opts[key]] = key;
  }
  return opts;
};

const collectRenderFiles = (opts) => {
  const collections = { files: {}, render: {}, layouts: {}, partials: {} };
  addDirToCollection(collections, opts, opts.renderPath, 'render');
  addDirToCollection(collections, opts, opts.layoutsPath, 'layouts');
  addDirToCollection(collections, opts, opts.partialsPath, 'partials');
  return collections;
};

const addDirToCollection = (collections, opts, dirPath, name) => {
  scanDirSync(dirPath, (entryPath, type, preventScan) => {
    if (type === 'file') {
      addFileToCollection(entryPath, dirPath, collections, name, opts);
    } else if (type === 'dir' && isCollectionPath(entryPath, opts)) {
      preventScan();
    }
  });
};

const addFileToCollection = (fullPath, dirPath, collections, name, opts) => {
  collections.files[fullPath] = fm(fs.readFileSync(fullPath, { encoding: 'utf8' }));
  collections.files[fullPath].dependents = [];
  const [key, collectionName] = getCollectionKeysFrom(fullPath, dirPath, name, opts);
  if (collectionName) {
    collections[collectionName][key] = fullPath;
  }
};

const getCollectionKeysFrom = (fullPath, dirPath, collectionName, opts) => {
  const {exts} = parseFilename(fullPath);
  let key = fullPath;
  if (exts.includes(opts.layoutsExt)) collectionName = 'layouts';
  else if (exts.includes(opts.partialsExt)) collectionName = 'partials';
  else key = upath.relative(dirPath, fullPath);
  return [key, collectionName];
};

const parseFilename = (filePath) => {
  const parsed = upath.basename(filePath).split('.');
  return {
    name: parsed.shift(),
    exts: parsed.map((ext) => `.${ext}`)
  };
};

const isCollectionPath = (path, opts, name = '') => {
  let match;
  const relPath = upath.relative(__dirname, path);
  switch (relPath) {
    case opts.renderPath: match = 'render'; break;
    case opts.layoutsPath: match = 'layouts'; break;
    case opts.partialsPath: match = 'partials'; break;
  }
  return name ? name === match : !!match;
}

const renderAll = (collections) => {
  buildDependencies(collections);
};

const buildDependencies = (collections) => {
  const renderQueue = [];
  for (let path in collections.renders) {
    const seen = {};
    const queue = [];
    let entry = collections.renders[path];
    while (entry) {
      if (seen[path]) throw `Circular nested layout in ${path}`;
      queue.push(entry);
      entry.dependents.push(queue);
      seen[path] = true;
      path = entry.attributes.layout;
      entry = collections.layouts[path];
    }
    renderQueue.push(queue);
  }
  return renderQueue;
}

module.exports = {
  renderDirSync
};
