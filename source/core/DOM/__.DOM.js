// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.min.js
// @js_externs var __; __.dn_; __._dn; __.dn; __.dn.each; __.dn.del; __.dn.before;__.dn.append;__.dn.prepend; __.dn.after; __.dn.show; __.dn.hide; __.dn.ix; __.dn.x; __.dn.y; __.dn.dx; __.dn.dy; __.dn.fade_; __.dn._fade; __.dn.css; __.css.h; __.dn.scroll; __.dn.scroll.to; __.dn.scroll.on; __.dn.scroll.off;
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
 * Takes a CSS selector string and queries the DOM for matching nodes.
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
			this.dn.each( xdn, fn );
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
 * @param {String} s CSS selector string
 * @param {Element} dn starting node
 * @param {Function} [fn] callback function
 * @returns {Element} A DOM node or null if CSS selector could not be found
 */
__._dn = function( s, dn, fn ) {
	var dnClosest = dn.closest( s );
	if( fn ) {
		this.dn.each( dnClosest, fn );
	}
	return dnClosest
};


/**
 * Provides methods that operate on DOM nodes.
 * @memberof __
 * @type {object}
 * @namespace __.dn
 */
__.dn = {
	/**
	 * Receives either an element or an array and a callback function.
	 * <br>
	 * In case of an array it iterates and invokes the callback on each element.
	 * In case an element it invokes the callback directly.
	 * <br>
	 * The callback is invoked with two parameters: the element and its index.
	 * @memberof __.dn
	 * @method each
	 * @example var ldn = __.dn_( ".links" );
	 * __.dn.each( ldn, function( dn, ix ) {
	 *     console.log( ix + ". " + dn.tagName ); 
	 * } );
	 * @example var dn1 = __.dn_( "[href='#one']" );
	 * var dn2 = __.dn_( "[href='#two']" );
	 * var dn3 = __.dn_( "[href='#three']" );
	 * var ldn = [ dn1, dn2, dn3 ];
	 * __.dn.each( ldn, function( dn ) {
	 *     dn.style.color = "red";
	 * } );
	 * @example __.dn.each( __.dn_( "a" ), function( dn ) {
	 *     dn.style.color = "red";
	 * } );
	 * @param {Array|Element} xdn Array of nodes or a single node 
	 * @param {Function} fn function to be invoked against nodes
	 */
	  each : function( xdn, fn ) {
		if( xdn ) {
			var ldn = ( ! isNaN( xdn.length ) ) ? xdn : [ xdn ];
			var c = ldn.length;
			for( var ix=0; ix<c; ix++ ) {
				fn( ldn[ ix ], ix );
			}
		}
	}
	/**
	* Deletes a DOM node.
	* @memberof __.dn
	* @method del
	* @param {Element} dn DOM node to be deleted
	* @example var dnForm = __.dn_( "form" );
	* __.dn.del( dnForm );
	*/
	, del : function( dn ) {
		dn.parentNode.removeChild( dn );
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
		while( ( dn = dn.previousElementSibling ) != null ) {
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
			if( ! /absolute|fixed/.test( self.getComputedStyle( dn ).position ) ) {
				dn.style.position = "absolute";
			}
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
			if( ! /absolute|fixed/.test( self.getComputedStyle( dn ).position ) ) {
				dn.style.position = "absolute";
			}
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
	, h : function( dn, us_h ) {
		us_h = us_h.toString() || "";
		var dnWrapper = document.createElement( "div" );
		dnWrapper.appendChild( document.createTextNode( us_h ) );
		dn.innerHTML = dnWrapper.innerHTML;
		dnWrapper = null;
	}
	, _move : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			this.each( dnMove, function( dn ) {
				dnTarget.parentNode.insertBefore( dn, dnTarget );
			} );
		}
		else {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget );
		}
	  }
	, move : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			this.each( dnMove, function( dn ) {
				dnTarget.appendChild( dn );
			} );
		}
		else {
			dnTarget.appendChild( dnMove );
		}
	  }
	, move_ : function( dnMove, dnTarget ) {
		if( dnMove instanceof Array ) {
			this.each( dnMove, function( dn ) {
				dnTarget.parentNode.insertBefore( dn, dnTarget.nextSibling );
				dnTarget = dn;
			} );
		}
		else {
			dnTarget.parentNode.insertBefore( dnMove, dnTarget.nextSibling );
		}
	}
	// rename h to x for it can be a dn or h
	, _add_ : function( h_or_dn, x1, x2, sfn ) {
		var dnRoot = ( typeof x1 == "object" ) ? x1 : document.body;
		var fn = ( typeof x1 == "function" ) ? x1 : x2;
		var dnCreator = document.createElement( "div" );
		if( typeof h_or_dn == "string" ) {
			dnCreator.innerHTML = h_or_dn;
		}	
		else {
			if( h_or_dn.length ) {
				this.each( h_or_dn, function( dn ) {
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
			this.each( xdn, fn );
		}
		__.dn[ sfn ]( xdn, dnRoot );
		return xdn;
	}
};

/**
 * @namespace __.dn.scroll
 * @memberof __.dn
 */

__.dn.scroll = {};
/**
* Scrolls the page or a DOM node to a specific x or y position or 
* directly to the top, left, bottom or right.
* <br>Expected positions: x, y, top, left, bottom, right
* @memberof __.dn.scroll
* @method to 
* @example __.dn.scroll.to( "bottom" ); // scroll page to bottom
* @example __.dn.scroll.to( dnMenu, "x", 100 ); // scroll menu node 100 px to the right
* @param {Element|String} dn_or_pos Either a DOM node or a position (if no DOM node is passed on the entire window is selected)
* @param {String|Number} pos_or_px Either a position or a position value in pixels
* @param {Number} [px] A position value in pixels
*/
__.dn.scroll.to = function( dn_or_pos, pos_or_px, px ) {
	var dn = ( typeof dn_or_pos == "string" ) ? document.body : dn_or_pos;
	var sPos = ( typeof dn_or_pos == "string" ) ? dn_or_pos : pos_or_px;
	var nPos = ( typeof pos_or_px == "number" ) ? pos_or_px : px;
	switch( sPos ) {
		case "x" :
			dn.scrollLeft = nPos;
		break;
		case "y" :
			dn.scrollTop = nPos;
		break;
		case "bottom" :
			dn.scrollTop = dn.scrollHeight;
		break;
		case "top" :
			dn.scrollTop = 0;
		break;
		case "left" :
			dn.scrollLeft = 0;
		break;
		case "right" :
			dn.scrollLeft = dn.scrollWidth;
		break;
	}
};

/**
* Registers to the scroll event of either a DOM node or the entire page.
* <br>
* A callback function is invoked with a data object providing information
* about the current position which is, if not manually set, called every
* 300 milliseconds.
* @memberof __.dn.scroll
* @method on
* @example __.dn.scroll.on( dnMenu, function( aInfo ) {
*     if( aInfo.bBottom ) {
*         alert( "scrolled to bottom" );
*     }
* } );
* @example __.dn.scroll.on( function() {
*     positionMenu();
* }, 1000 );
* @param {Element|String} dn_or_cb Either a DOM node or a callback function (if no DOM node is passed on the entire window is selected)
* @param {String|Number} cb_or_ms Either a callback function or a custom notification delay in milliseconds
* @param {Number} [ms] A notification delay in milliseconds
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
__.dn.scroll.on = function( dn_or_cb, cb_or_ms, ms ) {
	var dn = ( typeof dn_or_cb == "function" )
		? document
		: dn_or_cb;
	var fn = ( typeof dn_or_cb == "function" )
		? dn_or_cb
		: cb_or_ms;
	var msInterval = ( typeof cb_or_ms == "number" )
		? cb_or_ms
		: ( ms )
			? ms
			: 300;
	var cbScroll = function() {
		dn = ( dn == document ) ? document.body : dn; 
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
			fn( {
				  x : xcur
				, y : ycur
				, dy : dy
				, dx : dx
				, bTop : ( x == 0 )
				, bBottom : ( xcur == ( x + dx ) )
				, bLeft : ( y == 0 )
				, bRight : ( ycur == ( y + dy ) )
			} );
		}, msInterval );
	};
	dn.__cbScroll = cbScroll;
	dn.addEventListener( "scroll", dn.__cbScroll );
}


/**
* Unregisters from a scroll event of either a DOM node or the entire page.
* <br>
* @memberof __.dn.scroll
* @method off
* @example __.dn.scroll.off( dnMenu );
* @example __.dn.scroll.off();
* @param {Element} [dn] A DOM node for which we no longer want to get notified. (if no DOM node is passed on the entire window is selected)
*/
__.dn.scroll.off = function( dn ) {
	dn = dn || document;
	dn.removeEventListener( "scroll", dn.__cbScroll );
}
