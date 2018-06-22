// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.sp.list.min.js
// @js_externs var __; __.SP; __.SP.ctx
// ==/ClosureCompiler==


/**
 * @namespace __.SP.list
 * @memberof __.SP
 */

__.SP.list = {
	/**
	 * Gets a list context by name or guid
	 * @memberof __.SP.list
	 * @method get
	 * @todo use arguments object
	 * @todo improve error capturing
	 * @example __.SP.folder.get( ctx, "Documents" );
	 * @param {Object} ctx SharePoint site context
	 * @param {String} x either name of the list or its guid in curly brackets
	 * @returns {Object} context of the list
	 */
	  get : function( ctx, x ) {
		var oList = null;
		var oLists = ctx.get_web().get_lists();
		// remove any curly brackets if present
		x = x.replace( /{|}/g, "" )
		if( __.SP.bGuid( x ) ) {
			oList = oLists.getById( x );
		}
		else {
			oList = oLists.getByTitle( x );
		}
		return ( oList ) ? oList : null;
	}
	/**
	 * Reads list items
	 * @memberof __.SP.list
	 * @method read
	 * @example
	 * __.SP.list.read( {
	 * 	  sList : "Documents"
	 *	, lsFields : [ "Title", "ID" ]
	 *	, xmlQuery : "<Where><FieldRef Name='ID' /><Lt><Value Type='Number'>5</Value></Lt></Where>"
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Array} args.lsFields array of field names to be returned
	 * @param {String} [args.sSite] Url of a site (defaults to current)
	 * @param {String} [args.pathSearch] folder path to start search from
	 * @param {String} [args.xmlQuery] optional CAML query otherwise entire list is returned
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre class='return-object'>
	 * lkv | (Object) | array of key value pairs
	 * </pre>
	 */
	, read : function( args ) { // sList, lsFields, xmlQuery, pathSearch (to limit to subfolder)
		var async = __.Async.promise( args );
		// get context
		var ctx = __.SP.ctx( args );
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
			var lsFields = args.lsFields || [ "ID" ];
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
						if( lsFields.length > 0 ) {
							lsFields.forEach( function( sField ) {
								var oField = kvItem[ sField ];
								// we also want to show empty fields that are sent back
								// with null, hence check of type
								if( typeof oField !== "undefined" ) {
									if( oField && oField.get_termGuid ) {
										kv[ sField ] = oField.get_label();
										kv[ "guid" + sField ] = oField.get_termGuid();
									}
									else if( oField && oField.get_lookupValue ) {
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
					async.resolve( { lkv : lkv } );
				}
			} );
		}
	}
	/**
	 * OBSOLTE Reads fields from list view
	 */
	// REF: remove 
	// __.SP.list.readView ( {sList : "OSCE Contacts", sView : 111, lsFields : [ "Title", "Country" ], cb : function( a ) {	do( a.kv ); } ); } } )
	, readView : function( args ) { // sList, sView, lsFields, cb
		var cb = args.cb;
		var lsFields = args.lsFields;
		( new __.Async( {
			  id : "__.SP.list.readView"
			, sdftError : "Failed to read list view."
		} ) )
		.then( __.SP.view, "read", {
			  sList : args.sList
			, sView : args.sView
		} )
		.then( function( args ) {
			var async = __.Async.promise( args );
			async.then( __.SP.list, "read", {
				  sList : args.sList
				, lsFields : lsFields
				, xmlQuery : "<Query>" + args.kv.xmlQuery + "</Query>"
			} ).resolve();
		} )
		.then( function( args ) {
			cb( args );
			__.Async.promise( args ).resolve();
		} )
		.start();
	}
/**
 * <pre>
 * Check if a list exists
 * </pre>
 * @memberof __.SP.list
 * @method exists
 * @example
 * __.SP.list.exists( {
 * 	  sList : "Documents"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * bExists | (Boolean) | true if list exists otherwise false
 * </pre>
 */
	, exists : function( args ) {
		var async = __.Async.promise( args );
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
/**
 * <pre>
 * Get guid of a list for a given name
 * </pre>
 * @memberof __.SP.list
 * @method id
 * @example
 * __.SP.list.id( {
 * 	  sList : "Documents"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of a list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * idList | (String) | guid of a list
 * </pre>
 */
__.SP.list.id = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Updates the settings of a list. Available properties are:
 * - documentTemplateUrl
 * - contentTypesEnabled
 * - enableMinorVersions
 * - enableVersioning
 * - onQuickLaunch
 * - majorVersionLimit
 * - majorWithMinorVersionsLimit
 * </pre>
 * @todo prefix "set_" to avoid inidcation in argument
 * @todo rename kvFeatures to aSettings
 * @memberof __.SP.list
 * @method settings
 * @example
 * __.SP.list.settings( {
 * 	  sList : "Documents"
 *	, kvFeatures : {
 * 		  set_enableVersioning : true
 *		, set_onQuickLaunch : false
 * 	}
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of a list
 * @param {Object} args.kvFeatures key value pair of settings
 */
__.SP.list.settings = function( args ) {
	var async = __.Async.promise( args );
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


/**
 * <pre>
 * Creates a list of a give type
 * Available types:
 * - genericList
 * - discussionBoard
 * - documentLibrary
 * - announcements
 * - contacts
 * - events
 * - REF: more?
 * </pre>
 * @memberof __.SP.list
 * @method create
 * @example
 * __.SP.list.create( {
 * 	  sList : "simple list"
 *	, sType : "genericList"
 * 	, sDescription : "This is a simple list"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of the list
 * @param {String} args.sType type of the list
 * @param {String} [args.sDescription] description of the list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * oList | (Object) | context of the list
 * </pre>
 */
__.SP.list.create = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Deletes a list
 * </pre>
 * @memberof __.SP.list
 * @method del
 * @example
 * __.SP.list.del( {
 * 	  sList : "simple list"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of the list
 */
__.SP.list.del = function( args ) {
	var async = __.Async.promise( args );
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
	if( args.aCalculation ) {
		xml += ' ReadOnly="TRUE" Type="Calculated">';
		xml += "<Formula>" + args.aCalculation.sFormular + "</Formula>";
		xml += "<FieldRefs>";
		args.aCalculation.lsFields.forEach( function( sField ) {
			xml += "<FieldRef Name=\"" + sField + "\" />";
		} );
		xml += "</FieldRefs>";
	}
	else {
		xml += ' Type="' + sType + '">';
	}
	if( sType == "TaxonomyFieldType" ) {
		// REF: move this to __.SP.taxonomy
		var guidTermStore = __.SP.taxonomy.oStore.guidTermStore;
		var guidTermSet = __.SP.taxonomy.oStore.guidTermSet[ args.sTaxonomy ];
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

/**
 * @typedef oField
 * @property {String} sName internal name of a field
 * @property {String} sDisplayName display name of a field
 */
/**
 * <pre>
 * Adds fields to a list
 * </pre>
 * @memberof __.SP.list
 * @method addFields
 * @async 
 * @instance
 * @todo move to namespace __.SP.list.fields
 * @todo check need of return value loFields
 * @todo check if single updates prevent calulated fields from erroring out
 * @example
 * __.SP.list.addFields( {
 * 	  sList : "simple list"
 *	, loFields : loFields
 * } );
 * @param {Object} args 
 * @param {String} args.sList name of the list
 * @param {oField} args.loFields an array of list field objects "oField"
 */
__.SP.list.addFields = function( args ) { // sList, loFields
	var async = __.Async.promise( args );
	async.then( __.SP.taxonomy, "loadSPScripts" )
	async.then( function( args ) {
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
						oField.set_defaultValue( a.vDefault );
					}
					oField.update();
					ctx.load( oField );
				}
			} );
			__.SP.exec( ctx, oFields, function( oFields ) {
				if( oFields.sError ) {
					if( /Cannot complete this action/.test( oFields.sError ) ) {
						async.resolve();
					}
					else {
						async.reject( oFields.sError );
					}
				}
				else {
					async.resolve();
				}
			} );
		}
	} );
	async.resolve();
}

/**
 * <pre>
 * Sets up a field as lookup
 * @todo move to field namespace or merge with field.update
 * @todo automatically get guid of list by name
 * </pre>
 * @memberof __.SP.list
 * @method setLookup
 * @example
 * __.SP.list.setLookup( {
 * 	  oField : oField
 *	, idList : "12345678-asdf-zxcv-qwwe-1234567890ab"
 * 	, sField : "Title"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {Object} args.oField context of list field
 * @param {idList} args.idList guid of lookup list
 * @param {sField} args.sField name of main lookup list field to display
 */
__.SP.list.setLookup = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Sets up fields as lookup using a an array of {oFields}
 * @todo move to field namespace or merge with field.update
 * @todo check possibility to merge with {__.SP.field.setLookup}
 * </pre>
 * @memberof __.SP.list
 * @method setLookups
 * @example
 * __.SP.list.setLookups( { loFields : loFields } );
 * @param {Object} args a parameter object holding the following values
 * @param {Array|of|oField} args.loFields array of oField objects
 */
__.SP.list.setLookups = function( args ) {
	var async = __.Async.promise( args );
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
/**
 * <pre>
 * Adds a site column to a list
 * @todo move to field namespace or merge with field.update
 * @todo check if we can merge with setColumns
 * </pre>
 * @memberof __.SP.list
 * @method setColumn
 * @example
 * __.SP.list.setColumn( {
 * 	  sList : "test list"
 *	, sColumn : "Email"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of list
 * @param {String} args.sColumn internal name of site column
 */
__.SP.list.setColumn = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Adds columns to a list using a an array of {oFields}
 * @todo move to field namespace or merge with field.update
 * @todo check possibility to merge with {__.SP.field.setColumn}
 * </pre>
 * @memberof __.SP.setColumns
 * @method setColumns
 * @example
 * __.SP.list.setColumns( { loFields : loFields } );
 * @param {Object} args a parameter object holding the following values
 * @param {Array|of|oField} args.loFields array of oField objects
 */
__.SP.list.setColumns = function( args ) { // oList, loFields ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Returns the name of a list for a given guid
 * </pre>
 * @memberof __.SP.list
 * @method nameByGuid
 * @example __.SP.list.nameByGuid( {
 *     guid : "b5ffd424-8b37-4bb8-b070-d32e4d638740"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.guid guid of a list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * sName | (String) | name of the list
 * </pre>
 */
__.SP.list.nameByGuid = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Returns two objects mapping a lists internal field names against their display names and vice versa.
 * </pre>
 * @memberof __.SP.list
 * @method fields
 * @example __.SP.list.fields( { sList : "test list" } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of the list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * mpIntNames | (Object) | maps internal names against display names
 * mpDispNames | (Object) | maps display names against internal names
 * </pre>
 */
__.SP.list.fields = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oFields = oList.get_fields();
	var lsStandardFields = [ "Title", "Created", "Author" ];
	ctx.load( oFields, 'Include(Title,InternalName,FromBaseType)' );
	__.SP.exec( ctx, oFields, function( oFields ) {
		if( oFields.sError ) {
			async.reject( oFields.sError );
		}
		else {
			var laFields = oFields.getEnumerator();
			var mpIntNames = {};
			var mpDispNames = {};
			while( laFields.moveNext() ) {
				var aField = laFields.get_current();
				var sIntName = aField.get_internalName();
				var sDispName = aField.get_title();
				if( args.bOnlyCustom ) {
					if( ! aField.get_fromBaseType() ||
						lsStandardFields.__contains( sIntName ) ) {
						mpIntNames[ sIntName ] = sDispName;
						mpDispNames[ sDispName ] = sIntName;
					}
				}
				else {
					mpIntNames[ sIntName ] = sDispName;
					mpDispNames[ sDispName ] = sIntName;
				}
			}
			async.resolve( {
				  mpIntNames : mpIntNames
				, mpDispNames : mpDispNames
			} );
		}
	} );
};

/**
 * @namespace __.SP.list.field
 * @memberof __.SP.list
 */

__.SP.list.field = {};

/**
 * <pre>
 * Updates a list field with the following information
 * - display name
 * - flag to be required
 * - flag to be hidden
 * - flags in which forms to be shown
 * </pre>
 * @memberof __.SP.list.field
 * @method display
 * @example
 * __.SP.list.field.display( {
 * 	  sList : "test list"
 * 	, sField : "Title"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of the list
 * @param {String} args.sField internal name of the field
 * @param {String} args.sTitle new display name of the field
 * @param {Boolean} args.bRequired flag whether a field is required
 * @param {Boolean} args.bHidden flag whether to hide a field
 * @param {Boolean} args.bNew flag whether to not load in new form
 * @param {Boolean} args.bEdit flag whether to not load in edit form
 * @param {Boolean} args.bDisp flag whether to not load in view form
 */
// REF: rename sTitle to sDisplayName
// REF: think of merging with setLookup, setColumn and reanme method to update?
__.SP.list.field.display = function( args ) {
	var async = __.Async.promise( args );
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


/**
 * <pre>
 * Adds columns to a list using a an array of {oFields}
 * @todo check possibility to merge with {__.SP.field.display}
 * @todo investigate error we get with "choice" fields
 * </pre>
 * @memberof __.SP.list.field
 * @method displays
 * @example
 * __.SP.list.displays( {
 *        sList : "test list"
 *      , loFields : loFields
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {Array|of|oField} args.loFields array of oField objects
 */
__.SP.list.field.displays = function( args ) {
	var async = __.Async.promise( args );
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

/**
 * <pre>
 * Reorders fields of a list by an array of field names.
 * </pre>
 * @memberof __.SP.list.field
 * @method reorder
 * @example
 * __.SP.list.field.reorder( {
 *        sList : "test list"
 *      , lsFields : [ "Email", "CustomField", "Title" ]
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {Array} args.lsFields array of internal field names
 */
__.SP.list.field.reorder = function( args ) { 
	var async = __.Async.promise( args );
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

/**
 * Sets jsLink file on a field
 * @memberof __.SP.list.field
 * @method setJsLink
 * @example
 * __.SP.list.field.setJsLink( {
 *        sList : "OSCE Contacts"
 * 	, sField : "jsLink"
 * 	, urlJsLink : "~sitecollection/App/js/jsLink/jsLink_OCEEARegistrations_list.js?v=v5"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {Array} args.lsFields array of internal field names
 */
__.SP.list.field.setJsLink= function( args ) { // sList, [sField], urlJsLink
	var async = __.Async.promise( args );
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
			async.resolve( "jsLink set" );
		}
	} );
};


/*
 * get edir rights
    var web,clientContext,currentUser,oList,perMask;

    clientContext = new SP.ClientContext.get_current();
    web = clientContext.get_web();
    currentUser = web.get_currentUser();   
    oList = web.get_lists().getByTitle('Actions');
    clientContext.load(oList,'EffectiveBasePermissions');
    clientContext.load(currentUser); 
    clientContext.load(web);           

    clientContext.executeQueryAsync(function(){
        if (oList.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)){
            console.log("user has edit permission");
        }else{
             console.log("user doesn't have edit permission");
        }   
    }, function(sender, args){
        console.log('request failed ' + args.get_message() + '\n'+ args.get_stackTrace());
    });


*/
