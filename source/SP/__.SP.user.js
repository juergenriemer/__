__.SP.user = {
	/**
	 * Stores user info for consequtive calls to current()
	 */
	  aInfo : null
	/** 
	 * Gets info from currently logged user
	 */
	, current : function( args ) {
		var that = this;
		var async = __.async( args );
		if( this.aInfo ) {
			async.resolve( { aUserInfo : this.aInfo } );
			console.log( 'fresh from cache' );
			return;
		}

SP.SOD.executeFunc('SP.js', 'SP.ClientContext', function() {
   SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function() {
console.log( 'ulla' );
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
				}
				var loGroups = oGroups.getEnumerator();
				while( loGroups.moveNext() ) {
					var oGroup= loGroups.get_current();
					that.aInfo.lsGroups.push( oGroup.get_title() );
				}
				async.resolve( { aUserInfo : that.aInfo } );
			}
		} );

	})
})
	}
};
