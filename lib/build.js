const fs = require('fs');
const up = require('upath');
const gm = require('gray-matter');
const mustache = require('mustache');
const {ensureDirSync, scanDirSync, parseFilename} = require('./util.js');

module.exports = {
  renderDirSync: (opts = {}) => {
    const engine = new RenderEngine(opts);
    engine.readdirSync();
    engine.render();
    engine.writeFilesSync();
    return engine;
  }
}

class RenderEngine {
  constructor(opts) {
    const defaults = {
      exts: ['.md', '.mustache'],
      ignorePaths: ['src/static'],
      layoutsPath: 'src/layouts',
      layoutsExt: '.layout',
      outPath: 'dest',
      partialsPath: 'src/partials',
      partialsExt: '.partial',
      renderPath: 'src/render',
      root: 'src'
    };
    this.opts = Object.assign(defaults, opts);
    this.collections = new Collections(this);
    this.opts.ignoreFullPaths = this.opts.ignorePaths.map((path) => up.resolve(path));
  }

  readdirSync(path = '') {
    path = path || up.resolve(this.opts.root) || up.resolve();
    scanDirSync(path, (entryPath, type, preventScan) => {
      if (type == 'file') {
        this.readFileSync(entryPath);
      } else {
        preventScan();
        if (!this.opts.ignoreFullPaths.includes(entryPath)) {
          this.readdirSync(entryPath);
        }
      }
    });
  }

  readFileSync(path) {
    this.collections.collect(path);
  }

  render(path = '') {
    path ? this.collections.renderPath(path) : this.collections.renderAll();
  }

  writeFilesSync() {
    this.collections.render.write();
  }
}

class Collections {
  constructor(engine) {
    this.engine = engine;
    this.files = new Files(engine);
    this.render = new Render(engine);
    this.layouts = new Layouts(engine);
    this.partials = new Partials(engine);
  }

  collect(path) {
    const name = this.assign(path);
    if (name) {
      this.files.update(path);
      this[name].update(path);
    }
  }

  assign(path) {
    const opts = this.engine.opts;
    const {base} = up.parse(path);
    const {exts} = parseFilename(base);
    const ext = exts.pop();
    const ext2 = exts.pop();

    if (!opts.exts.includes(ext)) {
      return false;
    } else if (ext2 === opts.layoutsExt) {
      return 'layouts';
    } else if (ext2 === opts.partialsExt) {
      return 'partials';
    } else if (!up.relative(up.resolve(opts.layoutsPath), path).startsWith('..')) {
      return 'layouts';
    } else if (!up.relative(up.resolve(opts.partialsPath), path).startsWith('..')) {
      return 'partials';
    } else if (!up.relative(up.resolve(opts.renderPath), path).startsWith('..')) {
      return 'render';
    }
  }

  renderPath(path) {
    if (!up.relative(up.resolve(this.engine.opts.renderPath), path).startsWith('..')) {
      const file = this.files[path];
      if (file) {
        file.render();
      }
    }
  }

  renderAll() {
    for (const path of Object.keys(this.render.files)) {
      const file = this.render.files[path];
      file.render();
    }
  }
};

class Collection {
  constructor(engine, name) {
    this.engine = engine;
    this.name = name;
    this.files = {};
  }

  get object() {
    return this.files;
  }

  update(path) {
    const file = path instanceof File ? path : File.create(this.engine, path);
    if (file) {
      this.files[path] = file;
    } else {
      delete this.files[path];
    }
    return file;
  }
};

class Files extends Collection {
  constructor(engine) {
    super(engine, 'files');
  }
};

class Render extends Collection {
  constructor(engine) {
    super(engine, 'render');
    this.root = up.resolve(engine.opts.renderPath);
  }

  update(path) {
    super.update(path);
    if (this.files[path]) {
      this.files[path].dirty = true;
      this.files[path].output = null;
      const relOutPath = up.relative(this.root, path);
      let outPath;
      switch (up.extname(relOutPath)) {
        case '.mustache': outPath = up.changeExt(relOutPath, '.html', [], 20); break;
        case '.md': up.changeExt(relOutPath, '.html', [], 20); break;
      }
      this.files[path].outPath = up.resolve(this.engine.opts.outPath, outPath);
    }
  }

  write() {
    for (const file of Object.keys(this.files)) {
      this.files[file].write();
    }
  }
};

class Layouts extends Collection {
  constructor(engine) {
    super(engine, 'layouts');
    this.root = up.resolve(engine.opts.layoutsPath);
  }

  get(file) {
    const layoutName = file.data.layout;
    if (!layoutName) {
      return null;
    }
    const {exts} = parseFilename(layoutName);
    const ext = exts.pop();
    const tryNames = [];
    if (ext === '.mustache') {
      tryNames.push(layoutName);
    } else {
      tryNames.push(`${layoutName}.mustache`);
      tryNames.push(`${layoutName}.${this.engine.opts.layoutsExt}.mustache`);
    }

    for (const dir of [file.dir, this.root]) {
      for (const tryName of tryNames) {
        const tryPath = up.resolve(dir, tryName);
        if (this.files[tryPath]) {
          return this.files[tryPath];
        }
      }
    }
    return null;
  }

  getView(file, layout) {
    const parentView = layout ? this.getView(layout, this.get(layout)) : null;
    return Object.assign({}, parentView, file.data);
  }
}

class Partials extends Collection {
  constructor(engine) {
    super(engine, 'partials');
    this.root = up.resolve(engine.opts.partialsPath);
    this.insideRoot = {};
    this.orphans = {};
    this.dirty = true;
  }

  objectRelativeTo(file) {
    const path = file.path;
    const orphans = {};
    for (const partial of Object.keys(this.orphans)) {
      const relPath = up.relative(path, partial);
      orphans[relPath] = this.orphans[partial];
    }
    if (this.dirty) {
      this.namedPartials = {};
      for (const partial of Object.keys(this.insideRoot)) {
        const {dir, base} = up.parse(path);
        const {name, exts} = parseFilename(base);
        '.mustache' === exts.pop();
        if (exts[exts.length - 1] === this.engine.partialsExt) {
          exts.pop();
        }
        const partialName = up.relative(
          this.root, up.resolve(dir, [name, ...exts].join(''))
        );
        this.namedPartials[partialName] = this.insideRoot[partial];
      }
      this.dirty = false;
    }
    return Object.assign({}, this.namedPartials, orphans);
  }

  update(path) {
    super.update(path);
    this.dirty = true;
    const relPath = up.relative(this.root, path);
    if (this.files[path]) {
      if (relPath.substring(0, 2) !== '..') {
        this.insideRoot[relPath] = this.files[path];
      } else {
        this.orphans[path] = this.files[path];
      }
    } else {
      if (relPath.substring(0, 2) !== '..') {
        delete this.insideRoot[relPath];
      } else {
        delete this.orphans[path];
      }
    }
  }
}

class File {
  static create(engine, path) {
    const str = fs.readFileSync(path, { encoding: 'utf8' });
    const { dir, base } = up.parse(path);
    const { name, exts } = parseFilename(base);
    const ext = exts[exts.length - 1];
    if (!str || !engine.opts.exts.includes(ext)) {
      return false;
    }
    const file =
      ext === '.mustache' ? new MustacheFile(str) :
      ext === '.md' ? new MarkdownFile(str) :
      false;
    Object.assign(file, {engine, path, dir, name, exts, ext});
    return file;
  }

  constructor(str) {
    Object.assign(this, gm(str));
  }

  write() {
    if (this.outPath && this.output) {
      ensureDirSync(up.dirname(this.outPath));
      fs.writeFileSync(this.outPath, this.output, {encoding: 'utf8'});
    }
  }
};

class MustacheFile extends File {
  constructor(str) {
    super(str);
  }

  render({ content, view } = {}) {
    const colle = this.engine.collections;
    const layout = colle.layouts.get(this)
    view = view || colle.layouts.getView(this, layout);
    view.content = content || null;
    const partials = colle.partials.objectRelativeTo(this);
    const result = mustache.render(this.content, view, partials);
    this.output = layout ? layout.render({content: result, view}) : result;
    this.dirty = false;
    return this.output;
  }
};

class MarkdownFile extends File {
  constructor(...args) {
    super(...args);
  }
};
