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
    return {
      name: this.name,
      commonName: this.commonName,
      description: this.description,
      color: this.color
    }
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

  pClock.Species.prototype.assignSpeciesEventMouseOver =  function( eventElement ) {
    var data = this.getData();
    // these are raphael elements, not dom elements...
    eventElement.mouseover( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "mouseover", data.name, e );
    });
  }

  pClock.Species.prototype.assignSpeciesEventClick = function( eventElement ) {
    var data = this.getData();
    // test to see if tocuh and click both get fired.
    // these are raphael elements, not dom elements...
    eventElement.touchend( function(e){
      console.log( "touched", data.name, e );
    });
    eventElement.click( function( e ){
      // e.clientX and e.clientY are the mouse coords
      console.log( "clicked", data.name, e );
    });
  }
  
})( window.pClock = window.pClock || {} );
