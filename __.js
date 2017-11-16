// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __.dn._dn; __.dn.del; __.dn; __.dn._move; __.dn.move; __.dn.move_; __.dn._add; __.dn.add; __.dn.add_; __.dn.hide; __.dn.show; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.each; __.css; __.e; __.b; __.b.email; __.b.empty; __.b.url; __.cookies; __.cookies.get; __.cookies.set; __.cookies.del; __.url; __.url.oParams; __.o; __.o.s; __.o.add; __.o.kRename; __.o.clone; __.o.k; __.s; __.s.o;
// ==/ClosureCompiler==
// version 1.5
/**
 * JS Library of Technikum Wien
 * @version 1.0
 * @namespace __
 */
__ = {
	/**
	 * @memberof __
	 * @method dn_
	 * <pre>
	 * Takes a CSS selector string and queries the DOM for matching nodes.
	 * It returns a single DOM node if just one node was found.
	 * It returns a list of DOM nodes if multiple were found.
	 * It will return [null] in case nothing was found.
	 * An optional DOM node as starting point can be passed on otherwise [document] is used.
	 * An optional callback function to be applied on returned nodes can be passed on which will be invoked with two parameters: the single node and its index of the array
	 * </pre>
	 * @example var dnMenu = __.dn_( "#menu" );
	 * @example var lnLinks = __.dn_( "a.footer", dnMenu );
	 * @example __.dn_( "a.footer", dnMenu, function( dn, ix ) {
	 *       dn.style.color = "red";
	 *       dn.style.border = ix + "px solid green";
	 *  } );
	 * @example __.dn_( "[href]", function( dn ) {
	 *       dn.setAttribute( "href", "#" );
	 *  } );
	 * @param {String} s CSS selector string
	 * @param {Element|Function} [x1] starting node or callback function
	 * @param {Function} [x2] callback function
	 * @returns {Element|Array} A DOM node or a list of DOM nodes or null if CSS selector could not be found
	 */
	dn_ : function( s, x1, x2 ) {
		var dnStart = ( typeof x1 == "object" ) ? x1 : document;
		var fn = ( typeof x1 == "function" ) ? x1 : x2;
		var sfn = "querySelectorAll";
		if( /^.[a-zA-Z0-9_-]*$/.test( s ) ) {
			var sfst = s.substr( 0, 1 );
			if( sfst == "#" ) {
				sfn = "getElementById";
				s = s.substr( 1 );
			}
			else if( sfst == "." ) {
				sfn = "getElementsByClassName";
				s = s.substr( 1 );
			}
			else if( /[a-zA-Z]/.test( sfst ) ) {
				sfn = "getElementsByTagName";
			}
		}
		var xdn = dnStart[ sfn ]( s );
		if( xdn ) {
			if( fn ) {
				__.each( xdn, fn );
			}
			var c = xdn.length;
			if ( ! isNaN( c ) ) {
				if( c == 1 ) {
					return xdn[ 0 ];
				}
				else if( c == 0 ) {
					return null;
				}
			}
		}
		return xdn;
	}
	/**
	 * @memberof __
	 * @method _dn
	 * <pre>
	 * Takes a CSS selector string and queries the DOM for the closest matching parent node.
	 * It returns a DOM node.
	 * It will return [null] in case nothing was found.
	 * An optional callback function to be applied on returned nodes can be passed on which will be invoked with two parameters: the single node and its index of the array
	 * </pre>
	 * @memberof __
	 * @method _dn
	 * @example var dnInput = __.dn_( "[name='email']" );
	 * var dnForm = __._dn( "form", dnMenu );
	 * @example var dnForm = __._dn( "form", dnMenu, function( dn ) {
	 * 	dn.style.border = "1px solid red";
	 *	dn.submit();
	 * } );
	 * @param {String} s CSS selector string
	 * @param {Element} dn starting node
	 * @param {Function} [fn] callback function
	 * @returns {Element} A DOM node or null if CSS selector could not be found
	 */
	, _dn : function( s, dn, fn ) {
		var dnClosest = dn.closest( s );
		if( fn ) {
			__.each( dnClosest, fn );
		}
		return dnClosest
	}
	, each : function( xdn, fn ) {
		var ldn = ( ! isNaN( xdn.length ) ) ? xdn : [ xdn ];
		var c = ldn.length;
		for( var ix=0; ix<c; ix++ ) {
			fn( ldn[ ix ], ix );
		}
	}
	/**
	 * __.dn provides methods that operate on a single DOM node.
	 * @memberof __
	 * @type {object}
	 * @namespace __.dn
	 */
	, dn : {
		/**
		 * Deletes a DOM node.
		 * @memberof __.dn
		 * @method del
		 * @param {Element} dn DOM node to be deleted
		 * @example var dnForm = __._dn( "form", dnMenu );
		 * __.dn.del( dnForm );
		 */
		  del : function( dn ) {
			dn.parentNode.removeChild( dn );
		}
		/**
		 * Moves a DOM node right before another DOM node.
		 * @memberof __.dn
		 * @method _move
		 * @param {Element} dnMove DOM node that should get moved
		 * @param {Element} dnTarget DOM node in front of which the node should get moved to
		 * @example var dn1 = __.dn_( "#one" );
		 * var dn2 = __.dn_( "#two" );
		 * __.dn._move( d2, d1 );
		 */
		, _move : function( dnMove, dnTarget ) {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget );
		  }
		/**
		 * Moves a DOM node inside another DOM node
		 * @memberof __.dn
		 * @method move
		 * @example var dnUL = __.dn_( "ul" );
		 * var dnLI = __.dn_( "li:nth-child(1)" );
		 * __.dn.move( dnLI, dnUL );
		 * @param {Element} dnMove DOM node that should get moved
		 * @param {Element} dnTarget DOM node into which the DOM node should get moved
		 */
		, move : function( dnMove, dnTarget ) {
			dnTarget.appendChild( dnMove );
		  }
		/**
		 * Moves a DOM node right after another DOM node.
		 * @memberof __.dn
		 * @method move_
		 * @example var dnLI4 = __.dn_( "li:nth-child( 4 )" );
		 * var dnLI1 = __.dn_( "li:nth-child( 1 )" );
		 * __.dn.move_( dnLI1, dnLI4 );
		 * @param {Element} dnMove DOM node that should get moved
		 * @param {Element} dnTarget DOM node after which the node should get moved to
		 */
		, move_ : function( dnMove, dnTarget ) {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget.nextSibling );
		}
		/**
		 * <pre>
		 * Takes an HTML strings, converts them into DOM node(s) and writes them directly infront of an existing DOM node.
		 * It returns a single DOM node if HTML string has one root tag.
		 * It returns a list of DOM nodes if HTML string has multiple root tags.
		 * An optional DOM node as target DOM node can be passed on otherwise [document] is used.
		 * An optional callback function to be applied on created nodes can be passed on which will be invoked with two parameters: the single node and its index of the array
		 * </pre>
		 * @memberof __.dn
		 * @method _add
		 * @example var dnDIV = __.add( "<div></div>" );
		 * @example var h = "<a href='#1'></a><a href='#2'></a>";
		 * var lnLinks = __.dn_( h, dnDIV );
		 * @example var h = "<a href='#1'></a><a href='#2'></a>";
		 * var lnLinks = __.dn_( "h", function( dn, ix ) {
		 *	dn.style.border = ix + "px solid blue";
		 * });
		 * @param {String} h String of valid HTML.
		 * @param {Element|Function} [x1] target node or callback function
		 * @param {Function} [x2] callback function
		 * @returns {Element|Array} A DOM node or a list of DOM nodes
		 */
		, _add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "_move" );
		}
		, add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "move" );
		}
		, add_ : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "move_" );
		}
		, _add_ : function( h, x1, x2, sfn ) {
			var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var docFrag = document.createRange().createContextualFragment( h );
			var xdn = docFrag.children;
			var cNew = xdn.length;
			if( fn ) {
				this.each( xdn, fn );
			}
			__.dn[ sfn ]( docFrag, dnRoot );
			if( cNew == 1 ) {
				return dnRoot.lastChild;
			}
			var ldnChildren = dnRoot.children;
			var cRoot = ldnChildren.length;
			var ldn = [];
			for( var ix=0; ix<cNew; ix++ ) {
				var ixNew = cRoot - 1 - ix;
				ldn.push( ldnChildren[ ixNew ] );
			}
			return ldn;
		}
		, show : function( dn ) {
			if( dn.style.display != "none" ) {
				return;
			}
			var sDisplay = ( dn.hasAttribute( "__.display" ) )
				? dn.getAttribute( "__.display" )
				: "block";
			dn.style.display = sDisplay;
		}
		, hide : function( dn ) {
			if( dn.style.display == "none" ) {
				return;
			}
			var sDisplay = getComputedStyle( dn ).display;
			dn.setAttribute( "__.display", sDisplay ); 
			dn.style.display = "none";
		}
		, ix : function( dn ) {
			var ix = 0;
			while( ( dn = dn.previousSibling ) != null ) {
				ix++;
			}
			return ix;
		}
		, x : function( dn, x ) {
			if( x ) {
				dn.style.left = parseInt( x ) + "px";
			}
			else {
				return dn.getBoundingClientRect().left;
			}
		}
		, y : function( dn, y ) {
			if( y ) {
				dn.style.top = parseInt( y ) + "px";
			}
			else {
				return dn.getBoundingClientRect().top;
			}
		}
		, dx : function( dn, dx ) {
			if( dx ) {
				dn.style.width = parseInt( dx ) + "px";
			}
			else {
				return dn.getBoundingClientRect().width;
			}
		}
		, dy : function( dn, dy ) {
			if( dy ) {
				dn.style.height = parseInt( dy ) + "px";
			}
			else {
				return dn.getBoundingClientRect().height;
			}
		}
	}
	/**
	 * __.s provides methods that operate on strings
	 * @memberof __
	 * @type {object}
	 * @namespace __.s
	 */
	, s : {
		o : function( s ) {
			try {
				return JSON.parse( s );
			}
			catch( e ) {
				return null;
			}
		}
	}
	/**
	 * __.o provides methods that operate on objects
	 * @memberof __
	 * @type {object}
	 * @namespace __.o
	 */
	, o : {
		  s : function( o ) {
			return JSON.stringify( o );
		}
		, add : function( ocur, onew ) {
			for( var s in onew ) {
				ocur[ s ] = onew[ s ];
			} 
		}
		// http://stackoverflow.com/a/14592469/463676
		, kRename : function( o, kold, knew ) {
			Object.defineProperty(
				  o
				, knew
				, Object.getOwnPropertyDescriptor( o, kold )
			);
			delete o[ kold ];
		}
		, clone : function( o ) {
			try {
				return JSON.parse( JSON.stringify( o ) );
			}
			catch( e ) {
				return null;
			}
		}
		, k : function( o ) {
			for( k in o ) {
				return k;
			};
		}
	}
	, css : function( sStyle ) {
		var dn = document.createElement( 'style' );
		document.body.appendChild( dn );
		dn.innerHTML = sStyle;
	}
	, e : {
		stop : function( e ) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
	/**
	 * __.b provides methods that check
	 * @memberof __
	 * @type {object}
	 * @namespace __.b
	 */
	, b : {
		  email : function( s ) {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/.test( s );
		}
		, url : function( s ) {
			return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test( v );
		}
		, empty : function( x ) {
			if( typeof x == "string" ) {
				return ( x == "" );
			}
			else if( x.length ) {
				return ( x.length == 0 );
			}
			else if( typeof x == "object" ) {
				// http://stackoverflow.com/a/34491287/463676
				for( var dy in o ) {
					return false;
				}
				return true;
			}
		}
	}
	, cookies : {
		  get : function( k ) {
			var v = document.cookie.match( '(^|;) ?' + k + '=([^;]*)(;|$)' );
			return v ? v[ 2 ] : null;
		}
		, set : function( k, v, nDays ) {
			var d = new Date;
			d.setTime( d.getTime() + 86400000 * nDays );
			document.cookie = k + "=" + v + ";path=/;expires=" + d.toGMTString();
		}
		, del : function( k ) {
			__.cookie.set( k, '', -1 );
		}
	}
	, url : {
		  oParams : function () {
			var o = {};
			window.location.href.replace(
				/[?&]+([^=&]+)=([^&]*)/gi,
				function( m, k, v ) {
					o[ k ] = v;
				}
			);
			return o;
		}
	}
}

/* *** Polyfills *** */
/* matches */
this.Element && function( oPrototype ) {
	oPrototype.matches = oPrototype.matches ||
	oPrototype.matchesSelector ||
	oPrototype.webkitMatchesSelector ||
	oPrototype.msMatchesSelector ||
	function( sCSS ) {
		var dn = this;
		var ldn = ( dn.parentNode || dn.document ).querySelectorAll( sCSS )
		var ix = -1;
		while( ldn[ ++ix ] && ldn[ ix ] != dn ){};
		return !! ldn[ ix ];
	}
}( Element.prototype );

/* closest */
this.Element && function( oPrototype ) {
	oPrototype.closest = oPrototype.closest || function( sCSS ) {
		var dn = this;
		while( dn.matches && ! dn.matches( sCSS ) ) {
			dn = dn.parentNode;
		}
		return ( dn.matches ) ? dn : null;
	}
}( Element.prototype );

/* classList.toggle */

( function() {
	function ClassList( el ) {
		this.element = el;
	}
	ClassList.prototype = {
		toggle : function( name ) {
			if( this.contains( name ) ) {
				this.remove( name );
				return false;
			}
			else {
				this.add( name );
				return true;
			}
		}
	};
}() );







