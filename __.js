// version 1.3
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
		if( ! dn.closest ) {
			__.polyfill.closest();
			__._dn( s, dn, fn );
		}	
		else {
			var dnClosest = dn.closest( s );
			if( fn ) {
				__.each( dnClosest, fn );
			}
			return dnClosest
		}	
	}
	, each : function( xdn, fn ) {
		var c = ldn.length;
		var ldn = ( ! isNaN( c ) ) ? xdn : [ xdn ];
		for( var ix=0; ix<c; ix++ ) {
			fn( ldn[ ix ], ix );
		}
	}
	, dn : {
		  insertAfter : function( dnNew, dnBefore ) {
			dnBefore.parentNode.insertBefore( dnNew, dnBefore.nextSibling );
		}
		, del : function( dn ) {
			dn.parentNode.removeChild( dn );
		}
		, add : function( h, x1, x2 ) {
			var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var docFrag = document.createRange().createContextualFragment( h );
			var xdn = docFrag.children;
			var cNew = xdn.length;
			if( fn ) {
				this.each( xdn, fn );
			}
			dnRoot.appendChild( docFrag );
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
	, class : {
		  toggle : function( dn, s ) {
			if( dn.classList.toggle ) {
				dn.classList.toggle( s );		
			}
			else {
				if( dn.classList.contains( s ) ) {
					dn.classList.remove( s );
				}
				else {
					dn.classList.add( s );
				}
			}
		}
	}
	, polyfill : {
		  matches : function() {
			this.Element && function( oPrototype ) {
				oPrototype.matches = oPrototype.matches ||
				oPrototype.matchesSelector ||
				oPrototype.webkitMatchesSelector ||
				oPrototype.msMatchesSelector ||
				function( selector ) {
					var node = this, nodes = ( node.parentNode || node.document ).querySelectorAll( selector ), i = -1;
					while( nodes[ ++i ] && nodes[ i ] != node );
					return !! nodes[ i ];
				}
			}( Element.prototype );
			window.__matches = true;
		}
		, closest : function() {
			__.polyfill.matches();
			this.Element && function( oPrototype ) {
				oPrototype.closest = oPrototype.closest ||
				function( selector ) {
					var dn = this;
					while( dn.matches && ! dn.matches( selector ) ) {
						dn = dn.parentNode;
					}
					return ( dn.matches ) ? dn : null;
				}
			}( Element.prototype );
			window.__closest = true;
		}
	}
}
