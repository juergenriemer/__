if( typeof( __ ) == "undefined" ) {
	__ = {};
}

//__.css( '.-ac-content{background : #fff;z-index : 999;cursor : pointer;border-left : 1px solid #c0c0c0;border-right : 1px solid #c0c0c0;border-bottom : 1px solid #c0c0c0;} .-ac-content .-ac-highlight,.-ac-content .-ac-row:hover{background : #efefef;color : #a0a0a0;} .-ac-content .line{padding : 0.4em;border-bottom : 1px dotted #efefef;} .-ac-content .left img{height : 37px;width : 27px;float : left;} .-ac-content .right{margin-left : 33px;} .-ac-content .right .title{font-weight : bold;font-size : 1.1em;} .-ac-inactive {color : #a0a0a0 !important;cursor : default;} .-ac-loading{background-image: url("data:image/gif;base64,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");background-position-x : 100% !important;background-position-y : 0% !important;background-size : auto 100% !important;background-repeat : no-repeat !important;} ');

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
		a.dnList = a.dn.__after( this.hCreate() );
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
				dn = dn.__closest( ".-ac-row" );
			}
			var ixRow = dn.__ix() + 1;
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
		a.dn.ix = ix.__withinBoundary( 0, a.c );
		var ldnLines = a.dnList.__find( ".-ac-highlight" );
		__.dn.each( ldnLines, function( dn ) {
			dn.classList.remove( "-ac-highlight" );
		} );
		if( ldnLines && a.dn.ix > 0 ) {
			var scur = ".-ac-row:nth-child(" + a.dn.ix + ")"; 
			var dncurLine = a.dnList.__find( scur );
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
		a.dnList.__hide();
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
		// __.dn.dx( dnContent, __.dn.dx( a.dn ) );
		dnContent.__dx( dnContent, a.dn.__dx( a.dn ) );
		// next we iterate through all row generated by mustache
		__.dn.each( dnContent.children, function( dn ) {
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
		a.dnList.__show();
	}
	, hCreate : function() {
		return '<div style="display:none;position:relative;" class="-ac-list"></div>';
	}
};


