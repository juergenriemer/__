if( typeof( __ ) == "undefined" ) {
	console.warn( "__.Treeview depended on __ core libs" );
	__ = {};
}

__.Treeview = __.Class.extend( {
	  bInit : false
	, dnRoot : null
	, pathRoot : null
	, fnLoad : null
	, init : function( args ) {
		if( ! this.bInit ) {
		}
		this.bInit = true;
		this.dnRoot = args.dnRoot;
		this.pathRoot = args.pathRoot;
		this.fnLoad = args.fnLoad;
		this.loadRoot( this.pathRoot );
	  }
	, loadRoot : function( path ) {
		this.loadFolder( path );
	}
	, loadFolder : function( path ) {
		var that = this;
console.log( this );
		this.fnLoad( path, function( oResult ) {
			that.createStructure( oResult );
		} );	
		/*load 1st level of folders
		createFolderStructure
		set "loaded" (or use timestamp) on root node
		scroll to view*/
		
	}
	, createStructure : function( oResult ) {
		console.log( oResult );
	}
} );

__css( ' \
	* { color : red } \
	body { background : #efefef } \
' );
Object.defineProperty( Node.prototype, "__treeview", {
	value : function( args ) {
console.log( args );
		this.__oTreeview = __.Class.instantiate(
			  __.Treeview
			, {
				  dnRoot : this
				, args : args
			}
		);
	}
} );
