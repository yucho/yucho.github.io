---
layout: 'default'
title: 'About'
description: "A brief overview of what this website is about. Unfortunately, it is not about money, violence, and sex."
url: '/about'
urls: ['/about/','/about/index.html','/about.html']
styles:
	- |
		<style>
		@media (max-width: 549px) {
			/* Crop image */
			.profile-pic {
				width: 100vw;
				height: 100vw;
				border-radius: 30%;
				object-fit: none;
				object-position: 50% 90%;
			}
		}
		@media (min-width: 550px) {
			.row {
				position: relative;
				overflow: hidden;
			}
			.left-div {
				position: absolute;
				width: 48%;
				left: 0;
				bottom: 0;
			}
			.sky-block {
				width: 100%;
				padding-top: 500%;
			}

			/* Responsive empty div keeping aspect ratio */
			.left-empty-div-wrapper {
				display: inline-block;
				position: relative;
			}
			.left-empty-div-wrapper:after {
				padding-top: 120%;
				display: block;
				content: '';
			}
			.left-empty-div {
				position: absolute;
				top: 0;
				bottom: 0;
				right: 0;
				left: 0;
			}
		}
		/*
			Todo: icons magic center float
		*/
		.sky-gradient {
			background: #3766aa; /* For browsers that do not support gradients */
			background: -webkit-linear-gradient(black, #3766aa); /* For Safari 5.1 to 6.0 */
			background: -o-linear-gradient(black, #3766aa); /* For Opera 11.1 to 12.0 */
			background: -moz-linear-gradient(black, #3766aa); /* For Firefox 3.6 to 15 */
			background: linear-gradient(black, #3766aa); /* Standard syntax */
		}
		</style>
---

div '.row', ->
	# Profile pic

	# Empty div for layout
	div '.six.columns.left-empty-div-wrapper', ->
		div '.left-empty-div', ->

	# Absolute-positioned div sticking to bottom
	div '.left-div', ->
		div '.sky-block.sky-gradient', ->
		img '.profile-pic',
			src: "/images/yucho-bantay_1380x2453.jpg",
			sizes: "(min-width: 550px) 460px, 100vw",
			srcset: "/images/yucho-bantay_460x818.jpg 460w, /images/yucho-bantay_920x1636.jpg 920w, /images/yucho-bantay_1380x2453.jpg 1380w",
			alt: "Yucho leaning on Bantay Bell Tower"

	# Description
	div '.six.columns', ->
		h4 -> "I welcome you."
		p  ->
			"""
			This website is called <i>Astropolitan Project</i>. I am its creator <b>Yucho Ho</b>. I use it to blog my thoughts.
			"""
		p  ->
			"""
			Yucho is a hobbyist: programmer, pianist, pilot, entrepreneur, climber, boxer, and fish monger.
			"""
		p  ->
			"""
			Yucho gets nerdy for: music theory, theoretical math, and software deployment. Otherwise, I do what a typical modern human does.
			"""
		p  ->
			"""
			Hey, thanks for your interest in this website. I can't offer you a cup of coffee through the screen, but do make yourself at home!
			"""

# h4 -> "Links to unmaintained services:"
# Facebook, Twitter, Github, etc.
