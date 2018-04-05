/*
__.SP.webservice( {
	  sService : "midtier"
	, sEndPoint : "Log4NetExternal"
	, oPayload : oPayload
	, bIgnoreFailure : true
} );
*/
__.SP.webservice = {
	  call : function( args ) { // sService, sEndpoint, oPayload, aHeaders
		var async = __.async( args );
		var that = this;
		var sPayload = __.o.s( args.oPayload );
		var oAjax = window.XMLHttpRequest ?
			new XMLHttpRequest() :
			new ActiveXObject( 'Microsoft.XMLHTTP' );
		var url = O$C3.Urls.get( args.sService ) + args.sEndpoint + "?";
		oAjax.open( "POST", url, true );
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
				if( /Unexpected response from server. The status code of response is '0'/.test( oAjax.responseText ) ) {
					console.warn( "INFO: AJAX ABORTED" );
					async.stop();
				}
				else if( oAjax.status == 0 ) {
					fnerr( oAjax, "Could not connect to: " + ( args.sService.toUpperCase() ) );
				}
				else if( oAjax.status < 400  ) {
					async.resolve( { oAjax : oAjax } );
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
		oAjax.timeout = args.nTimeout || 20000;
		oAjax.send( sPayload );
	}
};

