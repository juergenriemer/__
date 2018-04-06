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

