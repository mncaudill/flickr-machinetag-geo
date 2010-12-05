(function () {
    var machine_tags_links, machine_tags, geo_sources;

    // Possible geosources
    geo_sources = new Array();
    geo_sources.push({
        namespace: 'foodspotting',
        predicate: 'place',
        fetch_geo_callback: function(data) {
            console.log(data);
        },
        fetch_geo: function(mt_value){
            jsonp_request('http://nolancaudill.com', this.fetch_geo_callback);           
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

    function jsonp_request(url, callback) {
        var body, script, global_callback_name; 
        global_callback_name = 'mtgeo_' + Math.floor(Math.random() * 100000000);
    }
    
})();
