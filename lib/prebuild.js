const path      = require("path");
const {URL}     = require("url");
const yargs     = require("yargs");

const serve     = require("metalsmith-serve");

/**
 * Prebuild tasks
 */
module.exports = opts => (files, metalsmith, done) => {
    // Metadata
    const metadata = metalsmith.metadata();

    // Parse argv and add metadata
    const argv = yargs.argv;
    const metatoadd = {};

    // Local server settings
    if(argv.serve) {
        if(Number.isInteger(argv.serve)) metatoadd.portserve = argv.serve;
        else metatoadd.portserve = 8080;
    }

    Object.assign(metadata, metatoadd);

    // Parse metadata and convert them to useful objects
    const tasks = new Promise(resolve => {
        if(metadata.portserve) metadata.site.url = new URL(`http://localhost:${metadata.portserve}`);
        else metadata.site.url = new URL(metadata.site.url)
        resolve();
    });

    // Add template helpers
    tasks.then(() => new Promise(resolve => {
        Object.assign(metadata, {
            // Gets the site root URL
            getrooturl: function() {
                return this.site.url.href;
            },

            // Gets the URL of current file
            geturl: function() {
                const url = new URL(this.site.url);
                url.pathname = this.url;
                return url.href;
            },
        });
        resolve();
    }));

    // Run serve if requested
    tasks.then(() => new Promise(resolve => {
        if(metadata.portserve) serve({port: metadata.portserve})(files, metalsmith, resolve);
    }));

    tasks.then(() => done());
};
