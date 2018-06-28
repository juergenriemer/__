/**
 * @namespace __.SP.group
 * @memberof __.SP
 */

__.SP.group = {};

/**
 * Creates a new SharePoint group
 * @memberof __.SP.group
 * @method add
 * @async 
 * @instance
 * @example
 * __.SP.group.add( {
 *       sName : "TaskAdmins"
 *     , sDescription : "users that can administer Tasks" 	
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sName name of the group
 * @param {String} [args.sDescription] description of the group
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * oGroup | (Object) | SP object of created group
 * </pre>
 */
__.SP.group.add = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
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

/**
 * Adds a user to a SharePoint group
 * @memberof __.SP.group
 * @method addUser
 * @async 
 * @instance
 * @example
 * __.SP.group.add( {
 *       sName : "OSCE-test\\jriemer"
 *     , sGroup : "TaskAdmins"
 * } );
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sUser domain/login of user
 * @param {String} args.sGroup name of the group
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * oUser | (Object) | SP object of added user
 * </pre>
 */
__.SP.group.addUser = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
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
