__.SP.webpart = {
	/** 
	 */
	  settings : function( args ) { // path, ixWP, kv
		var async = __.async( args );
		var ctx = __.SP.ctx();
		var path = _spPageContextInfo.webServerRelativeUrl + args.path;
		var oFile = ctx.get_web().getFileByServerRelativeUrl( path );
		var oWPM = oFile.getLimitedWebPartManager( SP.WebParts.PersonalizationScope.shared );
		var loWP = oWPM.get_webParts();
		ctx.load( loWP );
		__.SP.exec( ctx, loWP, function( loWP ) {
			if( loWP.sError ) {
				async.reject( loWP.sError );
			}
			else {
				var oDef = null;
				oDef = loWP.get_item( args.ixWP || 0 );
				if( ! oDef ) {
					async.reject( { sError : "No webpart with index: " + args.ixWP } );
				}
				else {
					var oProp = oDef.get_webPart().get_properties();
					ctx.load( oProp );
					__.SP.exec( ctx, oProp, function( oProp ) {
						if( oProp.sError ) {
							async.reject( oProp.sError );
						}
						else {
							for( var k in args.kv ) {
								var v = args.kv[ k ];
								oProp.set_item( k, v );
							}
							oDef.saveWebPartChanges();
							ctx.load( oDef );
							__.SP.exec( ctx, oDef, function( o ) {
								if( o.sError ) {
									async.reject( o.sError );
								}
								else {
									//async.resolve( oProp.get_item( k ) );
									async.resolve();
								}
							} );
						}
					} );
				}
			}
		} );
	}
}
