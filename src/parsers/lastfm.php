<?php

    function get_geodata($value) {
        global $services_auth;

        $key = $services_auth['lastfm']['key'];

        $url = "http://ws.audioscrobbler.com/2.0/?method=event.getinfo&event=$value&api_key=$key";
        $xml = simplexml_load_file($url);

        $venue_url = $xml->xpath('//venue/url');
        $venue_url = $venue_url[0] ? $venue_url[0] : "http://www.lastfm.com";

        $place_name = $xml->xpath('//venue/name');
        $place_name = $place_name[0] ? $place_name[0] : 'Unlisted';

        // Geo
        $venue_children = $xml->event->venue->location->children('http://www.w3.org/2003/01/geo/wgs84_pos#');
        $latitude = $venue_children->point->lat;
        $longitude = $venue_children->point->long;

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($venue_url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
