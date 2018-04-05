__.SP.permission = {};
__.SP.group = {};
__.SP.group.add = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oWeb = ctx.get_web();
	var oCreate = new SP.GroupCreationInformation();
	oCreate.set_title( args.sName );
	if( args.sDescription ) {
		oCreate.set_description( args.sDescription );
	}
	oGroup = oWeb.get_siteGroups().add( oCreate );
	ctx.load( oGroup );
	__.SP.exec( ctx, oGroup, function( oGroup ) {
		if( oGroup.sError ) {
			async.reject( oGroup );
		}
		else {
			async.resolve();
		}
	} );
}
__.SP.group.addUser = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oGroups = ctx.get_web().get_siteGroups();
	var oGroup = oGroups.getByName( args.sGroup );
	var oUserInfo = new SP.UserCreationInformation();
	//oUserInfo.set_loginName( args.sUser );
	oUserInfo.set_loginName( 'OSCE-test\\jriemer' );
	oUserInfo.set_title( 'jriemer' );
	oUserInfo.set_email('alias@somewhere.com');
	var oUser = oGroup.get_users().add( oUser );
	console.log(1)
	ctx.load( oUser );
	__.SP.exec( ctx, [ oGroup, oUser ], function( oUser ) {
		if( oUser.sError ) {
			async.reject( oUser );
		}
		else {
			async.resolve();
		}
	} );
}

__.SP.group.addUser = function( args ) {
	var async = __.async( args );
	var ctx = __.SP.ctx();
	var oUser = ctx.get_web().ensureUser( args.sUser );
	var oGroup = ctx.get_web().get_siteGroups().getByName( args.sGroup );
	oGroup.get_users().addUser( oUser );
	ctx.load( oUser );
	ctx.load( oGroup );
	__.SP.exec( ctx, oUser, function( oUser ) {
		if( oUser.sError ) {
			async.reject( oUser );
		}
		else {
			async.resolve();
		}
	} );
}
