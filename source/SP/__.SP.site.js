/**
 * @namespace __.SP.site
 * @memberof __.SP
 */

__.SP.site = {};

/**
 * Get all groups from a site
 * @memberof __.SP.site
 * @method groups
 * @async 
 * @instance
 * @example
 * __.SP.site.groups( {
 * 	  sSite : "https://dev-sharepoint.osce.org/sites/pas"
 * 	, cb : function( a ) { console.log( a ) }
 * } )
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sSite url of the site
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * laLists | (Object) | list of group data objects 
 * </pre>
 */
__.SP.ctx = function( args ) {
		return ( args && args.sSite )
			? new SP.ClientContext( args.sSite )
			: new SP.ClientContext.get_current();
	}
__.SP.site.groups = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oGroups = ctx.get_web().get_siteGroups();
	ctx.load( oGroups );
	__.SP.exec( ctx, oGroups, function( oGroups ) {
		if( oGroups.sError ) {
			async.reject( oGroups.sError );
		}
		else {
			var laGroups = [];
			var loGroups = oGroups.getEnumerator();
			while( loGroups.moveNext() ) {
				var oGroup = loGroups.get_current();
				var aGroup = {
					  id : oGroup.get_id()
					, sName : oGroup.get_title()
					, sType : oGroup.get_principalType()
					, sDescription : oGroup.get_description()
				};
				laGroups.push( aGroup );
			}
			async.resolve( { laGroups : laGroups } );
		}
	} );
}


/**
 * Get all lists from a site
 * @memberof __.SP.site
 * @method lists
 * @async 
 * @instance
 * @example
 * __.SP.site.lists( {
 * 	  sSite : "https://dev-sharepoint.osce.org/sites/pas"
 * 	, cb : function( a ) { console.log( a ) }
 * } )
 * @param {Object} args a parameter object holding the following values
 * @param {String} args.sSite url of the site
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * laLists | (Object) | list of list data objects 
 * </pre>
 */
__.SP.site.lists = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oLists = ctx.get_web().get_lists();
	ctx.load( oLists, 'Include( Title,EntityTypeName,Hidden,BaseType,Description,BaseTemplate,ContentTypesEnabled,ContentTypes,Id )' );
	__.SP.exec( ctx, oLists, function( oLists ) {
		if( oLists.sError ) {
			async.reject( oLists.sError );
		}
		else {
			var laLists = [];
			var loLists = oLists.getEnumerator();
			while( loLists.moveNext() ) {
				var oList = loLists.get_current();
				// lookup content types
				var loCTs = oList.get_contentTypes().getEnumerator();
				var lsContentTypes = [];
				while( loCTs.moveNext() ) {
					var oCT = loCTs.get_current();
					lsContentTypes.push( oCT.get_name() );
				}
				var aList = {
					  sTitle : oList.get_entityTypeName()
					, sDisplayName : oList.get_title()
					, sDescription : oList.get_description()
					, guid : oList.get_id().toString()
					, nBaseTemplate : oList.get_baseTemplate()
					, bLibrary : oList.get_baseType()
					, bList : ( ! oList.get_baseType() )
					, bHidden : oList.get_hidden()
					, lsContentTypes : lsContentTypes
				}
				laLists.push( aList );
			}
			async.resolve( { laLists : laLists } );
		}
	} );
}

// var xml = '<Field Type="Choice" Name="FrontOffice" DisplayName="Front Office" ';
//	xml += ' Format="Dropdown" Group="Custom Columns">';
//	xml += '<CHOICES><CHOICE>OSG</CHOICE><CHOICE>OCEEA</CHOICE></CHOICES></Field>';
// __.SP.site.addColumn( { xml : xml );

__.SP.site.addColumn = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oFields = ctx.get_web().get_fields();
	oFields.addFieldAsXml( args.xml );
	ctx.load( oFields );
	__.SP.exec( ctx, oFields, function( oFields ) {
		if( oFields.sError ) {
			async.reject( oFields );
		}
		else {
			async.resolve();
		}
	} );
};
// __.SP.site.readColumn({sColumn:"FrontOffice"})
__.SP.site.readColumn = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var oFields = ctx.get_web().get_fields();
	var oWeb = ctx.get_site().get_rootWeb();
	var oColumn = oWeb.get_availableFields().getByInternalNameOrTitle( args.sColumn );
	ctx.load( oColumn );
	__.SP.exec( ctx, oColumn, function( oColumn ) {
		if( oColumn.sError ) {
			async.reject( oColumn );
		}
		else {
			var ls = [];
			var xml = oColumn.get_schemaXml();
			xml.match( /<CHOICE>(.*?)<\/CHOICE>/g ).forEach( function( s ) {
				ls.push( s.match( /<CHOICE>(.*?)<\/CHOICE>/ )[ 1 ] ) ;
			} );
			async.resolve( {
				lsValues : ls
			} );
		}
	} );
};

__.SP.site.addCSS = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx( args );
	var ctx = SP.ClientContext.get_current()
	var oWeb = ctx.get_web();
	oWeb.set_alternateCssUrl( args.url );
	oWeb.update();
	__.SP.exec( ctx, oWeb, function( oWeb ) {
		if( oWeb.sError ) {
			async.reject( oWeb.sError );
		}
		else {
			async.resolve();
		}
	} );
};

