__.SP.ribbon = {
	  reload : function() {
		try {
			SP.Ribbon.PageManager.get_instance().get_ribbon().refresh();
		} catch( e ) {
			self.location.reload();
		}
	}
	, addIcon : function( args ) { //sList, sRibbon, sSegment, sLabel, sDescription, sAction, sEnabled, urlIcon16, urlIcon32, sToolTipTitle, sToolTipDescription
		// sRibbon: https://msdn.microsoft.com/en-us/library/office/bb802730.aspx
		// sSegment: https://msdn.microsoft.com/en-us/library/ee537543(office.14).aspx
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
		console.log( xml );
		oIcon.set_commandUIExtension( xml );
		oIcon.update();
		ctx.load( oList, "UserCustomActions" );
		__.SP.exec( ctx, oList, function( oList ) {
			if( oList.sError ) {
				console.log( 'err' );
				async.reject( oList );
			}
			else {
				console.log( 'ok' );
				async.resolve();
			}
		} );
	}
	, dmiep : function( args ) {
		var async = __.Async.promise( args );
		var ctx = __.SP.ctx();
		var oList = __.SP.list.get( ctx, args.sList );
		var oIcon = oList.get_userCustomActions().add();
		console.log( oList.get_userCustomActions() )
		console.log( oList.get_userCustomActions().add() )
		oIcon.set_location( args.sRibbon );
		//oIcon.set_commandUIExtension( xml );
		oIcon.set_group( "hello" );
		oIcon.set_title( "hello" );
		ctx.load( oList, "UserCustomActions" );
		__.SP.exec( ctx, oList, function( oList ) {
			if( oList.sError ) {
				console.log( 'err' );
				async.reject( oList );
			}
			else {
				console.log( 'ok' );
				async.resolve();
			}
		} );
	}
};
