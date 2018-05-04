pathVS = "C:\\Users\\admin_jriemer\\Projects\\";
pathBuilds = "..\\builds\\";
pathDocs = "..\\docs\\";
pathSource = "..\\source\\";

// -------------------------
path = require('path');
fs = require( "fs" );
extend = require( "util" )._extend;
const exec = require("child_process").exec
exec( "dir", ( error, stdout, stderr ) => {
	console.log( stdout );
	console.log( stderr );
	if( error !== null ) {
		console.log( error );
	}
} );

Compile = {
	  x : 0
	, walk : function( dir, rxInclude, rxExclude, aResult ) {
		var rxinc = new RegExp( rxInclude );
		var rxexc = new RegExp( rxExclude || "\.~" );
		var lflResult = [];
		var lfl = fs.readdirSync( dir );
		lfl.forEach( function( fl, path ) {
			fl = dir + '/' + fl;
			console.log( fl );
			var stat = fs.statSync(fl)
			if (stat && stat.isDirectory()) {
				lflResult = lflResult.concat( Compile.walk( fl, rxInclude, rxExclude ) )
			}
			else {
				if( 
					rxinc.test( fl ) &&
					( ! rxexc.test( fl ) )
			       
				) {
					console.log( fl );
					lflResult.push( fl );
				}
			}
		} )
		return lflResult;
	}
	, flConcat : function( lfl ) {
		var sAll = "";
		lfl.forEach( function( fl ) {
			var s = fl.split( "/" );
			console.log( s[ s.length - 1] );
			sAll += fs.readFileSync( fl, 'utf-8' );
		} );
		return sAll;
	}
	, getAppInfo : function() {
		self = { O$C3 : {} };
		O$C3 = {};
		console.log( srcpathJS + "app.js" );
		require( srcpathJS + "app.js" );
		var aAppInfo = {
			  sShort : O$C3.sAppShort
			, nVersion : O$C3.nVersion
		};
		O$C3 = null;
		return aAppInfo;
	}
	, write : function( path, sFileName, sContent ) {
		fs.writeFileSync( path + sFileName , sContent );
	}
	, mirror : function( srcpath, dstpath ) {
		var sCommand = "";
		sCommand += 'robocopy "' + srcpath + '" "' + dstpath + '"';
		sCommand += " /MIR /NFL /NDL /NJH /NJS /nc /ns /np /xf *.*~";
		console.log( sCommand );
		//cmd.run( sCommand );
	}
	, jsdoc : function( pathSource, pathDocs, sConfig ) {
		var sCommand = "";
		sCommand += "jsdoc " + pathSource;
		sCommand += " -c " + sConfig;
		sCommand += " -d " + pathDocs;
		console.log( sCommand );
	//	cmd.run( sCommand );
	}
	, __ : function() {
		this.jsdoc( this.pathSource, this.pathDocs, "config.json" );
	}
};

Compile.__();
