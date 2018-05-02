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
			var dnRoot = e.target.__find( ".osce-form-field" );
			var dnImg = dnRoot.__find( "img.ms-taxonomy-browser-button" );
			dnImg.click();
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
		dnRoot.__append( h );
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
		dnRoot.__append( h );
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
			( new __.Async( { sLabel : "filter_form_lookup" } ) )
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
		var dnLookup = dnRoot.__append( h );
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
		dnRoot.__append( h );
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
		__.dn.append( h, args.dnRoot );
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
// __.SP.filter.form.field.taxonomy.create( { dnRoot : __.dn_( "#sideNavBox" ), sid : "MainCat", sDisplayName : "Main Contact Type", idTermSet : O$C3.Tax.guidTermSet.MainContactType} );
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
		var dn = dnRoot.__append( h );
		var sspId = O$C3.Tax.guidTermStore;
		var url = _spPageContextInfo.webServerRelativeUrl;
		url += '\u002f_vti_bin\u002fTaxonomyInternalService.json';
		var dnPicker = document.body.__find( "#" + sidPicker );
		dnPicker.InputFieldId = sidInput;
		dnPicker.SspId = sspId;
		  // REF: put Tax object into __.SP.taxonomy!!!
		dnPicker.TermSetId = O$C3.Tax.guidTermSet[ args.sName ];
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





