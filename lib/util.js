const fs = require('fs');
const upath = require('upath');

const copyFileSync = (src, dest) => {
  [src, dest] = toPath(src, dest);
  fs.copyFileSync(src, dest,
    (err) => {
      if (err) throw err;

      console.log(`${upath.join(src)} copied to ${upath.join(dest)}`);
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
    const outPath = upath.join(dest, upath.relative(src, entryPath));
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

const parsePath = (...pathArr) => upath.resolve(...pathArr);

const scanDirSync = (dirPath, cb) => {
  dirPath = toPath(dirPath);
  _scanDirSync(dirPath, cb);
};

// DFS
const _scanDirSync = (dirPath, cb) => {
  for (const entry of fs.readdirSync(dirPath)) {
    const entryPath = upath.join(dirPath, entry);
    const stats = fs.statSync(entryPath);
    if (stats.isFile()) {
      cb(entryPath, 'file');
    } else if(stats.isDirectory()) {
      let preventScan = false;
      cb(entryPath, 'dir', () => preventScan = true);
      if (!preventScan) {
        _scanDirSync(entryPath, cb);
      }
    }
  }
};

const toPath = (...paths) => {
  for (const i in paths) {
    if (typeof paths[i] !== 'string') paths[i] = parsePath(...paths[i]);
    paths[i] = upath.normalize(paths[i]);
  }
  if (paths.length === 1) return paths[0];
  return paths;
};

module.exports = { 
  copyDirSync,
  copyFileSync,
  mkdirSync,
  scanDirSync,
  toPath
};
