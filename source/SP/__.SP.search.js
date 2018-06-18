/**
 * @namespace __.SP.search
 * @memberof __.SP
 */

__.SP.search = {};

/**
 * Loads external SP scripts to initiate JSOM search API. 
 * It will wait for 10 seconds before it rejects the promise.
 * @memberof __.SP.search
 * @method loadSPScripts
 * @async 
 * @instance
 * @example 
 * __.SP.search.loadSPScripts();
 * @returns {Object} Resolved promise
 */
__.SP.search.loadSPScripts = function( args ) {
	var async = __.Async.promise( args );
	var hdTimeout = setTimeout( function() {
		async.reject( "Could not load search component from SharePoint" );
	}, 10000 );
	SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
		SP.SOD.executeFunc("SP.Search.js", "Microsoft.SharePoint.Client.Search.Query.KeywordQuery", function () {
			clearTimeout( hdTimeout );
			async.resolve();
		} );
	} );
};

/**
 * Searches the index for keywords. Use 
 * @memberof __.SP.search
 * @method keyword
 * @async 
 * @instance
 * @example // searches for all task for current user
 * __.SP.search.keyword( {
 * 	  sQuery : 'ContentTypeId:0x0108* AssignedToOWSUSER:"' + __.SP.user.aInfo.sLogin + '"'
 * 	, lsProps : [ "Title", "AssignedToOWSUSER", "StatusOWSCHCS", "ListId", "Created" ]
 * 	, cb : function( laResult ) { console.log( laResult ); }
 * } );
 * __.SP.workflow.myTasks();
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sQuery keyword query
 * @param {Array} args.lsProps Additional properties to be included in the search result
 * @param {Function} [args.cb] optional callback function receiving the result.
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * oTasks | (Object) | data object holding search results
 * </pre>
 */


__.SP.search.keyword = function( args ) {
	var async = __.Async.promise( args );
	var sQuery = args.sQuery;
	if( ! sQuery ) {
		async.reject( "A query string is required for the search" );
		return;
	}
	var lsProps = args.lsProps || null;
	async.then( __.SP.search, "loadSPScripts", "Load search API scripts" )
	async.then( function( args ) {
		var ctx =  new SP.ClientContext();
		var oQuery = new Microsoft.SharePoint.Client.Search.Query.KeywordQuery( ctx );
		if( lsProps ) {
			var oProps = oQuery.get_selectProperties();
			lsProps.forEach( function( sProp ) {
				oProps.add( sProp );
			} );
		}
		oQuery.set_queryText( sQuery );
		var oExecutor = new Microsoft.SharePoint.Client.Search.Query.SearchExecutor( ctx );
		var oResults = oExecutor.executeQuery( oQuery );
		ctx.executeQueryAsync(
			function () {
				if( 	oResults &&
					oResults.m_value &&
					oResults.m_value.ResultTables && 
					oResults.m_value.ResultTables[ 0 ] &&
					oResults.m_value.ResultTables[ 0 ].ResultRows ) {
					async.resolve( { loResults : oResults.m_value.ResultTables[ 0 ].ResultRows } );
				}
				else {
					async.reject( "Could not perform a search" );
				}
			}
		);
	}, "Execute search" );
	async.resolve();
}
