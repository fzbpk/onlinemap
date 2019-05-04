var AMapMap = (function() {
  var AMapMap = function() {
    return new AMapMap.fn.init();
  };
  AMapMap.fn = AMapMap.prototype = {
    constructor: AMapMap,
    init: function() {
      this.initdat = {
        init: {
          minZoom: 8,
          maxZoom: 19
        },
        Tips_offset: {
          x: -40,
          y: -20
        },
        Div_offset: {
          x: 0,
          y: 0
        },
        Tips_Style: {
          color: "red",
          fontSize: "12px",
          height: "20px",
          lineHeight: "20px",
          fontFamily: "微软雅黑"
        },
        Line_Style: {
          enableEditing: false, //是否启用线编辑，默认为false
          enableClicking: true, //是否响应点击事件，默认为true
          icons: [],
          strokeWeight: "8", //折线的宽度，以像素为单位
          strokeOpacity: 0.8, //折线的透明度，取值范围0 - 1
          strokeColor: "#0000ff" //折线颜色
        },
        Icon: {
          Symbol: 7,
          pic: {
            scale: 0.6, //图标缩放大小
            strokeColor: "#fff", //设置矢量图标的线填充颜色
            strokeWeight: "2" //设置线宽
          },
          H: "10",
          W: "30"
        }
      };
      this.onMapLoad = undefined;
      this.onMapZoomed = undefined;
      this.onMapMoved = undefined;
      this.amap_option = undefined;
      this.amap_Map = undefined;
      this.trafficLayer = undefined;
      this.trafficLayer_Visible = false;
      this.Satellite_Visible = false;
      this.Creat = function(initjson,callbackname) {
        this.amap_option = initjson;
        if (document.getElementById(this.amap_option.mapid) == undefined) {
          var mapdiv = document.createElement("div");
          mapdiv.id = this.amap_option.mapid;
          mapdiv.class = "mapdiv";
          document.body.appendChild(mapdiv);
        } 
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "https://webapi.amap.com/maps?v=1.4.14&key=" +
          this.amap_option.key +
          "&callback=" +
          callbackname;
        document.head.appendChild(script);
        var linkcss = document.createElement("link");
        linkcss.rel = "stylesheet";
        linkcss.type = "text/css";
        linkcss.href = "api/amap/amap.css";
        document.head.appendChild(linkcss);
      };
      this.Load = function() {
        this.amap_Map = new AMap.Map(this.amap_option.mapid);
        var mapinit = this.onMapLoad;
        var mapzoomed = this.onMapZoomed;
        var mapmove=this.onMapMoved;
        var maps = this.amap_Map;
        var zooms = this.amap_option.point.zoom;
        this.amap_Map.on("complete", function(e) {
          if (mapinit != undefined) mapinit(maps);
        });
        if (this.amap_option.point.gps) {
          AMap.plugin("AMap.CitySearch", function() {
            var citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function(status, result) {
              if (status === "complete" && result.info === "OK") {
                this.amap_Map.setZoomAndCenter(zooms, result.city);
              }
            });
          });
        } else if (this.amap_option.point.city == undefined) {
          var point = new AMap.LngLat(
            this.amap_option.point.lng,
            this.amap_option.point.lat
          );
          this.amap_Map.setZoomAndCenter(zooms, point);
        } else {
          this.amap_Map.setZoomAndCenter(zooms, this.amap_option.point.city);
        }
        var mapcss = "mapdiv";
        if (this.amap_option.mapcss != undefined) {
            mapcss = this.amap_option.mapcss;
        }
        if (
          document
            .getElementById(this.amap_option.mapid)
            .className.indexOf(mapcss) == -1
        ) {
          document
            .getElementById(this.amap_option.mapid)
            .classList.add(mapcss);
        }
        if(this.amap_option.style!=undefined )
        {
            this.amap_Map.setMapStyle(this.amap_option.style.name);
        }
        this.trafficLayer = new AMap.TileLayer.Traffic({
          zIndex: 10
        });
        this.trafficLayer.setMap(this.amap_Map);
        this.trafficLayer.hide();
        this.trafficLayer_Visible = false;
        if (mapzoomed == undefined) {
          this.amap_Map.setStatus({ scrollWheel: false, touchZoom: false });
        } else {
          this.amap_Map.setStatus({ scrollWheel: true, touchZoom: true });
          this.amap_Map.on("zoomend", function(e) {
            mapzoomed();
          });
        }
        if(mapmove==undefined){
            this.amap_Map.setStatus({ dragEnable: false});
        } else {
          this.amap_Map.setStatus({ dragEnable: true});
          this.amap_Map.on("moveend", function(e) {
            mapmove();
          });
        }
      };
      this.IsInit = function() {
        return this.amap_Map != undefined;
      };
      this.Style=function(obj) {
        this.amap_Map.setMapStyle(obj);
      };
      this.Traffic = function() {
        if (this.trafficLayer_Visible) {
          this.trafficLayer.hide();
          this.trafficLayer_Visible = false;
        } else {
          this.trafficLayer.show();
          this.trafficLayer_Visible = true;
        }
      };
      this.Zoom = function() {
        return this.amap_Map.getZoom();
      };
      this.SetZoom = function(level) {
        return this.amap_Map.setZoom(level);
      };
      this.Center = function() {
        var point = this.amap_Map.getCenter();
        var ret = {
          lng: point.getLng(),
          lat: point.getLat()
        };
        return ret;
      };
      this.SetCenter = function(point) {
        var point = new AMap.LngLat(point.lng, point.lat);
        this.amap_Map.setCenter(point);
      };
      this.Clear = function() {
        this.amap_Map.clearMap();
      };
      this.Satellite = function() {
        if (this.Satellite_Visible) {
          this.amap_Map.setLayers([new AMap.TileLayer()]);
          this.Satellite_Visible = false;
        } else {
          this.amap_Map.setLayers([new AMap.TileLayer.Satellite()]);
          this.Satellite_Visible = true;
        }
      };
    }
  };
  AMapMap.fn.init.prototype = AMapMap.fn;
  return AMapMap;
})();
