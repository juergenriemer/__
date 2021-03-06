__.Async.fnerr = function( oError ) {
	top.__.SP.Error.show( oError );
};

top.__.SP.Error = __.Class.extend( {
	  dnWindow : null
	, oError : {}
	, createErrorData : function( args ) {
		var sError = "An incident happened";
		var sDescription = "";
		if( args.sdftError ) {
			sError = args.sdftError + "\r\n";
			if( args.sError ) {
				sDescription = args.sError;
			}
		}
		else if( args.sError ) {
			sError = args.sError;
			sDescription = "";
		}
		else if( typeof args == "string" ) {
			sError = args;
			sDescription = "";
		}
		// generate error code
		var sApplication = "SP";
		if( args.id ) {
			var lscurApplication = args.id.match( /^O\$C3\.(.*?)\./ );
			if( lscurApplication && lscurApplication[ 1 ] ) {
				sApplication = lscurApplication[ 1 ].toUpperCase();
			}
		}
		var idError = sApplication.toLowerCase() + "_" + Math.floor( (1 + Math.random() ) * 0x10000 ).toString( 16 );
		// check if we got an external error code passed
		// in wich case we take that one and remove it from error message
		var rxidError = new RegExp( /\[CODE\|(.*?)\]/ );
		var lsErrorId = sError.match( rxidError );
		if( lsErrorId && lsErrorId[ 1 ] ) {
			// get (external) error id
			idError = lsErrorId[ 1 ];
			// and remove from error string
			sError = sError.replace( rxidError, "" ).trim();
		}
		var now = new Date();
		var dt = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
		__.SP.user.current();
		var sUser = ( top.__.SP.user.aInfo && top.__.SP.user.aInfo.sLogin )
			? top.__.SP.user.aInfo.sLogin : "";
		this.oError = {
			  sTitle : args.sTitle || "System Message"
			, sError : sError
			, sDescription : sDescription
			, sUser : sUser
			, dt : dt
			, idError : idError
			, sApplication : sApplication
			, sInfo : args.sInfo || null
			, sStack : args.sStack || null
			, sLevel : args.sLevel || "ERROR"
			, sSite : _spPageContextInfo.siteServerRelativeUrl
			, url : self.location.href
		};
	}
	, logError : function() {
		var sException = this.oError.__toString();
		if( ! sException ) {
			sException = "[fallback]" + this.oError.sError + this.oError.sStack + this.oError.url;
		}
		var oPayload = {
			  level : this.oError.sLevel
			, message : "[" + this.oError.idError + "][" + this.oError.sApplication + "] " + this.oError.sError
			, exception : sException
		}
		top.__.SP.webservice.call( {
			  sService : "midtier"
			, sEndpoint : "Log4NetExternal"
			, oPayload : oPayload
			, bIgnoreFailure : true
		} );
	}
	, init : function( args ) { 
		var oError = args.oError || null;
		var kvOpts = args.kvOpts || null;
		// the error below is triggered by SharePoint in case an internal Ajax request is cancelled,
		// e.g. by navigating away from a page before a result was delivered. We can savely ignore.
		if( oError && oError.sError && /The status code of response is '0'./.test( oError.sError ) ) {
			console.warn( "ajax navigation abort hickup" );
			return;
		}
		var bShowToUser = ( kvOpts && kvOpts.bHideError ) ? false : true;
		var bLogError = ( kvOpts && kvOpts.bPreventLogging ) ? false : true;
		console.warn( "-------------ERROR-------------" );
		console.warn( "show to user: " + bShowToUser );
		console.warn( "log error: " + bLogError );
		console.warn( oError );
		console.warn( "-------------ERROR-------------" );
		this.createErrorData( oError );
		// default behaviour is to log the error and show the message to the user
		if( bShowToUser ) {
			this.showToUser();
		}
		if( bLogError ) {
			this.logError();
		}
	}
	, hMessage : function() {
		var hTemplate = " \
			<div class='osce-error'> \
				<p> \
					An unexpected error has occurred. The details have been logged. \
				</p> \
				<p> \
					Please close this dialog and try to repeat the operation. If the error continues, \
					contact IT Service Desk and include the details below in your report. \
				</p> \
				<div class='line'>&nbsp;</div> \
				<table class='osce-error'> \
					<tr> \
						<td class='title'>Timestamp (UTC):</td> \
						<td>{{dt}}</td> \
					</tr> \
					<tr> \
						<td class='title'>Username:</td> \
						<td>{{sUser}}</td> \
					</tr> \
					<tr> \
						<td class='title'>Error ID:</td> \
						<td>{{idError}}</td> \
					</tr> \
					<tr> \
						<td class='title'>Error message(s):</td> \
						<td class='message'> \
						<textarea disabled>{{sError}}{{sDescription}}</textarea> \
						</td> \
					</tr> \
				</table> \
			</div> \
		";
		try {
			return Mustache.to_html( hTemplate, this.oError );
		}
		catch( e ) {
			console.warn( "mustach error", e );
			return null;
		}
	}
	, showToUser : function() { 
		var that = this;
		var hMessage = this.hMessage( this.oError );
		if( hMessage ) {
			var oApp = null;
			var bShowReportErrorButton = false;
			var sApp = "";
			if( O$C3 && O$C3[ this.oError.sApplication ] ) {
				bShowReportErrorButton = O$C3[ this.oError.sApplication ].bShowReportErrorButton;
				sApp = "[" + O$C3[ this.oError.sApplication ].sApp + "] ";
			}
			var oModalConfig = {
				  sTitle : that.oError.sTitle
				, hContent : hMessage
				, sOk : null
				, fnClose : function() {
					that.dnWindow.close();
					//that.closeAll();
				}
				, fnact : function() {
					var sBody = "Dear Service Desk,\r\n\r\n";
					if( sApp ) {
						sBody += "The application " + sApp + "showed ";
					}
					else {
						sBody += "An application showed ";
					}
					sBody += "the following error message:\r\n";
					sBody += "(" + that.oError.idError + ") " + that.oError.sError + "\r\n";
					sBody += " The error happend at this URL:\r\n";
					sBody += that.oError.url + "\r\n\r\n\r\n";
					sBody += "\tBest regards,";
					var url = "mailto:ICTServicedesk@osce.org";
					var url = "mailto:jriemer@osce.org";
					url += "?subject=" + sApp + that.oError.sError;
					url += "&body=" + encodeURIComponent( sBody );
					window.location.href = url;
					that.dnWindow.close();
				}
			};
			if( O$C3 && O$C3[ this.oError.sApplication ] ) {
				if( O$C3[ this.oError.sApplication ].bShowReportErrorButton ) {
					oModalConfig.sOk = "Report";
				}
			}
			this.dnWindow = top.__.SP.modal.open( oModalConfig );
		}
	}
} );

top.__.SP.Error.show = function( oError, kvOpts ) {
	return __.Class.instantiate(
		top.__.SP.Error, {
			  oError : oError
			, kvOpts : kvOpts
		}
	);
};
