__.SP.taxonomy = {
	  aTerms : {} // holds loaded taxonomies
	, oTermInfo : null // holds all used taxonomy terms
};

// __.SP.taxonomy.setTermInForm( { sField : "Country", sTerm : "Albania", guid : "40690fe5-fd6d-4c27-bb52-b0d60a9e7d78" } );
__.SP.taxonomy.setTermInForm = function( args ) { // sField, sTerm, guid
	var h;
	if( args.guid ) {
		var v = args.sTerm + "|" + args.guid;
		__.dn_( "#" + args.sField + "_\\$input" ).value = v;
		h = "<span class='valid-text'>" + args.sTerm + "</span>";
	}
	else {
		h  = '<span class="invalid-text" ';
		h += 'title="The term is not a valid term">' + args.sTerm + '</span>';
	}
	__.dn_( "#" + args.sField + "_\\$containereditableRegion" ).innerHTML = h;
	__.async( args ).resolve();
}


__.SP.taxonomy.getTermIds = function( args ) {
	var async = __.async( args );
	if( __.SP.taxonomy.oTermInfo ) {
		console.log( 'fresh from cache' );
		async.resolve();
		return;
	}
	console.log( "LOADDDDDDDDDDDDDDDDD" );
	async.then( __.SP.list, "read", {
		  sList : "TaxonomyHiddenList"
		, lsFields : [ "IdForTerm", "ID", "Title" ]
	}, "Read taxonomy term id list" )
	async.then( function( args ) {
		__.SP.taxonomy.oTermInfo = {};
		args.lkv.forEach( function( kv ) {
			__.SP.taxonomy.oTermInfo[ kv.ID ] = {
				  id : kv.ID
				, sName : kv.Title
				, guid : kv.IdForTerm
			};
		} );
		__.async( args ).resolve();
	}, "Extract term id data" )
	async.resolve();
}

// __.SP.taxonomy.getTerm( 1 ).sName;
__.SP.taxonomy.termInfo = function( x ) { // x can be either of the follow three: ID, GUID or TERM NAME
	// in case of index we return immediately for this is the
	// key of the term info object
	if( typeof x == "number" ) {
		return __.SP.taxonomy.oTermInfo[ x ] || null;
	}
	// now lets check if input is term name or its guid and
	// assign the proper key
	var k = ( __.SP.bGuid( x ) ) ? "guid" : "sName";
	// then iterate through the term object and look for the
	// machting entry
	for( var id in __.SP.taxonomy.oTermInfo ) {
		var aTermInfo = __.SP.taxonomy.oTermInfo[ id ];
		if( aTermInfo[ k ] === x ) {
			// and send back if found
			return aTermInfo;
		}
	}
	// otherwise we send back null
	return null;
}

// __.SP.taxonomy.load( { sTermSet : O$C3.Tax.guidTermSet.MainCategory } )
// cons it:  __.SP.taxonomy.aTerms[ O$C3.Tax.guidTermSet.MainCategory ] );
__.SP.taxonomy.load = function( args ) {
	var async = __.async( args );
	// first check if we already loaded the taxonomy
	var oTerms = __.SP.taxonomy.aTerms[ args.sTermSet ];
	if( oTerms ) {
		async.resolve( { oTerms : oTerms } );
		return;
	}
	var ctx = __.SP.ctx();
	var sTermStore = args.sTermStore || "Managed Metadata Service";
	var oTax = SP.Taxonomy.TaxonomySession.getTaxonomySession( ctx );
	var oStore = oTax.get_termStores().getByName( sTermStore );
	var oSet = oStore.getTermSet( args.sTermSet );
	var oTerms = oSet.getAllTerms();
	ctx.load( oTerms, 'Include(Parent,Id,Name)');
	__.SP.exec( ctx, oTerms, function( oTerms ) {
		if( oTerms.sError ) {
			async.reject( oTerms.sError );
		}
		else {
			var loTerms = oTerms.getEnumerator();
			var aTerms = {};
			var aGuids = {};
			var aLabels = {};
			var aChildren = {};
			var sLastTerm = "";
			while( loTerms.moveNext() ) {
				var oTerm = loTerms.get_current();
				var oParent = oTerm.get_parent();
				var sMain = oTerm.get_name();
				var sLastTerm = sMain;
				var guid = oTerm.get_id().toString();
				if( ! oParent.get_serverObjectIsNull() ) {
					idParent = oParent.get_id().toString();
					if( ! aChildren[ idParent ] ) {
						aChildren[ idParent ] = [];
					}
					aChildren[ idParent ].push( guid );
				}
				aTerms[ sMain ] = {
					  guid : guid
					, lsLabels : []
				};
				aGuids[ guid ] = sMain;
				var oLabels = oTerm.getAllLabels( 1033 );
				ctx.load( oLabels );
				__.SP.exec( ctx, oLabels, function( oLabels, sMain ) {
					var loLabels = oLabels.getEnumerator();
					var sTerm = "";
					var vLookup = {};
					while( loLabels.moveNext() ) {
						var oLabel = loLabels.get_current();
						var sLabel = oLabel.get_value();
						if( aTerms[ sLabel ] ) {
							sTerm = sLabel;
							vLookup = {
								  sTerm : sTerm
								, guid : aTerms[ sTerm ].guid
							};
							aLabels[ sLabel ] = vLookup;
							aLabels[ __.s.tokenize( sLabel ) ] = vLookup;
						}
						else {
							aTerms[ sTerm ].lsLabels.push( sLabel );
							aLabels[ sLabel ] = vLookup;
							aLabels[ __.s.tokenize( sLabel ) ] = vLookup;
						}
					}
					if( ( sLastTerm == sTerm ) ) {
						var aResult = {
							  aTerms : aTerms
							, aGuids : aGuids
							, aLabels : aLabels
							, aChildren : aChildren
						}
						console.log( "!!!!!!!!!!!!!!!! LOADED" );
						__.SP.taxonomy.aTerms[ args.sTermSet ] = aResult;
						async.resolve( { oTerms : aResult } );
					}
				} );
				// add the otherway around
			}
		}
	} );
};

// __.SP.taxonomy.children( { idTermSet : O$C3.Tax.guidTermSet.MainCategory, idParent : "13a5103e-ee20-44ce-a164-35943e9df08e" } )
__.SP.taxonomy.children = function( args ) { // idTermSet, idParent
	var oStore = __.SP.taxonomy.aTerms[ args.idTermSet ];
	var l = [];
	var add = function( id ) {
		if( id != args.idParent ) {
			l.push( id );
		}
		var lid = oStore.aChildren[ id ];
		if( lid ) {
			lid.forEach( function( id ) {
				add( id );
			} );
		}
		return l;
	}
	var lid = add( args.idParent );
	return lid;
};

__.SP.taxonomy.search = function( args ) {
};

__.SP.taxonomy.search = function( args ) {
};

