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
  };

  pClock.Renderer.prototype.options = {
    defaultColor: "#ff0000",
    strokeWidth: 10,
    w: window.screen.availWidth,
    h: window.screen.availHeight,
    r: 20,
    center: {
      x: window.screen.availWidth * 0.5,
      y: window.screen.availHeight * 0.45,
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
    var events = sp.getEvents();
    var r = this.options.r;
    for( var speciesEvent in events ) {
      var eventElement = this.paper.path().attr({
        "stroke": "#" + sp.color,
        "stroke-width": this.options.strokeWidth
      }).attr({
        arc: [
          this.options.center.x,
          this.options.center.y,
            r * speciesIndex,
          events[speciesEvent].start,
          events[speciesEvent].end
        ]
      });
      /*
        @todo refactor assigning of event handlers, for next session...
        Should the renderer be handling the event handlers?
        Should the instances of Species themselves?
        Probably.
        Renderer should be returning the eventElement (which is an svg obj)
        and then pClock itself should be doing something like... 
        sp.registerEventObj(eventElement) in the buildSpecies loop passing the reference
        of the Specie itself, which then handles the event handler assignment
      */
      this.assignSpeciesEventEventHandlers( sp.getData(), eventElement );
    }
  };

  pClock.Renderer.prototype.assignSpeciesEventEventHandlers = function( data, eventElement) {
    this.assignSpeciesEventMouseOver( data, eventElement );
    this.assignSpeciesEventClick( data, eventElement );
  };
  
  pClock.Renderer.prototype.assignSpeciesEventMouseOver =  function( data, eventElement ) {
    eventElement.mouseover( function( e ){
      // e.clientX and e.clientY are the mouse coords
      // ahem... 
      console.log( "mouseover", data.name, e );
    });
  };

  pClock.Renderer.prototype.assignSpeciesEventClick = function( data, eventElement ) {
    eventElement.click( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "clicked", data.name, e );
    });
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