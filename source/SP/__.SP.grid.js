/**
 * Collection of methods dealing with functionality around list views of SharePoint lists.
 * @namespace __.SP.grid
 * @memberof __.SP
 */

__.SP.grid = {
	/**
	 * Returns item data of the current list view.
	 * Includes only data displayed in the view.
	 * @memberof __.SP.grid
	 * @method oData
	 * @todo rename to aListData or aData
	 * @todo test return example
	 * @example __.SP.grid.oData();
	 * @returns {Object} object of item data arranged by item IDs
	 * Example:
	 * <pre>
	 * {
	 *     11 : { ID : 11, Title : "title 1", Email : "test1@abc.com" }
	 *   , 13 : { ID : 13, Title : "title 2", Email : "test2@abc.com" }
	 * }
	 * </pre>
	 */
	  oData : function() {
		var o = {};
		ctx.ListData.Row.forEach( function( oData ) {
			o[ oData.ID ] = oData;
		} );
		return o;
	}
	/**
	 * Returns DOM node of the list webpart
	 * @memberof __.SP.grid
	 * @method dnWebpart
	 * @example var dnWebpart = __.SP.grid.dnWebpart();
	 * @returns {Node} DOM node of the list webpart
	 */
	, dnWebpart : function() {
		return document.body.__find( "#scriptWPQ2" );
	}
	/**
	 * Returns DOM node of the list webpart's main table
	 * @memberof __.SP.grid
	 * @method dnGrid
	 * @example var dnGrid = __.SP.grid.dnGrid();
	 * @returns {Node} DOM node of the main table
	 */
	, dnGrid : function() {
		return document.body.__find( "table[summary]" );
	}
	/**
	 * Returns item data of the currently selected items.<br>
	 * Includes only data displayed in the view.
	 * @memberof __.SP.grid
	 * @method selection
	 * @todo test return example
	 * @example __.SP.grid.selection();
	 * @returns {Object} object of item data arranged by item IDs
	 * Example:
	 * <pre>
	 * {
	 *     11 : { ID : 11, Title : "title 1", Email : "test1@abc.com" }
	 * }
	 */
	, selection : function() {
		var oData = __.SP.grid.oData();
		var loItems = SP.ListOperation.Selection.getSelectedItems();
		loItems.forEach( function( oItem ) {
			oItem.__add( oData[ oItem.id ] );
		} );
		return loItems;
	}

	/**
	 * Clears current selection of items in list.
	 * @memberof __.SP.grid
	 * @method clearSelection 
	 * @example __.SP.grid.clearSelection();
	 */
	, clearSelection : function() {
		document.body.__find( ".s4-itm-selected", function( dn, ix ) {
			setTimeout( function() {
				dn.__find( ".ms-selectitem-span" ).click();
			}, ix );
		} );
	}

	/**
	 * Locks the list webpart by greying it out and preventing any
	 * user interactions with the list.
	 * @memberof __.SP.grid
	 * @method lock
	 * @example __.SP.grid.lock();
	 */
	, lock : function() {
		var dnWebpart = this.dnWebpart();
		if( dnWebpart ) {
			__.lock.up( dnWebpart );
		}
	}

	/**
	 * Unlocks the webpart enabling user interactions again.
	 * @memberof __.SP.grid
	 * @method unlock
	 * @example __.SP.grid.unlock();
	 */
	, unlock : function() {
		var dnWebpart = this.dnWebpart();
		if( dnWebpart ) {
			__.lock.un( dnWebpart );
		}
	}

	/**
	 * Refreshes the list view without reloading the entire page. 
	 * @memberof __.SP.grid
	 * @method reload
	 * @todo test replacing return false in catch with page reload?
	 * @example __.SP.grid.reload();
	 */
	, reload : function( ms ) {
		ms = ms || 0;
		console.log( ">>>>>>>>>>>" + ms );
		setTimeout( function() {
			var dn = document.body.__find( "#ManualRefresh" );
			if( dn ) {
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
		}, ms );
	}
};

__.SP.icon = {
	mp : {
		  "x32" : {
			  placeholder : "/_layouts/15/images/placeholder32x32.png"
			, approved : "/_layouts/15/images/osce/checkmark.png"
			, approve : "/_layouts/15/images/osce/checkmark.png"
			, publish : "/_layouts/15/images/osce/checkmark.png"
			, rejected : "/_layouts/15/images/osce/x.png"
			, reject : "/_layouts/15/images/osce/x.png"
			, unpublish : "/_layouts/15/images/osce/x.png"
			, cancel : "/_layouts/15/images/osce/cancel.png"
			, close : "/_layouts/15/images/osce/cancel.png"
			, save : "/_layouts/15/images/osce/save.png"
		}
		, "x16" : {
			  folder : "/_layouts/15/images/osce/folder.gif"
			, contact : "/_layouts/15/images/osce/contact.png"
			, danger : "/_layouts/15/images/osce/danger.png"
			, contact : "/_layouts/15/images/osce/contact.png"
			, loading : "/_layouts/15/images/osce/loading.gif"
			, tags : "/_layouts/15/images/EMMCopyTerm.png"
			, calendar : "/_layouts/15/images/calendar_25.gif?rev=23"
		}
		, "x8" : { // evntually 9
			  locked : "/_layouts/15/images/lockoverlay.png"
			, unlocked : "/_layouts/15/images/osce/lockoverlay-green.png"
			, danger : "/_layouts/15/images/osce/danger-small.png"
			, reject : "/_layouts/15/images/osce/danger-small.png"
			, expanded : "/_layouts/15/images/osce/expanded.png"
			, collapsed : "/_layouts/15/images/osce/collapsed.png"
			, blank : "/_layouts/15/images/blank.gif?rev=23"
		}
	}
};
