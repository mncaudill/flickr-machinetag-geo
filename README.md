# flickr-machinetag-geo

Author: Nolan Caudill

Date: 2010/12/05

License: BSD

This is a bookmarklet to use Flickr's machine tag to pull
in the geodata. This is much more impressive when the geodata
itself is not already on the page. 

This project was completely inspired by Aaron Cope's post (http://www.aaronland.info/weblog/2010/12/06/urmum/#enplacify).

Currently supported machine tags:

* foodspotting

To be supported:

* yelp
* foursquare
* etc, etc, etc

To use, drag [this link](javascript:(function(){var e=document;var a=e.body;var c=e.createElement("script");c.src="https://nolancaudill.com/projects/machinetaggeo/machinetaggeo-min.js?"+(new Date().getTime());a.appendChild(c)})(); "flickr-machinetag-geo") to your browser bar.


A good first page to look at is Flickr's own, Chris Martin:
http://www.flickr.com/photos/cjmartin/5234756177/
