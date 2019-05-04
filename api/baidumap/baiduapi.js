var BaiduMap = (function() {
  var BaiduMap = function() {
    return new BaiduMap.fn.init();
  };
  BaiduMap.fn = BaiduMap.prototype = {
    constructor: BaiduMap,
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
      this.Baidu_option = undefined;
      this.Baidu_Map = undefined;
      this.trafficLayer = undefined;
      this.trafficLayer_Visible = false;
      this.Satellite_Visible = false;
      this.Creat = function(initjson, callbackname) {
        this.Baidu_option = initjson;
        if (document.getElementById(this.amap_option.mapid) == undefined) {
          var mapdiv = document.createElement("div");
          mapdiv.id = this.Baidu_option.mapid;
          mapdiv.class = "mapdiv";
          document.body.appendChild(mapdiv);
        } 
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "http://api.map.baidu.com/api?v=2.0&ak=" +
          this.Baidu_option.key +
          "&callback=" +
          callbackname;
        document.head.appendChild(script);
        var linkcss = document.createElement("link");
        linkcss.rel = "stylesheet";
        linkcss.type = "text/css";
        linkcss.href = "api/baidumap/baidu.css";
        document.head.appendChild(linkcss);
      };
      this.Load = function() {
        this.Baidu_Map = new BMap.Map(this.Baidu_option.mapid);
        var mapinit = this.onMapLoad;
        var mapzoomed = this.onMapZoomed;
        var mapmove = this.onMapMoved;
        var maps = this.Baidu_Map;
        var zooms = this.Baidu_option.point.zoom;
        this.Baidu_Map.addEventListener("load", function(e) {
          if (mapinit != undefined) mapinit(maps);
        });
        if (this.Baidu_option.point.gps) {
          var myCity = new BMap.LocalCity();
          myCity.get(function(result) {
            maps.centerAndZoom(result.name, zooms);
          });
        } else if (this.Baidu_option.point.city == undefined) {
          var point = new BMap.Point(
            this.Baidu_option.point.lng,
            this.Baidu_option.point.lat
          );
          this.Baidu_Map.centerAndZoom(point, this.Baidu_option.point.zoom);
        } else {
          this.Baidu_Map.centerAndZoom(
            this.Baidu_option.point.city,
            this.Baidu_option.point.zoom
          );
        }
        var mapcss = "mapdiv";
        if (this.Baidu_option.mapcss != undefined) {
          mapcss = this.Baidu_option.mapcss;
        }
        if (
          document
            .getElementById(this.Baidu_option.mapid)
            .className.indexOf(mapcss) == -1
        ) {
          document
            .getElementById(this.Baidu_option.mapid)
            .classList.add(mapcss);
        }
        if(this.Baidu_option.style!=undefined )
        {
            if(this.Baidu_option.style.name!=undefined && this.Baidu_option.style.name.length>0 )
            {this.Baidu_Map.setMapStyle({ style: this.Baidu_option.style.name });}
            else
            {this.Baidu_Map.setMapStyle({ styleJson: this.Baidu_option.style.json });}
        }
        this.trafficLayer = new BMap.TrafficLayer();
        this.trafficLayer_Visible = false;
        if (mapzoomed == undefined) {
          this.Baidu_Map.disableScrollWheelZoom();
          this.Baidu_Map.disablePinchToZoom();
        } else {
          this.Baidu_Map.enableScrollWheelZoom();
          this.Baidu_Map.enablePinchToZoom();
          this.Baidu_Map.addEventListener("zoomend", function(e) {
            mapzoomed();
          });
        }
        if (mapmove == undefined) {
          this.Baidu_Map.disableDragging();
        } else {
          this.Baidu_Map.enableDragging();
          this.Baidu_Map.addEventListener("moveend", function(e) {
            mapmove();
          });
        }
      };
      this.IsInit = function() {
        return this.Baidu_Map != undefined;
      };
      this.Style = function(obj) {
        if (typeof obj == "string") {
          this.Baidu_Map.setMapStyle({ style: obj });
        } else {
          this.Baidu_Map.setMapStyle({ styleJson: obj });
        }
      };
      this.Traffic = function() {
        if (this.trafficLayer_Visible) {
          this.Baidu_Map.removeTileLayer(this.trafficLayer);
          this.trafficLayer_Visible = false;
        } else {
          this.trafficLayer = new BMap.TrafficLayer();
          this.Baidu_Map.addTileLayer(this.trafficLayer);
          this.trafficLayer_Visible = true;
        }
      };
      this.Zoom = function() {
        return this.Baidu_Map.getZoom();
      };
      this.SetZoom = function(level) {
        return this.Baidu_Map.setZoom(level);
      };
      this.Center = function() {
        var point = this.Baidu_Map.getCenter();
        var ret = {
          lng: point.lng,
          lat: point.lat
        };
        return ret;
      };
      this.SetCenter = function(point) {
        var point = new BMap.Point(point.lng, point.lat);
        this.Baidu_Map.setCenter(point);
      };
      this.Clear = function() {
        this.Baidu_Map.clearOverlays();
      };
      this.Satellite = function() {
        if (this.Satellite_Visible) {
          this.Baidu_Map.setMapType(BMAP_NORMAL_MAP);
          this.Satellite_Visible = false;
        } else {
          this.Baidu_Map.setMapType(BMAP_SATELLITE_MAP);
          this.Satellite_Visible = true;
        }
      };
      this.Div = function(Setting) {
        if (Setting.position == undefined)
          Setting.position = new BMap.Size(0, 0);
        else
          Setting.position = new BMap.Size(Setting.position.x, div.position.y);
        this._Div(Setting);
      };
      this.DivOverlay = function(Point, Setting) {
        var point = new BMap.Point(Point.lng, Point.lat);
        this._DivOverlay(point, Setting);
      };
      this.Line = function(Point) {
        var points = [];
        $.each(Point, function() {
          points.push(new BMap.Point(this.lng, this.lat));
        });
        this._Line(points, this.initdat.Line_Style);
      };
      this.Linec = function(Point, Style) {
        var stypls = {
          enableEditing:
            Style.enableEditing || this.initdat.Line_Style.enableEditing,
          enableClicking:
            Style.enableClicking || this.initdat.Line_Style.enableClicking,
          icons: Style.icons || this.initdat.Line_Style.icons,
          strokeWeight:
            Style.strokeWeight || this.initdat.Line_Style.strokeWeight,
          strokeOpacity:
            Style.strokeOpacity || this.initdat.Line_Style.strokeOpacity,
          strokeColor: Style.strokeColor || this.initdat.Line_Style.strokeColor
        };
        var points = [];
        $.each(Point, function() {
          points.push(new BMap.Point(this.lng, this.lat));
        });
        this._Line(points, stypls);
      };
      this.Label = function(Message, Point) {
        var opts = {
          position: new BMap.Point(Point.lng, Point.lat), // 指定文本标注所在的地理位置
          offset: new BMap.Size(
            this.initdat.Tips_offset.x,
            this.initdat.Tips_offset.y
          ) //设置文本偏移量
        };
        this._Label(Message, opts, this.initdat.Tips_Style);
      };
      this.Labelc = function(Message, Point, Style) {
        var stypls = {
          color: Style.color || this.initdat.Tips_Style.color,
          fontSize: Style.fontSize || this.initdat.Tips_Style.fontSize,
          height: Style.height || this.initdat.Tips_Style.height,
          lineHeight: Style.lineHeight || this.initdat.Tips_Style.lineHeight,
          fontFamily: Style.fontFamily || this.initdat.Tips_Style.fontFamily
        };
        var opts = {
          position: new BMap.Point(Point.lng, Point.lat), // 指定文本标注所在的地理位置
          offset: new BMap.Size(
            this.initdat.Tips_offset.x,
            this.initdat.Tips_offset.y
          ) //设置文本偏移量
        };
        this._Label(Message, opts, stypls);
      };
      this.Icon = function() {
        return this._Icon(this.initdat.Icon);
      };
      this.Iconc = function(Symbol) {
        return this._Icon(Symbol);
      };
    },
    _Icon: function(Symbol) {
      var sy = new BMap.Symbol(Symbol.Symbol, Symbol.pic);
      return new BMap.IconSequence(sy, Symbol.H, Symbol.W);
    },
    _Line: function(Point, Style) {
      var polyline = new BMap.Polyline(Point, Style);
      this.Baidu_Map.addOverlay(polyline);
    },
    _Label: function(Message, opts, Style) {
      var label = new BMap.Label(Message, opts); // 创建文本标注对象
      label.setStyle(Style);
      this.Baidu_Map.addOverlay(label);
    },
    _Div: function(Setting) {
      function DivControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = Setting.position;
      }
      DivControl.prototype = new BMap.Control();
      DivControl.prototype.initialize = function(map) {
        var div = document.createElement("div");
        div.id = Setting.id;
        if (Setting.InnerHtml != undefined) div.innerHTML = Setting.InnerHtml;
        else if (Setting.InnerText != undefined)
          div.appendChild(document.createTextNode(Setting.InnerText));
        if (Setting.style != undefined) div.style = Setting.style;
        if (Setting.class != undefined) div.class = Setting.class;
        map.getContainer().appendChild(div);
        return div;
      };
      var myZoomCtrl = new DivControl();
      this.Baidu_Map.addControl(myZoomCtrl);
    },
    _DivOverlay: function(Point, Setting) {
      function ComplexDivOverlay(Point) {
        this._point = Point;
        this._callback = undefined;
      }
      ComplexDivOverlay.prototype = new BMap.Overlay();
      ComplexDivOverlay.prototype.initialize = function(map) {
        this._map = map;
        var div = (this._div = document.createElement("div"));
        div.id = Setting.id;
        if (Setting.InnerHtml != undefined) div.innerHTML = Setting.InnerHtml;
        else if (Setting.InnerText != undefined)
          div.appendChild(document.createTextNode(Setting.InnerText));
        if (Setting.style != undefined) div.style = Setting.style;
        if (Setting.class != undefined) div.class = Setting.class;
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        map.getPanes().labelPane.appendChild(div);
        return div;
      };
      ComplexDivOverlay.prototype.draw = function() {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x + "px";
        this._div.style.top = pixel.y + "px";
        if (Setting.load != undefined) {
          if (this._callback == undefined) {
            this._callback = Setting.load;
            this._callback();
          }
        }
      };
      var myCompOverlay = new ComplexDivOverlay(Point);
      this.Baidu_Map.addOverlay(myCompOverlay);
    }
  };
  BaiduMap.fn.init.prototype = BaiduMap.fn;
  return BaiduMap;
})();
