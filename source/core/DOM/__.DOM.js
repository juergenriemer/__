// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.dom.min.js
// @js_externs var __; __.dn; __.dn.each; __.dn._move; __.dn.move; __.dn.move_;
// ==/ClosureCompiler==

/**
 * xxxxxxProvides methods that operate on DOM nodes 
 * @description uasdlkfalsdkf jlkasdjf lkasdfj
 */

/**
 * Provides methods that operate on DOM nodes 
 * @namespace Node
 */


Object.defineProperty( Array.prototype, "__each", {
	value : function( cb ) {
		var cNodes = this.length;
		for( var ix=0; ix<cNodes; ix++ ) {
			cb( this[ ix ] );
		}
	}
} );
/**
 * Takes a CSS selector string and queries the DOM for matching nodes. If not used as node method it will assume document.body.
 * <br>
 * It returns a single DOM node if just one node was found.
 * <br>
 * It returns a list of DOM nodes if multiple were found.
 * <br>
 * It will return [null] in case nothing was found.
 * <br>
 * An optional DOM node as starting point can be passed on otherwise [document] is used.
 * <br>
 * An optional callback function to be applied on returned nodes can be passed on which
 * will be invoked with two parameters: the single node and its index of the array.
 * @memberof Node
 * @method __find
 * @example var dnMenu = __find( "#menu" );
 * @example var ldnLinks = dnMenu.__find( "a.footer" );
 * @example dnMenu.__find( "a.footer", function( dn, ix ) {
 *       dn.style.color = "red";
 *       dn.style.border = ix + "px solid green";
 *  } );
 * @example __find( "[href]", function( dn ) {
 *       dn.setAttribute( "href", "#" );
 *  } );
 * @param {String} css CSS selector string
 * @param {Function} [cb] callback function
 * @returns {Element|Array} A DOM node or a list of DOM nodes or null if CSS selector could not be found
 */

Object.defineProperty( Node.prototype, "__find", {
	value : function( css, cb ) {
		var dn = ( this.tagName.toUpperCase() == "BODY" )
			? document
			: this;
		var sfn = "querySelectorAll";
		if( /^.[a-zA-Z0-9_-]*$/.test( css ) ) {
			var sfst = css.substr( 0, 1 );
			if( sfst == "#" ) {
				sfn = "getElementById";
				css = css.substr( 1 );
			}
			else if( sfst == "." ) {
				sfn = "getElementsByClassName";
				css = css.substr( 1 );
			}
			else if( /[a-zA-Z]/.test( sfst ) ) {
				sfn = "getElementsByTagName";
			}
		}
		var xdn = dn[ sfn ]( css );
		xdn = HTMLCollection.prototype.isPrototypeOf( xdn )
			? [].slice.call( xdn ) : xdn;
		if( xdn ) {
			if( cb ) {
				__.dn.each( xdn, cb );
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
} );

/**
* Deletes a DOM node.
* @memberof Node
* @method __remove
* @example var dnForm = document.body.__find( "form" );
* dnForm.__remove();
*/
Object.defineProperty( Node.prototype, "__remove", {
	value : function() {
		this.parentNode.removeChild( this );
	}
} );

/**
 * Takes a CSS selector string and queries the DOM for the closest matching parent node.
 * <br>
 * It returns a DOM node. It will return [null] in case nothing was found.
 * <br>
 * An optional callback function to be applied on the returned node. It
 * will be invoked with one parameter: the single node
 * @memberof __
 * @method _dn
 * @example var dnInput = __.dn_( "[name='email']" );
 * var dnForm = __._dn( "form", dnInput );
 * @example __._dn( "div.the-form", dnInput, function( dn ) {
 *     dn.style.border = "1px solid red";
 *     dn.style.padding = "1em";
 * } );
 * @param {String} css CSS selector string
 * @param {Element} dn starting node
 * @param {Function} [cb] callback function
 * @returns {Element} A DOM node or null if CSS selector could not be found
 */
Object.defineProperty( Node.prototype, "__closest", {
	value : function( css, cb ) {
		var dnClosest = this.closest( css );
		if( cb ) {
			__.dn.each( dnClosest, cb );
		}
		return dnClosest
	}
} );

/**
* Takes either an HTML string and converts it into DOM node(s) or (an) 
* existing exsting DOM node(s) and creates or moves them inside the
* DOM node at the top. 
* It returns the created or moved DOM node(s).
* An optional callback function to be applied on created or moved DOM
* node(s) can be passed on which will be
* invoked with two parameters: the single node and its index of the array.
* @memberof Node
* @method __append
* @example var dnUL = document.body.__append( "<ul class='colors'></ul>" );
* @param {String} h_or_dn String of valid HTML.
* @param {Function} [cb] target node or callback function
* @returns {Element|Array} A DOM node or a list of DOM nodes
*/

Object.defineProperty( Node.prototype, "__append", {
	value : function( h_or_dn, cb ) {
		return __.dn._add_( h_or_dn, this, cb, "move" );
	}
} );

/**
* Takes either an HTML string and converts it into DOM node(s) or (an) 
* existing exsting DOM node(s) and creates or moves them inside the
* DOM node at bottom.
* It returns the created or moved DOM node(s).
* An optional callback function to be applied on created or moved DOM
* node(s) can be passed on which will be
* invoked with two parameters: the single node and its index of the array.
* @memberof Node
* @method __prepend 
* @example var dnUL = document.body.__prepend( "<ul class='colors'></ul>" );
* @example var h = "<li>red</li>";
* var lnLI = __.dn.__prepend( h, dnUL );
* @example var h = "<li>red</li>";
* var lnLI = __.dn.append( h, dnUL, function( dn, ix ) {
*     dn.style.color = dn.textContent;
*     dn.textContent = ix + ". " + dn.textContent;
* } );
* @param {String} h_or_dn String of valid HTML.
* @param {Function} [cb] target node or callback function
* @returns {Element|Array} A DOM node or a list of DOM nodes
*/

Object.defineProperty( Node.prototype, "__prepend", {
	value : function( h_or_dn, cb ) {
		if( this.firstChild ) {
			return __.dn._add_( h_or_dn, this.firstChild, cb, "_move" );
		}
		else {
			return __.dn._add_( h_or_dn, this, cb, "move" );
		}
	  }
} );

/**
* Takes either an HTML string and converts it into DOM node(s) or (an) 
* existing existing DOM node(s) and creates or moves them right before the
* DOM node.
* It returns the created or moved DOM node(s).
* An optional callback function to be applied on created or moved DOM
* node(s) can be passed on which will be
* invoked with two parameters: the single node and its index of the array.
* @memberof Node
* @method __before
* @param {String} h_or_dn String of valid HTML.
* @param {Function} [cb] target node or callback function
* @returns {Element|Array} A DOM node or a list of DOM nodes
*/

Object.defineProperty( Node.prototype, "__before", {
	value : function( h_or_dn, cb ) {
		return __.dn._add_( h_or_dn, this, cb, "_move" );
	}
} );


/**
* Takes either an HTML string and converts it into DOM node(s) or (an) 
* existing existing DOM node(s) and creates or moves them right after the
* DOM node.
* It returns the created or moved DOM node(s).
* An optional callback function to be applied on created or moved DOM
* node(s) can be passed on which will be
* invoked with two parameters: the single node and its index of the array.
* @memberof Node
* @method __after
* @param {String} h_or_dn String of valid HTML.
* @param {Function} [cb] target node or callback function
* @returns {Element|Array} A DOM node or a list of DOM nodes
*/

Object.defineProperty( Node.prototype, "__after", {
	value : function( h_or_dn, cb ) {
		return __.dn._add_( h_or_dn, this, cb, "move_" );
	}
} );



/**
* Shows a DOM node.
* It sets the display attribute of a DOM node to "block" or "inline" depending on its original state.
* @memberof Node
* @method __show
* @example dn.__show();
*/
Object.defineProperty( Node.prototype, "__show", {
	value : function() {
		var sDisplay = ( this.hasAttribute( "__.display" ) )
			? this.getAttribute( "__.display" )
			: "block";
		this.style.display = sDisplay;
	}
} );

/**
* Hides a DOM node.
* It sets the display attribute of a DOM node to "none" preserving the previous value.
* @memberof Node
* @method __hide
* @example dn.__hide();
*/
Object.defineProperty( Node.prototype, "__hide", {
	value : function() {
		if( this.style.display == "none" ) {
			return;
		}
		var sDisplay = getComputedStyle( this ).display;
		this.setAttribute( "__.display", sDisplay );
		this.style.display = "none";
	}
} );


Object.defineProperty( Node.prototype, "__h", {
	value : function( us_h ) {
		// REF: document and sanitzie!!!
		this.innerHTML = us_h;
	}
} );

/**
* Returns the index of a DOM node in its parent's children list.
* @memberof Node
* @method __ix
* @example dn.__ix();
* @returns {Number} index of DOM node
*/
Object.defineProperty( Node.prototype, "__ix", {
	value : function() {
		var ix = 0;
		var dn = this;
		while( ( dn = dn.previousElementSibling ) != null ) {
			ix++;
		}
		return ix;
	}
} );

/**
* Gets or sets the x-position of a DOM element.
* @memberof Node
* @method __x
* @example dn.__x( 300 );
* @example var x = dn.__x();
* @param {Element} dn DOM node
* @param {Integer} [n] x-position in pixels
* @returns {Element} x-position in pixels
*/
Object.defineProperty( Node.prototype, "__x", {
	value : function( n ) {
		if( n ) {
			if( ! /absolute|fixed/.test( self.getComputedStyle( this ).position ) ) {
				this.style.position = "absolute";
			}
			this.style.left = parseInt( n ) + "px";
		}
		else {
			return this.getBoundingClientRect().left;
		}
	}
} );

/**
* Gets or sets the y-position of a DOM element.
* @memberof Node
* @method __y 
* @example dn.__y( 300 );
* @example var y = dn.__y();
* @param {Element} dn DOM node
* @param {Integer} [n] y-position in pixels
* @returns {Element} y-position in pixels
*/
Object.defineProperty( Node.prototype, "__y", {
	value : function( n ) {
		if( n ) {
			if( ! /absolute|fixed/.test( self.getComputedStyle( this ).position ) ) {
				this.style.position = "absolute";
			}
			this.style.top = parseInt( n ) + "px";
		}
		else {
			return this.getBoundingClientRect().top;
		}
	}
} );

/**
* Gets or sets the width of a DOM element.
* @memberof Node
* @method __dx
* @example dn.__dx( 300 );
* @example var dx = dn.__dx();
* @param {Element} dn DOM node
* @param {Integer} [n] width in pixels
* @returns {Element} width in pixels
*/
Object.defineProperty( Node.prototype, "__dx", {
	value : function( dx ) {
		if( dx ) {
			this.style.width = parseInt( dx ) + "px";
		}
		else {
			return this.getBoundingClientRect().width;
		}
	}
} );

/**
* Gets or sets the height of a DOM element.
* @memberof Node
* @method __dy
* @example dn.__dy( 300 );
* @example var dy = dn.__dy();
* @param {Element} dn DOM node
* @param {Integer} [n] height in pixels
* @returns {Element} height in pixels
*/
Object.defineProperty( Node.prototype, "__dy", {
	value : function( dy ) {
		if( dy ) {
			this.style.height = parseInt( dy ) + "px";
		}
		else {
			return this.getBoundingClientRect().height;
		}
	}
} );

/**
* Lets an element fade out.
* @memberof Node
* @method __fadeOut
* @example dn.__fadeOut();
* @example dn.__fadeOut( 25, function() {
*     dn.__remove();
* } );
* @param {Integer} [ms] milliseconds it should take to fade out
* @param {Function} [cb] callback function to be invoked after element was faded out.
*/
Object.defineProperty( Node.prototype, "__fadeOut", {
	value : function( ms, cb ) {
		var dn = this;
		var ms = ( typeof ms == "number" ) ? ms : 250;
		var cb = ( typeof cb == "function" ) ? ms : cb;
		var nStep = 25 / ms;
		dn.style.opacity = dn.style.opacity || 1;
		( function fader() {
			if( ( dn.style.opacity -= nStep) < 0 ) {
				dn[ "__hide" ]();
				if( cb ) {
					cb();
				}
			}
			else {
				setTimeout( fader, 25 );
			}
		} )();
	}
} );

/**
* Lets an element fade in.
* @memberof Node
* @method __fadeIn
* @example dn.__fadeIn();
* @param {Integer} [ms] milliseconds it should take to fade out
* @param {Function} [cb] callback function to be invoked after element was faded out.
*/
Object.defineProperty( Node.prototype, "__fadeIn", {
	value : function( ms, cb ) {
		var dn = this;
		var ms = ( typeof ms == "number" ) ? ms : 250;
		var cb = ( typeof cb == "function" ) ? ms : cb;
		var nStep = 25 / ms;
		dn.style.opacity = this.style.opacity || 0;
		dn[ "__show" ]();
		( function fader() {
			var n = Number( dn.style.opacity ) + nStep;
			dn.style.opacity = n;
			if( n > 1 ) {
				dn.style.opacity = 1;
				if( cb ) {
					cb();
				}
			}
			else {
				setTimeout( fader, 25 );
			}
		} )();
	}
} );

/**
* Gets or sets a css attribute
* @memberof Node
* @method __style
* @example dn.__style( "color", "red" );
* @example var sColor = dn.__style( "color" );
* @param {String} k name of attribute
* @param {String} [v] optional value of attribute
* @returns {Element} value of attribute
*/
Object.defineProperty( Node.prototype, "__style", {
	value : function( k, v ) {
		if( ! v ) {
			return self.getComputedStyle( this )[ k ];
		}
		this.style[ k ] = v;
	}
} );

/**
* Scrolls the page or a DOM node to a specific x or y position or 
* directly to the top, left, bottom or right.
* <br>Expected positions: x, y, top, left, bottom, right
* @memberof Node
* @method __scrollTo
* @example dn.__scrollTo( "bottom" ); // scroll page to bottom
* @example dn.__scrollTo( "x", 100 ); // scroll menu node 100 px to the right
* @param {String} sPos position to scroll to (x,y,bottom,top,left,right)
* @param {Number} [nPos] A position value in pixels (in case of x,y)
*/
Object.defineProperty( Node.prototype, "__scrollTo", {
	value : function( sPos, nPos ) {
		switch( sPos ) {
			case "x" :
				this.scrollLeft = nPos;
			break;
			case "y" :
				this.scrollTop = nPos;
			break;
			case "bottom" :
				this.scrollTop = this.scrollHeight;
			break;
			case "top" :
				this.scrollTop = 0;
			break;
			case "left" :
				this.scrollLeft = 0;
			break;
			case "right" :
				this.scrollLeft = this.scrollWidth;
			break;
		}
	}
} );

/**
* Registers to the scroll event of either a DOM node or the entire page.
* <br>
* A callback function is invoked with a data object providing information
* about the current position which is, if not manually set, called every
* 300 milliseconds.
* @memberof Node
* @method __onScroll
* @example dn.__onScroll( function( aInfo ) {
*     if( aInfo.bBottom ) {
*         alert( "scrolled to bottom" );
*     }
* } );
* @example dn.__onScroll( function() {
*     positionMenu();
* }, 1000 );
* @param {Function} cb a callback function
* @param {Number} [msInterval] A notification delay in milliseconds
* @returns {Object} Information about the current position
* <pre class='return-object'>
* x | (Number) | current x position
* y | (Number) | current y position
* dx | (Number) | current width
* dy | (Number) | current height
* bTop | (Boolean) | flag to indicate whether scrolled to top
* bBottom | (Boolean) | flag to indicate whether scrolled to bottom
* bLeft | (Boolean) | flag to indicate whether scrolled to left 
* bRigth | (Boolean) | flag to indicate whether scrolled to right
* </pre>
*/
Object.defineProperty( Node.prototype, "__onScroll", {
	value : function( cb, msInterval ) {
		var msInterval = msInterval || 300;
		var cbScroll = function() {
			var dn = ( this == document ) ? document.body : this;
			if( dn.__hd ) {
				clearInterval( dn.__hd );
			}
			dn.__hd = setTimeout( function() {
				var xcur = dn.scrollHeight;
				var x = dn.scrollTop
				var dx = dn.clientHeight 
				var ycur = dn.scrollWidth;
				var y = dn.scrollLeft
				var dy = dn.clientWidth
				cb( {
					  "x" : xcur
					, "y" : ycur
					, "dy" : dy
					, "dx" : dx
					, "bTop" : ( x == 0 )
					, "bBottom" : ( xcur == ( x + dx ) )
					, "bLeft" : ( y == 0 )
					, "bRight" : ( ycur == ( y + dy ) )
				} );
			}, msInterval );
		};
		this[ "__cbScroll" ] = cbScroll;
		this.addEventListener( "scroll", this[ "__cbScroll" ] );
	}
} );

/**
* Unregisters from a scroll event of either a DOM node or the entire page.
* <br>
* @memberof Node
* @method dn.offScroll
* @example dn.offScroll();
*/
Object.defineProperty( Node.prototype, "__offScroll", {
	value : function() {
		this.removeEventListener( "scroll", this.__cbScroll );
		this.__cbScroll = null;
	}
} );





/**
 * Internal helper methods for DOM manipulation
 */

if( typeof __ == "undefined" ) {
	__ = {};
}

__.dn = {
	  each : function( xdn, fn ) {
		if( xdn ) {
			var ldn = ( ! isNaN( xdn.length ) ) ? xdn : [ xdn ];
			var c = ldn.length;
			for( var ix=0; ix<c; ix++ ) {
				fn( ldn[ ix ], ix );
			}
		}
	}
	, h : function( dn, us_h ) {
		us_h = us_h.toString() || "";
		var dnWrapper = document.createElement( "div" );
		dnWrapper.appendChild( document.createTextNode( us_h ) );
		dn.innerHTML = dnWrapper.innerHTML;
		dnWrapper = null;
	}
	, _move : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			__.dn.each( dnMove, function( dn ) {
				dnTarget.parentNode.insertBefore( dn, dnTarget );
			} );
		}
		else {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget );
		}
	  }
	, move : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			__.dn.each( dnMove, function( dn ) {
				dnTarget.appendChild( dn );
			} );
		}
		else {
			dnTarget.appendChild( dnMove );
		}
	  }
	, move_ : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			__.dn.each( dnMove, function( dn ) {
				dnTarget.parentNode.insertBefore( dn, dnTarget.nextSibling );
				dnTarget = dn;
			} );
		}
		else {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget.nextSibling );
		}
	}
	, _add_ : function( h_or_dn, x1, x2, sfn ) {
		var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
		var fn = ( typeof x1 == "function" ) ? x1 : x2;
		var dnCreator = document.createElement( "div" );
		if( typeof h_or_dn == "string" ) {
			dnCreator.innerHTML = h_or_dn;
		}	
		else {
			if( h_or_dn.length ) {
				__.dn.each( h_or_dn, function( dn ) {
					dnCreator.appendChild( dn );
				} );
			}
			else {
				dnCreator.appendChild( h_or_dn );
			}
		}
		var xdn = [].slice.call( dnCreator.children );
		xdn = ( xdn instanceof Array && xdn.length == 1 ) ? xdn[ 0 ] : xdn;
		if( fn ) {
			__.dn.each( xdn, fn );
		}
		__.dn[ sfn ]( xdn, dnRoot );
		return xdn;
	}
};


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


// global shortcut for document body
window[ "__find" ] = function( css, cb ) {
	return document.body[ "__find" ]( css, cb );
}

window[ "__append" ] = function( h_or_dn, cb ) {
	return document.body[ "__append" ]( h_or_dn, cb );
}

window[ "__prepend" ] = function( h_or_dn, cb ) {
	return document.body[ "__prepend" ]( h_or_dn, cb );
}

window[ "__style" ] = function( k, v ) {
	return document.body[ "__style" ]( k, v );
}

window[ "__scrollTo" ] = function( sPos, nPos ) {
	document.body[ "__scrollTo" ]( sPos, nPos );
}

window[ "__onScroll" ] = function( cb, msInterval ) {
	document.body[ "__onScroll" ]( cb, msInterval );
}

window[ "__offScroll" ] = function() {
	document.body[ "__offScroll" ]();
}

window[ "__css" ] = function( sCSS ) {
	var dnHead = document.getElementsByTagName( 'head' )[ 0 ];
	var dn = document.createElement( 'style' );
	dnHead.appendChild( dn );
	dn.innerHTML = sCSS;
};
