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
		console.log( args );
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
				var dnNode = dnLI.querySelector( "div.node" );
				var dnLink = dnNode.__find( "a" );
				var dnContainer = dnNode.__find( "img.ls-container" );
				var path = dnLink.getAttribute( "href" ).split( "#" )[ 1 ];
				var dnUL = dnLI.lastElementChild;
				switch( dn.getAttribute( "alt" ) ) {
					case "+" :
						dn.setAttribute( "alt", "-" );
						dnContainer.classList.add( "open" );
						if( dnUL.classList.contains( "js-loaded" ) ) {
							dnUL.__show();
						}
						else {
							dnContainer.classList.add( "loading" );
							that.loadFolder( dnUL, path, dnContainer );
						}
					break;
					case "-" :
						dn.setAttribute( "alt", "+" );
						dnContainer.classList.remove( "open" );
						dnUL.__hide();
					break;
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
	, loadFolder : function( dnNode, path, dnContainer ) {
		var that = this;
		this.fnLoad( path, function( oResult ) {
			if( dnContainer ) {
				dnContainer.classList.remove( "loading" );
			}
			that.createStructure( dnNode, oResult );
			// scroll into view
		} );
	}
	, hNode : function( aResult ) {
		var path = aResult.path.replace( /\/\//g, "/" );
		var sCustomProps = "";
		if( aResult.aCustom ) {
			for( var kProp in aResult.aCustom ) {
				var vProp = aResult.aCustom[ kProp ];
				sCustomProps += ' ' + kProp + '="' + vProp + '" ';
			}
		}
		//aResult.sType = "folder-open";
		return "<li " + sCustomProps + "> \
			<div class='node'> \
				<img class='ls-expando' alt='+'></img> \
				<a href='#" + path + "'> \
					<img class='ls-container " + aResult.sType + "'></img> \
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
		console.log( 'ulla' );
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
		setTimeout( function() {
			that.render_( dnNode, oResult );
		}, 1500 );
	}
} );

__css( ' \
	.ls-treeview ul { \
		xmargin : 0; \
		xpadding : 0; \
	} \
	.ls-treeview li { \
		list-style : none; \
	} \
	  .ls-treeview img.ls-container \
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
	.ls-treeview img.loading { \
		background-image:url( loading.gif ) \
	} \
	.ls-treeview img.expanded { \
		background-image:url( expanded.png ) \
	} \
	.ls-treeview img.collapsed { \
		background-image:url( collapsed.png ) \
	} \
' );
	/*
Object.defineProperty( Node.prototype, "__treeview", {
	value : function( args ) {
		args.dnRoot = this;
		this.__oTreeview = __.Class.instantiate( __.Treeview, args );
	}
} );
	*/
