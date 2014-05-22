(function(pClock, window ){

  ///////////////
  // Renderer
  // takes care of displaying things
  //
  pClock.Renderer = function( el, options ) {
    this.options = pClock.util.merge( this.options, options );
    this.element = el; // this is what our Raphael instance will draw onto.

    var currentDate = new Date();
    this.janFirst = new Date( currentDate.getFullYear(),0,1);

    // instantiate the Raphael instance.
    this.paper = new Raphael( "paper", "100%", "100%" );

    // // some tweaking
    window.onresize = this.onResize.bind(this);
    this.onResize();
    this.defineCustomRaphaelAttributes(this.paper);
    if( document.getElementById( "chrome" ) ){
      this.chrome = new Raphael( "chrome", "100%", "100%" );      
      this.defineCustomRaphaelAttributes(this.chrome);
      this.renderChrome();
    }
  }

  pClock.Renderer.prototype.getPaper = function() {
    return this.paper
  }

  pClock.Renderer.prototype.options = {
    chromeColor: "#99a",
    strokeWidth: 10,
    chromeRadiusMod: 15,
    r: 15
  }

  pClock.Renderer.prototype.getCenterPoint = function() {
    // this could change.
    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5
    }
  }

  pClock.Renderer.prototype.constructor = pClock.Renderer;

  pClock.Renderer.prototype.defineCustomRaphaelAttributes = function(raphaelElement){
    var self = this;
    raphaelElement.customAttributes.arc = function (x, y, radius, startDate, endDate) {
      return {
        path: self.describeArc(x, y, radius, self.dateToDegree(startDate), self.dateToDegree(endDate))
      }
    };
  }
  
  pClock.Renderer.prototype.setRenderQueue = function( renderQueue ) {
    this.renderQueue = renderQueue;
  }

  
  pClock.Renderer.prototype.getRenderQueue = function() {
    return this.renderQueue;
  }  

  pClock.Renderer.prototype.renderPhenophases = function( scaleFactor ) {
    // var s = new Date();
    this.scaleFactor = scaleFactor*0.1 || 1;
    var start = new Date().getTime(),
      i = 1,
      speciesCollection = this.getRenderQueue();
    for( var species in speciesCollection ) {
      this.renderSpeciesPhenophases( speciesCollection[species], i, this.scaleFactor );
      i++;
    }
    // var e = new Date();
    // console.log("render took", e-s, "ms");
  }

  pClock.Renderer.prototype.clearPaper = function(){
    for( var species in this.renderQueue ) {
      this.renderQueue[species].clear();
    }
    this.paper.clear();
  }

  pClock.Renderer.prototype.onResize = function(){
    var w = window.innerWidth, h = window.innerHeight;
    this.clearPaper();
    if( this.chrome ) {
      this.chrome.clear();
      this.renderChrome();      
    }
    this.renderPhenophases(this.scaleFactor);
  };

  pClock.Renderer.prototype.renderSpeciesPhenophases = function(sp, speciesIndex, zoom ){

    var phenophases = sp.getPhenophases(),
      r = Math.max( this.options.r * ( zoom * 0.05 * speciesIndex ), 6 ),
      center = this.getCenterPoint(),
      slug = pClock.util.slugify(sp.name);

    for( var phenophase in phenophases ) {
      var start = phenophases[phenophase].start,
        end = phenophases[phenophase].end;
      if( start && end ){
        var phenophaseElement = this.paper.path().attr({
          "stroke": "#" + sp.color,
          "stroke-width": Math.max( this.options.strokeWidth * ( zoom * 0.075 * speciesIndex ), 3 )
        }).attr({
          arc: [ center.x, center.y, r * speciesIndex, start, end ]
        });
        phenophaseElement.node.setAttribute("class", slug );
        sp.registerPhenophaseElement( phenophaseElement );        
      }
    }
  }

  pClock.Renderer.prototype.renderChrome = function(){
    var currentDate = new Date(),
      r = this.options.r,
      center = this.getCenterPoint(),
      chromeColor = this.options.chromeColor,
      chromeRadiusMod = this.options.chromeRadiusMod;
    // center
    this.chrome.circle(center.x, center.y, 3).attr({
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
      // "stroke-linecap": "round",
      "stroke-width": 10
    }).attr({
      arc: [
        center.x,
        center.y,
        r * chromeRadiusMod, 
        this.janFirst,
        currentDate
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
  }

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
  }

  pClock.Renderer.prototype.dateToDegree = function( date ) {
    var currentDate, currentYear, dayOfYear, ratio;
    currentDate = new Date(date);
    currentYear = currentDate.getFullYear();
    dayOfYear = Math.ceil( ( currentDate - this.janFirst ) /  pClock.util.MILLISECONDS_IN_A_DAY );
    ratio = dayOfYear / pClock.util.daysInYear( currentYear );
    return ratio * 360;
  }

  pClock.Renderer.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  pClock.Renderer.prototype.renderIndicatorRing = function( r, strokeWidth ) {
    var center = this.getCenterPoint();
    // this.paper.circle(center.x, center.y, r ).attr({
    //   "stroke": indicatorRingColor,
    //   "stroke-width": strokeWidth
    // });
  }

  pClock.Renderer.prototype.setZoom = function( scaleFactor ) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var scale = {
      x: w * scaleFactor,
      y: h * scaleFactor
    }
    this.clearPaper();
    this.renderPhenophases( scaleFactor );
  }


})( window.pClock = window.pClock || {}, window );