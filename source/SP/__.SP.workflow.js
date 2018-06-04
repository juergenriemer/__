/**
 * @namespace __.SP.workflow
 * @memberof __.SP
 */


__.SP.workflow = {};

__.SP.workflow.loadSPScripts = function( args ) {
	var async = __.Async.promise( args );
	if( SP && SP.WorkManagement ) {
		console.log( 'loaded' );
		async.resolve();
	}
	else {
		console.log( 'load now' );
		var hdTimeout = setTimeout( function() {
			async.reject( "Could not load work management from SharePoint" );
		}, 10000 );
		RegisterSod('SP.WorkManagement.js', '/_layouts/15/SP.WorkManagement.js');
		// NB: need to take out SODing from current JS exectuion thread by 
		// timeout 0, for otherwise loadMultiple doesn't load
		setTimeout( function() {
			SP.SOD.loadMultiple( [ 'sp.js', 'SP.WorkManagement.js' ], function() {
				clearTimeout( hdTimeout );
				async.resolve();
			} )
		}, 0 );
	}
};

/**
 * Fetches all tasks personally assigned to the current user. NOTE: tasks assigned by group assignment will not show up in the list.
 * @memberof __.SP.workflow
 * @method myTasks
 * @async 
 * @instance
 * @example
 * __.SP.workflow.myTasks();
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * oTasks | (Object) | data object holding task split in completed and pending, as well as broken down by task list.
 * </pre>
 */


__.SP.workflow.myTasks = function( args ) {
	var async = __.Async.promise( args );
	async.then( __.SP.workflow, "loadSPScripts" )
	async.then( function( args ) {
		var ctx = __.SP.ctx();
		var ctx = __.SP.ctx();
		var oSession = new SP.WorkManagement.OM.UserOrderedSessionManager( ctx ).createSession();
		var oTaskQuery = new SP.WorkManagement.OM.TaskQuery( ctx );
		var oLocations = new SP.WorkManagement.OM.UserSettingsManager( ctx ).getAllLocations();
		var oMyTasks = oSession.readTasks( oTaskQuery );
		ctx.load( oLocations );
		ctx.load( oMyTasks );
		__.SP.exec( ctx, [ oLocations, oMyTasks ], function() {
			if( oLocations.sError ) {
				async.reject( oSet.sError );
			}
			if( oMyTasks.sError ) {
				async.reject( oSet.sError );
			}
			else {
				var lkvTasks = [];
				var oTasks = {
					 completed : {}
					,  pending : {}
				};
				var taskEnumerator = oMyTasks.getEnumerator();
				var locEnum = oLocations.getEnumerator();
				var mpLocations = {};
				while (locEnum.moveNext()) {
					var loc = locEnum.current;
					mpLocations[ loc.get_id() ] = loc.get_name();
				}
				while (taskEnumerator.moveNext()) {
					var task = taskEnumerator.current;
					var sInfo = mpLocations[ task.get_locationId() ];
					var sSite = "n/a";
					var sTaskList = "n/a";
					if( sInfo ) {
						var lsInfo = sInfo.split( ":" );
						if( lsInfo && lsInfo[ 1 ] ) {
							sSite = lsInfo[ 0 ].trim();
							sTaskList = lsInfo[ 1 ].trim();
						}
					}
					else if( task.get_isPersonal() ) {
						sSite = "MySite";
						sTaskList = "My Personal Tasks";
					}
					var dtDue = task.get_dueDate();
					var nDaysLeft = __.utils.dt.diff( dtDue );
					// check if no due date is set (in which case SP
					// puts year 1901 by default (sic!))
					if( nDaysLeft < -42800 ) {
						nDaysLeft = null;
						dtDue = null;
					}
					var kvAddInfo = null;
					var sAddInfo = task.get_serializedCustomDataForClient();
					if( sAddInfo ) {
						kvAddInfo = sAddInfo.__toJson();
					}
					var sStatus = ( task.get_isCompleted() )
						? "completed"
						: "pending" ;
					var kvTask = {
						  id : task.get_id()
						, sName : task.get_name()
						, customAttributes : task.get_customAttributes()
						, sDescription : task.get_description()
						, dtStart : task.get_startDate()
						, dtDue : dtDue
						, nDaysLeft : nDaysLeft
						, urlEdit : task.get_editUrl()
						, isReadOnly : task.get_isReadOnly()
						, dtModified : task.get_lastModified()
						, idLocation : task.get_locationId()
						, sSite : sSite
						, pinAge : task.get_pinAge()
						, kvAddInfo : kvAddInfo
					};
					if( ! oTasks[ sStatus ][ sTaskList ] ) {
						oTasks[ sStatus ][ sTaskList ] = [];
					}
					oTasks[ sStatus ][ sTaskList ].push( kvTask );
				}
				async.resolve( { oTasks : oTasks } );
			}
		} );
	} );
	async.resolve();
}
