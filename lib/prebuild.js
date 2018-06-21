/**
 * Prebuild tasks for Metalsmith to provide helper functions and process data into
 * more useful format. Run this before other plugins.
 *
 * @module  prebuild
 */


/**
 * Dependencies
 */
// Utility to manipulate path strings
const path  = require("path");
// Metalsmith plugin to run a local server in dev environment
const serve = require("metalsmith-pretty-serve");
// Cross-platform solution to manipulate URL path strings
const upath = require("upath");
// Node native URL class
const {URL} = require("url");
// Utility to parse CLI arguments
const yargs = require("yargs");


/**
 * Prebuild tasks
 */
module.exports = opts => (files, metalsmith, done) => {
    // Get metadata from Metalsmith
    const metadata = metalsmith.metadata();
    const metatoadd = {};

    // Initialize task chain that will be performed serially
    let tasks = Promise.resolve();

    // Parse and process the command line arguments
    next(parseCLIInput);

    // Process metadata into useful objects (site.url into URL object, etc.)
    next(processMetadata);

    // Process per-file metadata and into useful objects (date into Date object, etc.)
    next(processFilesMetadata);

    // Add template helpers
    next(addTemplateHelpers);

    // Finished all tasks
    tasks.then(() => done());

    // If error occurs, exit the program
    tasks.catch((error) => {
        console.log(error);
        process.exit(1);
    });


    /**
     * Wrapper for Promise, makes the code more readable
     * @param nextTask {function} Promise function with resolve and reject as the inputs
     */
    function next(nextTask) {
        tasks = tasks.then(() => new Promise(nextTask));
    }

    /**
     * Parses command line inputs
     * @module CLI
     * @example
     *   --serve [port number]
     *     Run a local server to access the built website, optionally specify the port number.
     */
    function parseCLIInput(done, error) {
        // Get args from CLI input
        const argv = yargs.argv;

        // Get local server settings
        if(argv.serve) {
            if(Number.isInteger(argv.serve)) metatoadd.portserve = argv.serve;
            else metatoadd.portserve = 8080;
        }

        // Add parsed inputs to the metadata
        Object.assign(metadata, metatoadd);

        // Run a local server if requested
        if(metadata.portserve) serve({port: metadata.portserve})(files, metalsmith, done);
        else done();
    }

    function processMetadata(done, error) {
        // If a local server is running, swap URL to localhost
        if(metadata.portserve) metadata.site.url = new URL(`http://localhost:${metadata.portserve}`);
        else metadata.site.url = new URL(metadata.site.url)
        done();
    }

    function processFilesMetadata(done, error) {
        const keys = Object.keys(files);
        for(let i = 0; i < keys.length; i++) {
            const name = keys[i];
            // Parse file name and add the basename to file meta
            const parsedPath = path.parse(name);
            files[name].basename = parsedPath.base.split(".")[0];
            // Add URL path of the file into "urlpath" property
            files[name].urlPath  = upath.toUnix(parsedPath.dir);
            // Convert date strings into Date object
            if(files[name].date) files[name].date = new Date(files[name].date);
        }
        done();
    }

    function addTemplateHelpers(done, error) {
        Object.assign(metadata, {
            /**
             * Gets the site root URL.
             * @method getRootURL
             * @return {String} Root URL for the website
             */
            getRootURL: function() {
                return this.site.url.href;
            },

            /**
             * Gets the URL of current file. If urlPath is given, it appends the path
             * to the root URL and returns the complete URL string
             * @method getURL
             * @param urlPath {String} path appended to root URL
             * @return {String} URL for the file from which you call this function
             */
            getURL: function(urlPath) {
                const url = new URL(this.site.url);
                if(!urlPath)
                    url.pathname = path.posix.normalize(`${url.pathname}/${this.url}`);
                else if(typeof urlPath == "string")
                    url.pathname = path.posix.normalize(`${url.pathname}/${urlPath}`);
                else if(typeof urlPath == "object")
                    url.pathname = path.posix.normalize(`${url.pathname}/${urlPath.url}`);
                return url.href;
            },
        });
        done();
    }
};
