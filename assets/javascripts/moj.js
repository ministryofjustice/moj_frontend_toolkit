/*jslint browser: true, evil: false, plusplus: true, white: true, indent: 2 */
/*global $ */

(function(){
  "use strict";

  var moj = {

    Modules: {},

    Utilities: {},

    Events: $({}),

    init: function(){
      var x;

      for( x in moj.Modules ) {
        if(moj.Modules.hasOwnProperty(x)){
          moj.Modules[x].init();
        }
      }
    },

    // safe logging
    log: function( msg ) {
      if( window && window.console ) {
        window.console.log( msg );
      }
    },
    dir: function( obj ) {
      if( window && window.console ) {
        window.console.dir( obj );
      }
    }
  };

  window.moj = moj;
}());
