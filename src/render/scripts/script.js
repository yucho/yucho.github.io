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
		$window.on('resize', removeTitleLink);
	}

	// If width < 750px, remove title link (and make it dropdown menu in CSS)
	function removeTitleLink() {
		if($window.width() < 750)
			$('.site-title > a').click(function(){ return false; });
		else
			$('.site-title > a').unbind('click');
	}

	init();
});
