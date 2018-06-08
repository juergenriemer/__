/**
 * @xnamespace __.SP.site
 * @xmemberof __.SP
 */

__.SP.site = {};

__.SP.site.lists = function( args ) {
	var async = __.Async.promise( args );
	var ctx = __.SP.ctx();
	var oLists = ctx.get_web().get_lists();
	ctx.load( oLists, 'Include( Title,EntityTypeName,Description,BaseTemplate,ContentTypesEnabled,ContentTypes,Id )' );
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
	var ctx = __.SP.ctx();
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
	var ctx = __.SP.ctx();
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
	var ctx = __.SP.ctx();
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

