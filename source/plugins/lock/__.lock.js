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
				dnBag.__css( "height", dn.__css( "minHeight" ) );
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
				
				dnBag = dn.__append( hBag );
			}
			// adjust height of blend and show
			// dy needs to be the outer height with padding
			var dy = dn.scrollHeight;
			var dnFront = dnBag.firstElementChild;
			dnFront.innerHTML = "";
			if( kv && kv.hText ) {
				setTimeout( function() {
					dnFront.__h( kv.hText );
					dnFront.__y( -dy );
					dnFront.__dy( dy );
				}, 500 );
			}
			var dnBack = dnBag.lastElementChild;
			dnBack.__y( -dy );
			dnBack.__dy( dy );
			dnFront.__dy( dy );
			dnBack.__show();
		}, 0 );
	}
	, un : function( dn ) {
		// set timeout as a consequence of us using it for locking as well
		setTimeout( function() {
			dn.__find( ".-lck-bag", function( dnBag ) {
				dnBag.__remove();
			} );
		}, 0 );
	}
};

