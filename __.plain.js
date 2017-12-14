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
		xdn = HTMLCollection.prototype.isPrototypeOf( xdn )
			? [].slice.call( xdn ) : xdn;
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
		, _move : function( dnMove, dnTarget ) {
			if( dnMove.length ) {
				__.each( dnMove, function( dn ) {
					dnTarget.parentNode.insertBefore( dn, dnTarget );
				} );
			}
			else {
				dnTarget.parentNode.insertBefore( dnMove, dnTarget );
			}
		  }
		, move : function( dnMove, dnTarget ) {
			if( dnMove.length ) {
				__.each( dnMove, function( dn ) {
					dnTarget.appendChild( dn );
				} );
			}
			else {
				dnTarget.appendChild( dnMove );
			}
		  }
		, move_ : function( dnMove, dnTarget ) {
			if( dnMove.length ) {
				__.each( dnMove, function( dn ) {
					dnTarget.parentNode.insertBefore( dn, dnTarget.nextSibling );
				} );
			}
			else {
				dnTarget.parentNode.insertBefore( dnMove, dnTarget.nextSibling );
			}
		}
		, add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "move" );
		}
		, _add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "_move" );
		}
		, add_ : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "move_" );
		}
		, _add_ : function( h, x1, x2, sfn ) {
			var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var dn = document.createElement( "p" );
			dn.innerHTML = h;
			var xdn = [].slice.call( dn.children );
			xdn = ( xdn.length == 1 ) ? xdn[ 0 ] : xdn;
			if( fn ) {
				__.each( xdn, fn );
			}
			__.dn[ sfn ]( xdn, dnRoot );
			return xdn;
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
		, x : function( dn, n ) {
			if( n ) {
				dn.style.left = parseInt( n ) + "px";
			}
			else {
				return dn.getBoundingClientRect().left;
			}
		}
		, y : function( dn, n ) {
			if( n ) {
				dn.style.top = parseInt( n ) + "px";
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
		, fade_ : function( dn, x1, x2 ) {
			var ms = ( typeof x1 == "number" ) ? x1 : 250;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var nStep = 25 / ms;
			dn.style.opacity = dn.style.opacity || 1;
			( function fader() {
				if( ( dn.style.opacity -= nStep) < 0 ) {
					__.dn.hide( dn );
					if( fn ) {
						fn();
					}
				}
				else {
					setTimeout( fader, 25 );
				}
			} )();
		}
		, _fade : function( dn, x1, x2 ) {
			var ms = ( typeof x1 == "number" ) ? x1 : 250;
			var fn = ( typeof x1 == "function" ) ? x1 : x2;
			var nStep = 25 / ms;
			dn.style.opacity = dn.style.opacity || 0;
			__.dn.show( dn );
			( function fader() {
				var n = Number( dn.style.opacity ) + nStep;
				dn.style.opacity = n;
				if( n > 1 ) {
					dn.style.opacity = 1;
					if( fn ) {
						fn();
					}
				}
				else {
					setTimeout( fader, 25 );
				}
			} )();
		}
	}
	, s : {
		  o : function( s ) {
			try {
				return JSON.parse( s );
			}
			catch( e ) {
				return null;
			}
		}
		, empty : function( s ) {
			return ( s.trim() == "" );
		}
		, camelcase : function( s ) {
			var ls = s.split( " " );
			ls.forEach( function( s, ix ) {
				ls[ ix ] = s.substr( 0, 1 ).toUpperCase() + s.substr( 1 );
			} );
			return ( ls.join( " " ) );
		}
	}
	, l : {
		  del : function( l, x ) {
			var ix = l.indexOf( x );
			if( ix > -1 ) {
				l.splice( ix, 1 );
			}
			return l;
		}
		, contains : function( l, x ) {
			return ( l.indexOf( x ) > -1 );
		}
		, empty : function( l ) {
			var c = l.length;
			return ( ! isNaN( c ) && c > 0 ); 
		}
	}
	, o : {
		  s : function( o ) {
			return JSON.stringify( o );
		}
		, k : function( o ) {
			try {
				return Object.keys( o );
			}
			catch( e ) {
				var l = [];
				for( var k in o ) {
					l.push( k );
				}
				return l;
			}
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
		, copy : function( o ) {
			try {
				return JSON.parse( JSON.stringify( o ) );
			}
			catch( e ) {
				return null;
			}
		}
		, empty : function( x ) {
			// http://stackoverflow.com/a/34491287/463676
			for( var k in x ) {
				return false;
			}
			return true;
		}
	}
	, css : function( sStyle ) {
		var dn = document.createElement( 'style' );
		document.body.appendChild( dn );
		dn.innerHTML = sStyle;
	}
	, b : {
		  mail : function( s ) {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/.test( s );
		}
		, url : function( s ) {
			return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test( v );
		}
	}
	, cookie : {
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
		  oParams : function( url ) {
			var o = {};
			var s = ( url ) ? url : window.location.href;
			s.replace(
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
		var ldn = ( dn.parentNode || dn.document ).querySelectorAll( sCSS );
		var ix = -1;
		while( ldn[ ++ix ] && ldn[ ix ] != dn ){
			// just loop until hit the end
		};
		return ( ldn[ ix ] ) ? true : false;
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





__.win = {
	  dx: function () {
		return window.innerWidth;
	}
	, dy: function () {
		return window.innerHeight;
	}
};


__.Async = function( args ) {
	var k = ( args ) ? ( args.sName || "default" ) : "default";
	var args = args || {};
	args.sName = k;
	__.Async.store[ k ] = new __.Async.Promise( args );
	__.Async.sActive = k;
	return __.Async.store[ k ];
}
__.Async.store = {};
__.Async.active = function( sName ) {
	__.Async.sActive = sName || "default";
};
__.Async.fnerr = function( a, b ) {
	console.log( "[error]", a, b );
}
__.Async.fnok = function( a ) {
	console.log( "[--ok--]", a );
}
__.Async.hub = {
	  resolve : function( a ) { __.Async.fnok( a ); }
	, reject : function( a, b ) { __.Async.fnerr( a, b ); }
};
__.async = function( sName ) {
	if( sName ) {
		return __.Async.store[ sName ];
	}
	if( ! __.Async.sActive ) {
		return __.Async.hub;
	}
	return __.Async.store[ __.Async.sActive ];
}

__.Async.Promise = function( args ) {
	this.sName = args.sName;
	this.sStatus = "idle";
	this.args = {};
	this.lofn = [];
	this.ctx = args.ctx || window;
	this.fnerr = ( args && args.fnerr ) ? args.fnerr : __.Async.fnerr;
	this.fnend = ( args && args.fnend ) ? args.fnend : __.Async.fnok;
	return this;
};
__.Async.Promise.prototype = {
	  then : function( x1, x2, x3 ) {
		var ofn = {
			  ctx : ( typeof x1 == "object" ) ? x1 : this.ctx
			, sfn : ( typeof x1 == "object" ) ? x2 : x1
			, args : ( typeof x2 == "string" ) ? x3 : ( x2 ) ? x2 : {}
		};
		if( /^wait:/.test( ofn.sfn ) ) {
			var ms = ofn.sfn.split( ":" )[ 1 ];
			ofn.sfn = function() {
				setTimeout( function() {
					 __.async().resolve();
				}, ms );
			};
		}
		if( this.sStatus == "pending" ) {
			ofn.bLateArrival = true;
			var c = this.lofn.length;
			for( var ix=0; ix<c; ix++ ) {
				if( ! this.lofn[ ix ].bLateArrival ) {
					this.lofn.splice( ix, 0, ofn );
					break;
				}
			}
		}
		else {
			this.lofn.push( ofn );
		}
		return this;
	}
	, next : function() {
		var that = this;
		setTimeout( function() {
			// cut next function object from list
			var ofn = that.lofn.shift();
			// c_onsole.log( "nextasync|"+that.sName+"|> " + ofn.sfn );
			__.o.add( that.args, ofn.args );
			// we now invoke the function.
			if( typeof ofn.sfn == "string" ) {
				// in case its name is passed on as string
				// we invoke as key from context object passing
				// on our accumulated arguments object
				ofn.ctx[ ofn.sfn ]( that.args );
			}
			else {
				// in case we passed on an anonymous function
				// we invoke via "call" with context object again
				// passing on our accumulated arguments object
				ofn.sfn.call( ofn.ctx, that.args );
			}
		}, 0 );
	}
	, start : function() {
		this.sStatus = "pending";
		this.next();
		return this;
	}
	, resolve : function( args ) {
		__.Async.sActive = this.sName;
		__.o.add( this.args, args );
		if( this.lofn.length > 0 ) {
			this.next();
		}
		else {
			this.fnend( args, this.args );
			this.sStatus = "idle";
			__.Async.sActive = null;
		}
	}
	, reject : function( args ) {
		__.Async.sActive = this.sName;
		this.fnerr( args, this.args );
	}
	, active : function( sActive ) {
		__.Async.sActive = sActive;
	}
}







