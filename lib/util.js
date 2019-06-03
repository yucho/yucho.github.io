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
  console.log(`dest is ${dest}`);
  const currPath = src;
  _copyDirSync(src, dest, currPath);
}

const _copyDirSync = (src, dest, currPath) => {
  const dir = fs.readdirSync(currPath);
  for(const entry of dir) {
    const stats = fs.statSync(parsePath(currPath, entry));
    const entryPath = path.join(currPath, entry);
    if(stats.isFile()) {
      console.log(`${entry} is a file`);
      console.log(`copy to ${path.join(dest, path.relative(src, entryPath))}`)
      copyFileSync(entryPath, path.join(dest, path.relative(src, entryPath)));
    } else if(stats.isDirectory()) {
      console.log(`${entry} is a directory`);
      _copyDirSync(src, dest, entryPath);
    }
  }
};

module.exports = { 
  copyFileSync,
  copyDirSync
};
