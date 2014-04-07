(function(pClock){
  // Instantiate things once the dom is ready
  document.addEventListener("DOMContentLoaded", function() {
    // constants
    // This gets things started 
    pClock.initialize = function(){
      // only if we have the data... see below
      if( pClock.data ) {
        // ok then, stop running initapp... 
        clearInterval( pClock.dataLoadInterval );
        // lets create the pClock
        // demonstrate custom options
        var rendererOptions = {
          r: 20,
          chromeRadiusMod: pClock.data.length
        }
        var renderer = new pClock.Renderer( document.getElementById('pClock'), rendererOptions );
        var pclock = new pClock.PClock( pClock.data );
        pclock.setRenderer( renderer );
      }
    }
    // do we have the data?
    if( pClock.data ) {
      // then lets do this
      pClock.initialize();
    }else {
      // well lets run initApp every 200ms....
      pClock.dataLoadInterval = setInterval( pClock.initApp, 200 );
    }
  });
})(window.pClock = window.pClock || {} );
