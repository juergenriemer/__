pathVS = "C:\\Users\\admin_jriemer\\Projects\\";
pathBuilds = "../builds/";
pathDocs = "../docs/jsdoc/";
pathSource = "../source/";
nVersion = "0.9.66";
pathHive = "C:\\Program Files\\Common Files\\Microsoft Shared\\Web Server Extensions\\15\\TEMPLATE\\LAYOUTS\\osce\\";
// -------------------------
path = require('path');
fs = require( "fs" );
extend = require( "util" )._extend;
const exec = require("child_process").exec

Compile = {
	  x : 0
	, walk : function( dir, rxInclude, rxExclude, aResult ) {
		var rxinc = new RegExp( rxInclude );
		var rxexc = new RegExp( rxExclude || "\.~" );
		var lflResult = [];
		var lfl = fs.readdirSync( dir );
		lfl.forEach( function( fl, path ) {
			fl = dir + '/' + fl;
			var stat = fs.statSync(fl)
			if (stat && stat.isDirectory()) {
				lflResult = lflResult.concat( Compile.walk( fl, rxInclude, rxExclude ) )
			}
			else {
				if( 
					rxinc.test( fl ) &&
					( ! rxexc.test( fl ) )
			       
				) {
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
			//console.log( s[ s.length - 1] );
			sAll += fs.readFileSync( fl, 'utf-8' );
		} );
		return sAll;
	}
	, getAppInfo : function() {
		self = { O$C3 : {} };
		O$C3 = {};
		require( srcpathJS + "app.js" );
		var aAppInfo = {
			  sShort : O$C3.sAppShort
			, nVersion : O$C3.nVersion
		};
		O$C3 = null;
		return aAppInfo;
	}
	, createFolder : function( path ) {
		if (!fs.existsSync(path)){
			fs.mkdirSync(path);
		}

	}
	, deleteFolder : function( path ) {
		var that = this;
		if (fs.existsSync(path)) {
			fs.readdirSync(path).forEach(function(file, index){
				var curPath = path + "/" + file;
				if (fs.lstatSync(curPath).isDirectory()) { // recurse
					that.deleteFolder(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
	, purgeFolder : function( path ) {
		this.deleteFolder( path );
		this.createFolder( path );
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
		sCommand += " -r ";
		sCommand += " -c " + sConfig;
		sCommand += " -d " + pathDocs;
		console.log( sCommand );
		exec( sCommand, ( error, stdout, stderr ) => {
			if( stdout ) {
				console.log( "OK", stdout );
			}
			if( stderr ) {
				console.log( "SYSERR", stderr );
			}
			if( error !== null ) {
				console.log( "ERR", error );
			}
		} );
	//	cmd.run( sCommand );
	}
	, lflsort : function( lfl ) {
		lfl = lfl.sort( function( a, b ) {
			//a = a.replace( /[\W_]+/g, "" );
			a = a.replace( /\.js$/,"" );
			//b = b.replace( /[\W_]+/g, "" );
			b = b.replace( /\.js$/, "" );
			console.log( a, b );
			return (a < b);
		} );
		lfl.reverse();
		return lfl;
	}
	, __ : function() {
		// create documentation
		/*
		this.purgeFolder( pathDocs );
		this.jsdoc( pathSource + "/core/dom", pathDocs + "/dom", "config.json" );
		this.jsdoc( pathSource + "/core/utils", pathDocs + "/utils", "config.json" );
		this.jsdoc( pathSource + "/core/async", pathDocs + "/async", "config.json" );
		this.jsdoc( pathSource + "/core/class", pathDocs + "/class", "config.json" );
		this.jsdoc( pathSource + "/core/event", pathDocs + "/event", "config.json" );
		this.jsdoc( pathSource + "/SP", pathDocs + "/SP", "config.json" );
		*/

		var lfljsCore = this.walk( pathSource + "/core", "\.min\.js$", "\/jsLink\/" );
		var lfljsPlugins = this.walk( pathSource + "/plugins", "\.min\.js$", "\/jsLink\/" );
		//var lfljsSP = this.walk( pathSource + "/SP", "\.min\.js$", "\/jsLink\/" );
		var lfljsSP = this.walk( pathSource + "/SP", "\.js$" );
		this.lflsort( lfljsSP );
		console.log( lfljsSP );
		var sjsCore = this.flConcat( lfljsCore );
		var sjsPlugins = this.flConcat( lfljsPlugins );
		var sjsSP = this.flConcat( lfljsSP );
		var sjsAll = sjsCore + sjsPlugins + sjsSP;

		this.write( pathBuilds, "__.core." + nVersion + ".min.js", sjsCore );
		this.write( pathBuilds, "__.plugins." + nVersion + ".min.js", sjsPlugins );
		this.write( pathBuilds, "__.sp." + nVersion + ".min.js", sjsSP );
		this.write( pathBuilds, "__." + nVersion + ".min.js", sjsAll );
		this.write( pathHive, "__." + nVersion + ".min.js", sjsAll );
	}
};

Compile.__();


