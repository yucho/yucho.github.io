// Set these attributes to svg for ideal behavior
/*
getSVGResponsiveAttributes = () ->
	{
		viewBox: '0 0 550 350',
		preserveAspectRatio: 'xMinYMin meet',
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink',
		'xml:space': 'preserve'
	}
*/

$(document).ready(function() {

	var $window = $(window);

	function init() {
		removeTitleLink();
		setMinHeight();
		$window.on('resize', removeTitleLink);
		$window.on('resize', setMinHeight);
	}

	// If width < 750px, remove title link (and make it dropdown menu in CSS)
	function removeTitleLink() {
		if($window.width() < 750)
			$('.site-title > a').click(function(){ return false; });
		else
			$('.site-title > a').unbind('click');
	}

	// Text over image, set min-height of the wrapper
	function setMinHeight() {
		heights = [];
		$.each($('.text-over-image'), function () {
			heights.push( $(this).outerHeight(true) );
		});
		$.each($('.text-over-image-wrapper'), function (index) {
			$(this).css('min-height', heights[index]);
		});
	}

	init();
});
