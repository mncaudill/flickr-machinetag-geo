<?php

    function get_geodata($predicate, $value) {

        $url = "http://upcoming.org/$predicate/" . $value;
        $page = file_get_contents($url);
        
        // Extract latitude
        preg_match('#<abbr class="latitude" title="(.*)"#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#<abbr class="longitude" title="(.*)"#U', $page, $matches);
        $longitude = $matches[1];

        preg_match('#<span class="event-title-text summary" property="vcard:fn">(.*)</span>#Us', $page, $matches);
        $place_name = trim($matches[1]);

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
