---
layout: 'default'
title: 'About'
description: "A brief overview of what this website is about. Unfortunately, it is not about money, violence, and sex."
url: '/about'
urls: ['/about/','/about/index.html','/about.html']
styles: ['/styles/about.css']
---

# Light bulb
img src: "../images/lightbulb_1440x1920.png",
	sizes: "(min-width: 240px) 240px, 100vw",
	srcset: "../images/lightbulb_480x640.png 480w, ../images/lightbulb_960x1280.png 960w, ../images/lightbulb_1440x1920.png 1440w",
	alt: "light bulb"

# Description
h4 -> "Welcome to the pit."
p  ->
	"""
	As you wondered the vast <em>Internet Wasteland</em>, you have fallen into this pit. Judging from your dexterity and proficiency at climbing, it is impossible to exit straight out. Therefore, you have decided to search around this site for more information.
	"""
p ->
	"""
	A quick investigation revealed that a suspect named <strong>Yucho Ho</strong> is responsible for this abomination. He seems to be a hobbyist programmer, pianist, pilot, entrepreneur, climber, boxer, and fish monger. You also discovered a message left by a fallen traveler who had been trapped in here before.
	"""
blockquote ->
	em ->
		p ->
			"""
			My time has come. It is too late for me, and I am ready to meet my fate. However, I shall leave this message in attempt to save future victims. Beware of occasional profanity. In order to avoid the calamity, you must read the posts and leave comments...!
			"""

# h4 -> "Links to unmaintained services:"
# Facebook, Twitter, etc. etc.

# Profile pic here
div style: "text-align: center; margin: 0px auto; width: 40%; background-color: red; overflow: visible;", ->
	div ->
		img src: "http://yuchoho.com/images/golfball-on-grass_1680x810.png", sizes: "(min-width: 640px) 960px, 150vw", srcset: "../images/about-yucho_1440x640.png 1440w, ../images/about-yucho_2880x1280.png 2880w", alt: "Yucho smirks", style: "margin: 0 -9999% 0 -9999%; display: inline-block; max-width: none"
