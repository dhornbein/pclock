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
          chromeRadiusMod: 15
        }
        // instantiate
        pClock.renderer = new pClock.Renderer( document.getElementById('pClock'), rendererOptions );
        pClock.pClock = new pClock.PClock( pClock.data );

        Mousetrap.bind('command+option+s', function() {
          pClock.pClock.getSVG('paper');
        });
        Mousetrap.bind('up up down down left right left right b a enter', function() {
          window.alert('You have 99 lives');
        });
      }

      var dataSourceSelectionModalActuator = document.getElementById('data-modal-actuator'); 
      var dataSourceSelectionModalClose = document.getElementById('data-source-modal-close'); 
      dataSourceSelectionModalActuator.addEventListener('click', function(){ Avgrund.show('#data-source-selection-modal') } );
      dataSourceSelectionModalClose.addEventListener('click', function(){ Avgrund.hide() } );

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
