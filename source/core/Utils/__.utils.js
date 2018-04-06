// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __._dn; __.each; __.dn; __.dn.del; __.dn._move; __.dn.move; __.dn.move_; __.dn.add; __.dn._add; __.dn.add_; __.dn._add_; __.dn.show; __.dn.hide; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.dn.fade_; __.dn._fade; __.dn.css; __.css.h; __.s; __.s.o; __.o.empty; __.o.camelCase; __.o.tokenize; __.n; __.n.within; __.l; __.l.del; __.l.contains; __.l.equal; __.l.empty; __.l.kSort; __.l.remove; __.o; __.o.s; __.o.k; __.o.kk; __.o.add; __.o.kRename; __.o.c; __.o.copy; __.o.equal; __.o.empty; __.e; __.e.stop; __.css; __.b; __.b.mail; __.b.url; __.dt; __.dt.date; __.cookie; __.cookie.get; __.cookie.set; __.cookie.del; __.url; __.url.oParams; __.misc; __.misc.isIE; __.win; __.win.dx; __.win.dy; 
// ==/ClosureCompiler==
// version 1.5
/**
 * @version 1.0
 * @namespace __
 */

if( typeof __ == "undefined" ) {
	__ = {};
}

/**
 * Provides methods that operate on strings
 * @memberof __
 * @type {object}
 * @namespace __.s
 */
__.s = {
	/**
	 * <pre>
	 * Converts a string into an object.
	 * It will return [null] if it fails.
	 * </pre>
	 * @memberof __.s
	 * @method o
	 * @example var s = '{"sName":"John","nAge":44}';
	 * var o = __.s.o ( s );
	 * @param {String} s string we want to convert
	 * @returns {Object|null} Object or null
	 */
	  o : function( s ) {
		try {
			return JSON.parse( s );
		}
		catch( e ) {
			return null;
		}
	}
	/**
	 * <pre>
	 * Checks whether a string is empty after stripping of whitespaces
	 * </pre>
	 * @memberof __.s
	 * @method empty
	 * @example var s = "  ";
	 * var bEmpty = __.s.empty( s );
	 * @param {String} s string we want to examine
	 * @returns {Booelan} Result of the check
	 */
	, empty : function( s ) {
		s = ( typeof s == "string" ) ? s.trim() : null;
		return ( s === "" );
	}
	/**
	 * <pre>
	 * Uppercases the first character of a word
	 * </pre>
	 * @memberof __.s
	 * @method camelCase
	 * @example var s = __.s.camelCase( "hi mom" );
	 * @param {String} s string we want to camelcase
	 * @returns {String} Camelcased string
	 */
	, camelCase : function( s ) {
		var ls = [];
		s.split( " " ).forEach( function( s, ix ) {
			if( s ) {
				ls.push( s.substr( 0, 1 ).toUpperCase() + s.substr( 1 ) );
			}
		} );
		return ( ls.join( " " ) );
	}
	/**
	 * <pre>
	 * Splits camelcase string into words separated by spaces
	 * </pre>
	 * @memberof __.s
	 * @method unCamelCase
	 * @example var s = __.s.unCamelCase( "HiMom" );
	 * @result ( s == "Hi Mom" );
	 * @param {String} s string we want to un-camelcase
	 * @returns {String} un-camelcased string
	 */
	, unCamelCase : function( s ) {
		s = s.replace( /([A-Z])([a-z])/g, ' $1$2' );
		s = s.replace( /([a-z])([A-Z])/g, '$1 $2' );
	//	s = s.replace( /^./, function( s ){ return s.toUpperCase(); } );
		return s.trim();
	}
	/**
	 * <pre>
	 * Tokenize a string to certain levels:
	 * simple: remove spaces, quotes, newlines an lowercase
	 * </pre>
	 * @memberof __.s
	 * @method tokenize
	 * @example var s = __.s.tokenize( "Hi 'Mom'" ); // himom
	 * @param {String} s string we want to tokenize
	 * @param {String} [sType] string to indicate level (default is simple)
	 * @returns {String} tokenized string
	 */
	, tokenize : function( s, sType ) {
		if( ! sType || sType == "simple" ) {
			s = s.replace( /\s/g, "" );
			s = s.replace( /'/g, "" );
			s = s.replace( /"/g, "" );
			return s.toLowerCase();
		}
		return s;
	}
	/**
	 * <pre>
	 * Sanitizes a string by removing tags only
	 * </pre>
	 * @memberof __.s
	 * @method sanitize
	 * @example var s = __.s.sanitize( "Hi 'Mom'" ); // himom
	 * @param {String} s string we want to sanitize
	 * @returns {String} sanitized string
	 */
	// REF: unit test this
	, sanitize : function( s ) {
		return s.replace( /<(?:.|\n)*?>/gm, "" );
	}
};

/**
 * Provides methods that operate on numbers
 * @memberof __
 * @type {object}
 * @namespace __.n
 */
__.n = {
	/**
	 * <pre>
	 * Receives a number and an array of min and max value
	 * and returns the value of the number or either min or
	 * max value if the number lies outside those boundaries
	 * </pre>
	 * @memberof __.n
	 * @method within 
	 * @example var n = __.n.within( 1, [ 5, 9 ] ); // 1
	 * @param {Number} n number that should be within boundaries
	 * @param {Array} ln array of min and max value
	 * @returns {Number} value of number within boundaries
	 */
	  within : function( n, ln ) {
		n = ( n < ln[ 0 ] ) ? ln[ 0 ] : n;
		n = ( n > ln[ 1 ] ) ? ln[ 1 ] : n;
		return n;
	}
}

/**
 * Provides methods that operate on lists
 * @memberof __
 * @type {object}
 * @namespace __.l
 */
__.l = {
	/**
	 * <pre>
	 * Remove an element from a list
	 * </pre>
	 * @memberof __.l
	 * @method del
	 * @example var l = [ 1, 3, 7 ];
	 * var l = __.l.del( l, 7 );
	 * @param {Array} l List from which we want to remove an element
	 * @param {String|Number} x Element we want to remove
	 * @returns {Booelan} Result of the check whether list holds the element
	 */
	  del : function( l, x ) {
		var ix = l.indexOf( x );
		if( ix > -1 ) {
			l.splice( ix, 1 );
			__.l.del( l, x );
		}
	}
	/**
	 * <pre>
	 * Checks whether a list contains an element
	 * </pre>
	 * @memberof __.l
	 * @method contains
	 * @example
	 * var l = [ 1, 3, 7 ];
	 * var b7 = __.l.contains( l, 7 );
	 * @result
	 * (b7 == true);
	 * @param {Array} l list we want to examine
	 * @param {String|Number} x Element we are looking for
	 * @returns {Booelan} Result of the check whether list holds the element
	 */
	, contains : function( l, x ) {
		return ( l.indexOf( x ) > -1 );
	}
	/**
	 * <pre>
	 * Check if two arrays contain exactly the same data.
	 * NB: it is not sorting the array. If you don't want to
	 * keep the order use __.o.equal method instead.
	 * </pre>
	 * @memberof __.l
	 * @method equal
	 * @example var l1 = [ 1, 2, 3 ];
	 * var l2 = [ 1, 2, 3 ];
	 * var bEqual = __.l.equal( l1, l2 );
	 * @param {Array} l1 first array to be compared 
	 * @param {Array} l2 second array to be compared 
	 * @returns {Boolean} result of comparison
	 */
	, equal : function( l1, l2 ) {
		return ( l1.join( "-" ) === l2.join( "-" ) );
	}
	/**
	 * <pre>
	 * Checks whether a list is empty
	 * </pre>
	 * @memberof __.l
	 * @method empty
	 * @example var l = [];
	 * var bEmpty = __.l.empty( l );
	 * @param {Array} l list we want to examine
	 * @returns {Booelan} Result of the check
	 */
	, empty : function( l ) {
		return __.o.s( l ) === "[]";
	}
	/**
	 * <pre>
	 * Sorts an array of objects by an object's key
	 * </pre>
	 * @memberof __.l
	 * @method empty
	 * @example var lo = [ { v : 12 }, { x : 11 }, { s : "x" }, { v : 2 } ];
	 * lo = __.l.kSort( lo, "v" );
	 * @result lo == [ { x : 11, s : "x", v : 2, v : 12 } ]
	 * @param {Array} lo list of objects we want to sort by key
	 * @param {String} k key we want to sort by
	 * @returns {Array} Sorted array of objects
	 */
	, kSort : function( lo, k ) {
		return lo.sort( function( a, b ) {
			if( ! a.hasOwnProperty( k ) ) {
				return 1;
			} 
			else if( ! b.hasOwnProperty( k ) ) {
				return 0;
			} 
			return ( a[ k ] > b[ k ] );
		} );
	}
};

/**
 * Provides methods that operate on objects
 * @memberof __
 * @type {object}
 * @namespace __.o
 */
__.o = {
	/**
	 * <pre>
	 * Converts an object into a string
	 * Uses JSON.stringify therefore returns null in case of circular references
	 * </pre>
	 * @memberof __.o
	 * @method s
	 * @example var o = { sName : "John", nAge : 44 }
	 * var s = __.o.s( o );
	 * @param {Object} o Object to be stringified.
	 * @returns {string} String representation of the object.
	 */
	  s : function( o ) {
		try {
			return JSON.stringify( o );
		}
		catch( e ) {
			return null;
		}
	}
	/**
	 * <pre>
	 * Return (first) key of an object
	 * </pre>
	 * @memberof __.o
	 * @method k
	 * @example var mp = { "country" : "Belgium" }
	 * var k = __.o.k( mp ); // key
	 * @param {Object} o object
	 * @returns {String} k string of key or null if no assoc
	 */
	, k : function( o ) {
		for( var k in o ) {
			return k;
		}
		return null;
	}
	/**
	 * <pre>
	 * Return keys of an object.
	 * </pre>
	 * @memberof __.o
	 * @method kk
	 * @example var o = { sName : "John", nAge : 44 }
	 * var lk = __.o.kk( o ); // [ "sName", "nAge" ]
	 * @param {Object} o object
	 * @returns {array} Array of keys
	 */
	, kk : function( o ) {
		if( Object && Object.keys ) {
			return Object.keys( o );
		}
		else {
			var l = [];
			for( var k in o ) {
				l.push( k );
			}
			return l;
		}
	}
	/**
	 * <pre>
	 * Adds an object to an existing object.
	 * </pre>
	 * @memberof __.o
	 * @method add
	 * @example var oOrig = { sName : "John", nAge : 44 }
	 * var oNew = { email : "john@example.com", id : 123 }
	 * __.o.add( oOrig, oNew );
	 * @param {Object} ocur Existing object
	 * @param {Object} onew object to be added
	 */
	, add : function( ocur, onew ) {
		if( ocur && onew ) {
			for( var s in onew ) {
				ocur[ s ] = onew[ s ];
			} 
		} 
	}
	/**
	 * <pre>
	 * Rename a key of an object.
	 * </pre>
	 * @memberof __.o
	 * @method kRename
	 * @example var oOrig = { sName : "John", nAge : 44 }
	 * __.o.kRename( oOrig, "sName", "sFirstName" );
	 * @param {Object} o object
	 * @param {String} kold key to be renamed
	 * @param {String} knew new key name
	 */
	// http://stackoverflow.com/a/14592469/463676
	// REF: is this IE10 compatible?
	, kRename : function( o, kold, knew ) {
		try {
			Object.defineProperty(
				  o
				, knew
				, Object.getOwnPropertyDescriptor( o, kold )
			);
			delete o[ kold ];
		} catch( e ) {
			console.warn( 'kRename: o is no object' );
		}
	}
	/**
	 * <pre>
	 * Counts first level elements of an object
	 * </pre>
	 * @memberof __.o
	 * @method c 
	 * @example var o = { sName : "John", nAge : 44 }
	 * var oNew = __.o.c( o ); // 2
	 * @param {Object} o object to be examined 
	 * @returns {Number} count of elements
	 */
	, c : function( o ) {
		var c = 0;
		for( var k in o ) {
			if( o.hasOwnProperty( k ) ) {
				++c;
			}
		}
		return c;
	}
	/**
	 * <pre>
	 * Create a copy of an object
	 * </pre>
	 * @memberof __.o
	 * @method copy 
	 * @example var oOrig = { sName : "John", nAge : 44 }
	 * var oNew = __.o.copy( oOrig );
	 * @param {Object} o object to be copied
	 * @returns {Object} Copy of the object
	 */
	, copy : function( o ) {
		try {
			return JSON.parse( JSON.stringify( o ) );
		}
		catch( e ) {
			return null;
		}
	}
	/**
	 * <pre>
	 * Retrieve the structure of an object including its string size
	 * array of arrays containing key paths as string and a sorted 
	 * copy of the object passed on
	 * </pre>
	 * @memberof __.o
	 * @method struc 
	 * @example var o1 = { sName : "John", nAge : 44 };
	 * var oStruc = __.o.struc( o1 );
	 * @param {Object} o1 object to be examined 
	 * @returns {Object} result of comparison

			  o : copy of object 
			, nLength : string size 
			, lsStruc : arrays of keys
	 */
	, struc : function( o ) {
		var presort = function( a, b ) {
			var _a = ( a && a.sort ) ? a.sort() : a;
			var _b = ( b && b.sort ) ? b.sort() : b;
			return _a > _b;
		};
		var s = __.o.s( o );
		var nLength = s.length;
		var _o = __.s.o( s );	
		if( _o && _o.sort ) {
			_o.sort( presort ).sort();
		}
		var ls = [];
		function fnCrawl( _o, path ) {
			for( var k in _o ) {
				if( _o[k] && _o[k].sort ) {
					_o[k].sort( presort ).sort();
				}
				if( _o.hasOwnProperty( k ) ) {
					var sDot = ( path ) ? "." : ""; 
					ls.push( path + sDot + k );
					if( typeof _o[ k ] == "object" ) {
						fnCrawl( _o[ k ], path + sDot + k );
					}
				}
			}
		}
		fnCrawl( _o, "" );
		return {
			  o : _o
			, nLength : nLength
			, lsStruc : ls.sort()
		};
	}
	/**
	 * <pre>
	 * Check if two objects contain the same data
	 * </pre>
	 * @memberof __.o
	 * @method equal
	 * @example var o1 = { sName : "John", nAge : 44 };
	 * var o2 = { sName : "John", nAge : 44 };
	 * var bEqual = __.o.equal( o1, o2 );
	 * @param {Object} o1 first object to be compared 
	 * @param {Object} o2 second object to be compared 
	 * @returns {Boolean} true if objects are equal, false if not
	 */
	, equal : function( o1, o2 ) {
		return __.o._compare_( o1, o2 ).b; 
	}
	/**
	 * <pre>
	 * Compare two objects and retrieve their differences
	 * </pre>
	 * @memberof __.o
	 * @method diff
	 * @example var o1 = { sName : "John", nAge : 44 };
	 * var o2 = { sName : "John", nAge : 23, bMarried : true };
	 * var oDiff = __.o.diff( o1, o2 );
	 * @param {Object} o1 first object to be compared 
	 * @param {Object} o2 second object to be compared 
	 * @returns {Object|null} returns an object of two objects holding
	 * an array of differences found for each of the two object passed on or null if they are identical
	 */
	, diff : function( o1, o2 ) {
		var ldiff1 = __.o._compare_( o1, o2 ); 
		if( ldiff1.b ) {
			return null;
		}
		var ldiff2 = __.o._compare_( o2, o1 ); 
		return {
			  o1 : ldiff1.ldiff
			, o2 : ldiff2.ldiff
		};
	}
	, _compare_ : function( o1, o2 ) {
		var b = true;
		var ldiff = [];
		var oStruc1 = __.o.struc( o1 );
		var oStruc2 = __.o.struc( o2 );
		if( oStruc1.nLength !== oStruc2.nLength ) {
			ldiff.push( [ "length", ,oStruc1.nLength, oStruc2.nLength ] );
			b = false;
		}
		oStruc1.lsStruc.forEach( function( s ) {
			var x1 = oStruc1.o;
			var x2 = oStruc2.o;
			var lsParts = s.split( "." );
			for( var ix=0; ix<lsParts.length; ix++ ) {
				x1 = ( x1 ) ? x1[ lsParts[ ix ] ] : x1;
				x2 = ( x2 ) ? x2[ lsParts[ ix ] ] : x2;
				if( typeof x1 !== typeof x2 ) {
					ldiff.push( [ "type", s, x1, x2 ] );
					b = false;
					break;
				}
				else if( typeof x2 === "undefined" ) {
					ldiff.push( [ "miss", s, x1, x2 ] );
					b = false;
					break;
				}
				else if( x1 instanceof Date || x1 instanceof Function ) {
					x1 = x1.toString().replace( /\s/g, "" );
					x2 = x2.toString().replace( /\s/g, "" );
				}
				else if( typeof x1 !== "object" ) {
					if( x1 !== x2 ) {
						b = false;
						ldiff.push( [ "diff", s, x1, x2 ] );
					}
				}
			}
		} );
		return {
			  b : b
			, ldiff : ldiff
		};
	}
	/**
	 * <pre>
	 * Checks whether an object is empty
	 * </pre>
	 * @memberof __.o
	 * @method empty
	 * @example var o = {};
	 * var bEmpty = __.b.empty( o );
	 * @param {Object} o object we want to examine
	 * @returns {Booelan} Result of the check
	 */
	, empty : function( x ) {
		// http://stackoverflow.com/a/34491287/463676
		for( var k in x ) {
			return false;
		}
		return true;
	}
};

/**
 * Provides methods that operate on events
 * @memberof __
 * @type {object}
 * @namespace __.e
 */
__.e = {
	/**
	 * <pre>
	 * Simply stops event propagation and prevents default
	 * behaviour for an event object
	 * </pre>
	 * @memberof __.e
	 * @method stop
	 * @example __.stop( e );
	 * @param {Object} e event object
	 */
	  stop : function( e ) {
		e.stopPropagation();
		e.preventDefault();
	}
};

/**
 * <pre>
 * Add a stylesheet rule to the page.
 * </pre>
 * @memberof __
 * @method css
 * @example __.css( "a.footer { color: red; padding : 0 }" );
 * @param {String} sStyle String of CSS style notation
 */
// REF : move to win
__.css = function( sStyle ) {
	var dn = document.createElement( 'style' );
	document.body.appendChild( dn );
	dn.innerHTML = sStyle;
};

/**
 * Provides methods that check states
 * @memberof __
 * @type {object}
 * @namespace __.b
 */
__.b = {
	/**
	 * <pre>
	 * Checks whether a string is a valid email
	 * </pre>
	 * @memberof __.b
	 * @method mail
	 * @example var bMail = __.b.mail( "john@example.com" );
	 * @param {String} s String representing an email address
	 * @returns {Booelan} Result of the check
	 */
	  mail : function( s ) {
		return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/.test( s );
	}
	/**
	 * <pre>
	 * Checks whether a string is a valid URL 
	 * </pre>
	 * @memberof __.b
	 * @method url 
	 * @example var bUrl = __.b.url( "http://example.com" );
	 * @param {String} s String representing a URL
	 * @returns {Booelan} Result of the check
	 */
	, url : function( s ) {
		return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test( v );
	}
};

/**
 * Provides methods that operate with cookies
 * @memberof __
 * @type {object}
 * @namespace __.cookie
 */
__.cookie = {
	/**
	 * <pre>
	 * Gets a cookie by name
	 * </pre>
	 * @memberof __.cookie
	 * @method get
	 * @example var sCookie = __.cookie.get( "pref" );
	 * @param {String} k String representing a cookie name
	 * @returns {String|null} Value of the cookie or null
	 */
	  get : function( k ) {
		var v = document.cookie.match( '(^|;) ?' + k + '=([^;]*)(;|$)' );
		return v ? v[ 2 ] : null;
	}
	/**
	 * <pre>
	 * Sets a cookie by name
	 * </pre>
	 * @memberof __.cookie
	 * @method set
	 * @example var sCookie = __.cookie.get( "pref", "red", 365 );
	 * @param {String} k String representing a cookie name
	 * @param {String} v Value of the cookie
	 * @param {Number} nDays lifetime of a cookie in days
	 */
	, set : function( k, v, nDays ) {
		var d = new Date;
		d.setTime( d.getTime() + 86400000 * nDays );
		document.cookie = k + "=" + v + ";path=/;expires=" + d.toGMTString();
	}
	/**
	 * <pre>
	 * Removes a cookie by name
	 * </pre>
	 * @memberof __.cookie
	 * @method del
	 * @example __.cookie.del( "pref" );
	 * @param {String} k String representing a cookie name
	 */
	, del : function( k ) {
		__.cookie.set( k, '', -1 );
	}
};

/**
 * Provides methods that operate on the URL
 * @memberof __
 * @type {object}
 * @namespace __.url
 */
// REF: move to win
__.url = {
	/**
	 * <pre>
	 * Reads parameters store from the URL or a string if passed on as argument
	 * </pre>
	 * @memberof __.url
	 * @method oParams
	 * @param {String} [url] URL string
	 * @returns {Object} An object holding key/value pairs extracted from the URL
	 */
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
};

__.dt = {
	  date : function( sdt ) {
		var dt = ( sdt )
			? new Date( sdt.replace( /\D/g, '-' ).split( '-' ) )
			: new Date();
			
		var lsDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		var lsMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		var nDay = dt.getDate();
		var sDay = lsDays[ dt.getDay() ];
		var nMonth = dt.getMonth();
		var sMonth = lsMonths[ nMonth ];
		return {
			  nDay : nDay
			, sDay : sDay
			, sDayShort : sDay.substring( 0, 3 )
			, nMonth : nMonth
			, sMonth : sMonth
			, sMonthShort : sMonth.substring( 0, 3 )
		}
	}
};

__.misc = {
	  isIE : function() {
		// http://stackoverflow.com/a/36688806/463676 
		if( navigator.appName == 'Microsoft Internet Explorer' ) {
			return true; // IE
		}
		else if( navigator.appName == "Netscape" ) {
			return navigator.appVersion.indexOf( 'Edge' ) > -1; // EDGE
		}       
		return false; 
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

