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
 * @note list of ribbon's segments: https://msdn.microsoft.com/en-us/library/ee537543(office.14).aspx
 * @returns {Object} Resolved promise
 */
__.SP.ribbon.addIcon = function( args ) { // sList, sRibbon, sSegment, sLabel, sDescription, sAction, sEnabled, urlIcon16, urlIcon32, sToolTipTitle, sToolTipDescription
		// or: to get the segment use browser inspector and check the ID of the segement in UI
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
	}
};
