// see http://www.andismith.com/blog/2011/10/self-executing-anonymous-revealing-module-pattern/

(function(pClock, window ){

  // Class PClock
  pClock.PClock = function( data, options ) {
    // set up options
    this.options = pClock.util.merge( this.options, options );
    this.zoomLevel = 0;
    this.species = {}; // an object of species we're tracking on this clock
    this.setData( data ); // using a getter to set the data, in case we need to do more than just direct copy one day
    // we instantiate the renderer instance
    // build it out
    this.buildSpecies();
    this.initUI();
    this.setRenderer();
  }

  pClock.PClock.prototype.options = {
    initialZoom: 1.5
  }

  pClock.PClock.prototype.constructor = pClock.PClock;

  pClock.PClock.prototype.setRenderer = function( renderer ){
    this.renderer = renderer || pClock.renderer;
    this.renderer.setRenderQueue(this.species);
    this.renderer.renderPhenophases( this.options.initialZoom );
  }

  pClock.PClock.prototype.setData = function(data){
      this.data = data;
  }

  // Its a verifiable factory
  // http://www.joezimjs.com/javascript/javascript-design-patterns-factory/
  pClock.PClock.prototype.buildSpecies = function(){
    for ( var i=0; i < this.data.length; i++) {
      var slug = pClock.util.slugify( this.data[i].name );
      // create a species' instance.
      this.data[i]['slug'] = slug;
      var sp = new pClock.Species( this.data[i], this, this.renderer );
      // put it into an object with the slug as keys.
      this.species[ slug ] = sp;
    }
  }

  pClock.PClock.prototype.initUI = function(){
    window.addWheelListener( document.body, this.onMouseWheel.bind( this ) );
  }

  pClock.PClock.prototype.onMouseWheel = function(event){
    this.zoomDelta =  event.wheelDeltaY*0.02;
    this.zoomLevel += this.zoomDelta;
    this.zoomLevel = Math.max( this.zoomLevel, -3 );
    this.renderer.setZoom( this.zoomLevel );
  }

  pClock.PClock.prototype.phenophaseClicked = function( data, element ){
    console.log( data );
    // discuss format for this
    window.location.hash = data.slug;
  }

  pClock.PClock.prototype.getSVG = function(id) {
    var svg = document.getElementById(id).innerHTML;
    console.log( svg );
  }

})( window.pClock = window.pClock || {}, window );
