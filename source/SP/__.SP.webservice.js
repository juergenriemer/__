// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.webservice; __.SP.webservice.call;
// ==/ClosureCompiler==


/**
 * @namespace __.SP.webservice
 * @memberof __.SP
 */

__.SP.webservice = {
	/**
	 * Calls a webservice and handles results
	 * @memberof __.SP.webservice
	 * @method call
	 * @example // standalone
	 * __.SP.webservice.call( {
	 * 	  sService : "midtier"
	 *	, sEndpoint : "MySiteReadList"
	 * 	, oPayload : {
	 *		sList : "MyBookmarks" 		
	 *	}
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sService name of the webservice which is looked up in the O$C3.Url mapping object.
	 * @param {String} args.sEndpoint name of the endpoint
	 * @param {String} [args.sMethod] HTTP method (default is "POST")
	 * @param {Object} [args.oPayload] Object holding parameters as key value pairs 
	 * @param {Object} [args.aHeaders] Object holding custom HTTP headers as key value pairs 
	 * @param {Number} [args.msTimeout] Timeout in millisecons (default is 20 seconds)
	 * @param {Boolean} [args.bIgnoreFailure] Flag to indicate we are not interested in error handling.
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre class='return-object'>
	 * (resolved) oResponse | (Object) | XMLHTTP response object 
	 * (rejected) sError | (String) | error message
	 * (rejected) [sInfo] | (String) | additional information
	 * </pre>
	 */
	  call : function( args ) {
		var async = __.Async.promise( args );
		var that = this;
		var sPayload = __.o.s( args.oPayload );
		var sMethod = args.sMethod || "POST";
		var oAjax = window.XMLHttpRequest ?
			new XMLHttpRequest() :
			new ActiveXObject( 'Microsoft.XMLHTTP' );
		var url = O$C3.Urls.get( args.sService ) + args.sEndpoint + "?";
		oAjax.open( sMethod, url, true );
		oAjax.withCredentials = true;
		oAjax.onreadystatechange = function() {
			var fnerr = function( oAjax, sError ) {
				var sInfo = escape( oAjax.response );
				var sError = "Error reported: " + ( oAjax.statusText );
				var oResponse = __.s.o( oAjax.response );
				if( oResponse && oResponse.Message ) {
					sError = oResponse.Message;
				}
				if( args.bIgnoreFailure ) {
					async.stop();
				}
				else {
					async.reject( sError, sInfo );
				}
			};
			if( oAjax.readyState === 4 ) {
				// the error below is triggered by SharePoint in 				// case an internal Ajax request is cancelled,
				// e.g. by navigating away from a page before
				// a result was delivered. We can savely ignore.
				if( /Unexpected response from server. The status code of response is '0'/.test( oAjax.responseText ) ) {
					console.warn( "INFO: AJAX ABORTED" );
					async.stop();
				}
				else if( oAjax.status == 0 ) {
					fnerr( oAjax, "Could not connect to: " + ( args.sService.toUpperCase() ) );
				}
				else if( oAjax.status < 400  ) {
					async.resolve( { oResponse : oAjax } );
				}
				else if( oAjax.status == 401  ) {
					fnerr( oAjax, "Access denied to: " + ( args.sService.toUpperCase() ) );
				}
				else {
					fnerr( oAjax );
				}
			}
		}
		oAjax.setRequestHeader( "Accept", "application/json" );
		oAjax.setRequestHeader( "Content-Type", "application/json; charset=UTF-8;" );
		oAjax.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
		// apply custom headers
		if( args.aHeaders ) {
			for( var k in args.aHeaders ) {
				var v = this.aHeaders[ k ];
				oAjax.setRequestHeader( k, v );
			}
		}
		oAjax.timeout = args.msTimeout || 20000;
		oAjax.send( sPayload );
	}
};

