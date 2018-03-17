// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.Event; __.Event.listen; __.Event.trigger;
// ==/ClosureCompiler==
// version 1.0
/**
 * @version 1.0
 * @namespace __.Event
 */

if( typeof __ == "undefined" ) {
	__ = {};
}

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
	/**
	 * Lets an object listen to one or many events. It needs to 
	 * provide a method with the camelcased name of the event
	 * preceded with "on" in order to receive events.
	 * @memberof __.Event
	 * @method listen
	 * @example __.Event.listen( this, "eventOne", "eventTwo" );
	 * @param {oListener} object that wants to listen
	 * @param {String} name of events to listen to (one or many)
	 */
	, listen : function() {
		var that = this;
		var larg = Array.prototype.slice.call( arguments );
		var oListener = larg.shift();
		larg.forEach( function( sEvent ) {
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
	 * @example __.Event.trigger( "eventOne" );
	 * // invokes all methods: onEventOne
	 * @param {String} name of event
	 * @param {Dynamic} Additional information about the event
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

