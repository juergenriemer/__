__.SP.item = {
	/** 
	 * Create an item.
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
	 * Update fields of an item.
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
	 * Read fields from an item.
	 */
	, read : function( args ) { // sList, id, lsFields
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
		var _args = __.o.copy( args.lsFields );
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
					console.log( sField );
					console.log( oField.get_lookupValue() );
					console.log( oField.get_lookupId() );
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
					if( typeof oField != "undefined" && oField ) {
						if ( oField instanceof Array ) {
							_kv[ sField ] = [];
							oField.forEach( function( o ) {
								_kv[ sField ].push( convert( sField, o ) );
							} );
						}
						else {
							_kv = convert( sField, oField );
						}
					}
					__.o.add( kv, _kv );
				} );
				async.resolve( { oItem : oItem, kv : kv } );
			}
		} );
	}
//	__.SP.item.breakInheritance( { sList : "DossierInfos", id: 6 } ) 
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
//	__.SP.item.resetInheritance( { sList : "DossierInfos", id: 12 } ) 
	, resetInheritance : function( args ) { // sList, id
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
//	__.SP.item.addGroup( { sList : "DossierInfos", id: 7, sGroup: O$C3.FOUser.oSettings.sFrontOffice, sRole: "Read"  } ) 
	, addGroup : function( args ) { // sList, id, sGroup, sPermission
		/* sRole: Contribute,Custom Levelname,Read,Edit */
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
	// __.SP.item.restrictToGroup( { sList : "DossierInfos", id: 7, sGroup: O$C3.FOUser.oSettings.sFrontOffice, sRole: "Read"  } ) 
	, restrictToGroup : function( args ) { // sList, id, sGroup, sRole
		/* sRole: Contribute,Custom Levelname,Read,Edit */
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oItem = oList.getItemById( args.id );
		console.log( oItem );
		ctx.load( oItem );
		var oGroups = ctx.get_web().get_siteGroups();
		var oGroup = oGroups.getByName( args.sGroup );
		var oBinding = SP.RoleDefinitionBindingCollection.newObject( ctx );
		var oRole = ctx.get_web().get_roleDefinitions().getByName( args.sRole );
		oBinding.add( oRole );
		oItem.breakRoleInheritance( false );
		oItem.get_roleAssignments().add( oGroup, oBinding );
		__.SP.exec( ctx, oItem, function( oItem ) {
			console.log( oItem );
			if( oItem.sError ) {
				async.reject( oItem.sError );
			}
			else {
				async.resolve();
			}
		} );
	}
	// __.SP.item.restrictToUser( { sList : "SideBar", id: 22, xUser: _spPageContextInfo.userId, sRole: "Edit"  } ) 
	, restrictToUser : function( args ) { // sList, id, xUser, sRole
		/* sRole: Contribute,Custom Levelname,Read,Edit */
		/* xUser: either id or email or login name osce\\jriemer */
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
		else if( __.b.email( args.xUser ) ) {
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


