// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __.dn._dn; __.dn.del; __.dn; __.dn._move; __.dn.move; __.dn.move_; __.dn._add; __.dn.add; __.dn.add_; __.dn.hide; __.dn.show; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.each; __.css; __.e; __.b; __.b.email; __.b.url; __.cookies; __.cookies.get; __.cookies.set; __.cookies.del; __.url; __.url.oParams; __.o; __.o.s; __.o.add; __.o.kRename; __.o.copy; __.o.empty; __.s; __.s.o; __.s.empty; __.l; __.l.del; __.l.contains; __.l.empty;
// ==/ClosureCompiler==
// version 1.5
/**
 * @version 1.0
 * @namespace __
 */
__ = {
	/**
	 * <pre>
	 * Takes a CSS selector string and queries the DOM for matching nodes.
	 * It returns a single DOM node if just one node was found.
	 * It returns a list of DOM nodes if multiple were found.
	 * It will return [null] in case nothing was found.
	 * An optional DOM node as starting point can be passed on otherwise [document] is used.
	 * An optional callback function to be applied on returned nodes can be passed on which
	 * will be invoked with two parameters: the single node and its index of the array.
	 * </pre>
	 * @memberof __
	 * @method dn_
	 * @example var dnMenu = __.dn_( "#menu" );
	 * @example var ldnLinks = __.dn_( "a.footer", dnMenu );
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
	/**
	 * <pre>
	 * Takes a CSS selector string and queries the DOM for the closest matching parent node.
	 * It returns a DOM node.
	 * It will return [null] in case nothing was found.
	 * An optional callback function to be applied on the returned node. It will be invoked with
	 * one parameter: the single node
	 * </pre>
	 * @memberof __
	 * @method _dn
	 * @example var dnInput = __.dn_( "[name='email']" );
	 * var dnForm = __._dn( "form", dnInput );
	 * @example __._dn( "div.the-form", dnInput, function( dn ) {
	 *     dn.style.border = "1px solid red";
	 *     dn.style.padding = "1em";
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
	/**
	 * <pre>
	 * Receives either an element or an array and a callback function.
	 * In case of an array it iterates and invokes the callback on each element.
	 * In case an element it invokes the callback directly.
	 * The callback is invoked with two parameters: the element and its index.
	 * </pre>
	 * @memberof __
	 * @method each
	 * @example var ls = [ "one", "two", "three" ];
	 * __.each( ls, function( s, ix ) {
	 *     console.log( ix + ". " + s ); 
	 * } );
	 * @example var dn1 = __.dn_( "[href='#one']" );
	 * var dn2 = __.dn_( "[href='#two']" );
	 * var dn3 = __.dn_( "[href='#three']" );
	 * var ldn = [ dn1, dn2, dn3 ];
	 * __.each( ldn, function( dn ) {
	 *     dn.style.color = "red";
	 * } );
	 * @example __.each( dn, function( dn ) {
	 *     dn.style.color = "red";
	 * } );
	 * @param {Array|Element} xdn Array or a single element
	 * @param {Function} fn callback function
	 */
	, each : function( xdn, fn ) {
		var ldn = ( ! isNaN( xdn.length ) ) ? xdn : [ xdn ];
		var c = ldn.length;
		for( var ix=0; ix<c; ix++ ) {
			fn( ldn[ ix ], ix );
		}
	}
	/**
	 * Provides methods that operate on a single DOM node.
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
		 * @example var dnForm = __.dn_( "form" );
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
		 * __.dn._move( dn2, dn1 );
		 */
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
			if( dnMove.length ) {
				__.each( dnMove, function( dn ) {
					dnTarget.appendChild( dn );
				} );
			}
			else {
				dnTarget.appendChild( dnMove );
			}
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
			if( dnMove.length ) {
				__.each( dnMove, function( dn ) {
					dnTarget.parentNode.insertBefore( dn, dnTarget.nextSibling );
				} );
			}
			else {
				dnTarget.parentNode.insertBefore( dnMove, dnTarget.nextSibling );
			}
		}
		/**
		 * <pre>
		 * Takes an HTML string, converts it into DOM node(s) and writes inside of an existing DOM node.
		 * It returns a single DOM node if HTML string has one root tag.
		 * It returns a list of DOM nodes if HTML string has multiple root tags.
		 * An optional DOM node as target DOM node can be passed on otherwise [document] is used.
		 * An optional callback function to be applied on created nodes can be passed on which will be
		 * invoked with two parameters: the single node and its index of the array
		 * </pre>
		 * @memberof __.dn
		 * @method add
		 * @example var dnUL = __.dn.add( "<ul class='colors'></ul>" );
		 * @example var h = "<li>red</li>";
		 * var lnLI = __.dn.add( h, dnUL );
		 * @example var h = "<li>red</li>";
		 * var lnLI = __.dn.add( h, dnUL, function( dn, ix ) {
		 *     dn.style.color = dn.textContent;
		 *     dn.textContent = ix + ". " + dn.textContent;
		 * } );
		 * @param {String} h String of valid HTML.
		 * @param {Element|Function} [x1] target node or callback function
		 * @param {Function} [x2] callback function
		 * @returns {Element|Array} A DOM node or a list of DOM nodes
		 */
		, add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "move" );
		}
		/**
		 * Same as [add] with the difference that the DOM node(s) are not inserted into the existing DOM
		 * node but right in front of it.
		 * @memberof __.dn
		 * @method _add
		 * @example var dnLogin = __.dn_( "[name='login']" );
		 * var h = "<div>At least 8 characters</div>";
		 * var dnRule = __.dn._add( h, dnLogin );
		 * @param {String} h String of valid HTML.
		 * @param {Element|Function} [x1] target node or callback function
		 * @param {Function} [x2] callback function
		 * @returns {Element|Array} A DOM node or a list of DOM nodes
		 */
		, _add : function( h, x1, x2 ) {
			return __.dn._add_( h, x1, x2, "_move" );
		}
		/**
		 * Same as [add] with the difference that the DOM node(s) are not inserted into the existing DOM
		 * node but right after of it.
		 * @memberof __.dn
		 * @method add_
		 * @example var dnComment = __.dn_( "[name='comment']" );
		 * var h = "<a href='#clear'>clear</a>";
		 * var dnRule = __.dn.add_( h, dnComment );
		 * @param {String} h String of valid HTML.
		 * @param {Element|Function} [x1] target node or callback function
		 * @param {Function} [x2] callback function
		 * @returns {Element|Array} A DOM node or a list of DOM nodes
		 */
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
		/**
		 * <pre>
		 * Shows a DOM node.
		 * It sets the display attribute of a DOM node to "block" or "inline" depending on its original state.
		 * </pre>
		 * @memberof __.dn
		 * @method show
		 * @example __.dn.show( dnInline );
		 * @param {Element} dn DOM node to be shown
		 */
		, show : function( dn ) {
			if( dn.style.display != "none" ) {
				return;
			}
			var sDisplay = ( dn.hasAttribute( "__.display" ) )
				? dn.getAttribute( "__.display" )
				: "block";
			dn.style.display = sDisplay;
		}
		/**
		 * <pre>
		 * Hides a DOM node.
		 * It sets the display attribute of a DOM node to "none" preserving the previous value.
		 * </pre>
		 * @memberof __.dn
		 * @method hide
		 * @example __.dn.hide( dnInline );
		 * @param {Element} dn DOM node to be hidden
		 */
		, hide : function( dn ) {
			if( dn.style.display == "none" ) {
				return;
			}
			var sDisplay = getComputedStyle( dn ).display;
			dn.setAttribute( "__.display", sDisplay ); 
			dn.style.display = "none";
		}
		/**
		 * <pre>
		 * Returns the index of a DOM node in its parent's children list.
		 * </pre>
		 * @memberof __.dn
		 * @method ix 
		 * @example __.dn.ix( dnLI );
		 * @param {Element} dn DOM node
		 */
		, ix : function( dn ) {
			var ix = 0;
			while( ( dn = dn.previousSibling ) != null ) {
				ix++;
			}
			return ix;
		}
		/**
		 * <pre>
		 * Gets or sets the x-position of a DOM element
		 * </pre>
		 * @memberof __.dn
		 * @method x 
		 * @example __.dn.x( dn, 300 );
		 * @example var x = __.dn.x( dn );
		 * @param {Element} dn DOM node
		 * @param {Integer} [n] x-position in pixels
		 * @returns {Element} x-position in pixels
		 */
		, x : function( dn, n ) {
			if( n ) {
				dn.style.left = parseInt( n ) + "px";
			}
			else {
				return dn.getBoundingClientRect().left;
			}
		}
		/**
		 * <pre>
		 * Gets or sets the y-position of a DOM element
		 * </pre>
		 * @memberof __.dn
		 * @method y 
		 * @example __.dn.x( dn, 300 );
		 * @example var y = __.dn.y( dn );
		 * @param {Element} dn DOM node
		 * @param {Integer} [n] y-position in pixels
		 * @returns {Element} y-position in pixels
		 */
		, y : function( dn, n ) {
			if( n ) {
				dn.style.top = parseInt( n ) + "px";
			}
			else {
				return dn.getBoundingClientRect().top;
			}
		}
		/**
		 * <pre>
		 * Gets or sets the width of a DOM element
		 * </pre>
		 * @memberof __.dn
		 * @method dx 
		 * @example __.dn.dx( dn, 300 );
		 * @example var dx = __.dn.dx( dn );
		 * @param {Element} dn DOM node
		 * @param {Integer} [n] width in pixels
		 * @returns {Element} width in pixels
		 */
		, dx : function( dn, dx ) {
			if( dx ) {
				dn.style.width = parseInt( dx ) + "px";
			}
			else {
				return dn.getBoundingClientRect().width;
			}
		}
		/**
		 * <pre>
		 * Gets or sets the height of a DOM element
		 * </pre>
		 * @memberof __.dn
		 * @method dy 
		 * @example __.dn.dy( dn, 300 );
		 * @example var dy = __.dn.dy( dn );
		 * @param {Element} dn DOM node
		 * @param {Integer} [n] height in pixels
		 * @returns {Element} height in pixels
		 */
		, dy : function( dn, dy ) {
			if( dy ) {
				dn.style.height = parseInt( dy ) + "px";
			}
			else {
				return dn.getBoundingClientRect().height;
			}
		}
		/**
		 * <pre>
		 * Lets an element fade out
		 * </pre>
		 * @memberof __.dn
		 * @method fade_
		 * @example __.dn.fade_( dn );
		 * @example __.dn.fade_ = __.dn.fadeOut( dn, 25, function() {
		 *     __.dn.del( dn );
		 * } );
		 * @param {Element} dn DOM node
		 * @param {Integer} [ms] milliseconds it should take to fade out
		 * @param {Function} callback function to be invoked after element was faded out.
		 */
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
		/**
		 * <pre>
		 * Lets an element fade in
		 * </pre>
		 * @memberof __.dn
		 * @method _fade
		 * @example __.dn._fade( dn );
		 * @example __.dn._fade = __.dn.fadeOut( dn, 1000 );
		 * @param {Element} dn DOM node
		 * @param {Integer} [ms] milliseconds it should take to fade in 
		 * @param {Function} callback function to be invoked after element was faded in.
		 */
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
	/**
	 * Provides methods that operate on strings
	 * @memberof __
	 * @type {object}
	 * @namespace __.s
	 */
	, s : {
		/**
		 * <pre>
		 * Converts a string into an object.
		 * It will return [null] if it fails.
		 * </pre>
		 * @memberof __.s
		 * @method o
		 * @example var s = "{'sName':'John','nAge':44}";
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
			return ( s.trim() == "" );
		}
		/**
		 * <pre>
		 * Uppercases the first character of a word
		 * </pre>
		 * @memberof __.s
		 * @method camelcase
		 * @example var s = __.s.camelcase( "hi mom" );
		 * @param {String} s string we want to camelcase
		 * @returns {String} Camelcased string
		 */
		, camelcase : function( s ) {
			var ls = s.split( " " );
			ls.forEach( function( s, ix ) {
				ls[ ix ] = s.substr( 0, 1 ).toUpperCase() + s.substr( 1 );
			} );
			return ( ls.join( " " ) );
		}
		/**
		 * <pre>
		 * Tokenize a string to certain levels:
		 * simple: remove spaces an lowercase
		 * </pre>
		 * @memberof __.s
		 * @method tokenize
		 * @example var s = __.s.tokenize( "Hi Mom" ); // himom
		 * @param {String} s string we want to tokenize
		 * @param {String} [sType] string to indicate level (default is simple)
		 * @returns {String} tokenized string
		 */
		, tokenize : function( s, sType ) {
			if( ! sType || sType == "simple" ) {
				s = s.replace( / /g, "" );
				return s.toLowerCase();
			}
			return s;
		}
	}
	/**
	 * Provides methods that operate on lists
	 * @memberof __
	 * @type {object}
	 * @namespace __.l
	 */
	, l : {
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
			}
			return l;
		}
		/**
		 * <pre>
		 * Checks whether a list contains an element
		 * </pre>
		 * @memberof __.l
		 * @method contains
		 * @example var l = [ 1, 3, 7 ];
		 * var b7 = __.l.contains( l, 7 );
		 * @param {Array} l list we want to examine
		 * @param {String|Number} x Element we are looking for
		 * @returns {Booelan} Result of the check whether list holds the element
		 */
		, contains : function( l, x ) {
			return ( l.indexOf( x ) > -1 );
		}
		/**
		 * <pre>
		 * Check if two arrays contain exactly the same data
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
			return ( l1.join( "-" ) == l2.join( "-" ) );
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
			var c = l.length;
			return ! ( ! isNaN( c ) && c > 0 ); 
		}
	}
	/**
	 * Provides methods that operate on objects
	 * @memberof __
	 * @type {object}
	 * @namespace __.o
	 */
	, o : {
		/**
		 * <pre>
		 * Converts an object into a string
		 * </pre>
		 * @memberof __.o
		 * @method s
		 * @example var o = { sName : "John", nAge : 44 }
		 * var s = __.o.s( o );
		 * @param {Object} o Object to be stringified.
		 * @returns {string} String representation of the object.
		 */
		  s : function( o ) {
			return JSON.stringify( o );
		}
		/**
		 * <pre>
		 * Return keys of an object.
		 * </pre>
		 * @memberof __.o
		 * @method k
		 * @example var o = { sName : "John", nAge : 44 }
		 * var lk = __.o.k( o ); // [ "sName", "nAge" ]
		 * @param {Object} o object
		 * @returns {array} Array of keys
		 */
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
		/**
		 * <pre>
		 * Adds an object to an existing object.
		 * </pre>
		 * @memberof __.o
		 * @method add
		 * @example var oOrig = { sName : "John", nAge : 44 }
		 * var oNew = { email : "john@example.com", id : 123 }
		 * __.o.add( oNew, oOrig );
		 * @param {Object} ocur Existing object
		 * @param {Object} onew object to be added
		 */
		, add : function( ocur, onew ) {
			for( var s in onew ) {
				ocur[ s ] = onew[ s ];
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
		, kRename : function( o, kold, knew ) {
			Object.defineProperty(
				  o
				, knew
				, Object.getOwnPropertyDescriptor( o, kold )
			);
			delete o[ kold ];
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
		 * Check if two objects contain exactly the same data
		 * </pre>
		 * @memberof __.o
		 * @method equal
		 * @example var o1 = { sName : "John", nAge : 44 };
		 * var o2 = { sName : "John", nAge : 44 };
		 * var bEqual = __.o.equal( o1, o2 );
		 * @param {Object} o1 first object to be compared 
		 * @param {Object} o2 second object to be compared 
		 * @returns {Boolean} result of comparison
		 */
		, equal : function( o1, o2 ) {
			try {
				return ( JSON.parse( JSON.stringify( o1 ) ) ==
				         JSON.parse( JSON.stringify( o2 ) ) );
			}
			catch( e ) {
				return null;
			}
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
	}
	/**
	 * <pre>
	 * Add a stylesheet rule to the page.
	 * </pre>
	 * @memberof __
	 * @method css
	 * @example __.css( "a.footer { color: red; padding : 0 }" );
	 * @param {String} sStyle String of CSS style notation
	 */
	, css : function( sStyle ) {
		var dn = document.createElement( 'style' );
		document.body.appendChild( dn );
		dn.innerHTML = sStyle;
	}
	/**
	 * Provides methods that check states
	 * @memberof __
	 * @type {object}
	 * @namespace __.b
	 */
	, b : {
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
	}
	/**
	 * Provides methods that operate with cookies
	 * @memberof __
	 * @type {object}
	 * @namespace __.cookie
	 */
	, cookie : {
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
	}
	/**
	 * Provides methods that operate on the URL
	 * @memberof __
	 * @type {object}
	 * @namespace __.url
	 */
	, url : {
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
	var guid = "Async" + ( ++__.Async.ix );
	var args = args || {};
	args.guid = guid;
	return __.Async.store[ guid ] = new __.Async.Promise( args );
}
__.Async.ix = 0;
__.Async.store = {};
__.Async.fnerr = function( a, b ) {
	console.log( "[error]", a, b );
}
__.Async.fnok = function( a ) {
	console.log( "[--ok--]", a );
}
__.Async.stub = {
	  resolve : function( a ) { __.Async.fnok( a ); }
	, reject : function( a, b ) { __.Async.fnerr( a, b ); }
};

__.async = function( args ) {
	return ( typeof args == "object" && args.guid )
		? __.Async.store[ args.guid ]
		: __.Async.stub;
}
__.Async.Promise = function( args ) {
	this.guid = args.guid;
	this.sStatus = "idle";
	this.args = args;
	this.lofn = [];
	this.ctx = args.ctx || window;
	this.fnerr = ( args && args.fnerr ) ? args.fnerr : __.Async.fnerr;
	this.fnstat = ( args && args.fnstat ) ? args.fnstat : null;
	return this;
};
__.Async.Promise.prototype = {
	  c : 0
	, ix : 0
	, clear : function( lk ) {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				if( lk ) {
					lk.forEach( function( k ) {
						delete that.args[ k ];
					} );
				}
				else {
					that.args = { guid : that.guid };
				}
				that.resolve();
			}
			, args : {}
		};
		this._add( ofn );
		return this;
			
	}
	, wait : function( x1, x2, x3 ) {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : ( typeof x2 == "function" )
				? function() {
					var fnPoll = function() {
						if( x2() ) {
							that.resolve();
						}
						else {
							setTimeout( fnPoll, x1 );	
						}
					};
					fnPoll();
				}
				: function() {
					setTimeout( function() {
						 that.resolve();
					}, x1 );
				}
			, args : {}
			, sMsg : ( typeof x2 == "string" ) ? x2 : x3
		};
		this._add( ofn );
		return this;
	}
	/**
	 * <pre>
	 * Registers a method to the Async chain
	 * </pre>
	 * @memberof __.Async.Promise
	 * @method then
	 * @example ( new __.Async() )
	 * .then( that, "getRecords", { idUser : 123 }, "Getting records" )
	 * .then( function( args ) {
	 *     __.dn_( "#output" ).innerHTML = args.hResult;
	 *     __.async( args ).resolve();
	 * }, "Printing records" )
	 * .start();
	 * @param {Object|Function} x1 Either an anonymous function or parent object of the method
	 * @param {String|String} x2 Either string of method name or status message
	 * @param {String|String} x3 Either string of method name or status message
	 * @returns {String|null} Value of the cookie or null
	 */
	, then : function( x1, x2, x3, x4 ) {
		// construct an action's object
		var ofn = {
			  ctx : ( typeof x1 == "object" ) ? x1 : this.ctx
			, sfn : ( typeof x1 == "object" ) ? x2 : x1
			, args : ( typeof x2 == "string" )
				? x3
				: ( x2 )
					? x2
					: {}
			, sMsg : ( typeof x3 == "object" )
				? x4
				: ( typeof x3 == "string" )
					? x3
					: ( typeof x2 == "string" )
						? x2
						: ""
		};
		this._add( ofn );
		return this;
	}
	, _add : function( ofn ) {
		this.c++;
		ofn.guid = this.guid;
		// We first check whether we are already running the async stack
		if( this.sStatus == "pending" ) {
			// in which case we need to add new actions at the beginning
			// of the function array but at the end of any such added actions
			// we end up with an array like this [ new1, new2, old3, old4 ]
			// we mark the new action as "late arrival"
			ofn.bLateArrival = true;
			// iterate through the exising array
			var c = this.lofn.length;
			for( var ix=0; ix<c; ix++ ) {
				// and inject the new action after the first 
				// action that is not a "late arrival" itself
				if( ! this.lofn[ ix ].bLateArrival ) {
					this.lofn.splice( ix, 0, ofn );
					break;
				}
			}
		}
		else {
			// no "late arrival" a normal action to be added to the
			// end of the array holding all actions
			this.lofn.push( ofn );
		}
	}
	, _stats : function( sMsg ) {
		// in case we have set a status call back on init...
		if( this.fnstat ) {
			// ... we invoke it with possible message and
			// information on progress
			this.fnstat( {
				  guid : this.guid
				, sMsg : sMsg || ""
				, c : this.c
				, ix : this.ix
				, pct : this.ix * 100 / this.c
			} );
		}
	}
	, _next : function() {
		// cut next function object from list
		var ofn = this.lofn.shift();
		// increase action count
		this.ix++;	
		// invoke status method
		this._stats( ofn.sMsg );
		// add passed on arguments to args object
		__.o.add( this.args, ofn.args );
		// we now invoke the function.
		if( typeof ofn.sfn == "string" ) {
			// in case its name is passed on as string
			// we invoke as key from context object passing
			// on our accumulated arguments object
			ofn.ctx[ ofn.sfn ]( this.args );
		}
		else {
			// in case we passed on an anonymous function
			// we invoke via "call" with context object again
			// passing on our accumulated arguments object
			ofn.sfn.call( ofn.ctx, this.args );
		}
	}
	, start : function() {
		// we start action chain by setting status to pending
		this.sStatus = "pending";
		// triggering the first action
		this._next();
		// and returning this object for possible further chaining
		return this;
	}
	, resolve : function( args ) {
		// add returned results to args object
		__.o.add( this.args, args );
		// invoke next action if array is not empty
		if( this.lofn.length > 0 ) {
			this._next();
		}
		else {
			// otherwise stop and set status to idle
			this.sStatus = "idle";
		}
	}
	, reject : function( oError ) {
		// an error happened, we stop here and invoke
		// the error function with error and args object
		this.fnerr( oError, this.args );
	}
}







