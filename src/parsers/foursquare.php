<?php

    function get_geodata($value) {

        $url = "http://foursquare.com/venue/" . $value;
        $page = file_get_contents($url);
        
        // Extract latitude
        preg_match('#<meta content="(.*)" property="og:latitude"#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#<meta content="(.*)" property="og:longitude"#U', $page, $matches);
        $longitude = $matches[1];

        preg_match('#<meta content="(.*)" property="og:title"#U', $page, $matches);
        $place_name = $matches[1];

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
