__.SP.caml = {};
__.SP.caml.analyzeUrl = function() {
	var url = unescape( unescape( ( self.location.href ) ) );
	var sQuery;
	if( /ServerFilter=/.test( url ) ) {
		sQuery = "?" + url.split( "ServerFilter=" )[ 1 ];
		sQuery = sQuery.replace( /-/g, "&" );
	}
	else if( /FilterField1/.test( url ) ) {
		sQuery = url;
	}
	else {
		return null;
	}
	var oParams = __.url.oParams( sQuery );
	var oFields = {};
	for( var kParam in oParams ) {
		var ls = kParam.match( /FilterField(.*)$/ );
		if( ls ) {
			var k = oParams[ kParam ];
			var ix = ls[ 1 ];
			var v =  oParams[ "FilterValue" + ix ]
			oFields[ k ] = {
				v : v, sType: "Text"
			};
			if( oParams[ "FilterLookupId" + ix ] ) {
				oFields[ k ].sType = "Lookup";
				oFields[ k ].v = v.split( "," );
			}
			else if( ! isNaN( v ) ) {
				v = Number( v );
				if( v == 1 || v == 0 ) {
					oFields[ k ].v = v;
					oFields[ k ].sType = "Boolean";
				}
			}
		}
	};
	return oFields;
}
/* expected format: 
 * {
 *   Country : { sType : "Lookup", v: [ [2, 6] ] } // 2dim array for ORing multiple. NB: inner array holds term id plus children
 * , Published : { sType : "Boolean", v: 1 }
 * , FrontOffice : { sType : "Text", v: "OSG" }
 * }
 */
__.SP.caml.createFields = function( loFields ) {
	var lxml = [];
	loFields.forEach( function( aField ) {
		var sField = aField.sName;
		switch( aField.sType ) {
			case "ListOfIDs" :
				var xml = "<In>";
				xml += '<FieldRef Name="'+ sField + '" />';
				xml += "<Values>";
				aField.v.forEach( function( n ) {
					xml += '<Value Type="Number">' + n + '</Value>';
				} );
				xml += "</Values>";
				xml += "</In>";
				console.log( xml );
			break;
			case "taxonomy" :
				var xml = "";
				var lxmlIn = [];
				aField.v.forEach( function( laTaxFields ) {
					var xmlIn = "<In>";
					xmlIn += '<FieldRef LookupId="True" Name="'+ sField + '" />';
					xmlIn += "<Values>";
					laTaxFields.forEach( function( aTaxField ) {
						var id = aTaxField.id;
						var sName = escape( aTaxField.sName );
						// in case we have an ID == -1 this means the term had not yet been
						// assigned to any item however we need to put an ID (that won't return
						// results) for otherwise it'll impose no restrictions.
						var sTermNotAssignedYet = ( id == -1 )
							? ' sTermNotAssignedYet="' + sName + '"' : '';
						xmlIn += '<Value ' + sTermNotAssignedYet + ' Type="Integer">' + id + '</Value>';
					} );
					xmlIn += "</Values>";
					xmlIn += "</In>";
					lxmlIn.push( xmlIn );
				} );
				xml += __.SP.caml.wrap( lxmlIn, "Or" );
			break;
			case "boolean" :
				var xml = "<Eq>";
				xml += '<FieldRef Name="' + sField + '" />';
				xml += '<Value Type="Integer">' + aField.v + '</Value>';
				xml += "</Eq>";
			break;
			case "text" :
			case "choice" :
				var xml = "<" + aField.sOperator + ">";
				xml += '<FieldRef Name="' + sField + '" />';
				xml += '<Value Type="Text">' + aField.v + '</Value>';
				xml += "</" + aField.sOperator + ">";
			break;
			case "lookup" :
				var xml = "<" + aField.sOperator + ">";
				xml += '<FieldRef Name="' + sField + '" />';
				xml += '<Value Type="Lookup">' + aField.v + '</Value>';
				xml += "</" + aField.sOperator + ">";
			break;
			// REF: date, people missing
		}
		lxml.push( xml );
	} );
	return lxml;
};
__.SP.caml.wrap = function( lxml, sOpr ) {
	var nl = "\n";
	var sOpr = sOpr || "And";
	var wrap = function( sContent ) {
		return "<" + sOpr + ">" + nl + sContent + "</" + sOpr + ">" + nl;
	}
	var xml = "";
	// safety clause for while
	var x = 100;
	if( lxml.length == 1 ) {
		xml = lxml[ 0 ];
	}
	else if( lxml.length > 1 ) {
		xml += lxml.pop() + nl;
		xml += lxml.pop() + nl;
		xml = wrap( xml );
		while( lxml.length && (--x>0) ) {
			if( lxml.length > 0 ) {
				xml = wrap( lxml.pop() + nl + xml );
			}
		}
	}
	return xml;

};
__.SP.caml.whereClause = function( lxml ) {
	return '<Where>' + this.wrap( lxml, "And" ) + '</Where>';
}
__.SP.caml.convertFromUrl = function() {
	var oFields = __.SP.caml.analyzeUrl();
	if( oFields ) {
		var lxml = __.SP.caml.createFields( oFields );
		var sWhere = __.SP.caml.whereClause( lxml );
		var sSort = '<OrderBy><FieldRef Name="Title" /><FieldRef Name="FirstName" /></OrderBy>';
		return sSort + sWhere;
	}
	return null;
}
