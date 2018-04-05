// REF: remove __.dn from here were possible, e.g. __.dn.css
// REF: include loading gif that only shows after 500 ms
if( typeof( __ ) == "undefined" ) {
	__ = {};
}

__.lock = {
	  up : function( dn, kv ) {
		// set timeout for we want to ensure this is run
		// after any other rendering is done and we get
		// proper CSS values
		setTimeout( function() {
			var dnBag = dn.lastElementChild;
			// DOM node is empty. In case of a model get call,
			// this means its the first call to the server
			if( ! dnBag ) {
				dnBag = document.createElement( "div" );
				__.dn.css( dnBag, "height", __.dn.css( dn, "minHeight" ) );
				dn.appendChild( dnBag );
			}
			// locking blend (bag) does not exist...
			if( ! dnBag.classList.contains( "-lck-bag" ) ) {
				var hBag = " \
				<div class='-lck-bag'> \
					<div class='-lck-bag-front'></div> \
					<div class='-lck-bag-back'></div> \
				</div> \
				";
				// ...we append and position bag to top by height
				// because if we prepend and have Hx tags then
				// because of top padding entire stone gets shifted down
				
				dnBag = __.dn.add( hBag, dn );
			}
			// adjust height of blend and show
			// dy needs to be the outer height with padding
			var dy = dn.scrollHeight;
			var dnFront = dnBag.firstElementChild;
			dnFront.innerHTML = "";
			if( kv && kv.hText ) {
				setTimeout( function() {
					__.dn.h( dnFront, kv.hText );
					__.dn.y( dnFront, -dy );
					__.dn.dy( dnFront, dy );
				}, 500 );
			}
			var dnBack = dnBag.lastElementChild;
			__.dn.y( dnBack, -dy );
			__.dn.dy( dnBack, dy );
			__.dn.dy( dnFront, dy );
			__.dn.show( dnBag );
		}, 0 );
	}
	, un : function( dn ) {
		// set timeout as a consequence of us using it for locking as well
		setTimeout( function() {
			__.dn_( ".-lck-bag", dn, function( dnBag ) {
				__.dn.del( dnBag );
			} );
		}, 0 );
	}
};

console.log( __.lock.up );
