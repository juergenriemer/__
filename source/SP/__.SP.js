__.debug = true;
__.SP = {
	  ctx : function( sSite ) {
		return ( sSite )
			? new SP.ClientContext( sSite )
			: new SP.ClientContext.get_current();
	}
	, exec : function( ctx, o, fn ) {
		var fnok = function() {
			if( fn ) {
				fn( o );
			}
		}
		var fnerr = function( sender, args ) {
			if( fn ) {
				fn( {
					  sError : args.get_message()
					, sInfo: args.get_stackTrace()
				} );
			}
		}
		ctx.executeQueryAsync(
			  Function.createDelegate( this, fnok )
			, Function.createDelegate( this, fnerr )
		);
	}
	, bGuid : function( x ) {
		return /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test( x );
	}
};

__.SP.folder = {
	/** 
	 * Create a folder in a list.
	 */
	  create : function( args ) { // sList, sFolder
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var path = "";
		var sFolder = args.sFolder;
		if( /\//.test( args.sFolder ) ) {
			var ls = args.sFolder.split( "/" );
			sFolder = ls.pop();
			path = _spPageContextInfo.webServerRelativeUrl;
			path += "/" + args.sList + "/" + ls.join( "/" );
		}
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = new SP.ListItemCreationInformation();
		oItem.set_underlyingObjectType( SP.FileSystemObjectType.folder );
		oItem.set_leafName( sFolder );
		oItem.set_folderUrl( path );
		var oItem = oList.addItem( oItem );
		// also add title for we might use folder in lookup
		oItem.set_item( "Title", sFolder );
		oItem.update();
		ctx.load( oItem );
		__.SP.exec( ctx, oItem, function( oFolder ) {
			if( oFolder.sError ) {
				async.reject( oFolder.sError );
			}
			else {
				var id = oFolder.get_id();
				async.resolve( { oFolder : oFolder, idFolder : id });
			}
		} );
	}
	, read : function( args ) { // path, lsFields
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oItem = ctx.get_web().getFolderByServerRelativeUrl( args.path );
		ctx.load( oItem, "ListItemAllFields" );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
//console.log( oItem.get_properties( "id" ) );
 oItem = oItem.get_listItemAllFields();
				var kv = {};
				args.lsFields.forEach( function( sField ) {
					var oField = oItem.get_item( sField );
					if( oField ) {
						if( oField.get_lookupId ) {
							kv[ sField ] = oField.get_lookupValue();
							kv[ "id" + sField ] = oField.get_lookupId();
						}
						else {
							kv[ sField ] = oField;
						}
					}
				} );
				async.resolve( { oItem : oItem, kv : kv } );
			}
		} );
	}
};


/* *** SITE COLUMN *** */

// var xml = '<Field Type="Choice" Name="FrontOffice" DisplayName="Front Office" ';
//	xml += ' Format="Dropdown" Group="Custom Columns">';
//	xml += '<CHOICES><CHOICE>OSG</CHOICE><CHOICE>OCEEA</CHOICE></CHOICES></Field>';
// __.SP.site.addColumn( { xml : xml );
__.SP.site = {};
__.SP.site.addColumn = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var oFields = ctx.get_web().get_fields();
	oFields.addFieldAsXml( args.xml );
	ctx.load( oFields );
	__.SP.exec( ctx, oFields, function( oFields ) {
		if( oFields.sError ) {
			async.reject( oFields );
		}
		else {
			async.resolve();
		}
	} );
};
// __.SP.site.readColumn({sColumn:"FrontOffice"})
__.SP.site.readColumn = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var oFields = ctx.get_web().get_fields();
	var oWeb = ctx.get_site().get_rootWeb();
	var oColumn = oWeb.get_availableFields().getByInternalNameOrTitle( args.sColumn );
	ctx.load( oColumn );
	__.SP.exec( ctx, oColumn, function( oColumn ) {
		if( oColumn.sError ) {
			async.reject( oColumn );
		}
		else {
			var ls = [];
			var xml = oColumn.get_schemaXml();
			xml.match( /<CHOICE>(.*?)<\/CHOICE>/g ).forEach( function( s ) {
				ls.push( s.match( /<CHOICE>(.*?)<\/CHOICE>/ )[ 1 ] ) ;
			} );
			async.resolve( {
				lsValues : ls
			} );
		}
	} );
};

__.SP.site.addCSS = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var ctx = SP.ClientContext.get_current()
	var oWeb = ctx.get_web();
	oWeb.set_alternateCssUrl( args.url );
	oWeb.update();
	__.SP.exec( ctx, oWeb, function( oWeb ) {
		if( oWeb.sError ) {
			async.reject( oWeb.sError );
		}
		else {
			async.resolve();
		}
	} );
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
		//.debug()
		.then( __.SP.list, "exists", { sList : sList } )
		.then( function( args ) {
			var async = __.Async.promise( args );
			var bCreate = true;
			if( args.bExists ) {
				if( args.bPurge ) {
					async.then( __.SP.list, "del" );
					async.pause( 10000 );
				}
				else {
					bCreate = true;
				}
			}
			if( bCreate ) {
				async.then( __.SP.list, "create", { sType : sType }, "create list " + sList )
				async.then( __.SP.list, "setColumns", { sList : sList, loFields, loFields}, "set columns in list " + sList )
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

