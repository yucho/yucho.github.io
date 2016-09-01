# { brickBasename, brickDimensions[], brickType, sizes(optional) }

# Prepare
brickPath = @brickPath

# Firstly, check necessary inputs
if @brickBasename? and @brickDimensions? and @brickType?

	# Prepare
	brickImageFiles = []

	for dimension in @brickDimensions
		width = dimension.substring(0, dimension.indexOf('x'))
		brickImageFiles.push @brickPath + '/' + @brickBasename + '_' + dimension + '.' + @brickType + ' ' + width + 'w'

	src = brickImageFiles[brickImageFiles.length - 1]
	srcset = ""
	srcset += f + ', ' for f in brickImageFiles

	img src: src, srcset: srcset

else
	# Partial renders code when nothing is returned, so render something
	text '<!-- no brick image -->'
