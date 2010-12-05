(function () {
    var machine_tags_links, machine_tags, geo_sources;
    var parser_url_root = "http://localhost/machinetaggeo/parser.php?";

    // Possible geosources
    geo_sources = new Array();
    geo_sources.push({
        namespace: 'foodspotting',
        predicate: 'place',
        fetch_geo_callback: function(data) {
            console.log(data);
            draw_info_box(data);
        },
        fetch_geo: function(mt_value){
            jsonp_request('foodspotting', mt_value, this.fetch_geo_callback);           
        },
    });

    // Does this page continue machine tags?
    machine_tags_links = document.querySelectorAll('#themachinetags > li > a');

    // Does page contain one of our machine tagged geo sources?
    for(var i = 0; i < machine_tags_links.length; i++) {

        machine_tag_info = extract_machine_tag_info(machine_tags_links[i].text);

        for(var j = 0; j < geo_sources.length; j++) {
            if(geo_sources[j].namespace ==  machine_tag_info.namespace &&
                geo_sources[j].predicate == machine_tag_info.predicate) {
                    geo_sources[j].fetch_geo(machine_tag_info.value);
                    break;
            }
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

    function draw_info_box(data) {
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

        var url = "http://maps.google.com/maps/api/staticmap?size=300x300&markers=color:blue||" + data.latitude + "," + data.longitude + "&sensor=false";
        div.innerHTML = "<div style='color:black;font-weight:bold;size:14px;'><a href='" + data.url  + "'>" + data.place_name + "</a></div>";
        div.innerHTML += "<input type='text' value='" + data.latitude + "," + data.longitude + "'/>";
        div.innerHTML += "<img style='margin-top:10px;' src=" + url + ">";
        div.innerHTML += "<br><a onclick='document.getElementById(\"machinetaggeo-div\").style.display=\"none\";'>close</a>";
    }
    
})();
