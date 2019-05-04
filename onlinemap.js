var OM = (function() {
    var OM = function() {
        //amap
        var amapjs = document.createElement("script");
        amapjs.type = "text/javascript";
        amapjs.src = "api/amap/amap.js";
        document.head.appendChild(amapjs); 
        //baidumap
        var baidujs = document.createElement("script");
        baidujs.type = "text/javascript";
        baidujs.src = "api/baidumap/baiduapi.js";
        document.head.appendChild(baidujs); 

      return new OM.fn.init();
    };
    OM.fn = OM.prototype = {
      constructor: OM,
      init: function() { 
        this.onMapLoad = undefined;
        this.onMapZoomed = undefined;
        this.onMapMoved = undefined; 
        this.Map = undefined; 
        this.Creat = function(maptype,initjson,callbackname) { 
            if(maptype=="baidumap")
            {this.Map= new BaiduMap(); }
            else  if(maptype=="amap")
            {this.Map=  new AMapMap();}
            else
            { throw "not support "; } 
            this.Map.Creat(initjson,callbackname);
            this.Map.onMapLoad=this.onMapLoad;
            this.Map.onMapZoomed=this.onMapZoomed;
            this.Map.onMapMoved=this.onMapMoved;
        };
        this.Load = function() {
            this.Map.Load();
        };
        this.IsInit = function() {
          return this.Map.IsInit();
        };
        this.Style=function(obj) {
            this.Map.Style(obj);
        };
        this.Traffic = function() {
            this.Map.Traffic();
        };
        this.Zoom = function() {
          return this.Map.Zoom();
        };
        this.SetZoom = function(level) {
          return this.Map.SetZoom(level);
        };
        this.Center = function() { 
          return this.Map.Center();
        };
        this.SetCenter = function(point) {
            this.Map.SetCenter(point);
        };
        this.Clear = function() {
            this.Map.clearMap();
        };
        this.Satellite = function() {
            this.Map.Satellite();
        };
      }
    };
    OM.fn.init.prototype = OM.fn;
    return OM;
  })();