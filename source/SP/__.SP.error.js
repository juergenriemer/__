__.Async.fnerr = function( oError ) {
	__.SP.Error.show( oError );
};

__.SP.Error = __.Class.extend( {
	  dnWindow : null
	, oError : {}
	, createErrorData : function( args ) {
		var sError = "An incident happened";
		var sDescription = "";
		if( args.sLabel ) {
			sError = "Could not " + args.sLabel + ".\r\n";
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
		var now = new Date();
		var dt = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
		this.oError = {
			  sTitle : args.sTitle || "System Message"
			, sError : sError
			, sDescription : sDescription
			, sUser : __.SP.user.aInfo.sLogin
			, dt : dt
			, sInfo : args.sInfo || null
			, sStack : args.sStack || null
			, sLevel : args.sLevel || "ERROR"
			, idError : "sp" + Math.floor( (1 + Math.random() ) * 0x10000 ).toString( 16 )
			, sSite : _spPageContextInfo.siteServerRelativeUrl
			, url : self.location.href
		};
	}
	, log : function() {
		var sException = __.o.s( this.oError );
		if( ! sException ) {
			sException = "[fallback]" + this.oError.sError + this.oError.sStack + this.oError.url;
		}
		var oPayload = {
			  level : this.oError.sLevel
			, message : "[" + this.oError.idError + "][" + O$C3.sApp + "] " + this.oError.sError
			, exception : escape( sException )
		}
		console.warn( ">>>>>>ACTIVATE LOG>>>>>>>" );
		console.warn( oPayload );
		console.warn( "<<<<<<ACTIVATE LOG<<<<<<<" );
		return;
		__.SP.webservice.call( {
			  sService : "midtier"
			, sEndpoint : "Log4NetExternal"
			, oPayload : oPayload
			, bIgnoreFailure : true
		} );
	
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
						<span class='osce-erno hide'><br>[multiple errors occurred: <span>1</span>]</span> \
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
	, init : function( args ) { 
		console.warn( "-------------ERROR-------------" );
		console.warn( args );
		console.warn( "-------------ERROR-------------" );
		var that = this;
		this.createErrorData( args );
		var hMessage = this.hMessage( this.oError );
		if( hMessage ) {
			this.dnWindow = __.SP.modal.open( {
				  sTitle : that.oError.sTitle
				, hContent : hMessage
				, sOk : "Report"
				, fnClose : function() {
					that.dnWindow.close();
					//that.closeAll();
				}
				, fnact : function() {
					var sBody = "Dear Service Desk,\r\n\r\n";
					sBody += "The application \"" + O$C3.sApp + "\" showed ";
					sBody += "the following error message:\r\n\r\n";
					sBody += "\t(" + that.oError.idError + ") " + that.oError.sError + "\r\n\r\n";
					sBody += " Best regards,";
					var url = "mailto:ICTServicedesk@osce.org";
					var url = "mailto:jriemer@osce.org";
					url += "?subject=" + O$C3.sApp + ": " + that.oError.sError;
					url += "&body=" + encodeURIComponent( sBody );
					window.location.href = url;
					that.dnWindow.close();
				}
			} );
		}
		this.log();
	}
} );

__.SP.Error.show = function( args ) {
	return __.Class.instantiate( __.SP.Error, args );
};
