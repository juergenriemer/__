// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.webpart; __.SP.webpart.settings; 
// ==/ClosureCompiler==


/**
 * @namespace __.SP.webpart
 * @memberof __.SP
 */
__.SP.webpart = {
	/**
	 * Updates settings of a webpart.
	 * @memberof __.SP.webpart
	 * @method settings
	 * @todo complete example
	 * @todo provide list of properties available
	 * @example
	 * __.SP.item.create( {
	 * 	  path : "path to aspx page?"
	 *	, ixWP : 2
	 *	, kv : {
	 * 		JSLink? : "path/to/jslink"
	 * 	}
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.path path to aspx page holding the webpart
	 * @param {Number} [args.ixWP] index of webpart if page has multiple (default is: 0)
	 * @param {String} [args.kv] key/value pairs of properties to update
	 */
	  settings : function( args ) { // path, ixWP, kv
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var path = ( /^http/.test( args.path ) )
			? args.path
			: _spPageContextInfo.webServerRelativeUrl + args.path;
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
