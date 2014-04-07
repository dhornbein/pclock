(function(pClock){

  ///////////////
  // Renderer
  // takes care of displaying things
  //
  pClock.Renderer = function( el, options ) {
    this.options = pClock.util.merge( this.options, options );
    var w = this.options.w;
    var h = this.options.h;
    this.element = el; // this is what our Raphael instance will draw onto.
    // instantiate the Raphael instance.
    this.chrome = new Raphael( this.element.querySelector("#chrome"), w, h );
    this.paper = new Raphael( this.element.querySelector("#paper"), w, h );
    // // some tweaking
    window.onResize = this.onResize();
    this.defineCustomRaphaelAttributes();
    this.renderChrome();
  };

  pClock.Renderer.prototype.options = {
    chromeColor: "#99a",
    strokeWidth: 10,
    chromeRadiusMod: 15,
    w: window.innerWidth,
    h: window.innerHeight,
    r: 15,
    center: {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    }
  };

  pClock.Renderer.prototype.constructor = pClock.Renderer;

  pClock.Renderer.prototype.defineCustomRaphaelAttributes = function(){
    var self = this;
    this.paper.customAttributes.arc = function (x, y, radius, startDate, endDate) {
      return {
        path: self.describeArc(x, y, radius, self.dateToDegree(startDate), self.dateToDegree(endDate))
      }
    };
    this.chrome.customAttributes.arc = function (x, y, radius, startDate, endDate) {
      return {
        path: self.describeArc(x, y, radius, self.dateToDegree(startDate), self.dateToDegree(endDate))
      }
    };
  };
  
  pClock.Renderer.prototype.renderPhenophases = function( speciesCollection, zoom ) {
    zoom = zoom*0.1 || 1;
    var start, center, i;
    this.dataSet = speciesCollection;
    start = new Date().getTime();
    center = this.options.center;
    i = 1;
    for( var species in speciesCollection ) {
      this.renderSpeciesPhenophases( speciesCollection[species], i, zoom );
      i++;
      console.log(i);
    }
  };

  pClock.Renderer.prototype.onResize = function(sp, speciesIndex, zoom ){
    this.chrome.clear();
    this.renderChrome();
  };

  pClock.Renderer.prototype.renderSpeciesPhenophases = function(sp, speciesIndex, zoom ){
    var phenophases, r, center, slug;
    // console.log( speciesIndex );
    phenophases = sp.getPhenophases();
    r = Math.max( this.options.r * ( zoom * 0.05 * speciesIndex ), 6 );
    center = this.options.center;
    slug = pClock.util.slugify(sp.name);    
    for( var phenophase in phenophases ) {
      var phenophaseElement = this.paper.path().attr({
        "stroke": "#" + sp.color,
        "stroke-linecap": "round",
        "stroke-width": Math.max( this.options.strokeWidth * ( zoom * 0.075 * speciesIndex ), 3 )
      }).attr({
        arc: [
          center.x,
          center.y,
          r * speciesIndex,
          phenophases[phenophase].start,
          phenophases[phenophase].end
        ]
      });
      phenophaseElement.node.setAttribute("class", slug );
      sp.instantiateEventHandlers( phenophaseElement );
    }
  };

  pClock.Renderer.prototype.renderChrome = function(){
    var r, center, chromeColor, chromeRadiusMod, currentDate, janFirst;
    currentDate = new Date();
    janFirst = new Date( currentDate.getFullYear(),0,1);
    r = this.options.r;
    center = this.options.center;
    chromeColor = this.options.chromeColor;
    chromeRadiusMod = this.options.chromeRadiusMod;
    // center
    this.chrome.circle(center.x, center.y, 5).attr({
      "fill": chromeColor, 
      "stroke-width": 0
    });
    // // container
    this.chrome.circle(center.x, center.y, r * chromeRadiusMod ).attr({
      "stroke": chromeColor,
      "stroke-width": 1
    });
    // clock
    this.chrome.path().attr({
      "stroke": "#fafafa",
      "stroke-linecap": "round",
      "stroke-width": 10
    }).attr({
      arc: [
        center.x,
        center.y,
        r * chromeRadiusMod, 
        janFirst,
        Date()
      ]
    });
    var months = [];
    var i = 1;
    // months
    while (i < 13){
      months[i] = this.chrome.path()
        .attr({
          "stroke": "#ccc",
          "stroke-width": 5
        })
        .attr({
          arc: [
            center.x,
            center.y,
            r * chromeRadiusMod,
            i + "/1/2014",
            i + "/2/2014"
        ]});
      months[i].node.setAttribute("class","month-" + i);
      i++;
    }
  };

  pClock.Renderer.prototype.describeArc = function( x, y, radius, startAngle, endAngle ){
    var start, end, arcSweep, d;
    start = this.polarToCartesian(x, y, radius, endAngle);
    end = this.polarToCartesian(x, y, radius, startAngle);
    arcSweep = ( endAngle - startAngle <= 180 ) ? "0" : "1";
    d = [
      ["M", start.x, start.y],
      ["A", radius, radius, 0, arcSweep, 0, end.x, end.y]
    ];
    return d;
  };

  pClock.Renderer.prototype.dateToDegree = function( date ) {
    var currentDate, currentYear, janFirst, dayOfYear, ratio;
    currentDate = new Date(date);
    currentYear = currentDate.getFullYear();
    janFirst = new Date( currentYear, 0, 1);
    dayOfYear = Math.ceil( ( currentDate - janFirst ) /  pClock.util.MILLISECONDS_IN_A_DAY );
    ratio = dayOfYear / pClock.util.daysInYear( currentYear );
    return ratio * 360;
  };

  pClock.Renderer.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  };

  pClock.Renderer.prototype.setZoom = function( scaleFactor ) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var scale = {
      x: w * scaleFactor,
      y: h * scaleFactor
    }
    this.paper.clear();
//    this.paper.setViewBox( (w-scale.x)*0.5, (h-scale.y)*0.5, scale.x, scale.y );
    this.renderPhenophases( this.dataSet, scaleFactor );
  }


})( window.pClock = window.pClock || {} );