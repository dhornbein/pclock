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
      string.toLowerCase();
      string.replace(/[^a-z0-9]+/g, '-');
      string.replace(/^-|-$/g, '');
      return string;
    }
  };

})( window.pClock = window.pClock || {} );