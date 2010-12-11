/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
var MTGEO = {};
(function () {
    var body_text = document.body.innerHTML, secrets,
    parser_url_root = "BUILD_URL_ROOT/parser.php?",
    info_box, photo_id, geo_sources = [],
    is_owner = (/isOwner:\s*true/).test(body_text),
    enplacified_service = null;

    try {
        photo_id = location.pathname.match(/^\/photos\/([A-za-z0-9@]+)\/(\d+)\//)[2];
    } catch (e) {
        photo_id = null;
    }

    function jsonp_request(service, value, callback) {
        var body, script, global_callback_name;

        global_callback_name = 'mtgeo_' + Math.floor(Math.random() * 100000000);

        // Globalize it
        MTGEO[global_callback_name] = callback;

        body = document.body;
        script = document.createElement('script');
        script.src = parser_url_root + "cb=MTGEO." + global_callback_name + "&service=" + service + "&value=" + value;
        body.appendChild(script);
    }

    function append_loading_text(text) {
        info_box.innerHTML += text + "<br/>";
    }

    function write_close_button() {
        append_loading_text("<br><a onclick='document.getElementById(\"machinetaggeo-div\").style.display=\"none\";'>close</a>");
    }

    function show_geo_data(data) {
        var url, map_url, text, lat_lon_string;
        lat_lon_string = data.latitude + ',' + data.longitude;

        if (data.latitude && data.longitude) {
            // Map image url
            url = "http://maps.google.com/maps/api/staticmap?";
            url += "&zoom=14&size=300x300&markers=color:blue||" + lat_lon_string + "&sensor=false";

            // Link to image
            map_url = "http://maps.google.com/maps?q=" + lat_lon_string;

            // Write out info
            text = "<div style='color:black;font-weight:bold;size:14px;'><a href='" + data.url  + "'>" + data.place_name + "</a></div>";
            text += "<input type='text' value='" + lat_lon_string + "'/>";

            if (is_owner) {
                text += '<div id="mtgeo_setlocation_butt" style="margin:10px 0;width:80px;" onclick="MTGEO.set_location(' + lat_lon_string + ');" class="Butt">Set Location</div>';
            }

            text += "<a href='" + map_url + "'><img src=" + url + "></a>";

        } else {
            text = "Unable to fetch coordinates.";
        }

        info_box.innerHTML = text;

        write_close_button();
    }

    // Possible geosources
    geo_sources.push({
        namespace: 'foodspotting',
        predicate: 'place',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'foursquare',
        predicate: 'venue',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'openplaques',
        predicate: 'id',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'lastfm',
        predicate: 'event',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, 'event-' + mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'lastfm',
        predicate: 'venue',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, 'venue-' + mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'dopplr',
        predicate: 'explore',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'noticings',
        predicate: 'id',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });
    geo_sources.push({
        namespace: 'upcoming',
        predicate: 'event',
        fetch_geo_callback: show_geo_data,
        fetch_geo: function (mt_value) {
            enplacified_service = this.namespace;
            jsonp_request(this.namespace, mt_value, this.fetch_geo_callback);
        }
    });


    function get_secrets() {

        return {
            api_key: body_text.match(/api_key:\s*'([^']+)'/)[1],
            auth_hash: body_text.match(/auth_hash:\s*'([^']+)'/)[1],
            secret: body_text.match(/secret:\s*'([^']+)'/)[1]
        };

    }

    secrets = get_secrets();

    function draw_loading_box() {
        var body = document.body;

        info_box = document.createElement('div');

        body.appendChild(info_box);

        info_box.style.backgroundColor = "white";
        info_box.style.zIndex = 100000;
        info_box.style.position = 'fixed';
        info_box.style.right = "10px";
        info_box.style.top = "10px";
        info_box.style.border = "1px solid black";
        info_box.style.width = "300px";
        info_box.style.padding = "10px";
        info_box.id = "machinetaggeo-div";

    }

    function extract_machine_tag_info(text) {
        var split, prefix, namespace, value, predicate;

        split = text.split('=');
        prefix = split[0].split(':');

        namespace = prefix[0];
        predicate = prefix[1];

        return {
            namespace: namespace,
            predicate: predicate,
            value: split[1]
        };
    }

    function xhr_request(url, callback) {

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.responseText);
            }
        };

        xhr.open('GET', url);
        xhr.send(null);
    }

    function set_geolocation(latitude, longitude) {

        var url = '/services/rest/?';
        url += '&api_key=' + secrets.api_key;
        url += '&auth_token=';
        url += '&auth_hash=' + secrets.auth_hash;
        url += '&lat=' + latitude;
        url += '&lon=' + longitude;
        url += '&method=flickr.photos.geo.setLocation';
        url += '&photo_id=' + photo_id;

        xhr_request(url, function (data) {
            var button = document.getElementById('mtgeo_setlocation_butt');
            if (data.match(/stat="ok"/)) {
                button.innerHTML = 'Success';

                // Now add the tag...
                url = '/services/rest/?';
                url += '&api_key=' + secrets.api_key;
                url += '&auth_token=';
                url += '&auth_hash=' + secrets.auth_hash;
                url += '&method=flickr.photos.addTags';
                url += '&photo_id=' + photo_id;
                url += '&tags=' + encodeURIComponent('enplacified:by=' + enplacified_service);
                url += ',' + encodeURIComponent('enplacified:with=flickr-machinetag-geo');

                xhr_request(url, function (data) {
                    console.log(data);
                });

            } else {
                button.innerHTML = 'Error';
                button.className = 'DeleteButt';
            }

            button.onclick = null;
        });
    }

    MTGEO.set_location = set_geolocation;

    function process_machine_tags() {

        var machine_tags_links, machine_tags, machine_tag_info,
        detected = false, i, j;

        // Does this page continue machine tags?
        machine_tags_links = document.querySelectorAll('#themachinetags > li > a');

        // Does page contain one of our machine tagged geo sources?
        for (i = 0; i < machine_tags_links.length; i += 1) {

            machine_tag_info = extract_machine_tag_info(machine_tags_links[i].text);

            for (j = 0; j < geo_sources.length; j += 1) {
                if (geo_sources[j].namespace ===  machine_tag_info.namespace &&
                    geo_sources[j].predicate === machine_tag_info.predicate) {

                    append_loading_text('Found machine tag for ' + machine_tag_info.namespace + '...');
                    geo_sources[j].fetch_geo(machine_tag_info.value);
                    detected = true;
                    break;
                }
            }

            if (detected) {
                break;
            }

        }

        return detected;
    }


    (function () {
        var test_div = document.getElementById('machinetaggeo-div');

        if (test_div) {
            test_div.style.display = 'block';
        } else {

            draw_loading_box();
            append_loading_text('Trying to find machine tags...');

            if (!photo_id) {
                append_loading_text("This doesn't appear to be a Flickr photo page.");
                write_close_button();
            } else {
                if (!process_machine_tags()) {
                    append_loading_text('Unable to find useful machine tags...');
                    write_close_button();
                }
            }
        }
    }());
}());
