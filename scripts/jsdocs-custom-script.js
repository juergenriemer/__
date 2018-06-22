// get DOM nodes
// right navigation panel
var dnNav = document.querySelector( "nav" );
// custom methods menu
var dnMethods = document.getElementById( "methods" );
// custom methods count
var dnMethodCount = document.getElementById( "method-count" );

// show structure in namespace links
var ldnNamespaces = dnNav.querySelectorAll( "li a" );
var c = ldnNamespaces.length;
for( var ix=0; ix<c; ix++ ) {
	var dn = ldnNamespaces[ ix ];
	var sHref = dn.href;
	var lsParts = sHref.match( /^.*\/-(.*)\.html/ );
	if( lsParts && lsParts[ 1 ] ) {
		dn.textContent = lsParts[ 1 ];
	}
}

// show/hide custom methods menu if we have methods
// and render number of methods
var ldn = document.querySelectorAll( "h4.name" );
var c = ldn.length;
if( c ) {
	dnMethodCount.textContent = c;
}
else {
	document.getElementById( "method-header" ).style.display = "none";
}

// populate methods menu with links to methods found in 
// the current page
for( var ix=0; ix<c; ix++ ) {
	var dn = ldn[ ix ];
	var sMethod = "";
	for( var ixx=0; ixx<dn.childNodes.length; ixx++) {
		var dncur = dn.childNodes[ ixx ];
		if( dncur.nodeName === "#text") {
			sMethod = dncur.nodeValue;
			break;
		}
	}
	var dnLink = document.createElement( "a" );
	dnLink.name = sMethod;
	dn.parentNode.insertBefore( dnLink, dn );
	var dnLI = document.createElement( "li" );
	var dnA = document.createElement( "a" );
	dnA.href = "#" + sMethod;
	dnA.textContent = sMethod;
	dnLI.appendChild( dnA );
	dnMethods.appendChild( dnLI );
}

