/**
 * @namespace __.SP.folder
 * @memberof __.SP
 */
__.SP.folder = {
	/**
	 * Creates a folder in a document library
	 * @memberof __.SP.folder
	 * @method create
	 * @example __.SP.folder.create( {
	 * 	  sList : "Shared Documents"
	 * 	, sFolder "test folder"
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name of the list
	 * @param {String} args.sFolder name of the folder
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre>
	 * oFolder  | (Object) | context of the newly created folder
	 * idFolder | (Number) | item ID of the newly created folder
	 * </pre>
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
	/**
	 * Reads information of a folder
	 * @memberof __.SP.folder
	 * @method read
	 * @example // stand alone
	 * __.SP.folder.read( {
	 * 	  path : "/Lists/Shared Documents/test folder"
	 * } );
	 * @example // as promise
	 * .then( __.SP.folder, "read", {
	 * 	  path : "/Lists/Shared Documents/test folder"
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} path path of the folder
	 * @param {Array} lsFields array of internal field names to return
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre class='return-object'>
	 * oFolder | (Object) | context of the newly created folder
	 * aResult  | (Object) | associate array holding properties of the folder
	 * </pre>
	 */
	, read : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oFolder = ctx.get_web().getFolderByServerRelativeUrl( args.path );
		ctx.load( oFolder, "ListItemAllFields" );
		__.SP.exec( ctx, oFolder, function( oFolder ) {
			if( oFolder.sError ) {
				async.reject( oFolder.sError );
			}
			else {
				oFolder = oFolder.get_listItemAllFields();
				var aResult = {};
				args.lsFields.forEach( function( sField ) {
					var oField = oFolder.get_item( sField );
					if( oField ) {
						if( oField.get_lookupId ) {
							aResult[ sField ] = oField.get_lookupValue();
							aResult[ "id" + sField ] = oField.get_lookupId();
						}
						else {
							aResult[ sField ] = oField;
						}
					}
				} );
				async.resolve( { oFolder : oFolder, aResult : aResult } );
			}
		} );
	}
};
__.SP.folder.content = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var path = _spPageContextInfo.webServerRelativeUrl + "" + unescape( args.path );
	var mpQuery = {
		  "folders" : 	"<View><Query><Where> \
				<Eq>\
					<FieldRef Name='FSObjType' />\
					<Value Type='Integer'>1</Value>\
				</Eq>\
				</Where> \
				<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy> \
				</Query></View>"
		, "files" : 	"<View><Query><Where> \
				<Neq>\
					<FieldRef Name='FSObjType' />\
					<Value Type='Integer'>1</Value>\
				</Neq>\
				</Where> \
				<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy> \
				</Query></View>"
	};
	var viewXml = "<View> \
		<Query><Where> \
			<Eq>\
				<FieldRef Name='FSObjType' />\
				<Value Type='Integer'>1</Value>\
			</Eq>\
			</Where> \
			<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy>\
		</Query></View>";
	var oQuery = new SP.CamlQuery;
	oQuery.set_folderServerRelativeUrl( path );
	if( args.xmlQuery ) {
		oQuery.set_viewXml( args.xmlQuery );
	}
	else if( args.sFilter ) {
		var xmlQuery = mpQuery[ args.sFilter ];
		if( xmlQuery ) {
			oQuery.set_viewXml( xmlQuery );
		}
	}
	var oList = __.SP.list.get( ctx, args.sList );
	var oItems = oList.getItems( oQuery );
	var lsFields = [ "ContentType", "FileLeafRef", "ServerUrl", "DisplayName", "ID", "FileSystemObjectType" ];
	if( args.lsFields ) {
		lsFields = lsFields.concat( args.lsFields );
	}
	var sInclude = "Include( " + lsFields.join( "," ) + " )";
	ctx.load( oItems, sInclude );
	__.SP.exec( ctx, oItems, function( oItems ) {
		if( oItems.sError ) {
			async.reject( oItems.sError );
		}
		else {
			var laItems = [];
			var loItems = oItems.getEnumerator();
			while( loItems.moveNext() ) {
				var oItem = loItems.get_current();
				var bFolder = oItem.get_fileSystemObjectType();
				var url = oItem.get_item( 'ServerUrl' );
				if( bFolder ) {
					url = _spPageContextInfo.webServerRelativeUrl;
					url += "/_layouts/15/start.aspx#/SiteAssets/Forms/AllItems.aspx?RootFolder=";
					url += oItem.get_item( 'ServerUrl' );
				}
				var aItem = {
					  sTitle : oItem.get_item( 'FileLeafRef' )
					, sContentType : oItem.get_contentType().get_name()
					, idContentType : oItem.get_contentType().get_id().get_stringValue()
					, sDisplayName : oItem.get_displayName()
					, url : url
					, id : oItem.get_item( 'ID' )
					, bFolder : bFolder
				}
				if( args.lsFields ) {
					args.lsFields.forEach( function( sField ) {
						aItem[ sField ] = oItem.get_item( sField );
					} );
				}
				laItems.push( aItem );
			}
			async.resolve( { laItems : laItems } );
		}
	} );
}
/*
__.SP.folder.content( {
	  path : "/SiteAssets/Osce/Osce.Conman/"
	, sList : "Site Assets"
	, lsFields : [ "Author", "Modified" ]
	, cb : function( a ) {
		//console.log( a );
	}
} );
*/
__.SP.folder.content = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var path = _spPageContextInfo.webServerRelativeUrl + "" + unescape( args.path );
	var mpQuery = {
		  "folders" : 	"<View><Query><Where> \
				<Eq>\
					<FieldRef Name='FSObjType' />\
					<Value Type='Integer'>1</Value>\
				</Eq>\
				</Where> \
				<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy> \
				</Query></View>"
		, "files" : 	"<View><Query><Where> \
				<Neq>\
					<FieldRef Name='FSObjType' />\
					<Value Type='Integer'>1</Value>\
				</Neq>\
				</Where> \
				<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy> \
				</Query></View>"
	};
	var viewXml = "<View> \
		<Query><Where> \
			<Eq>\
				<FieldRef Name='FSObjType' />\
				<Value Type='Integer'>1</Value>\
			</Eq>\
			</Where> \
			<OrderBy><FieldRef Name='FileLeafRef' Ascending='True' /></OrderBy>\
		</Query></View>";
	var oQuery = new SP.CamlQuery;
	oQuery.set_folderServerRelativeUrl( path );
	if( args.xmlQuery ) {
		oQuery.set_viewXml( args.xmlQuery );
	}
	else if( args.sFilter ) {
		var xmlQuery = mpQuery[ args.sFilter ];
		if( xmlQuery ) {
			oQuery.set_viewXml( xmlQuery );
		}
	}
	var oList = __.SP.list.get( ctx, args.sList );
	var oItems = oList.getItems( oQuery );
	var lsFields = [ "ContentType", "FileLeafRef", "ServerUrl", "DisplayName", "ID", "FileSystemObjectType" ];
	if( args.lsFields ) {
		lsFields = lsFields.concat( args.lsFields );
	}
	var sInclude = "Include( " + lsFields.join( "," ) + " )";
	ctx.load( oItems, sInclude );
	__.SP.exec( ctx, oItems, function( oItems ) {
		if( oItems.sError ) {
			async.reject( oItems.sError );
		}
		else {
			var laItems = [];
			var loItems = oItems.getEnumerator();
			while( loItems.moveNext() ) {
				var oItem = loItems.get_current();
				var bFolder = oItem.get_fileSystemObjectType();
				var url = oItem.get_item( 'ServerUrl' );
				if( bFolder ) {
					url = _spPageContextInfo.webServerRelativeUrl;
					url += "/_layouts/15/start.aspx#/SiteAssets/Forms/AllItems.aspx?RootFolder=";
					url += oItem.get_item( 'ServerUrl' );
				}
				var aItem = {
					  sTitle : oItem.get_item( 'FileLeafRef' )
					, sContentType : oItem.get_contentType().get_name()
					, idContentType : oItem.get_contentType().get_id().get_stringValue()
					, sDisplayName : oItem.get_displayName()
					, url : url
					, id : oItem.get_item( 'ID' )
					, bFolder : bFolder
				}
				if( args.lsFields ) {
					args.lsFields.forEach( function( sField ) {
						aItem[ sField ] = oItem.get_item( sField );
					} );
				}
				laItems.push( aItem );
			}
			async.resolve( { laItems : laItems } );
		}
	} );
}
