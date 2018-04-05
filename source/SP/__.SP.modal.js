__.SP.modal = {
	  dn : null
	, load : function( args ) { // sTitle, url, fnLoad, fnClose, fnact
		args.bClose = ( typeof args.bClose != "undefined" ) ? args.bClose : true;
		var kv = {
			  title : args.sTitle
			, showClose : args.bClose
			, autoSize : true
			, url : args.url
			, dialogReturnValueCallback : function( b ) {
				if( args.fnClose ) {
					args.fnClose( b );
				}
			}
		};
		var dnModal = SP.UI.ModalDialog.showModalDialog( kv );
		( new __.Async() )
		.wait( 50, function() {
			if( dnModal && dnModal.$e_0 ) {
				if( args.fnLoad ) {
					args.fnLoad( dnModal.$e_0 );
				}
				return true;
			}
			return false;
		} )
		.start();
		return this;
	}
	, open : function( args ) { // sTitle, hContent, fnok, fnx, fnerr
		args.sLoading = args.sLoading || "Processing your request.";
		args.sOk = ( args.hasOwnProperty( "sOk" ) ) ? args.sOk : "Save";
		args.sCancel = ( args.hasOwnProperty( "sCancel" ) ) ? args.sCancel : "Cancel";
		args.bClose = ( typeof args.bClose != "undefined" ) ? args.bClose : true;
		var h = "<div id='osce-modal'>";
		h += args.hContent;
		h += "<p class='separator'></p>";
		h += this.buttons( args );
		h += "</div>";
		this.dn = __.dn.add( h );
		this.behaviour( this.dn, args );
		var kv = {
			  title : args.sTitle
			, showClose : args.bClose
			, autoSize : true
			, html : this.dn
			, dialogReturnValueCallback : function( b ) {
				if( args.fnClose ) {
					args.fnClose( b );
				}
			}
		};
		if( args.bShowProcessing ) {
			this.processing();
		}
		if( args.bNoButtons ) {
			__.dn_( ".osce-buttons", this.dn ).style.display = "none";
		}
		SP.UI.ModalDialog.showModalDialog( kv );
		return this;
	}
	, behaviour : function( dn, args ) {
		var that = this;
		var dnOk = __.dn_( "input[value='" + args.sOk + "']", this.dn );
		if( dnOk && args.fnact ) {
			dnOk.addEventListener( "click", function() {
				that.processing();
				args.fnact( that );
			} );
		}
		var dnCancel = __.dn_( "input[value='" + args.sCancel + "']", this.dn );
		if( dnCancel ) {
			dnCancel.addEventListener( "click", function() {
				__.SP.modal.cancel();
			} );
		}
		// set focus on first input field
		setTimeout( function() {
			var dnInput = __.dn_( "input", that.dn );
			if( dnInput && dnInput[ 0 ] && dnInput[ 0 ].focus ) {
				dnInput[ 0 ].focus();
			}
		}, 1500 );
	}
	, message : function( s ) {
		var dnMessage = __.dn_( ".osce-message", this.dn );
		var dnLoading = __.dn_( ".osce-loading", this.dn );
		if( s ) {
			dnMessage.textContent = s;
			dnMessage.style.display = "block";
			dnLoading.style.display = "none";
		}
		else {
			dnMessage.textContent = "";
			dnMessage.style.display = "none";
		}
	}
	, buttons : function( args ) {
		var h = "<div class='osce-action-panel'>";
		h += "  <div class='osce-message'></div>";
		h += "  <div class='osce-loading'>";
		h += "   <img src='" + __.SP.icon.mp.loading + "' />";
		h += "   <span>" + args.sLoading + "</span></div>";
		h += "  <div class='osce-buttons'>";
		if( args.sOk ) {
		h += "  <input type='button' value='" + args.sOk + "'";
		h += "   accesskey='O' class='ms-ButtonHeightWidth'>";
		}
		if( args.sCancel ) {
		h += "  <input type='button' value='" + args.sCancel+ "'";
		h += "   accesskey='1' class='ms-ButtonHeightWidth'>";
		}
		h += "  </div>";
		h += "</div>";
		return h;
	}
	, stopProcessing : function() {
		var dnLoading = __.dn_( ".osce-loading", this.dn );
		dnLoading.style.display = "none";
		//__.dn._fade( dnLoading );
	}
	, processing : function() {
		var dnLoading = __.dn_( ".osce-loading", this.dn );
		dnLoading.style.display = "block";
		//__.dn._fade( dnLoading );
	}
	, progress : function( s ) {
		var dnMessage = __.dn_( ".osce-loading > span", this.dn );
		dnMessage.textContent = s;
	}
	, close : function() {
		SP.UI.ModalDialog.commonModalDialogClose( 1 );
	}
	, cancel : function() {
		var dnClose = __.dn_( ".ms-dlgCloseBtn" );
		if( dnClose && dnClose.click ) {
			dnClose.click();
		}
		else {
			this.closeAll();
		}
	}
	// __.SP.modal.confirm( {
	//	  sTitle : "Confirm this action"
	//	, sQuestion : "Do you want to remove the contact from your list?"
	//	, fnAnswer : function( a ) {
	//		console.log( a );
	//	}
	// } );
	, confirm : function( args ) {
		var s = ( args.sError ) ? args.sError : args;
		var hQuestion = ( args.sQuestion )
			? "<p>" + args.sQuestion + "</p>"
			: "<p>Do you want to proceed?</p>";
		return __.SP.modal.open( {
			  sTitle : args.sTitle || "Confirm this action..."
			, hContent : hQuestion
			, sOk : "Yes"
			, sCancel : "No"
			, fnact : function() {
				__.SP.modal.close();
			}
			, fnClose : args.fnAnswer || null
		} );
	}
	, alert : function( args ) { // sTitle, sMessage
		var sMessage = ( args.sMessage ) ? args.sMessage : "";
		var h = "<p>" + sMessage + "</p>";
		return __.SP.modal.open( {
			  sTitle : args.sTitle || "System Message"
			, hContent : h
			, sOk : null
			, sCancel : "Close"
		} );
	}
	, convert : function( us ) {
		var mpTokens = {
			  "%20" : " "
			, "%21" : "!"
			, "%22" : "\""
			, "%23" : "#"
			, "%24" : "$"
			, "%25" : "%"
			, "%26" : "&"
			, "%27" : "'"
			, "%28" : "("
			, "%29" : ")"
			, "%2A" : "*"
			, "%2B" : "+"
			, "%2C" : ","
			, "%2D" : "-"
			, "%2E" : "."
			, "%2F" : "/"
			, "%3A" : ":"
			, "%3B" : ";"
			, "%3F" : "?"
		};
		var s = escape( us );
		for( var sToken in mpTokens ) {
			var rx = new RegExp( sToken, "g" );
			s = s.replace( rx, mpTokens[ sToken ] );
		}
		return s;
	}
	, error : function( args ) { // sTitle, sMessage, sStack
		var that = this;
		var sError = ( args.sError ) ? args.sError : "An error happened";
		var sStack = ( args.sStack ) ? args.sStack : null;
		var h = "<p>" + this.convert( sError ) + "</p>";
		if( sStack ) {
			h += "<p>Additional information on this incident:<br>"
			h += "<textarea style='resize:none;width:100%;height:50px;background:white;border:0' disabled='disabled'>";
			h += sStack;
			h += "</textarea></p>";
		}
		var sLevel = "ERROR";
		var idError = "sp" + Math.floor( (1 + Math.random() ) * 0x10000 ).toString( 16 );
		// aError.sSite = O$C3.Utils.Paths.cursiteRelative();
		// aError.url = self.location.href;
		var oPayload = {
			  level: sLevel
			, message: "[" + idError + "][" + O$C3.sApp + "] " + sError
			, exception: escape( args.sStack + "[addInfo:" + args.xInfo + "]" )
		}
		console.warn( ">>>>>>LOG>>>>>>>" );
		console.warn( oPayload );
		console.warn( "<<<<<<LOG<<<<<<<" );
		/*
		setTimeout( function() {
		__.SP.webservice.call( {
			  sService : "midtier"
			, sEndpoint : "Log4NetExternal"
			, oPayload : oPayload
			, bIgnoreFailure : true
		} );
		}, 500 );
		*/
		return __.SP.modal.open( {
			  sTitle : args.sTitle || "System Message"
			, hContent : h
			, sOk : "Report"
			, fnClose : function() {
				that.closeAll();
			}
			, fnact : function() {
				var sBody = "Dear Service Desk,\r\n\r\n";
				sBody += "The application \"" + O$C3.sApp + "\" showed ";
				sBody += "the following error message:\r\n\r\n";
				sBody += "\t(" + idError + ") " + sError + "\r\n\r\n";
				sBody += "Location: " + self.location.href + "\r\n\r\n";
				if( sStack ) {
					sBody += "Additional information:\r\n\r\n";
					var nStrip = 1000 - sBody.length;
					sBody += "\t" + sStack.substr( 0, nStrip ) + "\r\n\r\n";
				}
				sBody += " Best regards,";
				var url = "mailto:ICTServicedesk@osce.org";
				var url = "mailto:jriemer@osce.org";
				url += "?subject=" + O$C3.sApp + ": " + sError;
				url += "&body=" + encodeURIComponent( sBody );
				window.location.href = url;
				__.SP.modal.close();
			}
		} );
	}
	, closeAll : function() {
		console.log( 'closeall' );
		__.dn_( ".ms-dlgContent", function( dnModal ) {
			__.dn.del( dnModal );
		} );
		__.dn_( ".ms-dlgOverlay", function( dnBlend ) {
			__.dn.del( dnBlend );
		} );
	}
	, bExists : function() {
		return __.dn_( ".ms-dlgContent" );
	}
	, resize : function() {
		var oModal = SP.UI.ModalDialog.get_childDialog();
		oModal.$$d_autoSize();
	}
};

