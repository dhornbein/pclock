(function(pClock){

  pClock.util = {
    MILLISECONDS_IN_A_DAY: 86400000,
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
    },
    daysInYear: function( year ) {
      // returns days in the current year (adjusts for leap year)
      if(pClock.util.isLeapYear()) {
          // Leap year
          return 366;
      } else {
          // Not a leap year
          return 365;
      }
    },
    isLeapYear: function( year ) {
      return new Date(year, 1, 29).getMonth() == 1;
    }
  };

})( window.pClock = window.pClock || {} );