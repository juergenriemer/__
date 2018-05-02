__.SP.form = {
	getField : function( x ) { // x: either internal name or DOM node inside field row
		var dnForm = document.body.__find( "#WebPartWPQ2" );
		var url = self.location.href;
		if( /DispForm\.aspx/.test( url ) ) {
			if( typeof x == "string" ) {
				var dnTitle = dnForm.__find( 'a[name="SPBookmark_' + x + '"]' );
				var dnRow = dnTitle.__find( "tr", dnTitle );
				var dnValue = dnRow.__find( "td.ms-formbody" );
				var v = ( dnValue.textContent )
					? dnValue.textContent.__tokenize()
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
				var dnRow = x.__find( "tr" );
				var sField = dnRow.__find( "h3" ).id;
				var dnValue = ( x.value ) ? x : dnRow.__find( "input,textarea" );
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
