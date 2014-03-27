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