// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.item; 
// ==/ClosureCompiler==


/**
 * @namespace __.SP.item
 * @memberof __.SP
 */

__.SP.item = {
	/**
	 * Creates an item in a list with a set of key/value pairs.
	 * NB: The method is incomplete and does not cater for all possible 
	 * field types.
	 * @memberof __.SP.item
	 * @method create
	 * @example
	 * __.SP.item.create( {
	 * 	  sList : "Shared Documents"
	 *	, kv : {
	 *             Title : "new item"
	 *           , Description : "a new item"
	 *      } 
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
	  create : function( args ) { // sList, kv
		var async = __.Async.promise( args );
		// get context
		var ctx = __.SP.ctx();
		// get list
		var oList = __.SP.list.get( ctx, args.sList );
		var oInfo = new SP.ListItemCreationInformation();
		var oItem = oList.addItem( oInfo );
		// iterate through key/value pair
		for( var k in args.kv ) {
			var v = args.kv[ k ];
			if( typeof v == "object" ) {
				if( v.id ) {
					var o = new SP.FieldLookupValue();
					o.set_lookupId( v.id );
					oItem.set_item( k, o );
				}
			}
			else {
				oItem.set_item( k, v );
			}
		}
		// update the item
		oItem.update();
		// and invoke "load" on context
		ctx.load( oItem );
		// call the helper function handle the request
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve( {
					  oItem : oItem
					, idItem : oItem.get_id()
				} );
			}
		} );
	}
	/**
	 * Updates an item passing on values as a set of key/value pairs.
	 * @memberof __.SP.item
	 * @method update
	 * @example
	 * __.SP.item.update( {
	 * 	  sList : "Shared Documents"
	 * 	  id : 17
	 *	, kv : {
	 *             Title : "new item"
	 *           , Description : "a new item"
	 *      } 
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 * @param {Array} args.kv a key/value pair data object holding values for indicated fields.
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre class='return-object'>
	 * oItem | (Object) | handle of the updated SP item object
	 * </pre>
	 */
	, update : function( args ) { // sList, id, kv
		var async = __.Async.promise( args );
		// get context
		var ctx = __.SP.ctx();
		// get list
		var oList = __.SP.list.get( ctx, args.sList );
		// get the item by ID
		var oItem = oList.getItemById( args.id );
		// iterate through key/value pair
		for( var k in args.kv ) {
			var v = args.kv[ k ];
			if( typeof v == "object" ) {
				if( v.lookup ) {
					var lo = [];
					v.lookup.forEach( function( id ) {
						var oLookup = new SP.FieldLookupValue();
						oLookup.set_lookupId( id );
						lo.push( oLookup );
					
					} );
					oItem.set_item( k, lo );
				}
				if( v.choice ) {
					oItem.set_item( k, v.choice.join( "," ) );
				}
			}
			else {
				oItem.set_item( k, v );
			}
		}
		// update the item
		oItem.update();
		// and invoke "load" on context
		ctx.load( oItem );
		// call the helper function handle the request
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve( { oItem : oItem } );
			}
		} );
	}
	/**
	 * Reads fields from an item
	 * @memberof __.SP.item
	 * @method read
	 * @example
	 * __.SP.item.read( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 * 	  , lsFields : [ "Title", "CustomField" ]
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 * @param {Array} args.lsFields array for internal field names
	 * <pre class='return-object'>
	 * kv | (Object) | data object of key/value pairs
	 * </pre>
	 */
	, read : function( args ) {
		var async = __.Async.promise( args );
		// get context
		var ctx = __.SP.ctx();
		// get list
		var oList = __.SP.list.get( ctx, args.sList );
		// get item by ID
		var oItem = oList.getItemById( args.id );
		// in case we pass on additional parameters such as custom
		// field names to be fetched we do this in an array and...
		var lsFields = args.lsFields;
		var _args = args.lsFields.__copy();
		if( lsFields ) {
			// construct the arguments list for the 'load' call
			// by preceding the arguments with the item [oItem]
			_args.unshift( oItem );
		}
		else {
			// and we prepare the arguments list with the item only
			_args = [ oItem ];
		}
		// invoke the "load" call in context of context with lsFields list
		ctx.load.apply( ctx, _args );
		// call the helper function handle the request
		__.SP.exec( ctx, oItem, function( oItem ) {
			var convert = function( sField, oField ) {
				var kv = {};
				if( oField.get_termGuid ) {
					kv[ sField ] = oField.get_label();
					kv[ "guid" + sField ] = oField.get_termGuid();
				}
				else if( oField && oField.get_lookupId ) {
					kv[ sField ] = oField.get_lookupValue();
					kv[ "id" + sField ] = oField.get_lookupId();
				}
				else {
					kv[ sField ] = oField;
				}
				return kv;
			}
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				var kv = {};
				lsFields.forEach( function( sField ) {
					var oField = oItem.get_item( sField );
					var _kv = {};
					if( typeof oField != "undefined" ) {
						if( ! oField ) {
							_kv[ sField ] = ""; // null values
						}
						else if( SP.Taxonomy && oField instanceof SP.Taxonomy.TaxonomyFieldValueCollection ) {
							_kv[ sField ] = [];
							var loTaxTerms = oField.getEnumerator();
							while( loTaxTerms.moveNext() ) {
								var oTaxTerm = loTaxTerms.get_current();
								_kv[ sField ].push( convert( sField, oTaxTerm ) );
							}
						}
						else if( oField instanceof Array ) {
							_kv[ sField ] = [];
							oField.forEach( function( o ) {
								_kv[ sField ].push( convert( sField, o ) );
							} );
						}
						else {
							_kv = convert( sField, oField );
						}
					}
					kv.__add( _kv );
				} );
				async.resolve( { oItem : oItem, kv : kv } );
			}
		} );
	}
	/**
	 * Checks if the current user has edit rights on an item.
	 * @memberof __.SP.item
	 * @method isEditable
	 * @example
	 * __.SP.item.create( {
	 *      sList : "Shared Documents"
	 *    , id : 5
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of item
	 * @returns {Object} Resolved promise holding the following values 
	 * <pre class='return-object'>
	 * bEditable | (Boolean) | true if item is editable by the current user
	 * </pre>
	 */
	, isEditable : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		ctx.load( oItem, "EffectiveBasePermissions" );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				var oPermission = oItem.get_effectiveBasePermissions();
				var bEditable = false;
				if( oPermission.has( SP.PermissionKind.editListItems ) ) {
					bEditable = true;
				}
				async.resolve( { bEditable : bEditable } );
			}
		} );
	}
	/**
	 * Breaks the permission inheritance of an item
	 * @memberof __.SP.item
	 * @method breakInheritance
	 * @example
	 * __.SP.item.breakInheritance( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 */
	, breakInheritance : function( args ) { // sList, id
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		oItem.breakRoleInheritance( false );
		ctx.load( oItem );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
	/**
	 * Resets the original permission inheritance of an item
	 * @memberof __.SP.item
	 * @method resetInheritance
	 * @example
	 * __.SP.item.resetInheritance( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 */
	, resetInheritance : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		oItem.resetRoleInheritance();
		ctx.load( oItem );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
	/**
	 * Adds a group with a permission role to an item
	 * @memberof __.SP.item
	 * @method addGroup
	 * @example
	 * __.SP.item.addGroup( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 *	  , sGroup : "Reader Group 42"
	 *	  , sRole : "Read"
	 * } );
	 * @todo provide a full list of roles in documenation
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 * @param {String} args.sGroup name of the group
	 * @param {String} args.sRole permission role (possible values: Contribute, Read, Edit, Custom Levelname) 
	 */
	, addGroup : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		ctx.load( oItem );
		var oGroups = ctx.get_web().get_siteGroups();
		var oGroup = oGroups.getByName( args.sGroup );
		var oBinding = SP.RoleDefinitionBindingCollection.newObject( ctx );
		var oRole = ctx.get_web().get_roleDefinitions().getByName( args.sRole );
		oBinding.add( oRole );
		 oItem.get_roleAssignments().add( oGroup, oBinding );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
	/**
	 * Wipes all exising permissions on an item and adds a group with a permission role to it.
	 * @memberof __.SP.item
	 * @method restrictToGroup
	 * @example
	 * __.SP.item.restrictToGroup( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 *	  , sGroup : "Reader Group 42"
	 *	  , sRole : "Read"
	 * } );
	 * @todo provide a full list of roles in documenation
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 * @param {String} args.sGroup name of the group
	 * @param {String} args.sRole permission role (possible values: Contribute, Read, Edit, Custom Levelname) 
	 */
	, restrictToGroup : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		ctx.load( oItem );
		var oGroups = ctx.get_web().get_siteGroups();
		var oGroup = oGroups.getByName( args.sGroup );
		var oBinding = SP.RoleDefinitionBindingCollection.newObject( ctx );
		var oRole = ctx.get_web().get_roleDefinitions().getByName( args.sRole );
		oBinding.add( oRole );
		oItem.breakRoleInheritance( false );
		oItem.get_roleAssignments().add( oGroup, oBinding );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
	// __.SP.item.restrictToUser( { sList : "SideBar", id: 22, xUser: _spPageContextInfo.userId, sRole: "Edit"  } ) 
	/**
	 * Wipes all exising permissions on an item and adds a user with a permission role to it.
	 * @memberof __.SP.item
	 * @method restrictToUser
	 * @example
	 * __.SP.item.restrictToUser( {
	 * 	    sList : "Shared Documents"
	 * 	  , id : 17
	 *	  , xUser : _spPageContextInfo.userId
	 *	  , sRole : "Edit"
	 * } );
	 * @todo provide a full list of roles in documenation
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sList name or guid of a list
	 * @param {Number} args.id id of the list item
	 * @param {String} args.xUser either id or email or login name (osce\\jriemer) of a user
	 * @param {String} args.sRole permission role (possible values: Contribute, Read, Edit, Custom Levelname) 
	 */
	, restrictToUser : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		ctx.load( oItem );
		var oUsers = ctx.get_web().get_siteUsers();
		var oUser = null;
		if( ! isNaN( args.xUser ) ) {
			oUser = oUsers.getById( args.xUser );
		}
		else if( args.xUser.__isEmail() ) {
			oUser = oUsers.getByEmail( args.xUser );
		}
		else {
			oUser = oUsers.getByLoginName( args.xUser );
		}
		var oBinding = SP.RoleDefinitionBindingCollection.newObject( ctx );
		var oRole = ctx.get_web().get_roleDefinitions().getByName( args.sRole );
		oBinding.add( oRole );
		oItem.breakRoleInheritance( false );
		oItem.get_roleAssignments().add( oUser, oBinding );
		__.SP.exec( ctx, oItem, function( oItem ) {
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
};
