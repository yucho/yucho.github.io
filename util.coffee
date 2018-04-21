path = require "path"

###*
# Performs pre-build tasks.
###
exports.prepare = (opts) -> (files, metalsmith, done) ->
	setImmediate done

	# File manipulations
	for name in Object.keys files
		# Parse file names and add them to properties
		files[name].basename = path.parse(name).base.split(".")[0]

		# Convert date strings into date object
		if files[name].date? then files[name].date = new Date files[name].date

	# Add custom helpers to metadata
	Object.assign metalsmith,
		geturl: -> console.log @
