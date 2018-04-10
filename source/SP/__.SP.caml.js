/* tyepf def of caml field, expected format: 
 * {
 *   Country : { sType : "Lookup", v: [ [2, 6] ] } // 2dim array for ORing multiple. NB: inner array holds term id plus children
 * , Published : { sType : "Boolean", v: 1 }
 * , FrontOffice : { sType : "Text", v: "OSG" }
 * }
 */
/**
 * @namespace __.SP.caml
 * @memberof __.SP
 */
__.SP.caml = {};

/**
 * <pre>
 * Analyzes the URL and extracts the current query applied to a list.
 * </pre>
 * @memberof __.SP.caml
 * @method analyzeUrl
 * @todo typedef caml object
 * @example
 * __.SP.caml.analyzeUrl();
 * @returns {Object} aCAMLFields JSON describing the current query
 */
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
	var aCAMLFields = {};
	for( var kParam in oParams ) {
		var ls = kParam.match( /FilterField(.*)$/ );
		if( ls ) {
			var k = oParams[ kParam ];
			var ix = ls[ 1 ];
			var v =  oParams[ "FilterValue" + ix ]
			aCAMLFields[ k ] = {
				v : v, sType: "Text"
			};
			if( oParams[ "FilterLookupId" + ix ] ) {
				aCAMLFields[ k ].sType = "Lookup";
				aCAMLFields[ k ].v = v.split( "," );
			}
			else if( ! isNaN( v ) ) {
				v = Number( v );
				if( v == 1 || v == 0 ) {
					aCAMLFields[ k ].v = v;
					aCAMLFields[ k ].sType = "Boolean";
				}
			}
		}
	};
	return aCAMLFields;
}

/**
 * <pre>
 * Creates fields of a CAML query reading from an array of {oField} objects
 * </pre>
 * @memberof __.SP.caml
 * @method createFields
 * @todo typedef caml object
 * @example
 * __.SP.caml.createFields( { loFields : loFields } );
 * @param {oField} loFields an array of list field objects "oField"
 * @returns {String} lxml array of xml string representing CAML query fields
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

/**
 * <pre>
 * Reads array of xml string representing CAML query fields and wraps them in 
 * logical operator tags nesting them properly.
 * </pre>
 * @memberof __.SP.caml
 * @method wrap 
 * @example
 * __.SP.caml.wrap( {
 *       lxml : [
 *          "<Eq><FieldRef Name='ID' /><Value Type='Integer'>1</Value></Eq>" 
 *        , "<Eq><FieldRef Name='ID' /><Value Type='Integer'>9</Value></Eq>"
 *     , sOpr : "And"
 * } );
 * @param {Array} lxml array of xml string representing CAML query fields
 * @param {String} sOpr logical operator
 * @returns {String} xml xml string representing CAML fields queries wrapped in logical operators
 */
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

/**
 * <pre>
 * Takes string representing CAML fields queries and a logical operators
 * and wraps it in <where> clause returning it as CAML query
 * </pre>
 * @memberof __.SP.caml
 * @method whereClause
 * @example
 * __.SP.caml.whereClaue( {
 *       lxml : [
 *          "<Eq><FieldRef Name='ID' /><Value Type='Integer'>1</Value></Eq>" 
 *        , "<Eq><FieldRef Name='ID' /><Value Type='Integer'>9</Value></Eq>"
 *     , sOpr : "And"
 * } );
 * @param {Array} lxml array of xml string representing CAML query fields
 * @param {String} [sOpr] logical operator defaults to "And"
 * @returns {String} xml xml string representing a CAML query
 */
__.SP.caml.whereClause = function( lxml, sOpr ) {
	var sOpr = sOpr || "And";
	return '<Where>' + this.wrap( lxml, sOpr ) + '</Where>';
}

/**
 * <pre>
 * Analyzes the URL and extracts the current query applied to a list and returns
 * it as xml string representing a CAML query.
 * </pre>
 * @memberof __.SP.caml
 * @method convertFromUrl
 * @example __.SP.caml.convertFromUrl();
 * @returns {String} xml xml string representing a CAML query
 */
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
