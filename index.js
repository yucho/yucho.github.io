/**
 * JavaScript API for Metalsmith website generation
 *
 * @module scaffold-metalsmith
 */


/**
 * Dependencies
 */
// Lightweight static site generator
const metalsmith = require("metalsmith");

/**
 * Default options. Just modify values here. No need to separate config file.
 */
const opts = {
    "source": "src",
    "destination": "dest",
    "metadata": {
        "site": {
            "author": "Yucho Ho",
            "url": "https://yuchoho.com",
            "title": "Astropolitan Project",
            "description": "Yucho Ho's personal blog.",
            "keywords": "Yucho Ho, blog"
        }
    }
}

/**
 * Website generation. The order of plugins is very important
 */
metalsmith(__dirname)
    .source(opts.source)
    .destination(opts.destination)
    .metadata(opts.metadata)

    // Run prebuild tasks such as processing inputs and metadata, adding
    // template helpers, launching a local server, etc.
    .use(prebuildTasks())

    // Render .styl files to .css
    .use(renderStylus())

    // Concatenate some files to reduce the number of files and HTTP requests
    .use(concatenateFiles())

    // Minify concatenated JS files and generate source map on dev mode
    .use(uglifyJS())

    // Create collections of posts, masonry brick images, etc.
    .use(createCollections())

    // Load partials into Metalsmith metadata
    .use(loadPartials())

    // Render .coffeekup files to .html using in-place engine
    .use(renderCoffeekup())

    // Render .md files to .html
    .use(renderMarkdowns())

    // Render nested layouts in correct order
    .use(renderLayouts())

    // Render .eco files to .html using in-place engine
    .use(renderECO())

    // Remove unused attributes from theme.css
    .use(purifyCSS())

    // Minify concatenated CSS files and generate source map on dev mode
    .use(minifyCSS())

    // Generate sitemap and place it at document root for SEO
    .use(generateSitemap())

    // Delete unwanted files from build such as layouts
    .use(removeGarbage())

    .build(function(err) { if (err) throw err });


function prebuildTasks() {
    return require("./lib/prebuild.js")();
}

function renderStylus() {
    return require("metalsmith-stylus")();
}

function concatenateFiles() {
    const concat = require("metalsmith-concat-convention");
    return concat({ extname: ".concat" });
}

function uglifyJS() {
    return function(files, metalsmith, done) {
        const uglify = require("metalsmith-uglify");
        const metadata = metalsmith.metadata();
        const opts = { "sameName": true };

        // Don't generate source map in production mode
        if(!metadata.portserve) Object.assign(opts, {uglify: {sourceMap: false}});

        uglify(opts)(files, metalsmith, done);
    }
}

function createCollections() {
    const collections = require("metalsmith-collections");
    return collections({
        posts: {
            pattern: "posts/*.md",
            sortBy: "date",
            reverse: true
        },
        bricks: {
            pattern: "images/bricks/*.@(gif|jpg|jpeg|png|svg)"
        }
    });
}

function loadPartials() {
    const partials = require("metalsmith-jstransformer-partials");
    return partials({
        "directory": "./lib/partials",
        "engine": "eco"
    });
}

function renderCoffeekup() {
    const inplace = require("metalsmith-in-place");
    return inplace({ pattern: "**/*.coffeekup" });
}

function renderMarkdowns() {
    return require("metalsmith-markdown")();
}

function renderLayouts() {
    const layouts = require("metalsmith-nestedlayouts");
    return layouts({
        "directory": "src/layouts",
        //"pattern": "**/*.@(eco|html)"
    });
}

function renderECO() {
    const inplace = require("metalsmith-in-place");
    return inplace({ pattern: "**/*.eco" });
}

function purifyCSS() {
    const purifycss = require("metalsmith-purifycss");
    return purifycss ({
        content: ["*.html", "*.js"],
        css: ["styles/theme.css"],
        output: "styles/theme.css"
    });
}

function minifyCSS() {
    return function (files, metalsmith, done) {
        const minify = require("metalsmith-clean-css");
        const metadata = metalsmith.metadata();
        const opts = { files: ["src/scripts/**/*.css"] };

        // Don't generate source map in production mode
        if(metadata.portserve) Object.assign(opts, {sourceMap: true});

        minify(opts)(files, metalsmith, done);
    }
}

function generateSitemap() {
    return function(files, metalsmith, done) {
        const sitemap = require("metalsmith-sitemap");
        const metadata = metalsmith.metadata();
        sitemap({ hostname: metadata.getRootURL() })(files, metalsmith, done);
    }
}

function removeGarbage() {
    const ignore = require("metalsmith-ignore");
    return ignore([ "layouts/*" ]);
}
