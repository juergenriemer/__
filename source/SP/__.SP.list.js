__.SP.list = {
	/** 
	 * Gets a list by name or GUID.
	 */
	  get : function( ctx, sList ) {
		var oList = null;
		var oLists = ctx.get_web().get_lists();
		if( /^{/.test( sList ) ) {
			var ls = sList.match( /{(.*)}/ );
			if( ls.length == 2 ) {
				oList = oLists.getById( ls[ 1 ] );
			}
		}
		else {
			oList = oLists.getByTitle( sList );
		}
		return ( oList ) ? oList : null;
	}
	/**
	 * Reads fields from entire list
	 */
	// __.SP.list.read( { sList : "OSCE Contacts", lsFields : [ "Title", "ID" ], xmlQuery : "<Query><Where><In><FieldRef Name='ID' /><Values><Value Type='Number'>37</Value><Value Type='Number'>38</Value></Values></In></Where></Query>" } );
	, read : function( args ) { // sList, lsFields, xmlQuery, pathSearch (to limit to subfolder)
		var async = __.async( args );
		// get context
		var ctx = __.SP.ctx( args.sSite );
		// get list
		var oList = __.SP.list.get( ctx, args.sList );
		if( ! oList ) {
			async.reject( "List not found: " + args.sList );
		}
		else {
			var oQuery;
			if( args.xmlQuery ) {
				oQuery = new SP.CamlQuery();
				oQuery.set_viewXml( "<View>" + args.xmlQuery + "</View>" );
			}
			else {
				oQuery = SP.CamlQuery.createAllItemsQuery();
			}
			if( args.pathSearch ) {
				// not tested
				oQuery.set_folderServerRelativeUrl( args.pathSearch );
			}
			var oItems = oList.getItems( oQuery );
			ctx.load( oItems );
			__.SP.exec( ctx, oItems, function( oItems ) {
				if( oItems.sError ) {
					async.reject( oItems.sError );
				}
				else {
					var lkv = [];
					var laItems = oItems.getEnumerator();
					while( laItems.moveNext() ) {
						var kv = {};
						var kvItem = laItems.get_current().get_fieldValues();
						if( args.lsFields.length > 0 ) {
							args.lsFields.forEach( function( sField ) {
								var oField = kvItem[ sField ];
								if( oField ) {
									if( oField.get_termGuid ) {
										kv[ sField ] = oField.get_label();
										kv[ "guid" + sField ] = oField.get_termGuid();
									}
									else if( oField.get_lookupValue ) {
										kv[ sField ] = oField.get_lookupValue();
										kv[ "id" + sField ] = oField.get_lookupId();
									}
									else {
										kv[ sField ] = oField;
									}
								}
							} );
							lkv.push( kv );
						}
						else {
							lkv.push( kvItem );
						}
					}
				}
				async.resolve( { lkv : lkv } );
			} );
		}
	}
	/**
	 * Reads fields from list view
	 */
	// __.SP.list.readView ( {sList : "OSCE Contacts", sView : 111, lsFields : [ "Title", "Country" ], cb : function( a ) {	do( a.kv ); } ); } } )
	, readView : function( args ) { // sList, sView, lsFields, cb
		var cb = args.cb;
		var lsFields = args.lsFields;
		( new __.Async() )
		.then( __.SP.view, "read", {
			  sList : args.sList
			, sView : args.sView
		} )
		.then( function( args ) {
			var async = __.async( args );
			async.then( __.SP.list, "read", {
				  sList : args.sList
				, lsFields : lsFields
				, xmlQuery : "<Query>" + args.kv.xmlQuery + "</Query>"
			} ).resolve();
		} )
		.then( function( args ) {
			cb( args );
			__.async( args ).resolve();
		} )
		.start();
	}
	, exists : function( args ) {
		var async = __.async( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		ctx.load( oList, 'Id' );
		__.SP.exec( ctx, oList, function( oList ) {
			if( oList.sError ) {
				async.resolve( { bExists : false } );
			}
			else {
				async.resolve( { bExists : true } );
			}
		} );
	}
};
__.SP.list.id = function( args ) { // sList
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	ctx.load( oList, 'Id' );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve( { idList : oList.get_id() } );
		}
	} );
}

__.SP.list.settings = function( args ) { // kvFeatures
	/* kvFeatures:
	 * set_documentTemplateUrl
	 * set_contentTypesEnabled
	 * set_enableMinorVersions
	 * set_enableVersioning
	 * set_onQuickLaunch
	 * set_majorVersionLimit
	 * set_majorWithMinorVersionsLimit
	 */
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	for( var k in args.kvFeatures ) {
		var v = args.kvFeatures[ k ];
		oList[ k ]( v );
	}
	oList.update();
	ctx.load( oList );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve();
		}
	} );
};

__.SP.list.create = function( args ) { // sList, sType, sDescription
	/* sType:
	 * discussionBoard, documentLibrary, announcements, contacts, events
	 */
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oWeb = ctx.get_web();
	var oInfo = new SP.ListCreationInformation();
	oInfo.set_title( args.sList );
	oInfo.set_templateType( SP.ListTemplateType[ args.sType ] );
	var oList = oWeb.get_lists().add( oInfo );
	if( args.sDescription ) {
		oList.set_description( args.sDescription );
	}
	ctx.load( oList );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve( { oList : oList } );
		}
	} );
}

__.SP.list.del = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	oList.deleteObject();
	ctx.load( oList );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve();
		}
	} );
};

__.SP.list.xmlFields = function( args ) {
	console.log( args );
	var mp = {
		  taxonomy : "TaxonomyFieldType"
		, lookup : "Lookup"
		, choice : "Choice"
		, textarea : "Note"
		, input : "Text"
		, checkbox : "Boolean"
		, boolean : "Boolean"
		, date : "DateTime"
	};
	var xml = '<Field Name="' + args.sName + '" DisplayName="' + args.sName + '" ';
	if( args.sAddition ) {
		xml += args.sAddition;
	}
	var sType = mp[ args.sCAMLType ];
	// its a site column...
	if( sType == "DateTime" ) {
		xml += ' Format="DateOnly" ';
	}
	if( args.bMulti ) {
		sType = ( sType == "Choice" )
			? "MultiChoice"
			: sType += "Multi";
		xml += ' Mult="TRUE" ';
	}
	xml += ' Type="' + sType + '">';
	if( sType == "TaxonomyFieldType" ) {
		// REF: move this to __.SP.taxonomy
		var guidTermStore = O$C3.Tax.guidTermStore;
		var guidTermSet = O$C3.Tax.guidTermSet[ args.sTaxonomy ];
		xml += '<Customization>';
		xml += '<ArrayOfProperty>';
		xml += '<Property><Name>SspId</Name><Value xmlns:q1="http://www.w3.org/2001/XMLSchema" p4:type="q1:string" xmlns:p4="http://www.w3.org/2001/XMLSchema-instance">' + guidTermStore + '</Value></Property>';
		xml += '<Property><Name>TermSetId</Name><Value xmlns:q2="http://www.w3.org/2001/XMLSchema" p4:type="q2:string" xmlns:p4="http://www.w3.org/2001/XMLSchema-instance">' + guidTermSet + '</Value></Property>';
		xml += '</ArrayOfProperty>';
		xml += '</Customization>';
	}
	if( typeof args.vDefault !== "undefined" ) {
		xml += '<Default>' + args.vDefault + '</Default>';
	}
	xml += '</Field>';
	console.log( args );
	console.log( xml );
	return xml;
};
__.SP.list.oFieldType = function( args ) {
	var mp = {
		  taxonomy : SP.Taxonomy.TaxonomyField
		, lookup : SP.FieldLookup
		, choice : SP.FieldChoice
		, input : SP.FieldText
		, textarea : SP.FieldText
		, checkbox : SP.FieldText
		, boolean : SP.FieldText
		, date : SP.FieldDateTime
	};
	return mp[ args.sCAMLType ];
};

__.SP.list.addFields = function( args ) { // sList, loFields
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	if( args.loFields ) {
		var oFields = oList.get_fields();
		args.loFields.forEach( function( a ) {
			if( a.sCAMLType !== "column" && a.sName !== "Title" ) {
				var oField = ctx.castTo(
					  oFields.addFieldAsXml(
						  __.SP.list.xmlFields( a )
						, true
						, SP.AddFieldOptions.addToDefaultContentType
					)
					, __.SP.list.oFieldType( a )
				);
				if( a.sTitle ) {
					oField.set_title( a.sTitle );
				}
				if( a.sDescription ) {
					oField.set_description( a.sDescription );
				}
				if( a.lsChoices ) {
					oField.set_choices( a.lsChoices );
				}
				if( a.aLookup ) {
					a.aLookup.oField = oField;
				}
				if( a.vDefault ) {
					console.log( "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" );
					console.log( a.vDefault );
					oField.set_defaultValue( a.vDefault );
				}
				oField.update();
				ctx.load( oField );
			}
		} );
		__.SP.exec( ctx, oFields, function( oFields ) {
			if( oFields.sError ) {
				async.reject( oFields.sError );
			}
			else {
				async.resolve( { loFields : args.loFields } );
			}
		} );
	}
}
// change the sDisplayName afterwards!!!! REF
__.SP.list.setLookup = function( args ) { // oField, idList, sField ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oField = args.oField;
	oField.set_lookupList( "{" + args.idList + "}" );
	oField.set_lookupField( args.sField );
	oField.update();
	ctx.load( oField );
	__.SP.exec( ctx, oField, function( o ) {
		if( o.sError ) {
			async.reject( "setLookupErrorType " + o.sError );
		}
		else {
			async.resolve( { oField : oField });
		}
	} );
}

__.SP.list.setLookups = function( args ) { // oList, loFields ) {
	var async = __.async( args );
	args.loFields.forEach( function( o ) {
		if( o.aLookup ) {
			async.then( __.SP.list, "id", {
				sList : o.aLookup.sList
			} );
			async.then( __.SP.list, "setLookup", {
				  oField : o.aLookup.oField
				, sField : o.aLookup.sField
			} );
		}
	} );
	async.resolve();
}

// __.SP.list.setColumn( { sList : "FrontOfficeAssignments", sColumn : "FrontOffice"} )
__.SP.list.setColumn = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oColumn = ctx.get_web().get_fields().getByInternalNameOrTitle( args.sColumn );
	var oList = __.SP.list.get( ctx, args.sList );
	var oField = oList.get_fields().add( oColumn );
	var oView = oList.get_defaultView();
	oView.get_viewFields().add( args.sColumn );
	oView.update();
	oList.update();
	ctx.load( oList );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve();
		}
	} );
}

__.SP.list.setColumns = function( args ) { // oList, loFields ) {
	var async = __.async( args );
	args.loFields.forEach( function( o ) {
		if( o.sColumn ) {
			async.then( __.SP.list, "setColumn", {
				  sColumn : o.sColumn
				, sList : args.sList
			} );
		}
	} );
	async.resolve();
}
//__.SP.list.nameByGuid( { guid : "b5ffd424-8b37-4bb8-b070-d32e4d638740" } );
__.SP.list.nameByGuid = function( args ) { // guid
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = ctx.get_web().get_lists().getById( args.guid );
	ctx.load( oList, "Title" );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject( oList.sError );
		}
		else {
			async.resolve( {
				  sName : oList.get_title()
			} );
		}
	} );
};

//__.SP.list.fields( { sList : "OSCE Contacts" } );
__.SP.list.fields = function( args ) { // sList
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var oFields = oList.get_fields();
	ctx.load( oFields, 'Include(Title,InternalName)' );
	__.SP.exec( ctx, oFields, function( oFields ) {
		if( oFields.sError ) {
			async.reject( oFields.sError );
		}
		else {
			var laFields = oFields.getEnumerator();
			var mpIntNames = {};
			var mpDispNames = {};
			while( laFields.moveNext() ) {
				var sIntName = laFields.get_current().get_internalName();
				var sDispName = laFields.get_current().get_title();
				mpIntNames[ sIntName ] = sDispName;
				mpDispNames[ sDispName ] = sIntName;
			}
			async.resolve( {
				  mpIntNames : mpIntNames
				, mpDispNames : mpDispNames
			} );
		}
	} );
};

__.SP.list.field = {};
//__.SP.list.field.display( { sList : "OSCE Contacts", sField : "Spouse/Domestic Partner", sTitle : "Spouse" } );

/* sets the following attributes of a field: display name, required or not, where to show */
__.SP.list.field.display = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var oField = oList.get_fields().getByInternalNameOrTitle( args.sField );
	var bDisp = ( typeof args.bDisp !== "undefined" ) ? args.bDisp : true;
	var bNew = ( typeof args.bNew !== "undefined" ) ? args.bNew : true;
	var bEdit = ( typeof args.bEdit !== "undefined" ) ? args.bEdit : true;
	var bHidden = ( typeof args.bHidden !== "undefined" ) ? args.bHidden : false;
	oField.setShowInDisplayForm( bDisp );
	oField.setShowInNewForm( bNew );
	oField.setShowInEditForm( bEdit );
	if( args.sTitle ) {
		oField.set_title( args.sTitle );
	}
	if( args.bRequired ) {
		oField.set_required( args.bRequired );
	}
	oField.set_hidden( bHidden );
	oField.update();
	ctx.load( oField );
	__.SP.exec( ctx, oField, function( oField ) {
		if( oField.sError ) {
			async.reject( oField.sError );
		}
		else {
			async.resolve();
		}
	} );
}


__.SP.list.field.displays = function( args ) { // oList, loFields ) {
	var async = __.async( args );
	args.loFields.forEach( function( oField ) {
		if( oField.sCAMLType !== "choice" ) {
			async.then( __.SP.list.field, "display", {
				  sList : args.sList
				, sField : oField.sName
				, sTitle : oField.sDisplayName
				, bNew : oField.bNew
				, bEdit : oField.bEdit
				, bDisp : oField.bDisp
				, bHidden : oField.bHidden
				, bRequired : oField.bRequired
				, vDefault : oField.vDefault
			}, "update " + oField.sName )
		}
	} );
	async.resolve();
}


// var lsFields = ["FirstName", "Title", "Gender", "AcademicTitle", "Salutation", "JobTitle", "ol_Department", "WorkPhone", "CellPhone", "WorkAddress", "WorkCity", "WebPage", "Company", "WorkCountry", "AddressCountry", "DateOfEntry", "SpouseName", "AssistantsName", "Country", "CountryCategory", "MainCategory", "AreaOfExpertise", "ExecutiveStructure", "InternationalOrganization", "Comments", "FrontOffice", "DossierFile", "bDossier", "Published", "Log", "WorkState", "WorkZip", "FullName"];
// lsFields = ["FirstName","Gender"];__.SP.list.field.reorder( { sList : "OSCE Contacts", lsFields : lsFields } );
__.SP.list.field.reorder = function( args ) { // sList, lsFields
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var oCTs = oList.get_contentTypes();
	ctx.load( oCTs );
	__.SP.exec( ctx, oCTs, function( oCTs ) {
		if( oCTs.sError ) {
			async.reject( oCTs.sError );
		}
		else {
			var oCT = oCTs.getItemAtIndex( 0 );
			var oFields = oCT.get_fieldLinks();
			oFields.reorder( args.lsFields );
			oCT.update( false );
			__.SP.exec( ctx, oFields, function( oFields ) {
				if( oFields.sError ) {
					async.reject( oFields.sError );
				}
				else {
					async.resolve();
				}
			} );
		}
	} );
};

__.SP.list.field.setJsLink= function( args ) { // sList, [sField], urlJsLink
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var sField = args.sField || "jsLink";
	var oField = oList.get_fields().getByInternalNameOrTitle( sField );
	oField.set_jsLink( args.urlJsLink );
	oField.update();
	ctx.load( oField );
	__.SP.exec( ctx, oField, function( oField ) {
		if( oField.sError ) {
			async.reject( oField.sError );
		}
		else {
			async.resolve();
		}
	} );
};
