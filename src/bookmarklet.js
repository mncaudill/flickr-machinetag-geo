javascript:(function(){ 
    var d = document;
    var b = d.body;
    var s = d.createElement('script');
    s.src = "BUILD_URL_ROOT/machinetaggeo-min.js?" + (new Date().getTime());
    b.appendChild(s);
})();

