// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.utils.min.js
// @js_externs var __; __.e; __.e.stop; __.utils; __.css; __.utils.dt; __.utils.dt.date; __.cookie; __.cookie.get; __.cookie.set; __.cookie.del; __.url; __.url.oParams; __.misc; __.misc.isIE;
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
 * @method __toJson
 * @example var s = '{"sName":"John","nAge":44}';
 * var o = s.__toJson();
 * @returns {Object|null} Object or null
 */
Object.defineProperty( String.prototype, "__toJson", {
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
 * @method __isEmpty
 * @example var s = "  ";
 * var bEmpty = s.__isEmpty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "__isEmpty", {
	value : function() {
		return ( this.trim() === "" );
	}
} );

/**
 * Uppercases the first character of a word
 * @memberof String
 * @method __toCamelCase
 * @example var s = "hi mom".__toCamelCase();
 * @returns {String} Camelcased string
 */
Object.defineProperty( String.prototype, "__toCamelCase", {
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
 * @method __unCamelCase
 * @example var s = "HiMom".__unCamelCase();
 * @returns {String} un-camelcased string
 */
Object.defineProperty( String.prototype, "__unCamelCase", {
	value : function() {
		s = this.replace( /([A-Z])([a-z])/g, ' $1$2' );
		s = s.replace( /([a-z])([A-Z])/g, '$1 $2' );
		return s.trim();
	}
} );


/**
 * Tokenize a string to certain levels:
 * simple: remove spaces, quotes, newlines an puts to lowercase
 * @memberof String
 * @method __tokenize
 * @example var s = "Hi 'Mom'".__tokenize(); // himom
 * @param {String} [sType] string to indicate level (default is simple)
 * @returns {String} tokenized string
 */
Object.defineProperty( String.prototype, "__tokenize", {
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
 * Checks whether a string is a valid email
 * @memberof String
 * @method __isEmail
 * @example var bEmail = "john@example.com".__isEmail();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "__isEmail", {
	value : function() {
		return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/.test( this );
	}
} );

/**
 * Checks whether a string is a valid URL 
 * @memberof String
 * @method __isUrl 
 * @example var bUrl = "http://example.com".__isUrl();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( String.prototype, "__isUrl", {
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
 * @method __toString
 * @example var o = { sName : "John", nAge : 44 }
 * var s = o.__toString();
 * @returns {string} String representation of the object.
 */
Object.defineProperty( Object.prototype, "__toString", {
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
 * @method __struc 
 * @example var o = { sName : "John", nAge : 44 };
 * var oStruc = o1.__struc();
 * @param {Object} o1 object to be examined 
 * @returns {Object} result of comparison
		  o : copy of object 
		, nLength : string size 
		, lsStruc : arrays of keys
 */
Object.defineProperty( Object.prototype, "__struc", {
	value : function() {
		var presort = function( a, b ) {
			var _a = ( a && a.sort ) ? a.sort() : a;
			var _b = ( b && b.sort ) ? b.sort() : b;
			return _a > _b;
		};
		var s = this[ "__toString" ]();
		var nLength = s.length;
		var _o = s[ "__toJson" ]();
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
 * @method __equal
 * @example var o1 = { sName : "John", nAge : 44 };
 * var o2 = { sName : "John", nAge : 44 };
 * var bEqual = o.__equal( o1 );
 * @param {Object} o1 first object to be compared 
 * @param {Object} o2 second object to be compared 
 * @returns {Boolean} true if objects are equal, false if not
 */
Object.defineProperty( Object.prototype, "__equal", {
	value : function( oOther ) {
		return this[ "__compareTo" ]( oOther ).isEqual;
	}
} );

/**
 * Compare two objects and retrieve their differences
 * @memberof Object
 * @method __compareTo
 * @example var o1 = { sName : "John", nAge : 44 };
 * var o2 = { sName : "John", nAge : 23, bMarried : true };
 * var oDiff = o1.__compareTo( o2 );
 * @param {Object} o2 second object to be compared 
 * @returns {Object|null} returns an object of two objects holding
 * an array of differences found in the second object.
 */
Object.defineProperty( Object.prototype, "__compareTo", {
	value : function( o2 ) {
		var isEqual = true;
		var ldiff = [];
		var oStruc1 = this[ "__struc" ]();
		var oStruc2 = o2[ "__struc" ]();
		if( oStruc1.nLength !== oStruc2.nLength ) {
			ldiff.push( [ "length", ,oStruc1.nLength, oStruc2.nLength ] );
			isEqual = false;
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
					isEqual = false;
					break;
				}
				else if( typeof x2 === "undefined" ) {
					ldiff.push( [ "miss", s, x1, x2 ] );
					isEqual = false;
					break;
				}
				else if( x1 instanceof Date || x1 instanceof Function ) {
					x1 = x1.toString().replace( /\s/g, "" );
					x2 = x2.toString().replace( /\s/g, "" );
				}
				else if( typeof x1 !== "object" ) {
					if( x1 !== x2 ) {
						isEqual = false;
						ldiff.push( [ "diff", s, x1, x2 ] );
					}
				}
			}
		} );
		return {
			  isEqual : isEqual
			, ldiff : ldiff
		};
	}
} );

/**
 * Compare two objects and retrieve their differences
 * @memberof Object
 * @method __diff
 * @example var o1 = { sName : "John", nAge : 44 };
 * var o2 = { sName : "John", nAge : 23, bMarried : true };
 * var oDiff = o1.__diff( o2 );
 * @param {Object} o2 second object to be compared 
 * @returns {Object|null} returns an object of two objects holding
 * an array of differences found for each of the two object passed on or null if they are identical
 */
Object.defineProperty( Object.prototype, "__diff", {
	value : function( o2 ) {
		var ldiff1 = this[ "__compareTo" ]( o2 );
		if( ldiff1.isEqual ) {
			return null;
		}
		var ldiff2 = o2[ "__compareTo" ]( this ); 
		return {
			  "o1" : ldiff1.ldiff
			, "o2" : ldiff2.ldiff
		};
	}
} );


/**
 * Return (first) key of an object
 * @memberof Object
 * @method __getKey
 * @example var kv = { "country" : "Belgium" }
 * var k = kv.__getKey(); // key
 * @returns {String} k string of key or null if no assoc
 */
Object.defineProperty( Object.prototype, "__getKey", {
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
 * @method __getKeys
 * @example var o = { sName : "John", nAge : 44 }
 * var lk = o.__getKeys(); // [ "sName", "nAge" ]
 * @returns {array} Array of keys
 */
Object.defineProperty( Object.prototype, "__getKeys", {
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
 * @method __add
 * @example var oOrig = { sName : "John", nAge : 44 }
 * var oNew = { email : "john@example.com", id : 123 }
 * oOrig.__add( oNew );
 * @param {Object} onew object to be added
 */
Object.defineProperty( Object.prototype, "__add", {
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
 * @method __kRename
 * @example var o = { sName : "John", nAge : 44 }
 * o.__kRename( "sName", "sFirstName" );
 * @param {String} kold key to be renamed
 * @param {String} knew new key name
 */
// http://stackoverflow.com/a/14592469/463676
// REF: is this IE10 compatible?
Object.defineProperty( Object.prototype, "__kRename", {
	value : function( kold, knew ) {
			Object.defineProperty(
				  this
				, knew
				, Object.getOwnPropertyDescriptor( this, kold )
			);
			delete this[ kold ];
		try {
		} catch( e ) {
			console.warn( '__kRename: o is no object' );
		}
	}
} );

/**
 * Counts first level elements of an object
 * @memberof Object
 * @method __kCount 
 * @example var o = { sName : "John", nAge : 44 }
 * var c =o.__kCount(); // 2
 * @returns {Number} count of elements
 */
Object.defineProperty( Object.prototype, "__kCount", {
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
 * @method __copy 
 * @example var o = { sName : "John", nAge : 44 }
 * var oNew = o.__copy();
 * @returns {Object} Copy of the object
 */
Object.defineProperty( Object.prototype, "__copy", {
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
 * @method __isEmpty
 * @example var o = {};
 * var bEmpty = o.__isEmpty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( Object.prototype, "__isEmpty", {
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
 * @method __withinBoundary
 * @example var n1 = 1;
 * var n2 = n1.__withinBoundary( 5, 9 ); // 5
 * @param {Number} min minimum value
 * @param {Number} max maximum value
 * @returns {Number} value of number within boundaries
 */
Object.defineProperty( Number.prototype, "__withinBoundary", {
	value : function( min, max ) {
		var n = this;
		n = ( n < min ) ? min : n;
		n = ( n > max ) ? max : n;
		return n;
	}
} );


/**
 * Sanitizes any given string.
 * @memberof String
 * @method __sanitize
 * @example var us_sName = "Henry<script>alert(666)</script>"
 * var sName = us_sName.__sanitize();
 * @returns {String} Sanitized string
 */
Object.defineProperty( String.prototype, "__sanitize", {
	value : function() {
		us_h = this.toString() || "";
		var dnWrapper = document.createElement( "div" );
		dnWrapper.appendChild( document.createTextNode( us_h ) );
		return dnWrapper.innerHTML;
	}
} );

// ARRAY
/**
 * Provides methods that operate on arrays
 * @namespace Array
 */




/**
 * Remove an element from a list
 * @memberof Array
 * @method __remove
 * @example var l = [ 1, 3, 7 ];
 * var l = l.__remove( 7 );
 * @param {String|Number} x Element we want to remove
 */
Object.defineProperty( Array.prototype, "__remove", {
	value : function( el ) {
		var ix = this.indexOf( el );
		if( ix > -1 ) {
			this.splice( ix, 1 );
			this[ "__remove" ]( el );
		}
	}

} );

/**
 * Checks whether a list contains an element
 * @memberof Array
 * @method __contains
 * @example
 * var l = [ 1, 3, 7 ];
 * var b7 = l.__contains( 7 );
 * @result
 * (b7 == true);
 * @param {String|Number} x Element we are looking for
 * @returns {Booelan} Result of the check whether list holds the element
 */
Object.defineProperty( Array.prototype, "__contains", {
	value : function( el ) {
		return ( this.indexOf( el ) > -1 );
	}
} );


/**
 * Checks whether a list is empty
 * @memberof Array
 * @method __empty
 * @example var l = [];
 * var bEmpty = l.__empty();
 * @returns {Booelan} Result of the check
 */
Object.defineProperty( Array.prototype, "__empty", {
	value : function() {
		return this.length == 0;
		return __.o.s( l ) === "[]";
	}
} );

/**
 * Sorts an array of objects by an object's key
 * @memberof Array
 * @method __kSort
 * @example var lo = [ { v : 12 }, { x : 11 }, { s : "x" }, { v : 2 } ];
 * lo = lo.__kSort( lo, "v" );
 * @result lo == [ { x : 11, s : "x", v : 2, v : 12 } ]
 * @param {String} k key we want to sort by
 * @returns {Array} Sorted array of objects
 */
Object.defineProperty( Array.prototype, "__kSort", {
	value : function( k ) {
		return this.sort( function( a, b ) {
			var nReturn = 1;
			if( ! a.hasOwnProperty( k ) || typeof a[k] == "undefined" ) {
				return 1;
				nReturn = 1;
			} 
			else if( ! b.hasOwnProperty( k ) || typeof b[k] == "undefined" ) {
				return -1;
				nReturn = 0;
			} 
			if( a[ k ] < b[ k ] ) {
				return -1;
			} else if( a[ k ] > b[ k ] ) {
				return 1;
			}
			return 0;
		} );

	}
} );


/**
 * Add a stylesheet rule to the page.
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
	 * Gets a cookie by name
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
	 * Sets a cookie by name
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
	 * Removes a cookie by name
	 * @memberof __.cookie
	 * @method remove
	 * @example __.cookie.remove( "pref" );
	 * @param {String} k String representing a cookie name
	 */
	, remove : function( k ) {
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
	 * Reads parameters store from the URL or a string if passed on as argument
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

__.utils = {};
__.utils.dt = {
	  date : function( sdt ) {
		var dt = ( sdt )
			? new Date( sdt.replace( /\D/g, '-' ) )
			: new Date();
			
		var lsDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		var lsMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		var nDay = dt.getDate();
		var sDay = lsDays[ dt.getDay() ];
		var nMonth = dt.getMonth();
		var sMonth = lsMonths[ nMonth ];
		return {
			  "nDay" : nDay
			, "sDay" : sDay
			, "sDayShort" : sDay.substring( 0, 3 )
			, "nMonth" : nMonth
			, "sMonth" : sMonth
			, "sMonthShort" : sMonth.substring( 0, 3 )
		}
	}
};

__.utils.misc = {
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

