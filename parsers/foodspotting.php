<?php

    function get_geodata($value) {

        $url = "http://www.foodspotting.com/places/" . $value;
        $page = file_get_contents($url);
        
        // Extract latitude
        preg_match('#id="place_latitude".*value="(.*)"#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#id="place_longitude".*value="(.*)"#U', $page, $matches);
        $longitude = $matches[1];

        return array(
            "latitude" => $latitude,
            "longitude" => $longitude,
        );
    }
