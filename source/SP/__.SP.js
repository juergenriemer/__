// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.sp.1.0.0.min.js
// @js_externs var __; __.SP; __.SP.ctx
// ==/ClosureCompiler==

/**
 * @version 1.0.0
 * @namespace __
 */
if( typeof __ == "undefined" ) {
	__ = {};
}

/**
 * @namespace __.SP
 * @memberof __
 */


__.SP = {
	/**
	 * Gets a SharePoint context of the current site or a site you
	 * indicate via absolute Url
	 * @memberof __.SP
	 * @method ctx
	 * @example var ctx = __.SP.ctx();
	 * @example var ctx = __.SP.ctx( "https://jarvis.osce.org/sites/sec_ict" );
	 * @param {String} [sSite] Absolute Url of the SharePoint site
	 * @returns {Object} SharePoint site context
	 */
	  ctx : function( args ) {
		return ( args && args.sSite )
			? new SP.ClientContext( args.sSite )
			: new SP.ClientContext.get_current();
	}
	/**
	 * Executes an asynchronous call against the server.
	 * <br />
	 * It expects a SharePoint object to be loaded. Optionally you can indicate
	 * a callback function that will be invoked by the returned object or 
	 * an error message and stack in case of failure.
	 * @memberof __.SP
	 * @method exec
	 * @example __.SP.exec( ctx, oItem, function( oItem ) {
	 * 	if( oItem.sError ) {
	 * 		// error case
	 *		// oItem.sError holds the error message
	 * 		// oItem.sInfo holds the error stack
	 *	}
	 * 	else {
	 * 		// success case
	 * 	}
	 * } );
	 * @param {Object} ctx SharePoint site context
	 * @param {Object} oLoad Loaded object to be sent to server
	 * @param {Function} cb Callback function that handles success and error
	 */
	, exec : function( ctx, oLoad, cb ) {
		var cbok = function() {
			if( cb ) {
				cb( oLoad );
			}
		}
		var cberr = function( sender, args ) {
			if( cb ) {
				cb( {
					  sError : args.get_message()
					, sInfo: args.get_stackTrace()
				} );
			}
		}
		ctx.executeQueryAsync(
			  Function.createDelegate( this, cbok )
			, Function.createDelegate( this, cberr )
		);
	}
	/**
	 * Checks if a value is of form of a GUID
	 * @memberof __.SP
	 * @method bGuid 
	 * @example __.SP.bGuid( "12345678-asdf-zxcv-qwwe-1234567890ab" ) // true
	 * @example __.SP.bGuid( "567890ab" ) // false
	 * @example __.SP.bGuid( 321 ) // false
	 * @param {String} guid value of a guid
	 * @returns {Boolean} true or false
	 */
	, bGuid : function( x ) {
		return /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test( x );
	}
};

__.SP.deploy = {
	  list : function( args ) {
		var sList = args.oDeploy.sList;
		var sType = args.oDeploy.sType;
		var aSettings = args.oDeploy.aSettings || {};
		var loFields = args.oDeploy.loFields;
		var lsFields = [];
		loFields.forEach( function( oField ) {
			lsFields.push( oField.sName );
		} );
		var async = __.Async.promise( args )
		async
		.debug()
		.then( __.SP.list, "exists", { sList : sList } )
		.then( function( args ) {
			var async = __.Async.promise( args );
			var bCreate = true;
			if( args.bExists ) {
				if( args.bPurge ) {
					async.then( __.SP.list, "del" );
				}
				else {
					bCreate = false;
				}
			}
			if( bCreate ) {
				async.then( __.SP.list, "create", { sType : sType }, "create list " + sList )
				async.then( __.SP.list, "setColumns", { sList : sList, loFields : loFields}, "set columns in list " + sList )
				async.then( __.SP.list, "addFields", { sList : sList, loFields : loFields }, "add fields to list " + sList )
				async.then( __.SP.list, "setLookups", {}, "setup lookups in list " + sList )
			}
			async.resolve();
		} )
		.then( __.SP.list, "settings", { kvFeatures : aSettings }, "apply settings to list " + sList )
		.then( function( args ) {
			var async = __.Async.promise( args );
			for( var sFile in args.oDeploy.jsLinks ) {
				var jsLink = args.oDeploy.jsLinks[ sFile ];
				if( ! /\.aspx/.test( sFile ) ) {
					async.then( __.SP.list.field, "setJsLink", {
						  sList : sList
						, sField : "jsLink"
						, urlJsLink : jsLink
					}, "set jslink on field" )
				}
			}
			async.resolve();
		}, "set js links on views" )
		.then( function( args ) {
			var async = __.Async.promise( args );
			for( var sView in args.oDeploy.aViews ) {
				var aView = args.oDeploy.aViews[ sView ];
				var bDefaultView = ( args.oDeploy.sDefaultView && sView == args.oDeploy.sDefaultView ) ? true : null;
				async.then( __.SP.view, "add", {
					  sList : sList
					, bDefaultView : bDefaultView
					, bPublic : true
					, sView : sView
					, lsFields : aView.lsFields
					, xmlQuery : aView.xmlQuery
				}, "create " + sView )
			}
			async.resolve();
		}, sList + " - create views" )
		.then( function( args ) {
			var async = __.Async.promise( args );
			for( var sFile in args.oDeploy.jsLinks ) {
				var jsLink = args.oDeploy.jsLinks[ sFile ];
				if( /\.aspx/.test( sFile ) ) {
					var path = ( sType == "documentLibrary" )
						? sList + "/Forms/" + sFile
						: "/Lists/" + sList + "/" + sFile;
					async.then( __.SP.webpart, "settings", {
						  path : path
						, kv : {
							JSLink : jsLink
						}
					}, "set jslink on view: " + sFile )
				}
			}
			async.resolve();
		}, sList + " - set js links in webpart" )
		async.then( __.SP.list.field, "reorder", { sList : sList, lsFields : lsFields }, sList + " - reorder fields" )
		.then( __.SP.list.field, "displays", { loFields : loFields }, sList + " - set field displays" )
		.then( function( args ) {
			__.Async.promise( args ).resolve();
		}, "finished deploying: " + sList )
		.resolve();
	}
}

__.SP.sprvPage = null;
__.SP.scurPage = null;

if( self == top ) {
	__.SP.scurPage = null;
	window.addEventListener( "hashchange", function() {
		var url = unescape( unescape( self.location.href ) );
		__.SP.sprvPage = __.SP.scurPage || "";
		__.SP.scurPage = url;
		// check if a list is loaded
		var ls = url.match( /\/Lists\/(.*?)\// );
		var sList = "";
		if( ls && ls.length ) {
			sList = ls[ 1 ];
		}
		var ls = url.match(  /#.*\/(.*?)\.aspx/ );
		// get the current page
		var sPage = "";
		if( ls && ls.length ) {
			sPage = ls[ 1 ];
		}
		__.Event.trigger( "hashchange", {
			  sList : sList
			, sPage : sPage
			, sprvPage : __.SP.sprvPage
			, scurPage : __.SP.scurPage
		} );

		// empty #Dossier on hashchange since MDS-SP unloads external CSS at this
		// event rendering the form (content of #Dossier) unreadable so we set
		// inline styles on #Dossier and empty content on hashchange
		/*
		var dn = __.dn_( "#dossier-title" );
		if( dn ) {
			__.dn.del( dn );
		}
		var dn = __.dn_( "#Dossier" );
		if( dn ) {
			dn.innerHTML = "";
		}
		*/
	} );
}

