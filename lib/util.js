const fs = require('fs');
const path = require('path');

const copyFileSync = (src, dest) => {
  [src, dest] = toPath(src, dest);
  fs.copyFileSync(src, dest,
    (err) => {
      if (err) throw err;

      console.log(`${path.join(src)} copied to ${path.join(dest)}`);
    }
  )
};

const copyDirSync = (src, dest) => {
  [src, dest] = toPath(src, dest);
  mkdirSync(dest);
  _copyDirSync(src, dest);
}

const _copyDirSync = (src, dest) => {
  _scanDirSync(src, (entryPath, type) => {
    const outPath = path.join(dest, path.relative(src, entryPath));
    if (type === 'file') {
      copyFileSync(entryPath, outPath);
    } else if (type === 'dir') {
      mkdirSync(outPath);
    }
  });
};

const mkdirSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

const parsePath = (...subpaths) => path.resolve(...subpaths);

const scanDirSync = (dirPath, cb) => {
  dirPath = toPath(dirPath);
  _scanDirSync(dirPath, cb);
};

// DFS
const _scanDirSync = (dirPath, cb) => {
  for (const entry of fs.readdirSync(dirPath)) {
    const entryPath = path.join(dirPath, entry);
    const stats = fs.statSync(entryPath);
    if (stats.isFile()) {
      cb(entryPath, 'file');
    } else if(stats.isDirectory()) {
      cb(entryPath, 'dir');
      scanDirSync(entryPath, cb);
    }
  }
};

const toPath = (...args) => {
  for (const i in args) {
    if (typeof args[i] !== 'string') args[i] = parsePath(...args[i]);
  }
  if (args.length === 1) return args[0];
  return args;
}

module.exports = { 
  copyDirSync,
  copyFileSync,
  mkdirSync,
  scanDirSync
};
