/**
 * __.SP.Filter creates a new filter panel for a list.
 * <br>By default it is rendered in the left panel next to the list view.
 * <br>The user can perform filter searches, save them as personal views
 * and control visibility of filter fields.
 * @memberof __.SP
 * @class __.SP.Filter
 * @param {Object} args a parameter object holding the following values
 * @property {String} args.sList name of list for which we want to create a filter
 * @param {Array} args.loFields list of field objects {oField} that constitute the filter
 * @property {Function}  [args.cbCreate] callback to be invoked when the filter gets created
 * @property {Function}  [args.cbClear] callback to be invoked when the user clears the filter
 * @property {String}  [args.defaultView] name of the default view
 * @property {Object}  [args.oTax] object holding term store and sets (default is __.SP.taxonomy.oStore)
 * @todo rename defaultView to sdftView;
 * @example n/a
 */
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
	, sExpoertFieldStore : ""
	, sFilter : null
	, sFilterName : "Current Filter"
	, sList : null
	, oTax : null
	, dnSideNav : null
	, mpLang : {
		  saved_filter_name_exists_overwrite : "The selected filter name exists already.<br>Do you want to overwrite the existing filter with the current one?"
		, filter_field_selection_title : "Below you can select the fields to be displayed in your filter."
		, export_field_selection_title : "Below you can select the fields to be exported to Excel."
	}
	, init : function( aConf ) {
		var that = this;
		this.sList = aConf.sList;
		this.loAllFields = aConf.loFields;
		this.loFields = this.extractFilterFields( aConf.loFields );
		this.cbCreate = aConf.cbCreate || null;
		this.cbClear = aConf.cbClear || null;
		this.oTax = aConf.oTax || __.SP.taxonomy.oStore;
		this.defaultView = aConf.defaultView || "All Items";
		// SP's OOTB default views differ in internal and display name
		this.sdftView = aConf.defaultView || "AllItems";
		this.sFilter = "_filter_" + this.sList.__tokenize() + "_";
		this.sFilterFieldStore = this.sFilter + "_filter_";
		this.sExportFieldStore = this.sFilter + "_export_";
		// check if filter has already been created
		( new __.Async( {
			  id : "__.SP.Filter.init"
			, sdftError : "Failed to initialize a list filter."
		} ) )
		.then( function( args ) {
			var h = "<div id='"+ that.sFilter +"' style='display:none' class='osce-filter'></div>";
			that.dnSideNav = __find( "#sideNavBox" );
			that.dnRoot = that.dnSideNav.__append( h );
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
			__.Async.promise( args ).resolve();
		}, "create filter" )
		.then( function( args ) {
			that.getFilterFields();
			that.show();
			__.Event.listen( that, "hashchange" );
			__.Async.promise( args ).resolve();
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
			this.loAllFields.forEach( function( aField ) {
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
			this.loAllFields.forEach( function( aField ) {
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
		var slsExportFields = localStorage.getItem( this.sExportFieldStore );
		if( slsExportFields ) {
			this.lsExportFields = slsExportFields.__toJson();
		}
		if( ! this.lsExportFields ) {
			this.lsExportFields = [];
			this.loAllFields.forEach( function( aField ) {
				if( aField.bExport ) {
					that.lsExportFields.push( aField.sName );
				}
			} );
			localStorage.setItem( this.sExportFieldStore, this.lsExportFields.__toString() );
		}
		return this.lsExportFields;
	}
	, updateExportFields : function( lsFields ) {
		var that = this;
		this.lsExportFields = lsFields;
		localStorage.setItem( this.sExportFieldStore, this.lsExportFields.__toString() );
	}
	, exportView : function( lsFields, dnModal, sView ) {
		( new __.Async( {
			  id : "__.SP.Filter.exportView"
			, sdftError : "Failed to export a view."
		} ) )
		.then( __.SP.view, "copy", {
			  sList:"OSCE Contacts"
			, sOldView: sView || ctx.viewTitle
			, sNewView : "_export_"
		}, "copy current view" )
		.clear()
		.then( function( args ) {
			var async = __.Async.promise( args );
			async.then( __.SP.view, "update", {
				  sList:"OSCE Contacts"
				, sView : "_export_"
				, lsFields : lsFields
			}, "added all fields to view" ).resolve();
		}, "update export view" )
		.then( __.SP.view, "deleteFields", {
			lsFields : [ "js", "DossierFile" ]
		}, "Remove system fields" )
		.then( __.SP.view, "read", "Read guid of export view" )
		.then( function( args ) {
			var url = ctx.HttpRoot + "/_vti_bin/owssvr.dll?CS=109&Using=_layouts/query.iqy";
			url += "&List=" + ctx.listName;
			url += "&View={" + args.kv.guid + "}";
			url += "&CacheControl=1";
			dnModal.close();
			window.open( url );
			__.Async.promise( args ).resolve();
		} )
		.start();
	}
	, onHashchange : function( oMessage ) {
		if( oMessage.sList !== this.sList ) {
			this.hide();
		}
	}
	, unlock : function() {
		__.SP.grid.unlock();
		__.lock.un( this.dnRoot );
	}
	, lock : function() {
		__.SP.grid.lock();
		__.lock.up( this.dnRoot );
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
		return ( kv.__isEmpty() ) ? null : kv;
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
		url += "/_layouts/15/start.aspx#/Lists/" + this.sList + "/";
		url += this.defaultView + ".aspx?r=" + Math.random();
		self.location.href = url;
	}
	, loadPersonalView : function( guid ) {
		var bReload = new RegExp( guid, "i" ).test( self.location.href );
		self.location.href = this.createPersonalViewUrl( guid );
		if( bReload ) {
			__.SP.grid.reload( 1000 );
		}
	}
	, form2hash : function() {
		var kv = this.read();
		var sHash = ( kv ) ? "&query=__" + kv.__toString() + "__" : "";
		return sHash;
	}
	, getForm : function() {
		return this.dnForm;
		var id = "_filter_" + ctx.ListTitle.__tokenize() + "_";
		var dnForm = document.body.__find( "#" + id );
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
			  id : "__.SP.Filter.caml2form"
			, sdftError : "Failed to convert search to filter."
		} ) )
		.then( __.SP.view, "read", {
			  sList : ctx.ListTitle
			, sView : sView
		}, "read current view" )
		// REF: extract xml query reading in method for we need parts again further down the code
		.then( function( args ) {
			var async = __.Async.promise( args )
			var xmlQuery = args.kv.xmlQuery;
			lsxml = xmlQuery.match( /<Where>.*?<\/Where>/ );
			if( lsxml && lsxml[ 0 ] ) {
				xmlQuery = lsxml[ 0 ];
				var dn = document.body.__append( xmlQuery );
				dn.__find( "FieldRef", function( dn ) {
					// get necessary attributes from field node
					var sName = dn.getAttribute( "name" );
					var sOperator = dn.parentNode.tagName;
					// create sid of field
					var sid = ( that.sFilter + sOperator + sName ).__tokenize();
					// get the corresponding field in our filter
					var dnField = dnForm.__find( "[sid='" + sid + "']" );
					// skip unknown fields (e.g. for custom queries such as cherry picks)
					if( ! dnField ) {
						return;
					}
					var sFormType = dnField.getAttribute( "sFormType" );
					if( sFormType == "taxonomy" ) {
						async.then( __.SP.taxonomy, "load", {
							  sTermSet : that.oTax.guidTermSet[ sName ]
						}, "load " + sName )
					}
				} );
			}
			async.resolve();
		}, "load taxonomies" )
		.then( __.SP.taxonomy, "getTermIds", {}, "get taxonomy term ids" )
		.then( function( args ) {
			var bTaxTerms = false;
			// REF be more defensiv here
			var xmlQuery = args.kv.xmlQuery;
			lsxml = xmlQuery.match( /<Where>.*?<\/Where>/ );
			if( lsxml && lsxml[ 0 ] ) {
				xmlQuery = lsxml[ 0 ];
				var dn = document.body.__append( xmlQuery );
				dn.__find( "FieldRef", function( dn ) {
					// get necessary attributes from field node
					var sName = dn.getAttribute( "name" );
					var sOperator = dn.parentNode.tagName;
					// create sid of field
					var sid = ( that.sFilter + sOperator + sName ).__tokenize();
					// get the corresponding field in our filter
					var dnField = dnForm.__find( "[sid='" + sid + "']" );
					// skip unknown fields (e.g. for custom queries such as cherry picks)
					if( ! dnField ) {
						return;
					}
					var sFormType = dnField.getAttribute( "sFormType" );
					// and we check its type of field (e.g. choice, taxonomy, etc. )
					// all supported types are found in __.SP.filter.form.js
					var dnMultiValues = dn.__find( "values" );
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
								var oTax = __.SP.taxonomy.aTerms[ that.oTax.guidTermSet[ sName ] ];
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
				dn.__remove();
			}
			__.Async.promise( args ).resolve();
		}, "Analyse query" )
		.start();
	}
	, form2caml : function() {
		var that = this;
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
							var idTermSet = that.oTax.guidTermSet[ oField.sName ];
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
								if( ! lid.__isEmpty() ) {
									laTaxFields.push( lid );
								}
							}
							if( ! laTaxFields.__isEmpty() ) {
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
			  id : "__.SP.Filter.compareQueries"
			, sdftError : "Failed to check if search result has been updated."
		} ) )
		.then( __.SP.taxonomy, "getTermIds", "get taxonomy term ids" )
		.clear()
		.then( __.SP.view, "read", {
			  sList : that.sList
			, sView : sView
		}, "read current view query" )
		.then( function( args ) {
			var async = __.Async.promise( args );
			var oFields = that.read();
			for( var sField in oFields ) {
				var oField = oFields[ sField ];
				if( oField.v && oField.sCAMLType == "taxonomy" ) {
					async.then( __.SP.taxonomy, "load", {
						  sTermSet : that.oTax.guidTermSet[ oField.sName ]
					}, "load " + oField.sName )
				}
			}
			async.resolve();
		}, "load taxonomies" )
		.then( function( args ) {
			var token = function( s ) {
				s = s.__tokenize();
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
			var async = __.Async.promise( args );
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
			__.Async.promise( args ).resolve();
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
		h += '<span class="menu icon-excel" action="export" title="Export this search"></span>';
		h += '<b><span class="menu icon-clear" action="clear" title="Clear the filter"></span></b>';
		h += "</div>";
		this.dnRoot.__append( h )
			.addEventListener( "click", function( e ) {
				e.preventDefault();
				e.stopPropagation();
				switch( e.target.getAttribute( "action" ) ) {
					case "gear" :
						that.openFilterFieldWindow();
					break;
					case "export" :
						that.openExportFieldWindow();
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
		this.loFields = this.loFields.__kSort( "nFilter" );
		return this.loFields;
	}
	, createView : function( sName, cbfn ) {
		var that = this;
		var xmlQuery = '<OrderBy><FieldRef Name="Title" /></OrderBy>';
		( new __.Async( {
			  id : "__.SP.Filter.createView"
			, sdftError : "Failed to create a new filter view."
		} ) )
		.then( __.SP.taxonomy, "getTermIds", "get taxonomy term ids" )
		.then( function( args ) {
			var async = __.Async.promise( args );
			var oFields = that.read();
			for( var sField in oFields ) {
				var oField = oFields[ sField ];
				if( oField.v && oField.sCAMLType == "taxonomy" ) {
					async.then( __.SP.taxonomy, "load", {
						  sTermSet : that.oTax.guidTermSet[ oField.sName ]
					}, "load " + oField.sName )
				}
			}
			async.resolve();
		}, "load taxonomies" )
		.then( function( args ) {
			xmlQuery += that.form2caml();
			__.Async.promise( args ).resolve();
		}, "construct query" )
		.clear()
		.then( __.SP.view, "list", {
			  sList : that.sList
		}, "get list of views" )
		.then( function( args ) {
			var async = __.Async.promise( args );
			var sMode = ( args.lsViews.__contains( sName ) ) ? "update" : "add";
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
			__.Async.promise( args ).resolve();
		}, "extract grouping and sorting" )
		.then( function( args ) {
			var async = __.Async.promise( args );
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
			__.Async.promise( args ).resolve();
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
			self.location.href = url;
		} );
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
				var dnValue = that.oModal.dn.__find( "[name='sName']" );
				var sName = dnValue.value.__sanitize();
				if( sName  ) {
					( new __.Async( {
						  id : "__.SP.Filter.openSaveWindow"
						, sdftError : "Failed to save a filter."
					} ) )
					.then( __.SP.view, "list", {
						  sList : that.sList
					}, "get list of views" )
					.then( function( args ) {
						var async = __.Async.promise( args );
						if( args.lsViews.__contains( sName ) ) {
							var d = __.SP.modal.confirm( {
								  sTitle : "Confirm this action"
								, sQuestion : that.mpLang.saved_filter_name_exists_overwrite
								, fnAnswer : function( b ) {
									that.oModal.close();
									if( b ) {
										that.save( sName );
									}
								}
							} );
						}
						else {
							that.oModal.close();
							that.save( sName );
						}
						async.resolve();
					}, "check if view already exists" )
					.start();
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
		h += that.mpLang.filter_field_selection_title;
		h += "</p>";
		h += "<table>";
		this.loFields.forEach( function( aField ) {
			if( aField.nFilter ) {
				var sDisabled = ( aField.sName == "FrontOffice" )
					? " disabled "
					: "";
				var sChecked = ( that.lsFilterFields.__contains( aField.sName ) )
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
	// sView is optional, default is the current list view
	// we use it for e.g. cherry picks in ConMan
	, openExportFieldWindow : function( sView ) {
		var that = this;
		// first get all filter fields
		var sChecked = " checked ";
		var h = "<p>";
		h += that.mpLang.export_field_selection_title;
		h += "</p>";
		h += "<table>";
		this.getExportFields();
		var ix = 0;
		this.loAllFields.forEach( function( aField ) {
			if( aField.bExport ) {
				ix++;
				var sChecked = ( that.lsExportFields.__contains( aField.sName ) )
					? " checked "
					: "";
				if( ix % 2 ) {
					h += "<tr>";
				}
				h += "<td><input name='" + aField.sName + "'type='checkbox' ";
				h += sChecked + "'></input></td>";
				h += "<td title='" + aField.sDescription + "'>";
				h += aField.sDisplayName + "</td>";
				if( !( ix % 2 ) ) {
					h += "</tr>";
				}
			}
		} );
		h += "</table>";
		var dnModal = __.SP.modal.open( {
			  sTitle : "Export to Excel"
			, hContent : h
			, fnact : function( oModal ) {
				dnModal.message( "" );
				var ldnFields = oModal.dn.__find( "[name]:checked" );
				if( ldnFields ) {
					var lsFields = [];
					ldnFields.__each( function( dn ) {
						lsFields.push( dn.getAttribute( "name" ) );
					} );
					that.updateExportFields( lsFields );
					that.exportView( lsFields, dnModal, sView );
				}
				else {
					dnModal.message( "Please select at least one field." );
				}
			}
		} );
	}
	, toggleFilterFields : function() {
		var that = this;
		this.dnRoot.__find( ".osce-form-field", function( dn ) {
			var sid = dn.getAttribute( "sName" );
			if( that.lsFilterFields.__contains( sid ) ) {
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
			localStorage.setItem( this.sFilterFieldStore, this.lsFilterFields.__toString() );
		}
		else {
			// otherwise use local storage
			this.lsFilterFields = slsFilterFields.__toJson();
		}
	}
	, updateFilterFields : function( oModal ) {
		var that = this;
		this.lsFilterFields = [];
		oModal.dn.__find( "[name]", function( dn ) {
			if( dn.checked ) {
				that.lsFilterFields.push( dn.getAttribute( "name" ) );
			}
		} );
		localStorage.setItem( this.sFilterFieldStore, this.lsFilterFields.__toString() );
	}
} );




__.SP.filter.form = {};
__.SP.filter.form.create = function( args ) {
	var h = "<form class='osce-form'></form>";
	var dn = args.dnRoot.__append( h );
	args.loFields.forEach( function( oField ) {
		oField.dnRoot = dn;
		oField.idFilter = args.idFilter;
		__.SP.filter.form.field[ oField.sFormType ].create( oField );
	} );
	dn.addEventListener( "change", function() {
		if( args.cbChange ) {
			args.cbChange();
		}
	} );
	var fnModal = function() {
		var dn = document.body.__find( ".ms-dlgContent" );
		if( ! dn ) {
			if( args.cbChange ) {
				args.cbChange();
			}
		}
		else {
			setTimeout( fnModal, 500 );
		}
	}
	dn.addEventListener( "click", function( e ) {
		// monitor closing of taxonomy modal
		if( e.target.classList.contains( "ms-taxonomy-browser-button" ) ) {
			setTimeout( fnModal, 500 );
		}
		// prevent manual manipulation of the taxonomy picker DIV
		if( e.target.classList.contains( "ms-inputBox" ) ) {
			//var dnRoot = e.target.__closest( ".osce-form-field" );
			//var dnImg = dnRoot.__find( "img.ms-taxonomy-browser-button" );
			//dnImg.click();
		}
	} );
	return dn;
};

__.SP.filter.form.reset = function( dn ) {
	// clear all taxonomy fields
	dn.__find( '[role="textbox"]', function( dn ) {
		dn.innerHTML = "";
	} );
	dn.__find( '.osce-v', function( dn ) {
		dn.value = "";
	} );
	// and reset the form
	dn.reset();
};

__.SP.filter.form.read = function( dn ) {
	var kv = {};
	dn.__find( ".osce-form-field", function( dn ) {
		var sid = dn.getAttribute( "sid" );
		var sFormType = dn.getAttribute( "sFormType" );
		kv[ sid ] = {
			  v : __.SP.filter.form.field[ sFormType ].get( dn )
			, sName : dn.getAttribute( "sName" )
			, sCAMLType : dn.getAttribute( "sCAMLType" )
			, sOperator : dn.getAttribute( "sOperator" ) || null
		}
	} )
	return kv;
};

__.SP.filter.form.field = {};


__.SP.filter.form.field.sid = function( x ) {
	// we need unique ids, sName might be used mulitple times,
	// e.g. from/to date fields
	var sid = "";
	if( x instanceof Element ) {
		sid += x.__find( ".osce-filter" ).id;
		sid += ( x.getAttribute( "sOperator" ) + x.getAttribute( "sName" ) ).__tokenize();
	}
	else if( x.idFilter && x.sDisplayName ) {
		sid += x.idFilter;
		sid += ( x.sOperator + x.sName ).__tokenize();
	}
	else {
		console.warn( "parameter is no filter form argument", x );
		return null;
	}
	return sid;
};

__.SP.filter.form.field.hHeader = function( args ) {
	var cssHalfSize = ( args.bHalfSize ) ? " half-size" : "";
	var h = "<div class='osce-form-field" + cssHalfSize + "' ";
	h += ( args.sOperator ) ? " sOperator='" + args.sOperator + "' " : "";
	h += " sFormType='" + args.sFormType + "'";
	h += " sCAMLType='" + args.sCAMLType + "'";
	h += " sName='" + args.sName + "'";
	h += " sid='" + __.SP.filter.form.field.sid( args ) + "'>";
	h += "<label>" + args.sDisplayName + "</label><br />";
	return h;
};

__.SP.filter.form.field.text = {
	  create : function( args ) { //  dnRoot, sid, sDisplayName ) {
		var h = __.SP.filter.form.field.hHeader( args );
		h += "<input class='osce-v'></input>";
		h += "</div>";
		args.dnRoot.__append( h );
	}
	, get : function( dn ) {
		var v = dn.__find( ".osce-v" ).value;
		return ( v ) ? v : null;
	}
	, set : function( dn, v ) {
		var v = dn.__find( ".osce-v" ).value = v;
	}
};

__.SP.filter.form.field.lookupdate = {
	  create : function( args ) { //  dnRoot, sid, sDisplayName ) {
		var sid = __.SP.filter.form.field.sid( args );
		var h = __.SP.filter.form.field.hHeader( args );
		h += "<input id='" + sid + "' class='osce-v date' maxlength='45'></input>";
		h += '<a href="#" role="button" onclick="clickDatePicker( ';
		h += "'" + sid + "'";
		h += ", '" + _spPageContextInfo.siteServerRelativeUrl;
		h += "/_layouts/15/iframe.aspx?cal=1&amp;lcid=2057&amp;langid=1033&amp;tz=00:59:59.9990041&amp;ww=0111110&amp;fdow=1&amp;fwoy=0&amp;hj=0&amp;swn=false&amp;minjday=109207&amp;maxjday=2666269&amp;date='";
		h += ', \'\', event); return false;">';
		h += '<img id="' + sid + 'DatePickerImage" src="/_layouts/15/images/calendar_25.gif?rev=23"';
		h += ' border="0" class="osce-sp-calendar" alt="Select a date from the calendar.">';
		h += '</a>';
		h += '<iframe id="' + sid + 'DatePickerFrame" src="/_layouts/15/images/blank.gif?rev=23" ';
		h += ' frameborder="0" scrolling="no" style="display:none; position:absolute; width:200px; z-index:101;" ';
		h += ' title="Select a date from the calendar."></iframe>';
		h += "</div>";
		args.dnRoot.__append( h );
	}
	, get : function( dn ) {
		var v = dn.__find( ".osce-v" ).value;
		if( v ) {
			var nDate = v.split( "/" ).reverse().join( "" );;
			return nDate;
		}
		return null;
	}
	, set : function( dn, v ) {
		if( v ) {
			var lsMatch = v.match( /(....)(..)(..)/ );
			var sDate = lsMatch[ 3 ] + "/" + lsMatch[ 2 ] + "/" + lsMatch[ 1 ];
			dn.__find( ".osce-v" ).value = sDate;
		}
	}
};


__.SP.filter.form.field.autocomplete = {
	  create : function( args ) { //  dnRoot, sid, sDisplayName ) {
		var h = __.SP.filter.form.field.hHeader( args );
		h += "<input class='osce-v'></input>";
		h += "</div>";
		var fnFetch = function( sTerm, cbfn ) {
			var xmlQuery = "<Query><Where><Contains>"
			xmlQuery += "<FieldRef Name='" + args.sLookupField + "' />";
			xmlQuery += "<Value Type='Text'>" + sTerm +"</Value>";
			xmlQuery += "</Contains></Where></Query>";
			xmlQuery += "<RowLimit>" + ( args.nLimit || 10 ) + "</RowLimit>";
			( new __.Async( {
				  id : "__.SP.filter.form.field.autocomplete.create"
				, sdftError : "Failed to create an autocomplete field"
			} ) )
			.then( __.SP.list, "read", {
				  sList : args.sLookupList
				, lsFields : [ args.sLookupField ]
				, xmlQuery : xmlQuery
			}, "read lookup list for form filter" )
			.then( function( args ) {
				if( cbfn ) {
					cbfn( args.lkv );
				}
				__.Async.promise( args ).resolve();
			} )
			.start();
		};
		var dnLookup = args.dnRoot.__append( h );
		__.autocomplete.init( {
			  dn : dnLookup.__find( "input" )
			, sField : args.sLookupField
			, fnFetch : fnFetch
			, cb : function( rec ) {
				//
			}
		} );
	}
	, get : function( dn ) {
		var v = dn.__find( ".osce-v" ).value;
		return ( v ) ? v : null;
	}
	, set : function( dn, v ) {
		var v = dn.__find( ".osce-v" ).value = v;
	}
};

// __.SP.filter.form.field.checkbox.create( { dnRoot : __.dn_( "#sideNavBox" ), sid: "qwer", sDisplayName : "a checkbox field" } )
// __.SP.filter.form.field.checkbox.value( "qwer" );
__.SP.filter.form.field.checkbox = {
	  create : function( args ) { // dnRoot, sid, sDisplayName ) {
		var h = __.SP.filter.form.field.hHeader( args );
		h += "<select class='osce-v'>";
			h += "<option value=''></option>";
			h += "<option value='Yes'>Yes</option>";
			h += "<option value='No'>No</option>";
		h += "</select>";
		h += "</div>";
		args.dnRoot.__append( h );
	}
	, get : function( dn ) {
		var v = dn.__find( ".osce-v" ).value;
		return ( v ) ? v : null;
	}
	, set : function( dn, v ) {
		var v = dn.__find( ".osce-v" ).value = v;
	}
};

// __.SP.filter.form.field.choice.create( { dnRoot : __.dn_( "#sideNavBox" ), sid: "test", sDisplayName : "a choice field", lsChoices : [ "asdf", "qwer" ] } )
// __.SP.filter.form.field.taxonomy.value( "test" );
__.SP.filter.form.field.choice = {
	  create : function( args ) { //  dnRoot, sid, sDisplayName, lsChoices ) {
		var h = __.SP.filter.form.field.hHeader( args );
		h += "<select class='osce-v'>";
		h += "<option value=''></option>";
		args.lsChoices.forEach( function( s ) {
			h += "<option value='" + s + "'>" + s + "</option>";
		} );
		h += "</select>";
		h += "</div>";
		args.dnRoot.__append( h );
	}
	, get : function( dn ) {
		var v = dn.__find( ".osce-v" ).value;
		return ( v ) ? v : null;
	}
	, set : function( dn, v ) {
		var v = dn.__find( ".osce-v" ).value = v;
	}
};

// need to load the following in masterpage: sp.Taxonomy.js, scriptforwebtaggingui.js
// __.SP.filter.form.field.taxonomy.create( { dnRoot : __.dn_( "#sideNavBox" ), sid : "MainCat", sDisplayName : "Main Contact Type", idTermSet : __.SP.taxonomy.oStore.guidTermSet.MainContactType} );
// __.SP.filter.form.field.taxonomy.value( "MainCat" );
__.SP.filter.form.field.taxonomy = {
	  create : function( args ) { // dnRoot, sid, sDisplayName, idTermSet ) {
		var sid = __.SP.filter.form.field.sid( args );
		var sidPicker = sid + "_picker";
		var sidInput = sid + "_input";
		var h = __.SP.filter.form.field.hHeader( args );
		h += '<input class="osce-v" name="' + sidInput + '" type="hidden" ';
		h += ' id="' + sidInput + '"></input>';
		h += '<div id="' + sidPicker + '" class="ms-taxonomy">';
		h += '</div>';
		h += "</div>";
		var dn = args.dnRoot.__append( h );
		var sspId = __.SP.taxonomy.oStore.guidTermStore;
		var url = _spPageContextInfo.webServerRelativeUrl;
		url += '\u002f_vti_bin\u002fTaxonomyInternalService.json';
		var dnPicker = document.body.__find( "#" + sidPicker );
		dnPicker.InputFieldId = sidInput;
		dnPicker.SspId = sspId;
		  // REF: put Tax object into __.SP.taxonomy!!!
		dnPicker.TermSetId = __.SP.taxonomy.oStore.guidTermSet[ args.sName ];
		dnPicker.AnchorId = '00000000-0000-0000-0000-000000000000';
		dnPicker.IsMulti = true;
		dnPicker.AllowFillIn = false;
		dnPicker.IsSpanTermSets = false;
		dnPicker.IsSpanTermStores = false;
		dnPicker.IsIgnoreFormatting = false;
		dnPicker.IsIncludeDeprecated = false;
		dnPicker.IsIncludeUnavailable = false;
		dnPicker.IsIncludeTermSetName = false;
		dnPicker.IsAddTerms = false;
		dnPicker.IsIncludePathData = false;
		dnPicker.IsUseCommaAsDelimiter = false;
		dnPicker.Disable = false;
		dnPicker.ExcludeKeyword = false;
		dnPicker.JavascriptOnValidation = "";
		dnPicker.DisplayPickerButton = true;
		dnPicker.Lcid = 1033;
		dnPicker.FieldName = '';
		dnPicker.FieldId = '00000000-0000-0000-0000-000000000000';
		dnPicker.WebServiceUrl = url;
		Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.resetEventsRegistered();
		Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.onLoad( sidPicker );
	}
	, get : function( dn ) {
		var lv = dn.__find( '.osce-v' ).value.trim().split( ";" );
		var kv = {};
		lv.forEach( function( s ) {
			if( s ) {
				var ls = s.split( "|" );
				kv[ ls[ 0 ] ] = ls[ 1 ];
			}
		} );
		return ( kv.__isEmpty() ) ? null : kv;
	}
	, set : function( dn, aTermInfos ) {
		var sName = aTermInfos.sName
		var guid = aTermInfos.guid;
		if( sName && guid ) {
			var dnDisplay = dn.__find( "[role='textbox']" );
			dnDisplay.innerHTML += "<span class='valid-text' title='" + sName + "'>" + sName + "</span>;&nbsp;";
			var dnHidden = dn.__find( "input" );
			var vnew = sName + "|" + guid;
			var lsvHidden = [];
			if( dnHidden.value ) {
				lsvHidden = dnHidden.value.split( ";" );
			}
			lsvHidden.push( vnew );
			dnHidden.value = lsvHidden.join( ";" );
		}
		else {
			console.warn( "warn: invalid term info", sTerm );
		}
	}
}; 






