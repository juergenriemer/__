__.SP.form = {
	getField : function( x ) { // x: either internal name or DOM node inside field row
		var dnForm = __.dn_( "#WebPartWPQ2" );
		var url = self.location.href;
		if( /DispForm\.aspx/.test( url ) ) {
			if( typeof x == "string" ) {
				var dnTitle = __.dn_( 'a[name="SPBookmark_' + x + '"]', dnForm );
				var dnRow = __._dn( "tr", dnTitle );
				var dnValue = __.dn_( "td.ms-formbody", dnRow );
				var v = ( dnValue.textContent )
					? __.s.tokenize( dnValue.textContent )
					: null;
				return {
					  dnTitle : dnTitle
					, dnRow : dnRow
					, dnValue : dnValue
					, v : v
				}
			}
		}
		else if( /NewForm\.aspx|EditForm\.aspx/.test( url ) ) {
			if( x instanceof Element ) {
				var dnRow = __._dn( "tr", x );
				var sField = __.dn_( "h3", dnRow ).id;
				var dnValue = ( x.value ) ? x : __.dn_( "input,textarea", dnRow );
				var v = dnValue.value;
				return {
					  sField : sField
					, dnRow : dnRow
					, dnValue : dnValue
					, v : v
				}
			}
		}
	}
};
