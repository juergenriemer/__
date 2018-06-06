if( typeof( __ ) == "undefined" ) {
	console.warn( "__.Treeview depended on __ core libs" );
	__ = {};
}

__.Treeview = __.Class.extend( {
	  bInit : false
	, dnRoot : null
	, pathRoot : null
	, fnLoad : null
	, lpath : []
	, init : function( args ) {
		if( ! this.bInit ) {
		}
		this.bInit = true;
		this.dnRoot = args.dnRoot;
		this.dnRoot.classList.add( "ls-treeview" );
		this.pathRoot = "/" + args.pathRoot + "/";
		this.pathRoot = this.pathRoot.replace( /\/\//g, "/" );
		this.fnLoad = args.fnLoad;
		this.fnInit = args.fnInit || args.fnLoad;
		this.behaviour();
		this.createPreloadPaths( args );
		this.loadRoot( this.pathRoot );
	}
	, behaviour : function() {
		var that = this;
		this.dnRoot.addEventListener( "click", function( e ) {
			var dn = e.target;
			if( dn.classList.contains( "ls-expando" ) ) {
				var dnLI = dn.__closest( "li" );
				var dnUL = dnLI.lastElementChild;
				var dnIcon = dnLI.querySelector( "div.node img.ls-icon" );
				if( dn.classList.contains( "collapsed" ) ) {
					dn.classList.add( "expanded" );
					dn.classList.remove( "collapsed" );
					dnIcon.classList.add( "open" );
					if( dnUL.classList.contains( "js-loaded" ) ) {
						dnUL.__show();
					}
					else {
						dn.classList.add( "loading" );
						that.loadFolder( dnUL, dnLI, dnIcon );
					}
				}
				else {
					dn.classList.remove( "expanded" );
					dn.classList.add( "collapsed" );
					dnIcon.classList.remove( "open" );
					dnUL.__hide();
				}
			}
		} );
	}
	, loadRoot : function( path ) {
		var that = this;
		this.fnInit( path, function( oResult ) {
			that.createStructure( that.dnRoot, oResult );
		} );
	}
	, loadFolder : function( dnNode, dnLI, dnIcon ) {
		var that = this;
		var path = dnLI.getAttribute( "path" );
		this.fnLoad( path, function( oResult ) {
			var dnExpando = dnLI.__find( "img.ls-expando" );
			dnExpando.classList.remove( "loading" );
			that.createStructure( dnNode, oResult );
			// scroll into view
		}, dnLI );
	}
	, createProperties : function( aResult ) {
		var sProps = "";
		var kvProps = aResult.kvProps || {};
		aResult.kvProps.path = aResult.path;	
		for( var kProp in kvProps ) {
			var vProp = kvProps[ kProp ];
			sProps += ' ' + kProp + '="' + vProp + '" ';
		}
		return sProps;
	}
	, hNode : function( aResult ) {
		var path = aResult.path.replace( /\/\//g, "/" );
		var sProps = this.createProperties( aResult );
		var sBlank = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
		return "<li " + sProps + "> \
			<div class='node'> \
				<img src='" + sBlank + "' class='ls-expando collapsed'></img> \
				<a href='#" + path + "'> \
					<img src='" + sBlank + "' class='ls-icon " + aResult.sType + "'></img> \
					<span class='ls-name'>" + aResult.sName + "</span> \
				</a> \
			</div> \
			<ul class='js-not-loaded'></ul> \
		</li>";
	}
	, createPreloadPaths : function( args ) {
		if( args.pathPreload ) {
			var that = this;
			var path = args.pathPreload.replace( /\/\//g, "/" );
			path = path.replace( this.pathRoot, "" ); 
			var lsFolder = path.split( "/" );
			var sSlash = "";
			var curpath = this.pathRoot;
			lsFolder.forEach( function( sFolder ) {
				if( sFolder ) {
					curpath += sSlash + sFolder;
					sSlash = "/";
					that.lpath.push( curpath );
				}
			} );	
		}
	}
	, preloadPath : function( dnNode ) {
		if( this.lpath.length > 0 ) {
			var path = this.lpath.shift();
			var css = "a[href='#" + path + "']";
			var dnLink = dnNode.__find( css );
			if( dnLink ) {
				var dnLI = dnLink.__closest( "li" );
				dnLI.__find( ".ls-expando" ).click();
			}
		}
	}
	, _render : function( dnNode, oResult ) {
	}
	, render_ : function( dnNode, oResult ) {
		this.preloadPath( dnNode );
	}
	, createStructure : function( dnNode, oResult ) {
		var that = this;
		if( oResult.sErrMsg ) {
			return;
		}
		this._render( dnNode, oResult );
		dnNode.classList.remove( "js-not-loaded" );
		dnNode.classList.add( "js-loaded" );
		if( oResult.laFolders ) {
			if( oResult.laFolders == 0 ) {
				dnNode.classList.add( "js-empty" );
			}
			var hFolders = "";
			oResult.laFolders.forEach( function( aResult ) {
				hFolders += that.hNode( aResult );
			} );
			hFolders += "";
			dnNode.__append( hFolders );
		}
		that.render_( dnNode, oResult );
	}
} );

__css( ' \
	.ls-treeview ul { \
		margin-left : -16px; \
	} \
	.ls-treeview li { \
		list-style : none; \
	} \
	  .ls-treeview img { \
		border : 0; \
	} \
	  .ls-treeview img.ls-icon \
	, .ls-treeview img.ls-expando { \
		width : 16px; \
		height : 16px; \
		cursor : pointer; \
	} \
	.ls-treeview img.folder { \
		background-image:url( folder.png ) \
	} \
	.ls-treeview img.folder.open { \
		background-image:url( folder-open.png ) \
	} \
	.ls-treeview img.expanded { \
		background-image:url( expanded.png ) \
	} \
	.ls-treeview img.collapsed { \
		background-image:url( collapsed.png ) \
	} \
	.ls-treeview img.loading { \
		background-image:url( loading.gif ) \
	} \
' );
Object.defineProperty( Node.prototype, "__treeview", {
	value : function( args ) {
		args.dnRoot = this;
		this.__oTreeview = __.Class.instantiate( __.Treeview, args );
	}
} );
