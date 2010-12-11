<?php

    function get_geodata($predicate, $value) {

        $url = "http://noticin.gs/noticings/" . $value;
        $page = file_get_contents($url);
        
        preg_match('#map.setCenter\(new CM.LatLng\((.*), (.*)\)#U', $page, $matches);
        $latitude = $matches[1];
        $longitude = $matches[2];

        return array(
            "place_name" => "Noticings",
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
