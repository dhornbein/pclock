
// see http://www.andismith.com/blog/2011/10/self-executing-anonymous-revealing-module-pattern/

(function(pClock){

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
    //
  }

  pClock.PClock.prototype.constructor = pClock.PClock;

  pClock.PClock.prototype.setRenderer = function( renderer ){
    this.renderer = renderer;
    this.renderer.renderPhenophases( this.species );
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
      var sp = new pClock.Species( this.data[i], this, this.renderer );
      // put it into an object with the slug as keys.
      this.species[ slug ] = sp;
    }
  }

  pClock.PClock.prototype.initUI = function(){
    window.addWheelListener( document.body, this.onMouseWheel.bind( this ) );
  }

  pClock.PClock.prototype.onMouseWheel = function(event){
    // console.log( "onMouseWheel", event );
    this.zoomDelta =  event.wheelDelta*0.02;
    this.zoomLevel += this.zoomDelta;
    this.zoomLevel = Math.max( this.zoomLevel, 1 );
    console.log( this.zoomDelta, this.zoomLevel );
    this.renderer.setZoom( this.zoomLevel );
  }

})( window.pClock = window.pClock || {} );
