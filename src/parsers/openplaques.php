<?php

    function get_geodata($value) {

        $url = "http://www.openplaques.org/plaques/" . $value;
        $page = file_get_contents($url);
        
        // Extract latitude
        preg_match('#<span class="latitude" property="geo:lat">(.*)</span>#U', $page, $matches);
        $latitude = $matches[1];

        preg_match('#<span class="longitude" property="geo:long">(.*)</span>#U', $page, $matches);
        $longitude = $matches[1];

        preg_match('#<p class="inscription" property="op:inscription">(.*)</p>#sU', $page, $matches);
        $place_name = $matches[1];

        return array(
            "place_name" => escape_string($place_name),
            "url" => escape_string($url),
            "latitude" => escape_string($latitude),
            "longitude" => escape_string($longitude),
        );
    }
