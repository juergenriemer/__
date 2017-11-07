// version 1.2
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
				__.dn.each( xdn, fn );
			}
			if ( typeof xdn.length == "number" ) {
				if( xdn.length == 1 ) {
					return xdn[ 0 ];
				}
				else if( xdn.length == 0 ) {
					return null;
				}
			}
		}
		return xdn;
	}
	, dn : {
		  each : function( xdn, fn ) {
			var ldn = ( xdn.length ) ? xdn : [ xdn ];
			var c = ldn.length;
			for( var ix=0; ix<c; ix++ ) {
				fn( ldn[ ix ], ix );
			}
		}
		, frag : function( h, x1, x2 ) {
			var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var docFrag = document.createRange().createContextualFragment( h );
			var xdn = docFrag.children;
			var cNew = xdn.length;
			if( fn ) {
				this.each( xdn, fn );
			}
			// we append the document fragment to root node, at
			// this point document fragement [docFrag] is emptied
			dnRoot.appendChild( docFrag );
			// we check 
			if( cNew == 1 ) {
				console.l
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
	}
}
