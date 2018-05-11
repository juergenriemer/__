// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs var __; __.SP; __.SP.modal; __.SP.modal.alert; __.SP.modal.bExists; __.SP.modal.confirm; __.SP.modal.load; __.SP.modal.open; __.SP.modal.resize;
// ==/ClosureCompiler==


/**
 * @namespace __.SP.modal
 * @memberof __.SP
 */

__.SP.modal = {
	  dn : null
	/**
	 * Loads a page into a modal window
	 * @memberof __.SP.modal
	 * @method load
	 * @example __.SP.modal.load( {
	 *	  sTitle : "Manage taxonomies"
	 *	, url : "/link/to/taxonomy.aspx"
	 *	, fnLoad: function( dnModal ) {
	 *		var dnButton = dnModal.getElementById( "#add" );
	 * 		__.dn.del( dnButton );
	 *	}
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sTitle title of modal window
	 * @param {String} args.url Url to be loaded into the modal window
	 * @param {Function} [args.fnLoad] function to be called when the page was loaded.
	 * @param {Function} [args.fnClose] function to be called when the window gets closed (A number gets passed on indicating whether it was closed by cancelling (0) or clicking the "OK/Save" button (1)).
	 * @returns {Object} the modal object 
	 */
	, load : function( args ) {
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
		( new __.Async( {
			  id : "__.SP.modal.load"
			, sdftError : "Failed to load window page."
		} ) )
		.wait( function() {
			if( dnModal && dnModal.$e_0 ) {
				if( args.fnLoad ) {
					args.fnLoad( dnModal.$e_0 );
				}
				return true;
			}
			return false;
		}, 50 )
		.start();
		return this;
	}
	/**
	 * Opens a modal window
	 * @memberof __.SP.modal
	 * @method open
	 * @example __.SP.modal.confirm( {
	 *	  sTitle : "Save a filter"
	 *	, hContent : "name: <input id='filter' type='text'></input>"
	 *	, fnact : function( oModal ) {
	 *		var sName = oModal.dn.getElementById( "#filter" ).value();
			// save filter with sName
	 *	}
         *	, sCancel : null
         *	, bClose : false
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} args.sTitle title of modal window
	 * @param {String} args.hContent content of modal window in HTML format
	 * @param {String} [args.sOk] name of main action button (OK/Save), indicatng "null" will not render the button (default is "Save")
	 * @param {String} [args.sCancel] name of cancel button, indicating "null" will not render the button (default is "Cancel" )
	 * @param {Boolean} [args.bClose] flag wether a button to close the modal window is rendered (X in top right corner)
	 * @param {Function} [args.fnClose] function to be called when the window gets closed (A number gets passed on indicating whether it was closed by cancelling (0) or clicking the "OK/Save" button (1)).
	 * @param {Function} [args.fnact] function to be called when the main action button is clicked
	 * @param {String} [args.sLoading] message to be shown when {args.fnact} is called or when {args.bShowProcessing} is flagged true (default is "Processing your request.")
	 * @param {Boolean} [args.bShowProcessing] flag to show the "in progress" modus (spinning wheel + message).
	 * @returns {Object} the modal object 
	 */
	, open : function( args ) {
		args.sLoading = args.sLoading || "Processing your request.";
		args.sOk = ( args.hasOwnProperty( "sOk" ) ) ? args.sOk : "Save";
		args.sCancel = ( args.hasOwnProperty( "sCancel" ) ) ? args.sCancel : "Cancel";
		args.bClose = ( typeof args.bClose != "undefined" ) ? args.bClose : true;
		var h = "<div id='osce-modal'>";
		h += args.hContent;
		h += "<p class='separator'></p>";
		h += this.buttons( args );
		h += "</div>";
		this.dn = document.body.__append( h );
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
			this.dn.__find( ".osce-buttons" ).style.display = "none";
		}
		SP.UI.ModalDialog.showModalDialog( kv );
		return this;
	}
	, behaviour : function( dn, args ) {
		var that = this;
		var dnOk = this.dn.__find( "input[value='" + args.sOk + "']" );
		if( dnOk && args.fnact ) {
			dnOk.addEventListener( "click", function() {
				that.processing();
				args.fnact( that );
			} );
		}
		var dnCancel = this.dn.__find( "input[value='" + args.sCancel + "']" );
		if( dnCancel ) {
			dnCancel.addEventListener( "click", function() {
				__.SP.modal.cancel();
			} );
		}
		// set focus on first input field
		setTimeout( function() {
			var dnInput = that.dn.__find( "input" );
			if( dnInput && dnInput[ 0 ] && dnInput[ 0 ].focus ) {
				dnInput[ 0 ].focus();
			}
		}, 1500 );
	}
	, message : function( s ) {
		var dnMessage = this.dn.__find( ".osce-message" );
		var dnLoading = this.dn.__find( ".osce-loading" );
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
		var dnLoading = this.dn.__find( ".osce-loading" );
		dnLoading.style.display = "none";
	}
	, processing : function() {
		var dnLoading = this.dn.__find( ".osce-loading" );
		dnLoading.style.display = "block";
	}
	, progress : function( s ) {
		var dnMessage = this.dn.__find( ".osce-loading > span" );
		dnMessage.textContent = s;
	}
	, close : function() {
		SP.UI.ModalDialog.commonModalDialogClose( 1 );
	}
	, cancel : function() {
		var dnClose = document.body.__find( ".ms-dlgCloseBtn" );
		if( dnClose && dnClose.click ) {
			dnClose.click();
		}
		else {
			this.closeAll();
		}
	}
	/**
	 * Opens a confirmation window with a question plus "Yes"/"No" buttons.<br>
	 * Invokes a passed on callback function with a boolean indicating the answer.
	 * @memberof __.SP.modal
	 * @method confirm 
	 * @example __.SP.modal.confirm( {
	 *	  sTitle : "Confirm this action"
	 *	, sQuestion : "Do you want to remove the item?"
	 *	, fnAnswer : function( a ) {
	 *		console.log( a );
	 *	}
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} [args.sTitle] title of confirmation window (default is "Confirm this action..."
	 * @param {String} args.sQuestion question to ask the user (default is "Do you want to proceed?")
	 * @param {String} args.fnAnswer callback invoked with the answer as parameter
	 * @returns {Object} the modal object 
	 */
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
	/**
	 * Opens a modal alert window with a message.
	 * @memberof __.SP.modal
	 * @method alert
	 * @example __.SP.modal.alert( {
	 *	  sMessage : "You cannot perform this action until you checkout"
	 * } );
	 * @param {Object} args a parameter object holding the following values
	 * @param {String} [args.sTitle] title of alert window (default is "System Message"
	 * @param {String} args.sMessage message of the alert.
	 * @returns {Object} the modal object 
	 */
	, alert : function( args ) {
		var sMessage = ( args.sMessage ) ? args.sMessage : "";
		var h = "<p>" + sMessage + "</p>";
		return __.SP.modal.open( {
			  sTitle : args.sTitle || "System Message"
			, hContent : h
			, sOk : null
			, sCancel : "Close"
		} );
	}
	, closeAll : function() {
		console.log( 'closeall' );
		document.body.__find( ".ms-dlgContent", function( dnModal ) {
			dnModal.__remove();
		} );
		document.body.__find( ".ms-dlgOverlay", function( dnBlend ) {
			dnBlend.__remove();
		} );
	}
	/**
	 * Checks if a modal window is currently displayed.
	 * @memberof __.SP.modal
	 * @method bExists
	 * @example var bModalOpen = __.SP.modal.bExists();
	 * @returns {Boolean} true if a modal window is currently displayed
	 */
	, bExists : function() {
		return document.body.__find( ".ms-dlgContent" );
	}
	/**
	 * Resizes the current modal window to fit the content.
	 * @memberof __.SP.modal
	 * @method resize
	 * @example __.SP.modal.resize();
	 */
	, resize : function() {
		var oModal = SP.UI.ModalDialog.get_childDialog();
		oModal.$$d_autoSize();
	}
};

