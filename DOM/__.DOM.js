// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __._dn; __.each; __.dn; __.dn.del; __.dn._move; __.dn.move; __.dn.move_; __.dn.append; __.dn._append; __.dn.shift; __.dn.shift_; __.dn._add_; __.dn.show; __.dn.hide; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.dn.fade_; __.dn._fade; __.dn.css; __.css.h; __.s; __.s.o; __.o.empty; __.o.camelcase; __.o.tokenize; __.n; __.n.within; __.l; __.l.del; __.l.contains; __.l.equal; __.l.empty; __.l.kSort; __.l.remove; __.o; __.o.s; __.o.k; __.o.kk; __.o.add; __.o.kRename; __.o.c; __.o.copy; __.o.equal; __.o.empty; __.e; __.e.stop; __.css; __.b; __.b.mail; __.b.url; __.dt; __.dt.date; __.cookie; __.cookie.get; __.cookie.set; __.cookie.del; __.url; __.url.oParams; __.misc; __.misc.isIE; __.win; __.win.dx; __.win.dy; 
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
__.dn_ = function( s, x1, x2 ) {
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
};

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
__._dn = function( s, dn, fn ) {
	var dnClosest = dn.closest( s );
	if( fn ) {
		__.each( dnClosest, fn );
	}
	return dnClosest
};

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
// REF: move to misc?
__.each = function( xdn, fn ) {
	if( xdn ) {
		var ldn = ( ! isNaN( xdn.length ) ) ? xdn : [ xdn ];
		var c = ldn.length;
		for( var ix=0; ix<c; ix++ ) {
			fn( ldn[ ix ], ix );
		}
	}
};

/**
 * Provides methods that operate on DOM nodes.
 * @memberof __
 * @type {object}
 * @namespace __.dn
 */
__.dn = {
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
		if( dnMove instanceof Array ) {
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
		if( dnMove instanceof Array ) {
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
		if( dnMove instanceof Array ) {
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
	 * @method append
	 * @example var dnUL = __.dn.append( "<ul class='colors'></ul>" );
	 * @example var h = "<li>red</li>";
	 * var lnLI = __.dn.append( h, dnUL );
	 * @example var h = "<li>red</li>";
	 * var lnLI = __.dn.append( h, dnUL, function( dn, ix ) {
	 *     dn.style.color = dn.textContent;
	 *     dn.textContent = ix + ". " + dn.textContent;
	 * } );
	 * @param {String} h String of valid HTML.
	 * @param {Element|Function} [x1] target node or callback function
	 * @param {Function} [x2] callback function
	 * @returns {Element|Array} A DOM node or a list of DOM nodes
	 */
	, append : function( h, x1, x2 ) {
		return __.dn._add_( h, x1, x2, "move" );
	}
	/**
	 * <pre>
	 * xxxxxxTakes an HTML string, converts it into DOM node(s) and writes inside of an existing DOM node.
	 * It returns a single DOM node if HTML string has one root tag.
	 * It returns a list of DOM nodes if HTML string has multiple root tags.
	 * An optional DOM node as target DOM node can be passed on otherwise [document] is used.
	 * An optional callback function to be applied on created nodes can be passed on which will be
	 * invoked with two parameters: the single node and its index of the array
	 * </pre>
	 * @memberof __.dn
	 * @method prepend
	 * @param {String} h String of valid HTML.
	 * @param {Element|Function} [x1] target node or callback function
	 * @param {Function} [x2] callback function
	 * @returns {Element|Array} A DOM node or a list of DOM nodes
	 */
	, prepend : function( dnMove, dnTarget ) {
		if( dnTarget.firstChild ) {
			this.before( dnMove, dnTarget.firstChild );
		}
		else {
			this.append( dnMove, dnTarget );
		}
	  }
	/**
	 * Same as [add] with the difference that the DOM node(s) are not inserted into the existing DOM
	 * node but right in front of it.
	 * @memberof __.dn
	 * @method before
	 * @example var dnLogin = __.dn_( "[name='login']" );
	 * var h = "<div>At least 8 characters</div>";
	 * var dnRule = __.dn.before( h, dnLogin );
	 * @param {String} h String of valid HTML.
	 * @param {Element|Function} [x1] target node or callback function
	 * @param {Function} [x2] callback function
	 * @returns {Element|Array} A DOM node or a list of DOM nodes
	 */
	, before : function( h, x1, x2 ) {
		return __.dn._add_( h, x1, x2, "_move" );
	}
	/**
	 * xxxxSame as [append] with the difference that the DOM node(s) are not inserted into the existing DOM
	 * node but right after of it.
	 * @memberof __.dn
	 * @method after
	 * @example var dnComment = __.dn_( "[name='comment']" );
	 * var h = "<a href='#clear'>clear</a>";
	 * var dnRule = __.dn.after( h, dnComment );
	 * @param {String} h String of valid HTML.
	 * @param {Element|Function} [x1] target node or callback function
	 * @param {Function} [x2] callback function
	 * @returns {Element|Array} A DOM node or a list of DOM nodes
	 */
	, after : function( h, x1, x2 ) {
		return __.dn._add_( h, x1, x2, "move_" );
	}
	, _add_ : function( h, x1, x2, sfn ) {
		var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
		var fn = ( typeof x1 == "function" ) ? x1 : x2;
		var dn = document.createElement( "div" );
		if( typeof h == "string" ) {
			dn.innerHTML = h;
		}	
		else {
			dn.appendChild( h );
		}
		var xdn = [].slice.call( dn.children );
		xdn = ( xdn instanceof Array && xdn.length == 1 ) ? xdn[ 0 ] : xdn;
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
	/**
	 * <pre>
	 * Gets or sets a css attribute
	 * </pre>
	 * @memberof __.dn
	 * @method css
	 * @example __.dn.css( dn, "color", "red" );
	 * @example var sColor = __.dn.css( dn, "color" );
	 * @param {Element} dn DOM node
	 * @param {String} k name of attribute
	 * @param {String} [v] optional value of attribute
	 * @returns {Element} value of attribute
	 */
	, css : function( dn, k, v ) {
		if( ! v ) {
			return self.getComputedStyle( dn )[ k ];
		}
		dn.style[ k ] = v;
	}
	/**
	 * <pre>
	 * Securely writes HTML into a DOM element.
	 * It strips off the following tags: "script", "link", "iframe", "html", "body", "meta", "embed"
	 * </pre>
	 * @memberof __.dn
	 * @method h
	 * @example __.dn.h( dn, "<h1>Hi Mom</h1><iframe></iframe>" );
	 * @param {Element} dn DOM node
	 * @param {String} h HTML string
	 * REF: improve this and text with non-closing tags
	 */
	 , h : function( dn, h ) {
		h = h.toString();
		var lsForbidden = [ "script", "link", "iframe", "html", "body", "meta", "embed" ];
		lsForbidden.forEach( function( s ) {
			var srx = "<" + s + ".*>.*?<\/" + s + ">"; 
			var rx = new RegExp( srx, "ig" );
			h = h.replace( rx, "" );
		} );
		dn.innerHTML = h;	
	}
};

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
		s = s.replace( /([A-Z])/g, ' $1' )
		s = s.replace( /^./, function( s ){ return s.toUpperCase(); } );
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
		}
		return l;
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
			var x = a[ k ] || null;
			var y = b[ k ] || null;
			return ( (x < y )
				? -1
				: ( (x > y )
					? 1
					: 0 ) );
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
	 * Return key of an assoc 
	 * </pre>
	 * @memberof __.o
	 * @method k
	 * @example var mp = { "key" : "value" }
	 * var k = __.o.k( mp ); // key
	 * @param {Object} a object
	 * @returns {String} k string of key or null if no assoc
	 */
	, k : function( a ) {
		for( var k in a ) {
			return k;
		}
		return null;
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
	, kk : function( o ) {
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

