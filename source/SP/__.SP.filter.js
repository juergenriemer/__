__.SP.filter = {};
__.SP.Filter = __.Class.extend( {
	  dnRoot : null
	, dnForm : null
	, guidFilter : null
	, sList : null
	, cbCreate : null
	, cbDataEntered : null
	, cbClear : null
	, lsFilterFields : null
	, sFilterFieldStore : ""
	, sFilter : null
	, sFilterName : "Current Filter"
	, init : function( aConf ) {
		var that = this;
		this.sList = aConf.sList;
		this.loFields = this.extractFilterFields( aConf.loFields );
		this.cbCreate = aConf.cbCreate || null;
		this.cbClear = aConf.cbClear || null;
		this.defaultView = aConf.defaultView || "All Items";
		// SP's OOTB default views differ in internal and display name
		this.sdftView = aConf.defaultView || "AllItems";
		this.sFilter = "_filter_" + __.s.tokenize( this.sList ) + "_";
		this.sFilterFieldStore = this.sFilter + "_fields_";
		// check if filter has already been created
		( new __.Async( {
			  sLabel : "Create a filter for search or saving"
			, sFile : "__.SP.filter.js"
		} ) )
		//.debug()
		.wait( 25, function() {
			return __.dn_( "#sideNavBox" );
		}, "wait for side nav box" )
		.then( function( args ) {
			var h = "<div id='"+ that.sFilter +"' style='display:none' class='osce-filter'></div>";
			that.dnRoot = __.dn.add( h, __.dn_( "#sideNavBox" ) );
			that.createButtons();
			that.dnForm = __.SP.filter.form.create( {
				  dnRoot : that.dnRoot
				, idFilter : that.sFilter
				, loFields : that.getFields()
				// , cbChange : function() { that.toggleButtons() }
			} );
			if( that.cbCreate ) {
				that.cbCreate( that.dnRoot );
			}
			__.async( args ).resolve();
		}, "create filter" )
		.then( function( args ) {
			that.getFilterFields();
			that.show();
			__.Event.listen( that, "hashchange" );
			__.async( args ).resolve();
		}, "show and subscribe to broadcaster" )
		.start();
	}
	, extractFilterFields : function( loFields ) {
		var loFilterFields = [];
		loFields.forEach( function( oField ) {
			if( oField.nFilter ) {
				loFilterFields.push( oField );
			}
		} );
		return loFilterFields;
	}
	, lsFormFields : null
	, getFormFields : function() {
		var that = this;
		if( ! this.lsFormFields ) {
			this.lsFormFields = [];
			this.loFields.forEach( function( aField ) {
				if( ! aField.bHiddenInForm ) {
					that.lsFormFields.push( aField.sName );
				}
			} );
		}
		return this.lsFormFields;
	}
	, lsListFields : null
	, getListFields : function() {
		var that = this;
		if( ! this.lsListFields ) {
			this.lsListFields = [];
			this.loFields.forEach( function( aField ) {
				if( ! aField.bHiddenInList ) {
					that.lsListFields.push( aField.sName );
				}
			} );
		}
		return this.lsListFields;
	}
	, lsExportFields : null
	, getExportFields : function() {
		var that = this;
		if( ! this.lsExportFields ) {
			this.lsExportFields = [];
			this.loFields.forEach( function( aField ) {
				if( aField.bExport ) {
					that.lsExportFields.push( aField.sName );
				}
			} );
		}
		return this.lsExportFields;
	}
	, onHashchange : function( oMessage ) {
		if( oMessage.sList !== this.sList ) {
			this.hide();
		}
	}
	, unlock : function() {
		__.SP.grid.unlock();
		this.dnRoot.style.background = "#fff";
	}
	, lock : function() {
		__.SP.grid.lock();
		this.dnRoot.style.background = "#efefef";
	}
	, hide : function() {
		this.dnRoot.style.display = "none";
	}
	, show : function() {
		this.dnRoot.style.display = "block";
		this.update();
	}
	, read : function() {
		var kv = __.SP.filter.form.read( this.getForm() );
		for( var k in kv ) {
			if( ! kv[ k ] ) {
				delete kv[ k ];
			}
		}
		return ( __.o.empty( kv ) ) ? null : kv;
	}
	, bFilterView : function() {
		if( ! this.guidFilter ) {
			return false;
		}
		var rx = new RegExp( this.guidFilter );
		return rx.test( self.location.href );
	}
	, bDataEntered : function() {
		var oData = this.read();
		if( this.cbDataEntered ) {
			oData = this.cbDataEntered( oData );
		}
		return !! ( oData );
	}
	, createPersonalViewUrl : function( guid ) {
		var url = _spPageContextInfo.webServerRelativeUrl;
		url += "/_layouts/15/start.aspx#/Lists/" + this.sList + "/";
		url += "PersonalViews.aspx?PageView=Personal&ShowWebPart=";
		url += "{" + guid + "}";
		return url;
	}
	, loadDefaultView : function() {
		var url = _spPageContextInfo.webServerRelativeUrl;
		url += "/_layouts/15/start.aspx#/Lists/" + ctx.ListTitle +"/";
		url += this.sdftView +".aspx?r=" + Math.random();
		self.location.href = url;
	}
	, loadPersonalView : function( guid ) {
		self.location.href = this.createPersonalViewUrl( guid );
		__.SP.grid.reload();
	}
	, form2hash : function() {
		var kv = this.read();
		var sHash = ( kv ) ? "&query=__" + __.o.s( kv ) + "__" : "";
		return sHash;
	}
	, getForm : function() {
		return this.dnForm;
		var id = "_filter_" + __.s.tokenize( ctx.ListTitle ) + "_";
		var dnForm = __.dn_( "#" + id );
		if( dnForm ) {
			return dnForm;
		}
		return null;
	}
	, update : function() {
		__.SP.filter.form.reset( this.dnForm );
		this.unlock();
		this.caml2form();
		this.toggleFilterFields();
	}
	, caml2form : function() {
		var dnForm = this.getForm();
		var that = this;
		if( ! dnForm ) { return }
		var sView = ctx.viewTitle;
		var sList = ctx.ListTitle;
		( new __.Async( {
			  sLabel : "Update form with query"
			, sFile : "__.SP.filter.js"
		} ) )
		//.debug()
		.then( __.SP.view, "read", {
			  sList : ctx.ListTitle
			, sView : sView
		}, "read current view" )
		.then( __.SP.taxonomy, "getTermIds", {}, "get taxonomy term ids" )
		.then( function( args ) {
			var bTaxTerms = false;
			// REF be more defensiv here
			var xmlQuery = args.kv.xmlQuery;
			lsxml = xmlQuery.match( /<Where>.*?<\/Where>/ );
			if( lsxml && lsxml[ 0 ] ) {
				xmlQuery = lsxml[ 0 ];
				var dn = __.dn.add( xmlQuery );
				__.dn_( "FieldRef", dn, function( dn ) {
					// get necessary attributes from field node
					var sName = dn.getAttribute( "name" );
					var sOperator = dn.parentNode.tagName;
					// create sid of field
					var sid = __.s.tokenize( that.sFilter + sOperator + sName );
					// get the corresponding field in our filter
					var dnField = __.dn_( "[sid='" + sid + "']", dnForm );
					// skip unknown fields (e.g. for custom queries such as cherry picks)
					if( ! dnField ) {
						return;
					}
					var sFormType = dnField.getAttribute( "sFormType" );
					// and we check its type of field (e.g. choice, taxonomy, etc. )
					// all supported types are found in __.SP.filter.form.js
					var dnMultiValues = __.dn_( "values", dn );
					if( dnMultiValues ) {
						dn = dnMultiValues;
					}
					// get the last entry for we only have multiple values in case of
					// taxonomies and there we put the parent term at the end.
					if( dn && dn.lastChild && dn.lastChild.textContent ) {
						var v = dn.lastChild.textContent;
						// get the name of the term if it had not been assigned yet, hence
						// its ID was set to -1 see other comment in __.SP.caml.js
						var sTermNotAssignedYet = dn.lastChild.getAttribute( "stermnotassignedyet" );
						if( sFormType == "taxonomy" ) {
							bTaxTerms = true;
							// check if we deal with the name of the tag
							// this happens if we ddidn't had the term id when querying
							if( sTermNotAssignedYet ) {
								sTermNotAssignedYet = unescape( sTermNotAssignedYet );
								var oTax = __.SP.taxonomy.aTerms[ O$C3.Tax.guidTermSet[ sName ] ];
								var aTermsLookup = oTax.aTerms;
								var guidTerm = aTermsLookup[ sTermNotAssignedYet ].guid;
								v = {
									  guid : guidTerm
									, sName : sTermNotAssignedYet
								}
							}
							else {
								v = __.SP.taxonomy.termInfo( parseInt( v ) );
							}
						}
						if( sFormType == "checkbox" ) {
							if( v !== "" ) {
								v = ( v == 1 ) ? "Yes" : "No";
							}
						}
						if( v ) {
							__.SP.filter.form.field[ sFormType ].set( dnField, v );
						}
					}
				} );
				// in case we deal with tax terms we need to check if
				// the query changed in the meanwhile.
				if( bTaxTerms ) {
					that.compareQueries();
				}
				__.dn.del( dn );
			}
			__.async( args ).resolve();
		}, "Analyse query" )
		.start();
	}
	, form2caml : function() {
		var oFields = this.read();
		var lvCAML = [];
		if( oFields ) {
			var idFilter = this.getForm().id;
			for( var sid in oFields ) {
				var oField = oFields[ sid ];
				var v = oField.v;
				if( v ) {
					switch( oField.sCAMLType ) { // boolean, taxonomy, text, lookup, choice
						case "text" :
						case "date" : // REF check date on own property
						case "choice" :
						case "lookup" :
							lvCAML.push( {
								  sName : oField.sName
								, sType : oField.sCAMLType
								, sOperator : oField.sOperator
								, v : v
							} );
						break;
						case "boolean" :
							v = ( v == "Yes" ) ? 1 : 0;
							lvCAML.push( {
								  sName : oField.sName
								, sType : oField.sCAMLType
								, sOperator : oField.sOperator
								, v : v
							} );
						break;
						case "taxonomy" :
							laTaxFields = [];
							var idTermSet = O$C3.Tax.guidTermSet[ oField.sName ];
							for( var sName in v ) {
								// first get guids of children terms
								var guid = v[ sName ];
								var lguid = __.SP.taxonomy.children( {
									  idParent : guid
									, idTermSet : idTermSet
								} );
								// then lookup those term's IDs
								var lid = [];
								lguid.forEach( function( guid ) {
									var aTermInfo = __.SP.taxonomy.termInfo( guid );
									if( aTermInfo ) {
										lid.push( {
											  id : aTermInfo.id
											, sName : aTermInfo.sName
										} );
									}
								} );
								// also search add the parent term, if it does not
								// exist we set to -1 otherwise the id list might be
								// completely empty resulting in no restrictions
								var aTermInfo = __.SP.taxonomy.termInfo( guid );
								var idParent = ( aTermInfo ) ? aTermInfo.id : -1;
								lid.push( {
									  id : idParent
									, sName : sName
								} );
								if( ! __.l.empty( lid ) ) {
									laTaxFields.push( lid );
								}
							}
							if( ! __.l.empty( laTaxFields ) ) {
								lvCAML.push( {
									  sType : "taxonomy"
									, sName : oField.sName
									, v : laTaxFields
								} );
							}
						break;
					}
				}
			}
			var lxml = __.SP.caml.createFields( lvCAML );
			var xmlQuery = __.SP.caml.whereClause( lxml );
			return xmlQuery;
		}
	}
	, bCompared : null
	, compareQueries : function() {
		var that = this;
		if( this.bCompared ) {
			this.bCompared = null;
			return;
		}
		var sView = ctx.viewTitle;
		// no comparing in current filter
		if( sView == this.sFilterName ) {
			return;
		}
		// no comparing for default views
		if( ! /PersonalViews\.aspx/.test( self.location.hash ) ) {
			return;
		}
		( new __.Async( {
			  sLabel : "compare loaded queries"
			, sFile : "__.SP.filter.js"
		} ) )
		//.debug()
		.then( __.SP.taxonomy, "getTermIds", "get taxonomy term ids" )
		.clear()
		.then( __.SP.view, "read", {
			  sList : that.sList
			, sView : sView
		}, "read current view query" )
		.then( function( args ) {
			var async = __.async( args );
			var oFields = that.read();
			for( var sField in oFields ) {
				var oField = oFields[ sField ];
				if( oField.v && oField.sCAMLType == "taxonomy" ) {
					async.then( __.SP.taxonomy, "load", {
						  sTermSet : O$C3.Tax.guidTermSet[ oField.sName ]
					}, "load " + oField.sName )
				}
			}
			async.resolve();
		}, "load taxonomies" )
		.then( function( args ) {
			var token = function( s ) {
				s = __.s.tokenize( s );
				var sValues = s.replace( /<(?:.|\n)*?>/gm, "|" );
				if( sValues ) {
					var lsValues = sValues.split( "|" );
					if( lsValues && lsValues.length > 0 ) {
						lsValues.sort();
						return lsValues.join( "|" );
					}
				}
				return null;
			};
			var async = __.async( args );
			var newQuery = that.form2caml();
			var ls = args.kv.xmlQuery.match( /<Where>.*<\/Where>/ )
			var oldQuery = ls[ 0 ];
			if( token( newQuery ) != token( oldQuery ) ) {
				async.then( __.SP.view, "update", {
					  sList : that.sList
					, sView : sView
					, xmlQuery : newQuery
				}, "update view" )
				.then( function( args ) {
					that.bCompared = true;
					__.SP.grid.reload();
				}, "reload view" )
			}
			else {
				// query up to date
			}
			async.resolve();
		}, "compare queries" )
		.then( function( args ) {
			__.async( args ).resolve();
		}, "done" )
		.start();
	}
	, createButtons : function() {
		var that = this;
		var h = "";
		h += "<div id='osce-filter-buttons'>";
		h += '<span class="menu icon-gear" action="gear" title="Manage filter fields"></span>';
		h += '<span class="menu icon-search" action="search" title="Search with this filter"></span>';
		h += '<span class="menu icon-save" action="save" title="Save this search"></span>';
		h += '<b><span class="menu icon-clear" action="clear" title="Clear the filter"></span></b>';
		h += "</div>";
		__.dn.add( h, this.dnRoot )
			.addEventListener( "click", function( e ) {
				e.preventDefault();
				e.stopPropagation();
				switch( e.target.getAttribute( "action" ) ) {
					case "gear" :
						that.openFilterFieldWindow();
					break;
					case "search" :
						that.filter();
					break;
					case "clear" :
						__.SP.filter.form.reset( that.dnForm );
						if( that.cbClear ) {
							that.cbClear();
						}
						that.loadDefaultView();
					break;
					case "save" :
						that.openSaveWindow();
					break;
				}
			} );
	}
	, getFields : function() {
		this.loFields.forEach( function( oField ) {
			if( ! oField.sOperator ) {
				oField.sOperator = ( oField.sCAMLType == "taxonomy" ) ? "In" : "Eq";
			}
		} );
		this.loFields = __.l.kSort( this.loFields, "nFilter" );
		return this.loFields;
	}
	, createView : function( sName, cbfn ) {
		var that = this;
		var xmlQuery = '<OrderBy><FieldRef Name="Title" /></OrderBy>';
		( new __.Async( {
			  sLabel : "create a view"
			, sFile : "__.SP.filter.js"
		} ) )
		//.debug()
		.then( __.SP.taxonomy, "getTermIds", "get taxonomy term ids" )
		.then( function( args ) {
			var async = __.async( args );
			var oFields = that.read();
			for( var sField in oFields ) {
				var oField = oFields[ sField ];
				if( oField.v && oField.sCAMLType == "taxonomy" ) {
					async.then( __.SP.taxonomy, "load", {
						  sTermSet : O$C3.Tax.guidTermSet[ oField.sName ]
					}, "load " + oField.sName )
				}
			}
			async.resolve();
		}, "load taxonomies" )
		.then( function( args ) {
			xmlQuery += that.form2caml();
			__.async( args ).resolve();
		}, "construct query" )
		.clear()
		.then( __.SP.view, "list", {
			  sList : that.sList
		}, "get list of views" )
		.then( function( args ) {
			var async = __.async( args );
			var sMode = ( __.l.contains( args.lsViews, sName ) ) ? "update" : "add";
			async.resolve( { sMode : sMode } );
		}, "decide wether to create or update" )
		.then( __.SP.view, "read", {
			  sList : that.sList
			, sView : ctx.viewTitle
		}, "read current view" )
		.then( function( args ) {
			var xml = args.kv.xmlQuery;
			var xmlGroup = "";
			var xmlSort = "";
			var lsParts = xml.match( /(<GroupBy.*?<\/GroupBy>)/ );
			if( lsParts && lsParts.length ) {
				xmlGroup = lsParts[ 1 ];
			}
			var lsParts = xml.match( /(<SortBy.*?<\/SortBy>)/ );
			if( lsParts && lsParts.length ) {
				xmlSort = lsParts[ 1 ];
			}
			xmlQuery = xmlQuery + xmlGroup + xmlSort;
			__.async( args ).resolve();
		}, "extract grouping and sorting" )
		.then( function( args ) {
			var async = __.async( args );
			switch( args.sMode ) {
				case "add" :
					async.then( __.SP.view, "add", {
						  sList : that.sList
						, sView : sName
						, xmlQuery : xmlQuery
						, nRows : args.kv.nRows
						, bPaging : args.kv.bPaging
						, sTotal : args.kv.sTotal
						, lsFields : args.kv.lsFields
						, bPublic : false
					}, "add personal view" )
				break;
				case "update" :
					async.then( __.SP.view, "update", {
						  sList : that.sList
						, sView : sName
						, xmlQuery : xmlQuery
						, nRows : args.kv.nRows
						, bPaging : args.kv.bPaging
						, sTotal : args.kv.sTotal
						, lsFields : args.kv.lsFields
						, bPublic : false
					}, "update personal view" )
				break;
			}
			async.resolve();
		}, "add or update view" )
		.then( __.SP.view, "read", "read view for guid" )
		.then( function( args ) {
			cbfn( args.kv.guid );
			__.async( args ).resolve();
		}, "invoke callback" )
		.start();
	}
	, filter : function() {
		var that = this;
		var sView = that.sFilterName;
		this.lock();
		this.createView( sView, function( guid ) {
			that.guidFilter = guid;
			that.loadPersonalView( guid );
		} );
	}
	// CALLBACK for sidebar?
	, save : function( sView ) {
		var that = this;
		this.createView( sView, function( guid ) {
			var url = that.createPersonalViewUrl( guid );
			( new __.Async( {
				  sLabel : "Save a filter search"
				, sFile : "__.SP.filter.js:496"
				, fnstat: function( a ){
					if( a.sMsg && that.oModal ) {
						that.oModal.progress( a.sMsg );
					}
				}
			} ) )
			.then( __.SP.list, "read", {
				  sList : "SideBar"
				, lsFields : [ "ID", "Title" ]
				, xmlQuery : "<Query><Where><Eq><FieldRef Name='sAction' /><Value Type='Text'>#saved_filters</Value></Eq></Where></Query>"
			}, "read filter box id from sidebar" )
			.then( function( args ) {
				if( args.lkv && args.lkv[ 0 ] ) {
					var idParent = args.lkv[ 0 ].ID;
					var sParent = args.lkv[ 0 ].Title;
					delete args.lkv;
					var xmlcur = "<Query><Where><And>";
					xmlcur += "<Eq><FieldRef Name='Title' /><Value Type='Text'>" + sView + "</Value></Eq>";
					xmlcur += "<Eq><FieldRef Name='sParent' /><Value Type='Text'>" + sParent + "</Value></Eq>";
					xmlcur += "</And></Where></Query>"
					__.async( args ).resolve( {
						  idParent : idParent
						, sParent : sParent
						, xmlQuery : xmlcur
					} );
				}
				else {
					__.async( args ).reject( { sError: "no box for links" } );
				}
			}, "construct query to search for duplicate"  )
			.then( __.SP.list, "read", {
				  sList : "SideBar"
				, lsFields : [ "ID" ]
			}, "query sidebar for duplicates" )
			.then( function( args ) {
				var async = __.async( args );
				if( __.l.empty( args.lkv ) ) {
					async.then( __.SP.item, "create", {
						  sList : "SideBar"
						, kv : {
							  Title : sView
							, sParent : args.idParent
							, sAction : url
							, bShown : 1
							, nOrder : 1
						}
					}, "create new entry" )
					.then( function( args ) {
						var async = __.async( args );
						async.then( __.SP.item, "restrictToUser", {
							  sList : "SideBar"
							, id : args.idItem
							, xUser: _spPageContextInfo.userId
							, sRole: "Edit"
						}, "set permissions" ).resolve();
					} )
					.then( function() {
						var h = '';
						h += '<li>';
						h += '<a href="' + url + '">' + sView + '</a>';
						h += '</li>';
						// get proper box
						__.dn_( "#osce-sidebar h2", function( dn ) {
							if( dn.textContent == "Saved Filters" ) {
								var dnBox = dn.nextElementSibling;
								__.dn.add( h, dnBox );
							}
						} );
						__.async( args ).resolve();
					}, "manually add to sidebar" );
				}
				else {
					var id = args.lkv[ 0 ].ID;
					async.then( __.SP.item, "update", {
						  sList : "SideBar"
						, id : id
						, kv : {
							  Title : sView
							, sAction : url
						}
					}, "update existing sidebar entry" )
				}
				async.resolve();
			}, "create or update sidebar" )
			.then( function( args ) {
				that.oModal.close();
				__.async( args ).resolve();
			}, "Filter successfully saved" )
			.start();
		} );
	}
	, bDuplicateFilterName : function( sName ) {
		// iterate sidebar titles for "Saved Filters"
		var b = false;
		__.dn_( "h2", __.dn_( "#osce-sidebar" ), function( dnTitle ) {
			if( dnTitle.textContent == "Saved Filters" ) {
				// iterate all saved links
				var dnBox = __._dn( "div.osce-left-bar", dnTitle )
				__.dn_( "a", dnBox, function( dnLink ) {
					if( dnLink.textContent.trim() == sName ) {
						b = true;
					}
				} );
			}
		} );
		return b;
	}
	, openSaveWindow : function() {
		var that = this;
		var h = "<p>";
		h += "You can save the current search as list view. This enables you export the entire search";
		h += " result to Excel.</p>";
		h += "<p>Please enter a name for this new view:</p>";
		h += "<p>";
		h += "<input maxlength='50' type='text' name='sName' style='width:300px;font-size:1.3em;'/>";
		h += "<br><em class='maxlength' style='float:left'>(max. 50 characters)</em>";
		h += "<br></p>";
		this.oModal = __.SP.modal.open( {
			  sTitle : "Save Search as View"
			, hContent : h
			, fnok : function() {
				alert( "OK" );
			}
			, fnerr : function() {
				alert( "err" );
			}
			, fnact : function() {
				that.oModal.message( "" );
				var dnValue = __.dn_( "[name='sName']", that.oModal.dn );
				var sName = __.s.sanitize( dnValue.value );
				if( sName  ) {
					if( that.bDuplicateFilterName( sName ) ) {
						var d = __.SP.modal.confirm( {
							  sTitle : "Confirm this action"
							, sQuestion : O$C3.Lang.saved_filter_name_exists_overwrite
							, fnAnswer : function( b ) {
								if( b ) {
									that.save( sName );
								}
								else {
									that.oModal.close();
									that.openSaveWindow();
								}
							}
						} );
					}
					else {
						that.save( sName );
					}
				}
				else {
					// REF: do we overwrite the loading gif here? i.e. after entering name no loading gif?
					that.oModal.message( "Please enter a name" );
				}
			}
		} );
	}
	, openFilterFieldWindow : function() {
		var that = this;
		// first get all filter fields
		var sChecked = " checked ";
		var h = "<p>";
		h += O$C3.Lang.filter_field_selection_title;
		h += "</p>";
		h += "<table>";
		this.loFields.forEach( function( aField ) {
			if( aField.nFilter ) {
				var sDisabled = ( aField.sName == "FrontOffice" )
					? " disabled "
					: "";
				var sChecked = ( __.l.contains( that.lsFilterFields, aField.sName ) )
					? " checked "
					: "";
				h += "<tr>";
				h += "<td><input name='" + aField.sName + "'type='checkbox' ";
				h += sChecked + sDisabled + "'></input></td>";
				h += "<td title='" + aField.sDescription + "'>";
				h += aField.sDisplayName + " (" + aField.sFO + ")</td>";
				h += "</tr>";
			}
		} );
		h += "</table>";
		var dnModal = __.SP.modal.open( {
			  sTitle : "Manage filter fields"
			, hContent : h
			, fnact : function( oModal ) {
				that.updateFilterFields( oModal );
				dnModal.close();
				that.update();
			}
		} );
	}
	, toggleFilterFields : function() {
		var that = this;
		__.dn_( ".osce-form-field", this.dnRoot, function( dn ) {
			var sid = dn.getAttribute( "sName" );
			if( __.l.contains( that.lsFilterFields, sid ) ) {
				dn.classList.remove( "hide" );
			}
			else {
				dn.classList.add( "hide" );
			}
		} );
	}
	, getFilterFields : function() {
		var that = this;
		var slsFilterFields = localStorage.getItem( this.sFilterFieldStore );
		if( ! slsFilterFields ) {
			// load default values
			this.lsFilterFields = [];
			this.loFields.forEach( function( oField ) {
				that.lsFilterFields.push( oField.sName );
			} );
			localStorage.setItem( this.sFilterFieldStore, __.o.s( this.lsFilterFields ) );
		}
		else {
			// otherwise use local storage
			this.lsFilterFields = __.s.o( slsFilterFields );
		}
	}
	, updateFilterFields : function( oModal ) {
		var that = this;
		this.lsFilterFields = [];
		__.dn_( "[name]", oModal.dn, function( dn ) {
			if( dn.checked ) {
				that.lsFilterFields.push( dn.getAttribute( "name" ) );
			}
		} );
		localStorage.setItem( this.sFilterFieldStore, __.o.s( this.lsFilterFields ) );
	}
} );



