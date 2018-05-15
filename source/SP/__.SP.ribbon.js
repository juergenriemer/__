/**
 * @namespace __.SP.ribbon
 * @memberof __.SP
 */

__.SP.ribbon = {};

/**
 * Reloads the current ribbon, refreshing their active states. In case it fails to reload the ribbon it reloads the page
 * @memberof __.SP.ribbon
 * @method reload
 * @instance
 * @example
 * __.SP.ribbon.reload();
 */
__.SP.ribbon.reload = function() {
	try {
		SP.Ribbon.PageManager.get_instance().get_ribbon().refresh();
	} catch( e ) {
		self.location.reload();
	}
};

/**
 * Creates a new icon in a ribbon
 * @memberof __.SP.ribbon
 * @method addIcon
 * @async 
 * @instance
 * @example
 * n/a atm
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sList name of the list 
 * @param {String} args.sRibbon name of the list's ribbon 
 * @param {String} args.sSegment name of the ribbon's segement 
 * @param {String} args.sLabel label of the icon
 * @param {String} args.sDescription description of the icon
 * @param {String} args.sAction inline JavaScript of the onclick action
 * @param {String} args.sEnabled inline JavaScript to identify whether icon is acitve
 * @param {String} args.urlIcon16 URL of the small icon image
 * @param {String} args.urlIcon32 URL of the large icon image
 * @param {String} args.sToolTipTitle title of the tooltip
 * @param {String} args.sToolTipDescription description of the tooltip
 * @note list of list's ribbons: https://msdn.microsoft.com/en-us/library/office/bb802730.aspx
 * @note list of ribbon's segments: https://msdn.microsoft.com/en-us/library/ee537543(office.14).aspx or: to get the segment use browser inspector and check the ID of the segement in UI
 * @returns {Object} Resolved promise
 */
__.SP.ribbon.addIcon = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var oList = __.SP.list.get( ctx, args.sList );
	var oIcon = oList.get_userCustomActions().add();
	oIcon.set_location( args.sRibbon );
	var sCommand = args.sLabel.toLowerCase();
	sCommand = sCommand.replace( /\s/g, "_" );
	var xml = '<CommandUIExtension xmlns="http://schemas.microsoft.com/sharepoint/">';
	xml += '<CommandUIDefinitions>';
	xml += '<CommandUIDefinition Location="' + args.sSegment + '.Controls._children">';
	xml += '<Button Id="Ribbon.' + args.sRibbon + '.' + args.sSegment + '.' + sCommand + '" ';
	xml += 'Command="' + sCommand + '" ';
	xml += 'Sequence="' + ( args.nSequence || 0 ) + '" ';
	xml += 'Image16by16="' + args.urlIcon16 + '" ';
	xml += 'Image32by32="' + args.urlIcon32 + '" ';
	xml += 'Description="' + args.sDescription + '" ';
	xml += 'LabelText="' + args.sLabel + '" ';
	xml += 'ToolTipTitle="' + ( args.sToolTipTitle || "" ) + '" ';
	xml += 'ToolTipDescription="' + ( args.sToolTipDescription || "" ) + '" ';
	xml += 'TemplateAlias="o1"/>';
	xml += '</CommandUIDefinition>';
	xml += '</CommandUIDefinitions>';
	xml += '<CommandUIHandlers>';
	xml += '<CommandUIHandler Command="' + sCommand + '" ';
	xml += 'CommandAction="' + args.sAction + '" ';
	if( args.sEnabled ) {
		xml += 'EnabledScript="' + args.sEnabled + '" ';
	}
	xml += '/>';
	xml += '</CommandUIHandlers>';
	xml += '</CommandUIExtension>';
	oIcon.set_commandUIExtension( xml );
	oIcon.update();
	ctx.load( oList, "UserCustomActions" );
	__.SP.exec( ctx, oList, function( oList ) {
		if( oList.sError ) {
			async.reject();
		}
		else {
			async.resolve();
		}
	} );
};



/**
 * Allows for an asynchronous task stack to deliver the enabled status of a ribbon icon.
 * @memberof __.SP.ribbon
 * @method syncEnabledScript
 * @async 
 * @instance
 * @example
 * var dnIcon = __find( "#Ribbon\\.ListItem\\.Manage\\.CancelItem-Large" )
 * var oAsync = ( new __.Async()
 *    .then( function( args ) {
 *        // do sg to resolve/reject
 *        async.resolve( { bEnabled : false } );
 *    )
 * return __.SP.ribbon.syncEnabledScript( dnIcon, oAsync );
 * @param {String} args.dnIcon DOM node of the ribbon icon (expected to use the A-tag holding the icon ID).
 * @param {String} args.oAsync An Async task stack (must not be started).
 * @param {String} args.sSegment name of the ribbon's segement 
 * @returns {Boolean} false
 */
__.SP.ribbon.syncEnabledScript = function( dnIcon, oAsync ) {
	var that = this;
	// first check if it is the first call on the icon
	// in which case we initialize our custom attributes
	if( ! dnIcon.hasAttribute( "osce-bEnabled" ) ) {
		// enabled state of icon
		dnIcon.setAttribute( "osce-bEnabled", false );
		// flag whether we reload ribbon with new state
		dnIcon.setAttribute( "osce-bBusy", false );
	}
	var bBusy = ( dnIcon.getAttribute( "osce-bBusy" ) == "true" );
	if( ! bBusy ) {
		// set loading gif after a little moment
		dnIcon.__hd = setTimeout( function() {
			dnIcon.__style( "position", "relative" );
			var sStyle = ( __.utils.misc.isIE() )
				? 'position:absolute;top:13px;margin-left:12px'
				: 'position:absolute;top:13px;margin-left:-7px' ;
			var hLoading = "<img class='osce-loader' style='" + sStyle + "' ";
			hLoading += " src='" + __.SP.icon.mp.loading + "'/>";
			dnIcon.__append( hLoading );
		}, 501 );
		// reload ribbon with new state
		dnIcon.setAttribute( "osce-bBusy", true );
		dnIcon.setAttribute( "osce-bEnabled", false );
		oAsync.then( function( args ) {
			var async = __.Async.promise( args );
			dnIcon.setAttribute( "osce-bEnabled", args.bEnabled );
			setTimeout( function() {
				dnIcon.setAttribute( "osce-bBusy", false );
			}, 500 );
			// clear loading gif
			clearTimeout( dnIcon.__hd );
			var dnLoader = dnIcon.__find( ".osce-loader" );
			if( dnLoader ) {
				dnLoader.__remove();
			}
			__.SP.ribbon.reload();
		}, "set enabled state and refresh ribbon" )
		.start();
	}
	var bEnabled = ( dnIcon.getAttribute( "osce-bEnabled" ) == "true" );
	return bEnabled;
};

