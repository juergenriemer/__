// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.event.min.js
// @js_externs var __; __.Event; __.Event.listen; __.Event.trigger;
// ==/ClosureCompiler==


/**
 * @namespace __
 */
if( typeof __ == "undefined" ) {
	__ = {};
}

/**
 * @namespace __.Event
 * @memberof __
 */

__.Event = {
	  oListeners : {}
	, sEvent : function( sEvent ) {
		var ls = [];
		sEvent.split( " " ).forEach( function( s, ix ) {
			if( s ) {
				ls.push( s.substr( 0, 1 ).toUpperCase() + s.substr( 1 ) );
			}
		} );
		return ( "on" + ls.join( "" ) );
	}
	, setScroll : function() {
		var that = this;
		__onScroll( function( aInfo ) {
			that.trigger( "scroll", aInfo );
		}, 50 );
	}
	/**
	 * Lets an object listen to one or many events. It needs to 
	 * provide a method with the camelcased name of the event
	 * preceded with "on" in order to receive events.
	 * @memberof __.Event
	 * @method listen
	 * @example o = {
	 *      init : function() {
	 *       __.Event.listen( this, "hashchange", "newsLoaded" );
	 *    }
	 *    , onHashchange : function( oPageInfo ) {
	 *       // handle event 
	 *    }
	 *    , onNewsLoaded : function( oNews ) {
	 *       // handle event
	 *    }
	 * };
	 * @example // __.Event.listen( this, "eventOne", "eventTwo" );
	 * @param {oListener} object that wants to listen
	 * @param {String} one or many names of events to listen to
	 */
	, listen : function() {
		var that = this;
		var larg = Array.prototype.slice.call( arguments );
		var oListener = larg.shift();
		larg.forEach( function( sEvent ) {
			if( sEvent == "scroll" ) {
				that.setScroll();
			}
			sEvent = that.sEvent( sEvent );
			if( ! that.oListeners[ sEvent ] ) {
				that.oListeners[ sEvent ] = [];
			}
			that.oListeners[ sEvent ].push( oListener );
		} );
	}
	/**
	 * Triggers an event with a message object
	 * @memberof __.Event
	 * @method trigger
	 * @example window.addEventListener( "hashchange", function() {
	 *    __.Event.trigger( "hashchange", self.location.hash );
	 * } );
	 * // invokes all methods: onEventOne
	 * @param {String} sEvent name of event
	 * @param {Dynamic} [xMessage] Additional information that is sent 
	 * along with the event, can be of any type
	 */
	, trigger : function( sEvent, oMessage ) {
		sEvent = this.sEvent( sEvent );
		var loListeners = this.oListeners[ sEvent ];
		if( loListeners ) {
			loListeners.forEach( function( oListener ) {
				if( typeof oListener[ sEvent ] == "function" ) {
					oListener[ sEvent ]( oMessage );
				}
				else {
					console.warn( "listener has no trigger receiver: " + sEvent );
				}
			} );
		}
	}
};

