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
 * // not working!
 * __.SP.ribbon.addIcon( {
 * 	  sList : "OSCE Contacts"
 * 	, sRibbon : "CommandUI.Ribbon.ListForm.Edit"//.Edit-title"
 * 	, sSegment : "Ribbon.ListForm.Edit.Commit"
 * 	, sLabel : "hi mom"
 * 	, sAction : "javascript:alert(1)"
 * } )
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
 * @param {Object} args a parameter object holding the following values
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
			hLoading += " src='" + __.SP.icon.mp.x16.loading + "'/>";
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


/**
 * Temporarily adds a ribbon icon into an existing ribbon group on-the-fly.
 * <br>It will try to find an icon image path by looking upt the image map (__.SP.icon.mp) using the lowercase label name (replacing spaces with underscores) and defaults to the placeholder icon (orange dot)
 * @memberof __.SP.ribbon
 * @method addTempIcon
 * @instance
 * @example
 * // add itom to clipboard group in edit ribbon in items edit form
 * dnAction = __.SP.ribbon.addTempIcon( {
 * 	  sLabel : "Approve Now" // image map key: "approve_now"
 * 	, dnGroup : __find( "#Ribbon\\.ListForm\\.Edit\\.Clipboard" )
 * 	, nPosition : 1
 * 	, fnAction : function() {
 * 		alert( 'approved' );
 * 	}
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sLabel Name of the icon
 * @param {Node} args.dnGroup DOM node of the group the icon should get appended. (Note: you get the node by ID of the LI element)
 * @param {function} args.fnAction Function to be executed on click
 * @param {Number} [args.nPosition] Position of the icon (0 is first position) by default icon is appended
 * @returns {Node} DOM node of the newly added icon
 */
__.SP.ribbon.addTempIcon = function( args ) {
	var hButton, sLabel;
	var kmpIcons = args.sLabel.toLowerCase().replace( /\s/g, "_" );
	var pathIconImg = __.SP.icon.mp.x32[ kmpIcons ];
	if( ! pathIconImg ) {
		pathIconImg = __.SP.icon.mp.x32.placeholder;
	}
	var hIcon = ' \
		<span class="ms-cui-section" id="" unselectable="on"> \
		<span class="ms-cui-row-onerow" id="" unselectable="on"> \
		<a class="ms-cui-ctl-large" mscui:controltype="Button" role="button" unselectable="on"> \
			<span class="ms-cui-ctl-largeIconContainer" unselectable="on"> \
			<span class="ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on"> \
			<img src="' + pathIconImg + '" unselectable="on" \> \
			</span> \
			</span> \
			<span class="ms-cui-ctl-largelabel" unselectable="on">' + args.sLabel + '</span> \
		</a> \
		</span> \
		</span> \
	';
	var dnIcons = args.dnGroup.__find( ".ms-cui-layout" );
	var dnIcon;
	if( typeof args.nPosition == "number" ) {
		var dnInsertBefore = dnIcons.__find( "span.ms-cui-section:nth-child(" + ( args.nPosition + 1 ) + ")" );
		console.log( dnInsertBefore );
		if( dnInsertBefore ) {
			dnIcon = dnInsertBefore.__before( hIcon );
		}
		else {
			console.warn( "desired icon position not available, will append" );
			dnIcon = dnIcons.__append( hIcon );
		}
	}
	else {
		dnIcon = dnIcons.__append( hIcon );
	}
	if( typeof args.fnAction == "function" ) {
		dnIcon.__find( "a" ).addEventListener( "click", function( e ) {
			e.stopPropagation();
			args.fnAction();
		} );
	}
	else {
		console.warn( "temp ribbon icon has no action function" );
	}
};

/**
 * Temporarily adds ribbon group to an existing ribbon on-the-fly.
 * <br>It adds an ID to the LI element starting with "Temp" plus the groups label joined by dots (e.g. Temp.Task.Actions)
 * @memberof __.SP.ribbon
 * @method addTempGroup
 * @instance
 * @example
 * // add group to edit ribbon in items edit form
 * dnGroup = __.SP.ribbon.addTempGroup( {
 * 	  dnRibbon : __find( "#Ribbon\\.ListForm\\.Edit" )
 * 	, nPosition : 0
 * 	, sLabel : "Task Actions"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sLabel Name of the group
 * @param {Node} args.dnRibbon DOM node of the ribbon the group should get appended. (Note: you get the node by ID of the UL element)
 * @param {Number} [args.nPosition] Position of the group (0 is first position) by default group is appended
 * @returns {Node} DOM node of the newly added group
 */
__.SP.ribbon.addTempGroup = function( args ) {
	var sid = "Temp." + args.sLabel.replace( " ", "." );
	var hGroup = ' \
		<li class="ms-cui-group" id="' + sid + '" unselectable="on"> \
			<span class="ms-cui-groupContainer" unselectable="on"> \
				<span class="ms-cui-groupBody" unselectable="on"> \
				<span class="ms-cui-layout" unselectable="on"> \
				</span> \
				</span> \
				<span class="ms-cui-groupTitle" unselectable="on">' + args.sLabel + '</span> \
			</span> \
			<span class="ms-cui-groupSeparator" unselectable="on"></span> \
		</li> \
	';
	if( typeof args.nPosition == "number" ) {
		var dnInsertBefore = args.dnRibbon.__find( "li:nth-child(" + ( args.nPosition + 1 ) + ")" );
		if( dnInsertBefore ) {
			return dnInsertBefore.__before( hGroup );
		}
		else {
			console.warn( "desired group position not available, will append" );
			return args.dnRibbon.__append( hGroup );
		}
	}
	else {
		return args.dnRibbon.__append( hGroup );
	}
}
