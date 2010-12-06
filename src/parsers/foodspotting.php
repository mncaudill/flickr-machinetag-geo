<?php

    function get_geodata($value) {

        $url = "http://www.foodspotting.com/places/" . $value;
        $page = file_get_contents($url);
        
        // Extract latitude
        preg_match('#id="place_latitude".*value="(.*)"#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#id="place_longitude".*value="(.*)"#U', $page, $matches);
        $longitude = $matches[1];

        preg_match('#id="place_name".*value="(.*)"#U', $page, $matches);
        $place_name = $matches[1];

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
