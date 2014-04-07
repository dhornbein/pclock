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
    this.phenophases = data.events;
    // Note: these are raphael elements, not dom elements...
    this.phenophaseElements = [];
  }

  pClock.Species.prototype.constructor = pClock.Species;

  pClock.Species.prototype.getData = function(){
    // we don't need this function yet, 
    // but it's good to have in case we want to send out some specific set of data,
    // or do anything to it on it's way out.
    return this.data;
  }

  pClock.Species.prototype.getPhenophases = function(){
    return this.phenophases;
  }

  //////////////////////
  // Event Handlers
  //////////////////////

  pClock.Species.prototype.registerPhenophaseElement = function( eventElement) {
    this.phenophaseElements.push(eventElement);
    this.assignSpeciesEventMouseOver( eventElement );
    this.assignSpeciesEventClick( eventElement );
  }
  
  pClock.Species.prototype.clear = function(){
    var limit = this.phenophaseElements.length;
    while( this.phenophaseElements.length > 0 ){
      var el = this.phenophaseElements.pop();
      // these are raphael elements, not dom elements...
      el.unmouseover();
      el.unclick();
      el.untouchend();
      el.remove()
      el = null;
    }
  }

  pClock.Species.prototype.assignSpeciesEventMouseOver =  function( el ) {
    var data = this.getData();
    // these are raphael elements, not dom elements...
    el.mouseover( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "mouseover", data.name, e );
    });
  }

  pClock.Species.prototype.assignSpeciesEventClick = function( el ) {
    var data = this.getData();
    // test to see if tocuh and click both get fired.
    // these are raphael elements, not dom elements...
    el.touchend( function(e){
      console.log( "touched", data.name, e );
    });
    el.click( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "clicked", data );
      // set this to a broadcast so we don't have to have knowledge about who to send the event to 
      // but just say "a phenophase was clicked and here's the data for it"
      // which makes me think we might want to introduce a pClock.Phenophase class 
      pClock.pClock.phenophaseClicked( data, el );
    });
  }
  
})( window.pClock = window.pClock || {} );
