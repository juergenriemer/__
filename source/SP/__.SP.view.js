__.SP.view = {};
// __.SP.view.list( { sList:"OSCE Contacts"} );
__.SP.view.list = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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

// __.SP.view.read( { sList : "OSCE Contacts", sView : "OSG Contacts" } );
// sends back guid, fields, url, rows, query
__.SP.view.read = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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

// __.SP.view.deleteFields( { sList : "OSCE Contacts", sView : "All contacts", lsFields : ["Company"] } );
__.SP.view.deleteFields = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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
				var b = __.l.contains( args.lsFields, sField );
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
__.SP.view.add = function( args ) { // sList, sView, xmlQuery, bPublic, jsLink, lsFields
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var oViews = oList.get_views();
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
			console.log( oView );
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

// __.SP.view.del( { sList : "OSCE Contacts", sView : "test_me" } );
__.SP.view.del = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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

// __.SP.view.update({ sList:"OSCE Contacts", sView: "b", jsLink : "~sitecollection/SiteAssets/list_view.js?v=1" } )
__.SP.view.update = function( args ) { // sList, sView, [jsLink], xmlQuery, lsfields, sTotal
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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
			async.reject( oView );
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
						async.reject( oFields );
					}
					else {
						async.resolve( oFields );
					}
				} );
			}
			else {
				async.resolve( oView );
			}
		}
	} );
}

// __.SP.view.copy({ sList:"OSCE Contacts", sOldView: "OSG Contacts", sNewView : "xxx" } );
__.SP.view.copy = function( args ) { // sList, sOldView, sNewView
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
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
					async.resolve( oView );
				}
			} );
		}
	} );
}

