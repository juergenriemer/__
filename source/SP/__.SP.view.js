// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.view; __.SP.read; __.SP.deleteFields; __.SP.add; __.SP.del; __.SP.update; __.SP.copy;
// ==/ClosureCompiler==


/**
 * Methods that deal with SharePoint list views
 * @namespace __.SP.view
 * @memberof __.SP
 */

__.SP.view = {};

/**
 * Get all views of a list.
 * @memberof __.SP.view
 * @method list
 * @instance
 * @async
 * @example
 * __.SP.view.list( {
 *     sList : "OSCE Contacts"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * lsViews | (Array) | array of view names
 * </pre>
 */
__.SP.view.list = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oViews = oList.get_views();
	ctx.load( oViews );
	__.SP.exec( ctx, oViews, function( oViews ) {
		if( oViews.sError ) {
			async.reject( oViews.sError );
		}
		else {
			var lsViews = [];
			var loView = oViews.getEnumerator();
			while( loView.moveNext() ) {
				var oView = loView.get_current();
				lsViews.push( oView.get_title() );
			}
			async.resolve( { lsViews : lsViews } );
		}
	} );
}

/**
 * Get information on a particular view.
 * @memberof __.SP.view
 * @method read
 * @instance
 * @async
 * @example
 * __.SP.view.read( {
 *       sList : "OSCE Contacts"
 *     , sView : "All items"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sView name of the view
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * kv | (Object) | key/value pair of properties
 * kv.guid | (String) | guid of the view
 * kv.lsFields | (Array) | array of fields shown in the view
 * kv.urlJSLink | (String) | url to the jsLink file
 * kv.nRows | (Number) | number of rows displayed
 * kv.bPaging | (String) | flag indicating whether the view has pagination
 * kv.sTotal | (String) | name of field for which totals are generated (NB: only one, the first field is returned ATM)
 * kv.xmlQuery | (String) | CAML Query of the view
 * </pre>
 */
__.SP.view.read = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oView = oList.get_views().getByTitle( args.sView );
	var oFields = oView.get_viewFields();
	ctx.load( oView );
	ctx.load( oFields );
	__.SP.exec( ctx, oView, function( oView ) {
		if( oView.sError ) {
			async.reject( oView.sError );
		}
		else {
			var lsFields = [];
			var oFields = oView.get_viewFields();
			for( var ix=0; ix<oFields.get_count(); ix++ ) {
				var sField = oFields.getItemAtIndex( ix );
				lsFields.push( sField );
			}
			var sTotal = null;
			if( oView.get_aggregationsStatus() == "On" ) {
				var sAggregations = oView.get_aggregations();
				var lsParts = sAggregations.match( /Name="(.+?)"/ );
				if( lsParts && lsParts[ 1 ] ) {
					sTotal = lsParts[ 1 ];
				}
			}
			var kv = {
				  guid : oView.get_id().toString()
				, lsFields : lsFields
				, urlJSLink : oView.get_jsLink()
				, nRows : oView.get_rowLimit()
				, bPaging : oView.get_paged()
				, sTotal : sTotal
				, xmlQuery : oView.get_viewQuery()
			};
			async.resolve( { kv : kv } );
		}
	} );
}

/**
 * Deletes fields displayed in a view
 * @memberof __.SP.view
 * @method deleteFields
 * @instance
 * @async
 * @example
 * __.SP.view.deleteFields( {
 *       sList : "OSCE Contacts"
 *     , sView : "All items"
 *     , lsFields : [ "Title", "ID" ]
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sView name of the view
 * @param {Array} args.lsFields array of field names to be removed from the view's display
 */
__.SP.view.deleteFields = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oView = oList.get_views().getByTitle( args.sView );
	var oFields = oView.get_viewFields();
	ctx.load( oView );
	ctx.load( oFields );
	__.SP.exec( ctx, [ oView, oFields ], function( lo ) {
		var oView = lo[ 0 ];
		var oFields = lo[ 1 ];
		if( lo.sError ) {
			async.reject( lo.sError );
		}
		else {
			for( var ix=0; ix<oFields.get_count(); ix++ ) {
				var sField = oFields.getItemAtIndex( ix );
				var b = args.lsFields.__contains( sField );
				if( b ) {
					oFields.remove( sField );
				}
			}
			oView.update();
			__.SP.exec( ctx, oView, function( o ) {
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
// __.SP.view.add( { sList:"OSCE Contacts",sView:"test_me",lsFields:["Title","Country","Company"],xmlQuery:'<OrderBy><FieldRef Name="Title" /></OrderBy><Where><Eq><FieldRef Name="FrontOffice" /><Value Type="Text">OCEEA</Value></Eq></Where>'} );
/**
 * Adds a new view to a list
 * @memberof __.SP.view
 * @instance
 * @async
 * @method add
 * @example
 * __.SP.view.deleteFields( {
 *       sList : "OSCE Contacts"
 *     , sView : "All items"
 *     , lsFields : [ "Title", "ID" ]
 *     , xmlQuery : '<OrderBy><FieldRef Name="Title" /></OrderBy><Where><Eq><FieldRef Name="Title" /><Value Type="Text">Hi Mom</Value></Eq></Where>'
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sView name of the view
 * @param {Array} args.lsFields array of field names to be displayed in the view
 * @param {String} [args.sTotal] field name for which totals should be displayed (NB: ATM only one field is supported)
 * @param {String} [args.jsLink] URL of a JSLink file to be loaded with this view.
 * @param {Boolean} [args.bPublic] flag whether the view is public or personal (default is false/personal)
 * @param {Boolean} [args.bDefaultView] flag whether the view is set to be default (default is false)
 * @param {Number} [args.nRows] number of items to be shown on one page (default is 10)
 * @param {Boolean} [args.bPaging] flag whether the view shows pagination (default is false)
 */
__.SP.view.add = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oViews = oList.get_views();
	// REF: refactor bPersonal.. its confusing
	var bPersonal = ( args.bPublic ) ? false : true;
	ctx.load( oViews );
	__.SP.exec( ctx, oViews, function( oViews ) {
		if( oViews.sError ) {
			async.reject( oViews.sError );
		}
		else {
			var oView = new SP.ViewCreationInformation();
			oView.set_title( args.sView );
			oView.set_personalView( bPersonal );
			var oQuery = new SP.CamlQuery();
			oQuery.set_viewXml( args.xmlQuery );
			oView.set_query( oQuery );
			if( args.bDefaultView ) {
				oView.set_setAsDefaultView( true );
			}
			if( args.lsFields ) {
				oView.set_viewFields( args.lsFields );
			}
			if( args.nRows ) {
				oView.set_rowLimit( args.nRows );
			}
			if( args.bPaging ) {
				oView.set_paged( true );
			}
			oViews.add( oView );
			ctx.load( oViews );
			__.SP.exec( ctx, oViews, function( oViews ) {
				if( oViews.sError ) {
					async.reject( oViews.sError );
				}
				else {
					// since we cannot add jsLink on creation (sic!) we
					// need to update after creation
					if( args.jsLink ) {
						var oView = oList.get_views().getByTitle( args.sView );
						oView.set_jsLink( args.jsLink );
						oView.update();
						ctx.load( oView );
						__.SP.exec( ctx, oView, function( oView ) {
							if( oView.sError ) {
								async.reject( oView.sError );
							}
							else {
								if( args.sTotal ) {
									var xmlAggregation = '<FieldRef Name="' + args.sTotal + '" Type="COUNT" />';
									oView.set_aggregations( xmlAggregation );
									oView.set_aggregationsStatus( "On" );
									oView.update();
									ctx.load( oView );
									__.SP.exec( ctx, oView, function( oView ) {
										if( oView.sError ) {
											async.reject( oView.sError );
										}
										else {
											async.resolve();
										}
									} );
								}
								else {
									async.resolve();
								}
							}
						} );
					}
					// otherwise we resolve
					else {
						async.resolve();
					}
				}
			} );
		}
	} );
};

/**
 * Deletes a view from a list
 * @memberof __.SP.view
 * @method del
 * @instance
 * @async
 * @todo rename to remove
 * @example
 * __.SP.view.del( {
 *       sList : "OSCE Contacts"
 *     , sView : "All Items"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sView name of the view
 */
__.SP.view.del = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oView = oList.get_views().getByTitle( args.sView );
	oView.deleteObject();
	ctx.load( oView );
	__.SP.exec( ctx, oView, function( oView ) {
		if( oView.sError ) {
			// REF: below error message is thrown eventhough all is deleted.. don't know why
			if( /^Cannot complete this action/.test( oView.sError ) ) {
				async.resolve();
			}
			else {
				async.reject( oView.sError );
			}
		}
		else {
			async.resolve();
		}
	} );
};

/**
 * Updates properties of a view
 * @memberof __.SP.view
 * @method update
 * @instance
 * @async
 * @example
 * __.SP.view.update( {
 *       sList : "OSCE Contacts"
 *     , sView : "All Items"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sView name of the view
 * @param {String} [args.xmlQuery] CAML of the view
 * @param {String} [args.jsLink] Url of a JS Link file
 * @param {Number} [args.nRows] number of items shown in one result page
 * @param {String} [args.sTotal] name of field that should be counted
 * @param {Array} [args.lsFields] array of fields that should be displayed
 */
__.SP.view.update = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oView = oList.get_views().getByTitle( args.sView );
	var oFields = oView.get_viewFields();
	if( args.xmlQuery ) {
		var oQuery = new SP.CamlQuery();
		oQuery.set_viewXml( args.xmlQuery );
		oView.set_viewQuery( oQuery );
	}
	if( args.jsLink ) {
		oView.set_jsLink( args.jsLink );
	}
	if( args.nRows ) {
		oView.set_rowLimit( args.nRows );
	}
	if( args.sTotal ) {
		var xmlAggregation = '<FieldRef Name="' + args.sTotal + '" Type="COUNT" />';
		oView.set_aggregations( xmlAggregation );
		oView.set_aggregationsStatus( "On" );
	}
	oView.update();
	ctx.load( oView );
	ctx.load( oFields );
	__.SP.exec( ctx, oView, function( oView ) {
		if( oView.sError ) {
			async.reject( oView.sError );
		}
		else {
			if( args.lsFields ) {
				var loField = oFields.getEnumerator();
				var lsRemoveFields = [];
				while( loField.moveNext() ) {
					var sField = loField.get_current();
					lsRemoveFields.push( sField );
				}
				lsRemoveFields.forEach( function( s ) {
					oFields.remove( s );
				} );
				args.lsFields.forEach( function( s ) {
					oFields.add( s );
				} );
				oView.update();
				ctx.load( oFields );
				__.SP.exec( ctx, oFields, function( oFields ) {
					if( oView.sError ) {
						async.reject( oFields.sError );
					}
					else {
						async.resolve();
					}
				} );
			}
			else {
				async.resolve();
			}
		}
	} );
}

/**
 * Copies an existing view under a new name
 * @memberof __.SP.view
 * @method copy
 * @instance
 * @async
 * @example
 * __.SP.view.update( {
 *       sList : "OSCE Contacts"
 *     , sOldView : "All Items"
 *     , sNewView : "All Items Two"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name or guid of a list
 * @param {String} args.sOldView name of the existing view
 * @param {String} args.sNewView name of the new view
 */
__.SP.view.copy = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oList = __.SP.list.get( ctx, args.sList );
	var oView = oList.get_views().getByTitle( args.sOldView );
	ctx.load( oView );
	__.SP.exec( ctx, oView, function( oView ) {
		if( oView.sError ) {
			async.reject( oView.sError );
		}
		else {
			var guid = oView.get_id().toString();
			oList.saveAsNewView( guid, args.sNewView, true, args.sNewView + ".aspx");
			var oView = oList.get_views().getByTitle( args.sNewView );
			ctx.load( oView );
			__.SP.exec( ctx, oView, function( oView ) {
				if( oView.sError ) {
					async.reject( oView );
				}
				else {
					async.resolve();
				}
			} );
		}
	} );
}

