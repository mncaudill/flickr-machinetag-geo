(function () {
    var machine_tags_links, machine_tags, geo_sources;
    var parser_url_root = "BUILD_URL_ROOT/parser.php?";

    var info_box = null;

    // Try to reload box if we've already seen it
    var test_div = document.getElementById('machinetaggeo-div');

    if(test_div) {
        test_div.style.display = 'block';
    } else {

        draw_loading_box();

        // Possible geosources
        geo_sources = new Array();
        geo_sources.push({
            namespace: 'foodspotting',
            predicate: 'place',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('foodspotting', mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'foursquare',
            predicate: 'venue',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('foursquare', mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'openplaques',
            predicate: 'id',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('openplaques', mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'lastfm',
            predicate: 'event',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('lastfm', 'event-' + mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'lastfm',
            predicate: 'venue',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('lastfm', 'venue-' + mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'dopplr',
            predicate: 'explore',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('dopplr', mt_value, this.fetch_geo_callback);           
            },
        });
        geo_sources.push({
            namespace: 'noticings',
            predicate: 'id',
            fetch_geo_callback: show_geo_data,
            fetch_geo: function(mt_value){
                jsonp_request('noticings', mt_value, this.fetch_geo_callback);           
            },
        });

        // Does this page continue machine tags?
        machine_tags_links = document.querySelectorAll('#themachinetags > li > a');

        // Does page contain one of our machine tagged geo sources?
        for(var i = 0; i < machine_tags_links.length; i++) {

            machine_tag_info = extract_machine_tag_info(machine_tags_links[i].text);

            var detected = false;
            for(var j = 0; j < geo_sources.length; j++) {
                if(geo_sources[j].namespace ==  machine_tag_info.namespace &&
                    geo_sources[j].predicate == machine_tag_info.predicate) {
                        append_loading_text('Found machine tag for ' + machine_tag_info.namespace + '...');
                        geo_sources[j].fetch_geo(machine_tag_info.value);
                        detected = true;
                        break;
                }
            }

            if(detected) {
                break;
            }

        }

        if(!detected) {
            append_loading_text('Unable to find useful machine tags...');
            append_loading_text("<br><a onclick='document.getElementById(\"machinetaggeo-div\").style.display=\"none\";'>close</a>");
        }
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

    function jsonp_request(service, value, callback) {
        var body, script, global_callback_name; 
        global_callback_name = 'mtgeo_' + Math.floor(Math.random() * 100000000);

        window[global_callback_name] = callback;
        
        body = document.body;
        script = document.createElement('script');
        script.src = parser_url_root + "cb=" + global_callback_name + "&service=" + service + "&value=" + value;
        body.appendChild(script);
    }

    function draw_loading_box() {
        var body = document.body;

        var div = document.createElement('div');
        body.appendChild(div);

        div.style.backgroundColor = "white";
        div.style.zIndex = 100000;
        div.style.position = 'fixed';
        div.style.right = "10px";
        div.style.top = "10px";
        div.style.border = "1px solid black";
        div.style.width = "300px";
        div.style.padding = "10px";
        div.id = "machinetaggeo-div";

        info_box = div;

        append_loading_text('Trying to find machine tags...');
    }

    function show_geo_data(data) {
        var url = "http://maps.google.com/maps/api/staticmap?&zoom=14&size=300x300&markers=color:blue||" + data.latitude + "," + data.longitude + "&sensor=false";
        var map_url = "http://maps.google.com/maps?q=" + data.latitude + "," + data.longitude;
        var text = "<div style='color:black;font-weight:bold;size:14px;'><a href='" + data.url  + "'>" + data.place_name + "</a></div>";
        text += "<input type='text' value='" + data.latitude + "," + data.longitude + "'/>";
        text += "<a href='" + map_url + "'><img style='margin-top:10px;' src=" + url + "></a>";
        text += "<br><a onclick='document.getElementById(\"machinetaggeo-div\").style.display=\"none\";'>close</a>";

        info_box.innerHTML = text;
    }

    function append_loading_text(text) {
        info_box.innerHTML += text + "<br/>";
    }
    
})();