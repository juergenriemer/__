
// version 1.5
__ = {
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
	, dn : {
		  del : function( dn ) {
			dn.parentNode.removeChild( dn );
		}
		, _move : function( dnNew, dnExisting ) {
			dnExisting.parentNode.insertBefore( dnNew, dnExisting );
		  }
		, move : function( dnNew, dnExisting ) {
			dnExisting.appendChild( dnNew );
		  }
		, move_ : function( dnNew, dnExisting ) {
			dnExisting.parentNode.insertBefore( dnNew, dnExisting.nextSibling );
		}
		, _add : function( h, x1, x2 ) {
			__.dn._add_( h, x1, x2, "_move" );
		}
		, add : function( h, x1, x2 ) {
			__.dn._add_( h, x1, x2, "move" );
		}
		, add_ : function( h, x1, x2 ) {
			__.dn._add_( h, x1, x2, "move_" );
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
	}
	, css : function( sStyle ) {
		var dn = document.createElement( 'style' );
		document.body.appendChild( dn );
		dn.innerHTML = sStyle;
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
		var dn = this
		var ldn = ( dn.parentNode || dn.document ).querySelectorAll( sCSS )
		var i = -1;
		while( ldn[ ++i ] && ldn[ i ] != dn );
		return !! ldn[ i ];
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

