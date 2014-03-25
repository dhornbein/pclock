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

})( window.pClock = window.pClock || {} );