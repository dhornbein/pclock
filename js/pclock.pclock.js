
// see http://www.andismith.com/blog/2011/10/self-executing-anonymous-revealing-module-pattern/

(function(pClock){

  // Class PClock
  pClock.PClock = function( display, data, options ) {
    // set up options
    this.options = pClock.util.merge( this.options, options ); 
    this.species = {}; // an object of species we're tracking on this clock
    this.setData( data ); // using a getter to set the data, in case we need to do more than just direct copy one day
    // we instantiate the renderer instance
    this.renderer = new pClock.Renderer( display, this.options.renderer );
    // build it out
    this.buildSpecies();
    // 
  }

  pClock.PClock.prototype.options = {
    // nothing here but allows us to pass options to render from pclock.js
    renderer: {}
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
      this.renderer.renderSpecies( sp, i );
    }
  }


})( window.pClock = window.pClock || {} );
