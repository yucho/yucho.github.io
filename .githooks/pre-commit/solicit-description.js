#!/usr/bin/env node

/**
 * solicit-description.js - Enforces contributors to provide a description
 * of each file in this project directory, making this project more
 * manageable. Good to run in Git pre-commit script.
 */


// Path for yml file that contains the descriptions
const yml = "descriptions.yml"


// Dependencies
const fs		= require("fs");
const {exec}	= require("child_process");
const parseYML	= require("js-yaml").safeLoad;


// Cache
let files;
let descriptions;


console.log("solicit-description.js is running...");


// Get all files tracked by Git
new Promise((resolve, reject) => {
	exec("git ls-files", (err, stdout, stderr) => {
		if (err) reject(err);
		files = stdout;
		resolve();
	});
})


// Read yml
.then(() => new Promise((resolve, reject) => {
	fs.readFile(yml, (err, data) => {
		if (err) reject(err);
		descriptions = data;
		resolve();
	})
}), )


// Check if description exists for all tracked files. Throw if any is missing
// or if description of untracked file is found
.then(() => new Promise((resolve, reject) => {
	filesArray = files.split("\n");
	ymlArray = Object.keys(parseYML(descriptions));
	for(let i = 0; i < filesArray.length; i++) {
		let file = filesArray[i];
		if(file) {
			let ymlIndex = ymlArray.indexOf(file);
			if (ymlIndex < 0) {
				reject(`Error! ${file} has no description. Please add it to <project-root>/${yml}`);
			}
			else {
				ymlArray.splice(ymlIndex, 1);
			}
		}
	}

	for(let i = 0; i < ymlArray.length; i++) {
		let file = ymlArray[i];
		if(file) {
			if(filesArray.indexOf(file) < 0) {
				reject(`Error! The file ${file} is not tracked by Git. Please remove the entry.`)
			}
		}
	}

	resolve();
}))


// Handle errors by printing them and exiting with non-zero status
.catch((reason) => {
	console.log(reason);
	process.exit(1);
});
