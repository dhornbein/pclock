(function(pClock){

  ///////////////
  // Renderer
  // takes care of displaying things
  //
  pClock.Renderer = function( el, options ) {
    this.options = pClock.util.merge( this.options, options );
    this.element = el; // this is what our Raphael instance will draw onto.
    // instantiate the Raphael instance.
    this.paper = new Raphael( this.element, this.options.w, this.options.h );
    // some tweaking
    this.defineCustomRaphaelAttributes();
    this.renderChrome();
  };

  pClock.Renderer.prototype.options = {
    defaultColor: "#ff0000",
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
    var ca = this.paper.customAttributes.arc = function (x, y, radius, startDate, endDate) {
      return {
        path: self.describeArc(x, y, radius, self.dateToDegree(startDate), self.dateToDegree(endDate))
      }
    };
    return ca;
  };

  pClock.Renderer.prototype.renderSpecies = function(sp, speciesIndex){
    var events, r, center, slug;
    // console.log( speciesIndex );
    events = sp.getEvents();
    r = this.options.r;
    center = this.options.center;
    slug = pClock.util.slugify(sp.name);    
    for( var speciesEvent in events ) {
      var eventElement = this.paper.path().attr({
        "stroke": "#" + sp.color,
        "stroke-width": this.options.strokeWidth
      }).attr({
        arc: [
          center.x,
          center.y,
          r * speciesIndex,
          events[speciesEvent].start,
          events[speciesEvent].end
        ]
      });
      eventElement.node.setAttribute("class", slug );
      sp.instantiateEventHandlers( eventElement );
    }
  };

  pClock.Renderer.prototype.renderChrome = function(){
    var r, center, chromeColor, chromeRadiusMod;
    r = this.options.r;
    center = this.options.center;
    chromeColor = this.options.chromeColor;
    chromeRadiusMod = this.options.chromeRadiusMod;
    // center
    this.paper.circle(center.x, center.y, 5).attr({fill: chromeColor, "stroke-width": 0});
    // container
    this.paper.circle(center.x, center.y, r * chromeRadiusMod ).attr({stroke: chromeColor, "stroke-width": 1});
    // clock
    this.paper.path().attr({stroke: chromeColor, "stroke-width": 10}).attr({arc: [this.options.center.x, this.options.center.y, r * chromeRadiusMod, "1/1/2014", Date()]});
    var months = [];
    var i = 1;
    // months
    while (i < 13){
      // console.log( center.x );
      months[i] = this.paper.path()
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
    var currentDate = new Date(date);
    var janFirst = new Date( currentDate.getFullYear(),0,1);
    var dayOfYear = Math.ceil( ( currentDate - janFirst ) / 86400000 );
    var ratio = dayOfYear / 365; // do we really need to worry about leap years? - yes!
    return ratio * 360;
  };

  pClock.Renderer.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  };

})( window.pClock = window.pClock || {} );