(function(pClock){
  // Instantiate things once the dom is ready
  document.addEventListener("DOMContentLoaded", function() {

    // This gets things started 
    pClock.initialize = function(){
      // only if we have the data... see below
      if( pClock.data ) {
        // ok then, stop running initapp... 
        clearInterval( pClock.dataLoadInterval );
        // lets create the pClock
        // demonstrate custom options
        var rendererOptions = {
          r: 20,
          chromeRadiusMod: pClock.data.length
        }
        var renderer = new pClock.Renderer( document.getElementById('pClock'), rendererOptions );
        var pclock = new pClock.PClock( pClock.data );
        pclock.setRenderer( renderer );
      }
    }

    // do we have the data?
    if( pClock.data ) {
      // then lets do this
      pClock.initialize();
    }else {
      // well lets run initApp every 200ms....
      pClock.dataLoadInterval = setInterval( pClock.initApp, 200 );
    }

  });

})(window.pClock = window.pClock || {} );




// see http://www.andismith.com/blog/2011/10/self-executing-anonymous-revealing-module-pattern/

(function(pClock){

  // Class PClock
  pClock.PClock = function( data, options ) {
    // set up options
    this.options = pClock.util.merge( this.options, options );
    this.species = {}; // an object of species we're tracking on this clock
    this.setData( data ); // using a getter to set the data, in case we need to do more than just direct copy one day
    // we instantiate the renderer instance
    // build it out
    this.buildSpecies();
    //
  }

  pClock.PClock.prototype.setRenderer = function( renderer ){
    this.renderer = renderer;
    this.renderAllSpecies();
  }

  pClock.PClock.prototype.renderAllSpecies = function(){
    for( var i=0; i < this.data.length; i++ ){
      // if this block gets more complex we break it out into renderSpecies
      var key = pClock.util.slugify(this.data[i].name);
      this.renderer.renderSpecies( this.species[key], i );
    }
  }

  pClock.PClock.prototype.constructor = pClock.PClock;

  pClock.PClock.prototype.setData = function(data){
      this.data = data;
  }

  // Its a verifiable factory
  // http://www.joezimjs.com/javascript/javascript-design-patterns-factory/
  pClock.PClock.prototype.buildSpecies = function(){
    for ( var i=0; i < this.data.length; i++) {
      var slug = pClock.util.slugify( this.data[i].name );
      // create a species' instance.
      var sp = new pClock.Species( this.data[i], this, this.renderer );
      // put it into an object with the slug as keys.
      this.species[ slug ] = sp;
      // tell the renderer to render it
      // we could refactor to have a renderAll Species and render them all at once
      // after we've logged them all... that would probably be better
    }
  }


})( window.pClock = window.pClock || {} );

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
(function(pClock){

  ////////////////////////////
  // Species
  //
  pClock.Species = function ( data, marshal ) {
    this.marshal = marshal;
    this.data = data;
    this.id = data.id;
    this.categories = data.categories;
    this.name = data.name;
    this.commonName = data.commonName;
    this.description = data.description;
    this.color = data.color;
    this.events = data.events;
  }

  pClock.Species.prototype.constructor = pClock.Species;

  pClock.Species.prototype.getData = function(){
    return {
      name: this.name,
      commonName: this.commonName,
      description: this.description,
      color: this.color
    }
  }

  pClock.Species.prototype.getEvents = function(){
    return this.events;
  }

  //////////////////////
  // Event Handlers
  //////////////////////

  pClock.Species.prototype.instantiateEventHandlers = function( eventElement) {
    this.assignSpeciesEventMouseOver( eventElement );
    this.assignSpeciesEventClick( eventElement );
  };
  
  pClock.Species.prototype.assignSpeciesEventMouseOver =  function( eventElement ) {
    var data = this.getData();
    eventElement.mouseover( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "mouseover", data.name, e );
    });
  };

  pClock.Species.prototype.assignSpeciesEventClick = function( eventElement ) {
    var data = this.getData();
    eventElement.click( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "clicked", data.name, e );
    });
  };
})( window.pClock = window.pClock || {} );
(function(pClock){

  pClock.util = {
    // copies keys from one object to another and overrites existing keys
    // a shallow copy
    merge: function( destObj, sourceObj ){
      for( var key in sourceObj ) {
        destObj[key] = sourceObj[key];
      }
      return destObj;
    },
    // creates a slug out of any string
    slugify: function( aString ){
      var string = aString;
      string = string.toLowerCase();
      string = string.replace(/[^a-z0-9]+/g, '-');
      string = string.replace(/^-|-$/g, '');
      return string;
    }
  };

})( window.pClock = window.pClock || {} );
// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
        console[method] = noop;
    }
  }
}());


