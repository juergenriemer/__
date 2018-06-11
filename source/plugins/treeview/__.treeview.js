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
		this.msLoadingDelay = 125;
		this.bInit = true;
		this.dnRoot = args.dnRoot;
		this.dnRoot.classList.add( "ls-treeview" );
		this.pathRoot = ( args.pathRoot ) ? "/" + args.pathRoot + "/" : "/";
		this.pathRoot = this.pathRoot.replace( /\/\//g, "/" );
		this.fnLoad = args.fnLoad;
		this.fnInit = args.fnInit || args.fnLoad;
		this.behaviour();
		if( args.preloadPath ) {
			this.createPreloadPaths( args.preloadPath );
		}
		this.loadRoot( this.pathRoot );
	}
	, behaviour : function() {
		var that = this;
		this.dnRoot.addEventListener( "click", function( e ) {
			var dn = e.target;
			var dnLI = dn.__closest( "li" );
			var dnNode = dnLI.querySelector( "div.node" );
			if( dn.classList.contains( "ls-expando" ) ) {
				var dnUL = dnLI.lastElementChild;
				var dnIcon = dnLI.querySelector( "div.node img.ls-icon" );
				if( dn.classList.contains( "collapsed" ) ) {
					dn.classList.add( "expanded" );
					dn.classList.remove( "collapsed" );
					if( dnUL.classList.contains( "js-loaded" ) ) {
						dnIcon.classList.add( "open" );
						//dnUL.__show();
						dnUL.__slideDown().__fadeIn();
					}
					else {
						dn.hdTimer = setTimeout( function() {
							dn.classList.add( "loading" );
						}, that.msLoadingDelay );
						that.loadFolder( dnUL, dnLI, dnIcon );
					}
				}
				else {
					dn.classList.remove( "expanded" );
					dn.classList.add( "collapsed" );
					dnIcon.classList.remove( "open" );
					//dnUL.__hide();
					dnUL.__slideUp().__fadeOut();
				}
			}
			else if( dn.tagName != "DIV" ) {
				// highlight active node
				that.setActiveNode( dnNode );
			}
		} );
	}
	, setActiveNode : function( dnNode ) {
		var dnActiveNode = this.dnRoot.__find( ".node.active" );
		if( dnActiveNode ) {
			dnActiveNode.classList.remove( "active" );
		};
		dnNode.classList.add( "active" );
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
			dnIcon.classList.add( "open" );
			var dnExpando = dnLI.__find( "img.ls-expando" );
			clearTimeout( dnExpando.hdTimer );
			setTimeout( function() {
				// remove loading gif
				dnExpando.classList.remove( "loading" );
			}, that.msLoadingDelay );
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
		var pathOpen = aResult.pathOpen || aResult.path;
		var sProps = this.createProperties( aResult );
		var sBlank = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
		return "<li " + sProps + "> \
			<div class='node'> \
				<img src='" + sBlank + "' class='ls-expando collapsed'></img> \
				<a href='" + pathOpen + "'> \
					<img src='" + sBlank + "' class='ls-icon " + aResult.sType + "'></img> \
					<span class='ls-name'>" + aResult.sName + "</span> \
				</a> \
			</div> \
			<ul class='js-not-loaded'></ul> \
		</li>";
	}
	, createPreloadPaths : function( pathPreload ) {
		var that = this;
		var path = pathPreload.replace( /\/\//g, "/" );
		path = path.replace( this.pathRoot, "/" ); 
		var lsFolder = path.split( "/" );
		var curpath = this.pathRoot;
		lsFolder.forEach( function( sFolder ) {
			if( sFolder ) {
				curpath += sFolder + "/";
				that.lpath.push( curpath );
			}
		} );
	}
	, preloadPath : function( dnNode ) {
		dnNode = dnNode || this.dnRoot;
		if( this.lpath.length > 0 ) {
			var path = this.lpath.shift();
			var css = "li[path='" + path + "']";
			var dnLI = dnNode.__find( css );
			if( dnLI ) {
				if( this.lpath.length == 0 ) {
					var dnNode = dnLI.querySelector( "div.node" );
					this.setActiveNode( dnNode );
				}
				var dnExpando = dnLI.querySelector( ".ls-expando" );
				if( dnExpando.classList.contains( "collapsed" ) ) {
					dnExpando.click();
				}
				else {
					this.preloadPath( dnNode );
				}
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
			dnNode.style.maxHeight = 0;
			dnNode.style.opacity = 0;
			dnNode.__append( hFolders );
			dnNode.__slideDown().__fadeIn();
		}
		that.render_( dnNode, oResult );
	}
} );

__css( ' \
	.ls-treeview li { list-style:none; } \
	.ls-treeview div.node { height:20px; } \
	.ls-treeview div.node.active { background:#efefef; } \
	.ls-treeview img { width:16px; height:16px; float:left; cursor:pointer; } \
	.ls-treeview a:hover { text-decoration:none; } \
	.ls-treeview a img.ls-icon { float:left; } \
	.ls-treeview a span.ls-name { margin-left:4px; line-height:16px; font-size:100%; vertical-align:text-top; } \
	.ls-treeview ul { margin-left:16px; } \
	.ls-treeview img.folder { \
		/* background-image:url( folder.png ) */ \
		background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAH0AAAB9ABuYvnnwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACmSURBVDiNY2QgAry62sDD/uuH5m8kMcb/jF/33rlzk5GQ5s/nKkV/MYu1sYtaprBx8sLFvzw/+/7nj+vqLAwMDAyfTlYK//7/lxNd838WZp4/jNwdLEKW/pwimihynIKvBNne3WNmZGBgYHh/vvoyw38GHWK8gwxY2VklmSBWMciQqhkGmMjVOGrAsDKAhYGBgeH/f4YcRgZGNlI1c3/8+JFSB1AOAG3DLJA4I9FiAAAAAElFTkSuQmCC"); \
	} \
	.ls-treeview img.folder.open { \
		/* background-image:url( folder-open.png ) */ \
		background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAH0AAAB9ABuYvnnwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFHSURBVDiNxZA9L0NhGIav97xvqyqlPhLxlZhUYjCKdBAG/0AXidGfsJitTPwBqVkiVESsUh2aYKqhJa22DtpT7ek5r6kfC+kZxD3eT67nvp8H/lvit6GOb8iX0bmo1nqy4xrFyfLjlYidOADqZzguc2MPm4GJpYOh6cVQy7fyKetJqik4MQFU9mxvyzcyuO3rD8vuBSaODPavRIZml0OG9LV9WR4IDquvdnMl/e8L4fmtqD803vPd3VIA0h8AwK6+8Zm5BKf2I+B8lWk25PFzYsfWBkedH2hNNZekXkj1EryOAAHnRsuxLZN64c5DeVEUyk0oXEoAVj6J2zB7552+02YpkjG04MOuVWi8Jj2ko4Wqx2disZoB4L7d41jvXurfKn/jBsAAqGSv0doLry/SdrAGoHBJN2133wOO0OJwdW236YX5O30DMvV3Ol5mm2YAAAAASUVORK5CYII="); \
	} \
	.ls-treeview img.expanded { \
		/* background-image:url( expanded.png ) */ \
		background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAQdAAAEHQBSn3aPwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADcSURBVDiN7ZDBSsNAEIb/md3stiFkPScxTHIu9pGEqoVCn8Yn8gl8ir2GFA+RQLLxoAWpae1d/+PMP//w/cC/6AqPqaqqYua67/sX7/3796W+dCkiC2ZeMfOOiMooil4BXBdQFMVSa702xjwlSbJp2xYAFqc+PvdZa31nrX1wzm3KsgTRPO1cgGHmVRzHW+fco4icZ5xDEJFaKbVP0/Q+z3MMw4BxHCcAPRFNvwYYY+oQwm3TNPjiBj6Lew4hvJ36f4BlWRYrpW6stcvjjJmnrusO3vsDgHCR6Q/qA41eNjwn1bnkAAAAAElFTkSuQmCC"); \
	} \
	.ls-treeview img.collapsed { \
		/* background-image:url( collapsed.png ) */ \
		background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAQdAAAEHQBSn3aPwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEXSURBVDiN1ZAxS4RwGMafvERoOB2qI1wk0Ek3h78u4qdoa49oaw38FG3REJEt19IiOLnc7eLfRI4WDcLILujkBrU1IiWn6F2fh9/7e1/gr2ejK3BdV2UY5olS+uY4TtPVY3rgdyzLHhiGsd22beeizT699Xp93jTN1mw2uwTwOsigrmuYpglBEM4Wi8VxEAQ7gwAAwHEcdF3nRVE8iqLoxPO83UEAABiPx9A0bU+W5cMwDE99398fBACAoihQluUHz/PPo9Ho/WvW+0QAiOMYlNJkuVzeKIoytSzr5deANE2RZVlSVdW1qqq3hJDH753OE1arFebzeVJV1YUkSVeEkPSnXqdBnucPoihOJ5PJvW3bRZ/pP59PafBj2ofGftMAAAAASUVORK5CYII="); \
	} \
	.ls-treeview img.loading { \
		/* background-image:url( loading.gif ) */ \
		background-image:url("data:image/gif;base64,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"); \
	} \
' );
Object.defineProperty( Node.prototype, "__treeview", {
	value : function( args ) {
		args.dnRoot = this;
		this.__oTreeview = __.Class.instantiate( __.Treeview, args );
	}
} );
console.log( ">>>>>>" );
/*
O$C3.TV = {
	  dnTreeview : null
	, init : function() {
		var that = this;
		top.document.addEventListener( "DOMContentLoaded", function() {
			setTimeout( function() {
				if( ! that.dnTreeview ) {
					that.create();
					__.Event.listen( that, "hashchange" );
				}
			}, 1000 );
		} );
	}
	, readHash : function() {
		var path = __.url.oParams().RootFolder;
		if( path ) {
			path = unescape( path );
			path = path.replace( _spPageContextInfo.webServerRelativeUrl, "" );
			path = path.replace( / /g, "%20" );
		}
		else {
			var lsMatches = self.location.href.match( /\.aspx#(.*)Forms\/.*?\.aspx/ );
			if( lsMatches && lsMatches[ 1 ] ) {
				path = lsMatches[ 1 ];
			}
		}
		return path;
	}
	, create : function() {
		var that = this;
		var dnSidebar = __find( "#sideNavBox" );
		var path = this.readHash();
		this.dnTreeview = dnSidebar.__append( "<ul id='treeview'></ul>" );
		this.dnTreeview.__treeview( {
			  preloadPath : path
			, fnLoad : function( path, cbLoaded, dnLI ) {
				if( dnLI ) {
					var sList = dnLI.getAttribute( "sList" );
					var sListInternal = dnLI.getAttribute( "sListInternal" );
				}
				var that = this;
				var ms = Math.random() * 1000;
				ms = 0;
				setTimeout( function() {
					__.SP.folder.content( {
						  path : path
						, sList : sList
						, sFilter : "folders"
						, cb : function( args ) {
							var laFolders = [];
							args.laItems.forEach( function( aList ) {
								var sFolderName = aList.sDisplayName;
								var pathLoad = path + aList.sTitle + "/"
								var pathOpen = _spPageContextInfo.webServerRelativeUrl;
								pathOpen += "/_layouts/15/start.aspx#/" + sListInternal;
								pathOpen += "/Forms/AllItems.aspx?RootFolder=";
								pathOpen += _spPageContextInfo.webServerRelativeUrl + pathLoad;
								laFolders.push( {
									  sName : sFolderName
									, path : pathLoad
									, pathOpen : pathOpen
									, sType : "folder"
									, kvProps : {
										  sList : sList
										, sListInternal : sListInternal
									}
								} );
							} );
							cbLoaded( { laFolders : laFolders } );
						}
					} );
				}, ms );
			}
			, fnInit : function( path, cbLoaded ) {
				__.SP.site.lists( {
					  cb : function( args ) {
						var laFolders = [];
						args.laLists.forEach( function( aList ) {
							if( aList.nBaseTemplate == 101 ) {
								var sList = aList.sDisplayName;
								var sListInternal = aList.sTitle.replace( /_x0020_/g, "%20" );
								var pathOpen = _spPageContextInfo.webServerRelativeUrl;
								pathOpen += "/_layouts/15/start.aspx#/" + sListInternal;
								pathOpen += "/Forms/AllItems.aspx";
								laFolders.push( {
									  sName : sList
									, path : "/" + sListInternal + "/"
									, pathOpen : pathOpen
									, sType : "folder"
									, kvProps : {
										  sList : sList
										, sListInternal : sListInternal
									}
								} );
							}
						} );
						cbLoaded( { laFolders : laFolders } );
					}
				} );
			}
		} );
	}
	, onHashchange : function( aInfo ) {
		console.log( aInfo );
		if( ! /#/.test( aInfo.scurPage ) ) {
			console.log( ">>>>>>>>>>>" + aInfo.sprvPage );
		} else { console.log( 'oki' ) }
//https://dev-sharepoint.osce.org/sites/conman_pro/SiteAssets/Forms/AllItems.aspx?RootFolder=/sites/conman_pro/SiteAssets/Osce/Osce.Conman/images/

//https://dev-sharepoint.osce.org/sites/conman_pro/_layouts/15/start.aspx#/SiteAssets/Forms/AllItems.aspx?RootFolder=/sites/conman_pro/SiteAssets/Osce/Osce.Conman/images/

		var path = this.readHash( aInfo );
		if( path ) {
			this.dnTreeview.__oTreeview.createPreloadPaths( path );
			this.dnTreeview.__oTreeview.preloadPath();
		}
	}
}
O$C3.TV.init();
*/
