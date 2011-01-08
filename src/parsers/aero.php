<?php

    function get_geodata($predicate, $value) {

        $url = "http://www.ourairports.org/airports/" . $value;
        $page = file_get_contents($url);
        
        // Get title
        preg_match('#<title>(.*)@#U', $page, $matches);
        $place_name = $matches[1];

        // Extract lat/lon
        preg_match('#<meta name="geo.position" content="(.*);(.*)"#U', $page, $matches);
        $latitude = $matches[1];
        $longitude = $matches[2];

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
