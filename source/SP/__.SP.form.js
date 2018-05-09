// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.form;
// ==/ClosureCompiler==


/**
 * Methods that deal with item add and edit forms
 * @namespace __.SP.form
 * @memberof __.SP
 */

__.SP.form = {};

/**
 * Gets information of a form field by either internal name or any DOM node inside (e.g. to be used in onfocus, onclick events).
 * @memberof __.SP.form
 * @method getField
 * @instance
 * @example
 * __.SP.form.getField( "Title" );
 * @param {String|Node} either internal name or any DOM node inside field row
 * @returns {Object} Resolved promise holding the following values 
 * <pre class='return-object'>
 * sField | (String) | internal name of the field
 * dnRow | (Node) | DOM node of containing table row (TR)
 * dnValue | (Node) | DOM node of the form element holding user input
 * v | (String) | current value of element holding user input
 * </pre>
 */

__.SP.form.getField = function( s_or_dn ) {
	var dnForm = __find( "#WebPartWPQ2" );
	var url = self.location.href;
	if( /DispForm\.aspx/.test( url ) ) {
		if( typeof s_or_dn == "string" ) {
			var dnTitle = dnForm.__find( 'a[name="SPBookmark_' + s_or_dn + '"]' );
			if( dnTitle ) {
				var dnRow = dnTitle.__closest( "tr" );
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
			return null;
		}
	}
	else if( /NewForm\.aspx|EditForm\.aspx/.test( url ) ) {
		var dnItem = ( s_or_dn instanceof Element )
			? s_or_dn
			: __find( "#" + s_or_dn );
		if( dnItem ) {
			var dnRow = dnItem.__closest( "tr" );
			var sField = dnRow.__find( "h3" ).id;
			var dnValue = ( dnItem.value ) ? dnItem : dnRow.__find( "input,textarea,select" );
			var v = dnValue.value;
			return {
				  sField : sField
				, dnRow : dnRow
				, dnValue : dnValue
				, v : v
			}
		}
		return null;
	}
};


