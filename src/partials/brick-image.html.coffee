# { brickBasename, brickDimensions[], brickType, sizes(optional) }

# Prepare
path = @brickPath
basename = @brickBasename or @basename
dimensions = @brickDimensions
type = @brickType

# Firstly, check necessary inputs
if basename? and dimensions? and type? and path?

	# Prepare
	brickImageFiles = []

	for dimension in dimensions
		width = dimension.substring(0, dimension.indexOf('x'))
		brickImageFiles.push path + '/' + basename + '_' + dimension + '.' + type + ' ' + width + 'w'

	src = brickImageFiles[brickImageFiles.length - 1]
	srcset = ""
	srcset += f + ', ' for f in brickImageFiles

	img src: src, sizes: '450px', srcset: srcset

else
	# Partial renders code when nothing is returned, so render something
	text '<!-- no brick image -->'
