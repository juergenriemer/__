__.Common = {};
__.Common.Urls = {
	aaurl : {
		  prod : {
			rso : 'https://rso.osce.org/',
			docin : 'https://docin.osce.org/',
			sharepoint : 'https://sharepoint.osce.org/',
			mySite : 'https://sp-selfservice.osce.org/',
			midtier : 'https://ws-sharepoint.osce.org/WebService.asmx/',
			sputils : 'https://sputils-ssom.osce.org/'
		}
		, test : {
			rso : 'https://test-rso.osce.org/',
			docin : 'https://test-docin.osce.org/',
			sharepoint : 'https://test-jarvis.osce.org/',
			mySite : 'https://test-sp-selfservice.osce.org/',
			midtier : 'https://test-ws-sharepoint.osce.org/WebService.asmx/',
			sputils : 'https://sputils-ssom-test.osce.org/'
			
		}
		, dev : {
			rso : 'https://dev-rso.osce.org/',
			docin : 'https://dev-docin.osce.org/',
			sharepoint : 'https://dev-sharepoint.osce.org/',
			mySite : 'https://dev-sp-selfservice.osce.org/',
			midtier : 'https://dev-ws-sharepoint.osce.org/WebService.asmx/',
			sputils : 'https://sputils-ssom-dev.osce.org/'
		}
	}
	, get : function( sDomain ) {
		var sEnv = "prod";
		if( /(^test-|-test\.)/.test( self.location.host ) ) {
			sEnv = "test";
		}
		else if( /(^dev-|-dev\.)/.test( self.location.host ) ) {
			sEnv = "dev";
		}
		var url = this.aaurl[ sEnv ][ sDomain ];
		return url;
	}
};
//
//
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
	 * 	, sEndpoint : "SPMySiteListRead"
	 * 	, oPayload : {
	 * 		  listName : "MyBookMarks"
	 * 		, fields : __.o.s( ["Title","Url","LinkType"] )
	 * 	}
	 * 	, cb : function( oResult ) {
	 * 		var msResponse = __.s.o( oResult.oResponse.responseText );
	 * 		console.log( __.s.o( msResponse.d ) );
	 * 	}
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
		var sPayload = args.oPayload.__toString();
		var sMethod = args.sMethod || "POST";
		var oAjax = window.XMLHttpRequest ?
			new XMLHttpRequest() :
			new ActiveXObject( 'Microsoft.XMLHTTP' );
		var url = __.Common.Urls.get( args.sService ) + args.sEndpoint + "?";
		oAjax.open( sMethod, url, true );
		oAjax.withCredentials = true;
		oAjax.onreadystatechange = function() {
			var fnerr = function( oAjax, sError ) {
				console.log( oAjax );
				var sError = "";
				try {
					var oResponse = oAjax.response.__toJson();
					if( oResponse && oResponse.Message ) {
						// check if we get back a JSON with "Message" (EDRMS case)
						sError = oResponse.Message;
						if( oResponse.ID ) {
							sError = "[CODE|" + oResponse.ID + "] " + sError;
						}
					}
					else {
						// then check if we get back any sort of XML/HTML response
						// in which case we try to parse the content
						sError = oAjax.response.replace( /^.*<body+?>/g, "" );
						sError = sError.replace( /<(.|\n)*?>/g, "" );
						sError = sError.trim().substring( 0, 300 );
					}
				} catch( e ) {}
				// if we did not come up with a suitable error message...
				if( ! sError ) {
					// .. we check if the statusText holds any information
					sError = ( oAjax.statusText )
						? "Error reported: " + ( oAjax.statusText )
						// .. as last resort we conclude the connection was aborted
						: "Network connection aborted.";
				}
				if( args.bIgnoreFailure ) {
					async.stop();
				}
				else {
					async.reject( sError );
				}
			};
			if( oAjax.readyState === 4 ) {
				if( oAjax.status == 0 ) {
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

