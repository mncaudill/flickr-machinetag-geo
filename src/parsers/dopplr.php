<?php

    function get_geodata($value) {

        // Supports three predicates: eat, stay, explore
        list($predicate, $value) = explode('-', $value);

        $url = "http://dplr.it/{$predicate}/" . $value;
        $page = file_get_contents($url);

        // Extract latitude
        preg_match('#pointLat:(-?\d.*),#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#pointLng:(-?\d.*),#U', $page, $matches);
        $longitude = $matches[1];

        preg_match('#<title>(.*)\|#U', $page, $matches);
        $place_name = trim($matches[1]);

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
