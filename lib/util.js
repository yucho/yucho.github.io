const fs = require('fs');
const path = require('path');


const parsePath = (...subpaths) => path.resolve(...subpaths);

const toPath = (...args) => {
  for (const i in args) {
    if (typeof args[i] !== 'string') args[i] = parsePath(...args[i]);
  }
  if (args.length === 1) return args[0];
  return args;
}

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
  const currPath = src;
  mkdirSync(dest);
  _copyDirSync(src, dest, currPath);
}

const _copyDirSync = (src, dest, currPath) => {
  const dir = fs.readdirSync(currPath);
  for(const entry of dir) {
    const entryPath = path.join(currPath, entry);
    const outPath = path.join(dest, path.relative(src, entryPath));
    const stats = fs.statSync(entryPath);
    if(stats.isFile()) {
      copyFileSync(entryPath, outPath);
    } else if(stats.isDirectory()) {
      mkdirSync(outPath);
      _copyDirSync(src, dest, entryPath);
    }
  }
};

const mkdirSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

module.exports = { 
  copyFileSync,
  copyDirSync,
  mkdirSync
};
