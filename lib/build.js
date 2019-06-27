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
  const collections = collectRenderFiles(buildOpts(opts));
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
  const collections = { files: {}, render: {}, layouts: {}, partials: {}, opts};
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

// const buildDependencies = (collections) => {
//   for (let file in collections.render) {
//     const seen = {};
//     const queue = [];
//     let entry = collections.render[file];
//     while (entry.attributes.layout) {
//       if (seen[file]) throw `Circular nested layout in ${file}`;
//       queue.push(entry);
//       entry.dependents.push(queue);
//       seen[file] = true;
//       file = entry.attributes.layout;
//       entry = collections.layouts[file];
//     }
//     renderQueue.push(queue);
//   }
//   return renderQueue;
// }

const initEngineAttributes = (engine) => {
  const { files, render, layouts, partials } = engine.collections;
  for (const outPath in render) {
    files[render[outPath]].outPath = outPath;
  }
  for (const path in layouts) {
    engine.collections._layouts[parseFilename(path).name] = layouts[path];
    files[layouts[path]].subscriber = new Set();
  }
  for (const path of partials) {
    files[path].subscriber = new Set();
  }
};

const mergeParentsAttributes = (path, collections) => {
  const seen = {};
  const attr = file.attributes;
  let layout = files[path].layout;
  while(layout) {
    if (seen[path]) throw `Circular nested layout in ${path}`;
    seen[path] = true;
    file = getLayout();
    Object.assign(attr, file.attributes);
  }
  return attr;
};

const getLayout = (name, {layouts, opts}) => {
  layouts[name] || 
};

class RenderEngine {
  constructor (collections) {
    this.collections = collections;
    Object.assign(this, collections);
    initEngineAttributes(this);
  }

  renderAll () {
    // buildDependencies(collections);
  }

  render (filePath) {
    const outPath = (this.render[filePath] && filePath) || this.files[filePath].outPath;
    if (!outPath) throw `Unable to render ${filePath}`;

    const file = this.files[this.render[outPath]];
    const attr = mergeParentsAttributes(this.render[outPath], this.collections);
  }

  renderAllDependents (file) {
    ;
  };

  subscribe (subscriber, parent) {
    ;
  }

  emitChange (...filePaths) {

  }
}

module.exports = {
  renderDirSync
};
