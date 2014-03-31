
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
    // this renders the clock face
    this.renderer.renderChrome( i );
  }


})( window.pClock = window.pClock || {} );
