__.SP.icon = {
	mp : {
		  "default" : "/_layouts/15/images/Osce/danger.png"
		, dirty : "/_layouts/15/images/Osce/danger.png"
		, closed : "/_layouts/15/images/lockoverlay.png"
		, record : "/_layouts/15/images/lockoverlay.png"
		, unmarked : "/_layouts/15/images/Osce/lockoverlay-green.png"
		, yearlyFolder : "/_layouts/15/images/Osce/YF.png"
		, obsolete : "/_layouts/15/images/Osce/overlay-SO.png"
		, smallDanger : "/_layouts/15/images/Osce/danger-small.png"
		, bigDanger : "/_layouts/15/images/warning70by70.gif"
		, loading : "/_layouts/15/images/Osce/fancytree-loading.gif"
	}
};
__.SP.grid = {
	  oData : function() {
		var o = {};
		ctx.ListData.Row.forEach( function( oData ) {
			o[ oData.ID ] = oData;
		} );
		return o;
	}
	, dnWebpart : function() {
		return __.dn_( "#scriptWPQ2" );
	}
	, dnGrid : function() {
		return __.dn_( "table[summary]" );
	}
	, selection : function() {
		var oData = __.SP.grid.oData();
		var loItems = SP.ListOperation.Selection.getSelectedItems();
		loItems.forEach( function( oItem ) {
			__.o.add( oItem, oData[ oItem.id ] );
		} );
		return loItems;
	}
	, clearSelection : function() {
		__.dn_( ".s4-itm-selected", function( dn, ix ) {
			setTimeout( function() {
				__.dn_( ".ms-selectitem-span", dn ).click();
			}, ix );
		} );
	}
	, unlock : function() {
		var dnWebpart = this.dnWebpart();
		if( dnWebpart ) {
			__.lock.un( dnWebpart );
		}
	}
	, lock : function() {
		var dnWebpart = this.dnWebpart();
		if( dnWebpart ) {
			__.lock.up( dnWebpart );
		}
	}
	, reload : function() {
		var dn = __.dn_( "#ManualRefresh" );
		if( dn ) {
			// until we can refresh the ribbon bar as well
			// SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);
			dn.click();
		}
		else {
			try {
				var idList = SP.ListOperation.Selection.getSelectedList();
				idList = idList.toLowerCase().replace( "-", "_" ).replace( "{", "" ).replace( "}", "" );
				__doPostBack( "ctl00$m$g_" + idList + "$ctl02", "cancel" );
			} catch( e ) {
				return false;
			}
		}
		return true;
	}
};
