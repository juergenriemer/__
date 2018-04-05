if( typeof( __ ) == "undefined" ) {
	__ = {};
}

__.autocomplete = {
	/* {
		dn : DOM node of input field
		sField : field to use to update input field on select
		hTemplate : Mustache template
		fnFetch : function to fetch data will be called with sTerm and cbfn parameters
		cb : callback on selection
	} */
	  init : function( a ) {
		if( a.dn.tagName !== "INPUT" ) {
			console.warn( "autocomplete missing input field" );
			return;
		}
		if( ! a.hTemplate ) {
		//	console.warn( "autocomplete missing template" );
		//	return;
		}
		if( ! a.fnFetch ) {
			console.warn( "autocomplete missing function to fetch data" );
			return;
		}
		if( a.dn.ix ) {
			// we already attached autocomplete
			return;
		}
		if( ! a.hTemplate ) {
// test this.. class names are not -ac do we need class here at all?
			var h = '<div class="line">';
			h += '<div class="title">{{' + a.sField + '}}</div>';
			h += '</div>';
			a.hTemplate = h;
		}
		a.lsInactive = a.lsInactive || [];
		// first we flag the input field with a classname used to get
		// all active autocompletes e.g. for when the browser resizes
		a.dn.classList.add( "-ac" );
		// add "autocomplete" off for certain field names are
		// automatically added autocomplete (e.g. chrome + "author")
		a.dn.autocomplete = "off";
		// create and assign HTML fragment to DOM node
		a.dnList = __.dn.add_( this.hCreate(), a.dn );
		//xxx a.dnList = __.dn.frag( this.hCreate() );
		//xxx __.dn.insertAfter( a.dnList, a.dn );
		// apply events
		this.events( a );
	}
	, msDelay : 500
	, style : function( a ) {
	}
	, fetch : function( a, sTerm ) {
		var that = this;
		if( a.dnList.hdDelay ) {
			clearTimeout( a.dnList.hdDelay );
		}
		a.dnList.hdDelay = setTimeout( function() {
			a.dn.classList.add( "-ac-loading" );
			//xxx __.dn.addClass( a.dn, "-ac-loading" );
			a.fnFetch( sTerm, function( oResult ) {
				if( a.dn.classList.contains( "-ac-active" ) ) {
					that.render( a, oResult );
				}
			} );
		}, that.msDelay );
	}
	, events : function( a ) {
		var that = this;
		a.dn.ix = 0;
		a.dnList.addEventListener( "click", function( e ) {
			__.e.stop( e );
			var dn = e.target;
			if( ! dn.classList.contains( "-ac-row" ) ) {
				//dn = __.dn.up( dn, "className", "-ac-row" );
				dn = __._dn( ".-ac-row", dn );
			}
			var ixRow = __.dn.ix( dn ) + 1;
			that.highlight( a, ixRow );
			that.select( a );
		} );
		a.dn.addEventListener( "keydown", function( e ) {
			if( e.keyCode == "13" ) {
				__.e.stop( e );
				that.select( a );
			}
		} );
		a.dn.addEventListener( "keyup", function( e ) {
			var dn = e.target;
			if( e.keyCode == "38" ) {
				that.highlight( a, Number( a.dn.ix ) - 1 );
			}
			else if( e.keyCode == "40" ) {
				that.highlight( a, Number( a.dn.ix ) + 1 );
			}
			else if( e.keyCode == "27" ) {
				that.close( a, false );
			}
			else {
				// fetch terms from service
				var sTerm = dn.value;
				that.fetch( a, sTerm );
			}
		} );
		a.dn.addEventListener( "blur", function( e ) {
			__.e.stop( e );
			// close if input field loses focus
			// we need to delay this action after a possible
			// click event had been processed
			setTimeout( function() {
				that.close( a, false );
			}, 250 );
		} );
		a.dn.addEventListener( "focus", function( e ) {
			var dn = e.target;
			// we have focus on the node, i.e we can activate
			// the autocomplete
			a.dn.classList.add( "-ac-active" );
			// if the input field gets focus check if we 
			// should perform a query without typing first
			if( a.bInitLoad ) {
				// fetch term, avoiding hint text being used
				var sTerm = ( dn.classList.contains( '-fh-hinted' ) )
					? "" : dn.value;	
				// fetch terms from service
				that.fetch( a, sTerm );
			}
		} );
	}
	, highlight : function( a, ix ) {
console.log( ix );
		a.dn.ix = __.n.within( ix, [ 0, a.c ] );
		var ldnLines = __.dn_( ".-ac-highlight", a.dnList );
		__.each( ldnLines, function( dn ) {
			dn.classList.remove( "-ac-highlight" );
		} );
		if( ldnLines && a.dn.ix > 0 ) {
			var scur = ".-ac-row:nth-child(" + a.dn.ix + ")"; 
			var dncurLine = __.dn_( scur, a.dnList );
			dncurLine.classList.add( "-ac-highlight" );
		}
	}
	, select : function( a ) {
		// default value is blank
		var v = "";
		// if a field name is set...
		if( a.sField ) {
			// first get the index
		    	var ix = a.dn.ix - 1;
			// let check if we have a data object
			if( a.dn.oResult &&
			    a.dn.oResult.length && 
			    a.dn.oResult[ ix ] ) {
				// get selected data object
				var rec = a.dn.oResult[ ix ];
				// ... we update the input field value with it
				v = ( rec ) ? rec[ a.sField ] : "";
			}
		}
		// set value in input field
		if( ! a.bClearOnSelect ) {
			// if not clear on select
			a.dn.value = v;
		}
		else {
			// otherwise blank
			a.dn.value = "";
		}
		// if a callback is set...
		if( typeof a.cb == "function" ) {
			// we invoke it with the entire record object
			a.cb( rec );
		}
		// finally we hide the list
		this.close( a, true );
	}
	, close : function( a, bSelected ) {
//return;
		// remove active class, which also prevents ajax responses
		// still hanging to open it again
		a.dn.classList.remove( "-ac-active" );
		// hide loader
		a.dn.classList.remove( "-ac-loading" );
		// first check if list is already empty
		if( a.dnList.innerHTML == "" ) {
			// in which case it had already been closed
			// we simply return
			return;
		}
		// hide the list
		__.dn.hide( a.dnList );
		// empty it
		a.dnList.innerHTML = "";
		// and reset the highlight index
		a.dn.ix = 0;
		if( ! bSelected ) {
			// blank input field if not just selected
			a.dn.value = "";
		}
		// re-activate hint if set
		if( a.dn.hasAttribute( "ls-hint" ) ) {
			__.formhint.blur( a.dn );
			a.dn.blur();
		}
	}
	, render : function( a, oResult ) {
		// first remove the loading animation
		a.dn.classList.remove( "-ac-loading" );
		// we got some results
		if( oResult && oResult.length ) {
			// set number of results needed for navigation
			a.c = oResult.length;
			// attach the result object to input field for
			// later extraction of selected field
			a.dn.oResult = oResult;
		}
		var h = "{{#lrecs}}" + a.hTemplate + "{{/lrecs}}";
		var aData = {
			  lrecs : oResult
		};
		// construct content with mustache within a wrapper node
		// that is absolute positioned for flyout effect
		var hContent = "<div style='position:absolute' class='-ac-content'>";
		hContent +=  Mustache.to_html( h, aData ) + "</div>";
		// write it into the list node
		a.dnList.innerHTML = hContent;
		// get this content DOM node
		var dnContent = a.dnList.firstChild;
		// and resize to the width of input field
		__.dn.dx( dnContent, __.dn.dx( a.dn ) );
		// next we iterate through all row generated by mustache
		__.each( dnContent.children, function( dn ) {
			// and add a class indicating its a row created
			// by this library, it is used later on
			dn.classList.add( "-ac-row" );
			// next we check if the content is found in the
			// list of inactive terms
			var sText = dn.textContent;
			if( a.lsInactive.indexOf( sText ) > -1 ) {
				// in which case we add according class
				dn.classList.add( "-ac-inactive" );
			}
		} );
		// in case we want to mess with the output before it is
		// shown to the users (e.g. deactivate already selected
		// tags) we can indicate on a callback which is invoked
		// now along with the output DOM node as parameter.
		if( a.render_ ) {
			a.render_( a.dnList );
		}
		// and show it
		__.dn.show( a.dnList );
	}
	, hCreate : function() {
		return '<div style="display:none;position:relative;" class="-ac-list"></div>';
	}
};


