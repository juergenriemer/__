/**
 * @namespace __.SP.user
 * @memberof __.SP
 */

__.SP.user = {};

// Stores user info for consequtive calls to current()
__.SP.user.aInfo = {
	  id : -1
	, sLogin : "na"
	, mail : "na"
	, bAdmin : false
	, lsGroups : []
	, bLoaded : false
};

/**
 * Gets information on the currently logged in user
 * @memberof __.SP.user
 * @method current
 * @instance
 * @async
 * @example
 * __.SP.user.current();
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * aUserInfo | (Object) | key/value pair of properties
 * kv.id | (String) | id of the user
 * kv.sLogin | (Array) | domain/login of the user
 * kv.mail | (String) | email of the user
 * kv.bAdmin | (Number) | number of rows displayed
 * kv.lsGroups | (Array) | array of SharePoint group names the user is member of
 * </pre>
 */
__.SP.user.current = function( args ) {
	var that = this;
	var async = __.Async.promise( args );
	if( this.aInfo.bLoaded ) {
		async.resolve( { aUserInfo : this.aInfo } );
		return;
	}
	var _getCurrentUserInfo = function() {
		var ctx = __.SP.ctx();
		var oUser = ctx.get_web().get_currentUser();
		var oGroups = oUser.get_groups();
		ctx.load( oUser );
		ctx.load( oGroups );
		__.SP.exec( ctx, [ oUser, oGroups ], function( lo ) {
			var oUser = lo[ 0 ];
			var oGroups = lo[ 1 ];
			if( oUser.sError ) {
				async.resolve( "Could not load user info", oUser );
			}
			else if( oGroups.sError ) {
				async.resolve( "Could not load users group info", oGroups );
			}
			else {
				that.aInfo = {
					  id : oUser.get_id()
					, sLogin : oUser.get_loginName()
					, mail : oUser.get_email()
					, bAdmin : oUser.get_isSiteAdmin()
					, lsGroups : []
					, bLoaded : false
				}
				var loGroups = oGroups.getEnumerator();
				while( loGroups.moveNext() ) {
					var oGroup= loGroups.get_current();
					that.aInfo.lsGroups.push( oGroup.get_title() );
				}
				async.resolve( { aUserInfo : that.aInfo } );
			}
		} );
	}
	SP.SOD.executeFunc('SP.js', 'SP.ClientContext', function() {
		SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function() {
			_getCurrentUserInfo();
		} )
	} )
};

// execute it right away for will need it in any case
_spBodyOnLoadFunctionNames.push( "__.SP.user.current" );

