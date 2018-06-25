Test = {
	  root : ""
	, sMode : ""
	, bError : false
	, cAsserts : 0
	, msAssertCheck : 0
	, lsLibs : [ "DOM" , "Async", "Class", "Event", "Utils" ]
	, ixLib : 0
	, createTest : function( sLib, bMin ) {
		var that = this;
		var sMin = ( bMin ) ? "?min" : "";
		var dnIFrame = document.createElement( "iframe" );
		dnIFrame.style.height = "100px";
		dnIFrame.onload = function() {
			dnIFrame.onload = function() {
				setTimeout( function() {
				that.nextTest( sLib, bMin, dnIFrame );
				}, 200 );
			}
		}
		var url = that.root + sLib + "/test." + sLib + ".html" + sMin;
		dnIFrame.src = url;	
		document.body.appendChild( dnIFrame );	
	}
	, nextTest : function( sLib, bMin, dnIFrame ) {
		dnIFrame.style.display = "none";
		var sMin = ( bMin ) ? " [minified]" : " [plain]";
		var dnMessage = document.createElement( "div" );
		dnMessage.textContent = "OK -> " + sLib + sMin;
		dnMessage.style.border = "1px dashed #fff";
		dnMessage.style.color = "#fff";
		dnMessage.style.background = "green";
		document.body.appendChild( dnMessage );
		// was last test minified?
		if( bMin ) {
			if( this.lsLibs.length > 0 ) {
				var sLib = this.lsLibs.shift();
				this.createTest( sLib, false );
			}
		}
		else {
			this.createTest( sLib, true );
		}
	}
	, all : function() {
		var sLib = this.lsLibs.shift();
	//	var sLib = this.lsLibs[ 0 ]//.shift();
		this.createTest( sLib, false );
	}
	, assert : function( x1, x2, sLabel ) {
		var dn = document.querySelector( "#test-output" );
		if( JSON.stringify( x1 ) == JSON.stringify( x2 ) ) {
			s = 'OK: ' + sLabel;
		}
		else {
			s = 'ERR: ' + sLabel + " (check console)";
			console.warn( 'ERR: ' + sLabel );
			console.warn( 'got', x1 );
			console.warn( 'exp', x2 );
			this.bError = true;
		}
		dn.innerHTML = s + "<br>" + dn.innerHTML;
		this.cAsserts--;
	} 
	, init : function() {
		var that = this;
		if( /test.html$/.test( self.location.href ) ) {
			Test.all();
		}
		else {
			this.cAsserts = cAsserts;
			this.msAssertCheck = msAssertCheck || 100;
			var sLib = self.location.href.match( /test\.(.*)\.html/ )[ 1 ];
			var fl = "__." + sLib;
			if ( /\?min/.test( self.location.href ) ) {
				fl += ".min.js";
				this.sMode = " [minified]";	
			}
			else {
				fl += ".js";
				this.sMode = " [plain]";	
			}
			var h = '<sc'+'ript src="' + fl + '"></sc'+'ript>';
			h += '<h3>Unit tests for ' + sLib + this.sMode + '</h3>';
			h += '<a href="' + self.location.href + '" ';
			h += ' target="_blank">run standalone</a>';
			h += " <div style='border:1px dashed black' ";
			h += " id='test-output'></div>";
			document.write(  h );
			setTimeout( function() {
				that.assertCheck();
			}, that.msAssertCheck );
		}
	}
	, assertCheck : function() {
		this.cAsserts--;
		this.assert( this.cAsserts, 0, "All tests run" );
		if( this.bError ) {
			document.body.style.background = "red";
		}
		else {
			document.body.style.background = "green";
			self.location.href = "about:blank";
		}
	}
};
Test.init();
