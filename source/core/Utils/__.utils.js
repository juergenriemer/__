// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __._dn; __.each; __.dn; __.dn.del; __.dn._move; __.dn.move; __.dn.move_; __.dn.add; __.dn._add; __.dn.add_; __.dn._add_; __.dn.show; __.dn.hide; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.dn.fade_; __.dn._fade; __.dn.css; __.css.h; __.s; __.s.o; __.o.empty; __.o.camelCase; __.o.tokenize; __.n; __.n.within; __.l; __.l.del; __.l.contains; __.l.equal; __.l.empty; __.l.kSort; __.l.remove; __.o; __.o.s; __.o.k; __.o.kk; __.o.add; __.o.kRename; __.o.c; __.o.copy; __.o.equal; __.o.empty; __.e; __.e.stop; __.css; __.b; __.b.mail; __.b.url; __.dt; __.dt.date; __.cookie; __.cookie.get; __.cookie.set; __.cookie.del; __.url; __.url.oParams; __.misc; __.misc.isIE; __.win; __.win.dx; __.win.dy; 
// ==/ClosureCompiler==
/**
 * @namespace __
 */

if( typeof __ == "undefined" ) {
	__ = {};
}




// STRING


/**
 * Provides methods that operate on strings 
 * @namespace String
 */




/**
 * Converts a string into an object.
 * It will return [null] if it fails.
 * @memberof String
 * @method toJson
 * @example var s = '{"sName":"John","nAge":44}';
 * var o = s.toJson();
 * @returns {Object|null} Object or null
 */
Object.defineProperty( String.prototype, "toJson", {
	  value : function() {
		try {
			return JSON.parse( this );
		}
		catch( e ) {
			return null;
		}
	}
} );

/**
 * Checks whether a string is empty after stripping of whitespaces
 * @memberof String
 * @method isEmpty
 * @example var s = "  ";
 * var bEmpty = s.isEmpty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "isEmpty", {
	value : function() {
		return ( this.trim() === "" );
	}
} );

/**
 * Uppercases the first character of a word
 * @memberof String
 * @method toCamelCase
 * @example var s = "hi mom".toCamelCase();
 * @returns {String} Camelcased string
 */
Object.defineProperty( String.prototype, "toCamelCase", {
	value : function() {
		var ls = [];
		this.split( " " ).forEach( function( s, ix ) {
			if( s ) {
				ls.push( s.substr( 0, 1 ).toUpperCase() + s.substr( 1 ) );
			}
		} );
		return ( ls.join( " " ) );
	}
} );

/**
 * Splits camelcase string into words separated by spaces
 * @memberof String
 * @method unCamelCase
 * @example var s = "HiMom".unCamelCase();
 * @returns {String} un-camelcased string
 */
Object.defineProperty( String.prototype, "unCamelCase", {
	value : function() {
		s = this.replace( /([A-Z])([a-z])/g, ' $1$2' );
		s = s.replace( /([a-z])([A-Z])/g, '$1 $2' );
		return s.trim();
	}
} );


/**
 * Tokenize a string to certain levels:
 * simple: remove spaces, quotes, newlines an lowercase
 * @memberof String
 * @method tokenize
 * @example var s = "Hi 'Mom'".tokenize(); // himom
 * @param {String} [sType] string to indicate level (default is simple)
 * @returns {String} tokenized string
 */
Object.defineProperty( String.prototype, "tokenize", {
	value : function( sType ) {
		var s = this;
		if( ! sType || sType == "simple" ) {
			s = s.replace( /\s/g, "" );
			s = s.replace( /'/g, "" );
			s = s.replace( /"/g, "" );
			return s.toLowerCase();
		}
		return s;
	}
} );

/**
 * Sanitizes a string by removing tags only
 * @memberof String
 * @method sanitize
 * @example var s = "Hi 'Mom'".sanitize(); // himom
 * @returns {String} sanitized string
 */
// REF: unit test this
Object.defineProperty( String.prototype, "sanitize", {
	value : function() {
		return this.replace( /<(?:.|\n)*?>/gm, "" );
	}
} );


/**
 * Checks whether a string is a valid email
 * @memberof String
 * @method isEmail
 * @example var bEmail = "john@example.com".isEmail();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "isEmail", {
	value : function() {
		return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/.test( this );
	}
} );

/**
 * Checks whether a string is a valid URL 
 * @memberof String
 * @method isUrl 
 * @example var bUrl = "http://example.com".isUrl();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "isUrl", {
	value : function() {
		return /^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test( this );
	}
} );




// OBJECTS



/**
 * Provides methods that operate on objects 
 * @namespace Object 
 */







/**
 * Converts an object into a string
 * Uses JSON.stringify therefore returns null in case of circular references
 * @memberof Object
 * @method stringify
 * @example var o = { sName : "John", nAge : 44 }
 * var s = o.stringify();
 * @returns {string} String representation of the object.
 */
Object.defineProperty( Object.prototype, "stringify", {
	value : function() {
		try {
			return JSON.stringify( this );
		}
		catch( e ) {
			return null;
		}
	}
} );

/**
 * Retrieve the structure of an object including its string size
 * array of arrays containing key paths as string and a sorted 
 * copy of the object passed on
 * @memberof Object
 * @method struc 
 * @example var o = { sName : "John", nAge : 44 };
 * var oStruc = o1.struc();
 * @param {Object} o1 object to be examined 
 * @returns {Object} result of comparison
		  o : copy of object 
		, nLength : string size 
		, lsStruc : arrays of keys
 */
Object.defineProperty( Object.prototype, "struc", {
	value : function( o ) {
		var presort = function( a, b ) {
			var _a = ( a && a.sort ) ? a.sort() : a;
			var _b = ( b && b.sort ) ? b.sort() : b;
			return _a > _b;
		};
		var s = o.stringify();
		var nLength = s.length;
		var _o = s.toJson();
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
} );
/**
 * Check if two objects contain the same data
 * @memberof Object
 * @method equal
 * @example var o1 = { sName : "John", nAge : 44 };
 * var o2 = { sName : "John", nAge : 44 };
 * var bEqual = __.o.equal( o1, o2 );
 * @param {Object} o1 first object to be compared 
 * @param {Object} o2 second object to be compared 
 * @returns {Boolean} true if objects are equal, false if not
 */
Object.defineProperty( Object.prototype, "equal", {
	value : function( oOther ) {
		return this._compare_( oOther ).b; 
	}
} );

/**
 * Compare two objects and retrieve their differences
 * @memberof Object
 * @method diff
 * @example var o1 = { sName : "John", nAge : 44 };
 * var o2 = { sName : "John", nAge : 23, bMarried : true };
 * var oDiff = o1.diff( o2 );
 * @param {Object} o2 second object to be compared 
 * @returns {Object|null} returns an object of two objects holding
 * an array of differences found for each of the two object passed on or null if they are identical
 */
Object.defineProperty( Object.prototype, "diff", {
	value : function( o2 ) {
		var ldiff1 = this._compare_( o2 ); 
		if( ldiff1.b ) {
			return null;
		}
		var ldiff2 = o2._compare_( this ); 
		return {
			  o1 : ldiff1.ldiff
			, o2 : ldiff2.ldiff
		};
	}
} );

Object.defineProperty( Object.prototype, "_compare_", {
	value : function( o2 ) {
		var b = true;
		var ldiff = [];
		var oStruc1 = this.struc( this );
		var oStruc2 = this.struc( o2 );
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
} );


/**
 * Return (first) key of an object
 * @memberof Object
 * @method getKey
 * @example var kv = { "country" : "Belgium" }
 * var k = kv.getKey(); // key
 * @returns {String} k string of key or null if no assoc
 */
Object.defineProperty( Object.prototype, "getKey", {
	value : function() {
		for( var k in this ) {
			return k;
		}
		return null;
	}
} );

/**
 * Return keys of an object.
 * @memberof Object
 * @method getKeys
 * @example var o = { sName : "John", nAge : 44 }
 * var lk = o.getKeys(); // [ "sName", "nAge" ]
 * @returns {array} Array of keys
 */
Object.defineProperty( Object.prototype, "getKeys", {
	value : function() {
		if( Object && Object.keys ) {
			return Object.keys( this );
		}
		else {
			var l = [];
			for( var k in this ) {
				l.push( k );
			}
			return l;
		}
	}
} );

/**
 * Adds an object to an existing object.
 * @memberof Object
 * @method add
 * @example var oOrig = { sName : "John", nAge : 44 }
 * var oNew = { email : "john@example.com", id : 123 }
 * oOrig.add( oNew );
 * @param {Object} onew object to be added
 */
Object.defineProperty( Object.prototype, "add", {
	  value : function( onew ) {
		if( onew ) {
			for( var s in onew ) {
				this[ s ] = onew[ s ];
			} 
		} 
	}
} );



/**
 * Rename a key of an object.
 * @memberof Object
 * @method kRename
 * @example var o = { sName : "John", nAge : 44 }
 * o.kRename( "sName", "sFirstName" );
 * @param {String} kold key to be renamed
 * @param {String} knew new key name
 */
// http://stackoverflow.com/a/14592469/463676
// REF: is this IE10 compatible?
Object.defineProperty( Object.prototype, "kRename", {
	value : function( kold, knew ) {
			Object.defineProperty(
				  this
				, knew
				, Object.getOwnPropertyDescriptor( this, kold )
			);
			delete this[ kold ];
		try {
		} catch( e ) {
			console.warn( 'kRename: o is no object' );
		}
	}
} );

/**
 * Counts first level elements of an object
 * @memberof Object
 * @method kCount 
 * @example var o = { sName : "John", nAge : 44 }
 * var c =o.kCount(); // 2
 * @returns {Number} count of elements
 */
Object.defineProperty( Object.prototype, "kCount", {
	value : function() {
		var _c = 0;
		for( var k in this ) {
			if( this.hasOwnProperty( k ) ) {
				++_c;
			}
		}
		return _c;
	}
} );

/**
 * Create a copy of an object
 * @memberof Object
 * @method copy 
 * @example var o = { sName : "John", nAge : 44 }
 * var oNew = o.copy();
 * @returns {Object} Copy of the object
 */
Object.defineProperty( Object.prototype, "copy", {
	value : function() {
		try {
			return JSON.parse( JSON.stringify( this ) );
		}
		catch( e ) {
			return null;
		}
	}
} );

/**
 * Checks whether an object is empty
 * @memberof Object
 * @method isEmpty
 * @example var o = {};
 * var bEmpty = o.isEmpty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( Object.prototype, "isEmpty", {
	value : function() {
		// http://stackoverflow.com/a/34491287/463676
		for( var k in this ) {
			return false;
		}
		return true;
	}
} );






// NUMBER
/**
 * Provides methods that operate on numbers
 * @namespace Number 
 */





/**
 * Receives a number and an array of min and max value
 * and returns the value of the number or either min or
 * max value if the number lies outside those boundaries
 * @memberof Number
 * @method within 
 * @example var n = 1.within( 5, 9 ); // 1
 * @param {Number} min minimum value
 * @param {Number} max maximum value
 * @returns {Number} value of number within boundaries
 */
Object.defineProperty( Number.prototype, "within", {
	value : function( min, max ) {
		var n = this;
		n = ( n < min ) ? min : n;
		n = ( n > max ) ? max : n;
		return n;
	}
} );



// ARRAY
/**
 * Provides methods that operate on arrays
 * @namespace Array
 */



/**
 * Converts an array into a string
 * Uses JSON.stringify therefore returns null in case of circular references
 * @memberof Object
 * @method stringify
 * @example var l = [1,2,3]
 * var s = l.stringify();
 * @returns {string} String representation of the object.
 */
Object.defineProperty( Array.prototype, "xxxxxstringify", {
	value : function() {
		try {
			return JSON.stringify( this );
		}
		catch( e ) {
			return null;
		}
	}
} );




/**
 * Remove an element from a list
 * @memberof Array
 * @method del
 * @example var l = [ 1, 3, 7 ];
 * var l = l.del( 7 );
 * @param {String|Number} x Element we want to remove
 * @returns {Booelan} Result of the check whether list holds the element
 */
Object.defineProperty( Array.prototype, "del", {
	value : function( el ) {
		var ix = this.indexOf( el );
		if( ix > -1 ) {
			this.splice( ix, 1 );
			this.del( el );
		}
	}

} );

/**
 * Checks whether a list contains an element
 * @memberof Array
 * @method contains
 * @example
 * var l = [ 1, 3, 7 ];
 * var b7 = l.contains( 7 );
 * @result
 * (b7 == true);
 * @param {String|Number} x Element we are looking for
 * @returns {Booelan} Result of the check whether list holds the element
 */
Object.defineProperty( Array.prototype, "contains", {
	value : function( el ) {
		return ( this.indexOf( el ) > -1 );
	}
} );

/**
 * Check if two arrays contain exactly the same data.
 * NB: it is not sorting the array. If you don't want to
 * keep the order use __.o.equal method instead.
 * @memberof __.l
 * @method equal
 * @example var l1 = [ 1, 2, 3 ];
 * var l2 = [ 1, 2, 3 ];
 * var bEqual = __.l.equal( l1, l2 );
 * @param {Array} l1 first array to be compared 
 * @param {Array} l2 second array to be compared 
 * @returns {Boolean} result of comparison
 */
Object.defineProperty( Array.prototype, "equal", {
	value : function( lOther ) {
		return ( this.join( "-" ) === lOther.join( "-" ) );
	}
} );

/**
 * Checks whether a list is empty
 * @memberof Array
 * @method empty
 * @example var l = [];
 * var bEmpty = l.empty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( Array.prototype, "empty", {
	value : function() {
		return this.length == 0;
		return __.o.s( l ) === "[]";
	}
} );

/**
 * Sorts an array of objects by an object's key
 * @memberof Array
 * @method empty
 * @example var lo = [ { v : 12 }, { x : 11 }, { s : "x" }, { v : 2 } ];
 * lo = lo.kSort( lo, "v" );
 * @result lo == [ { x : 11, s : "x", v : 2, v : 12 } ]
 * @param {String} k key we want to sort by
 * @returns {Array} Sorted array of objects
 */
Object.defineProperty( Array.prototype, "kSort", {
	value : function( k ) {
		return this.sort( function( a, b ) {
			if( ! a.hasOwnProperty( k ) ) {
				return 1;
			} 
			else if( ! b.hasOwnProperty( k ) ) {
				return 0;
			} 
//console.log(  a[ k ] - b[ k ]  );
			return ( a[ k ] > b[ k ] );
		} );
	}
} );


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

