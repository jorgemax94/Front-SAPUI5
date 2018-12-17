sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"com/gerdau/logistics/autoatendimento/model/models",
	"com/gerdau/logistics/autoatendimento/controller/ListSelector",
	"com/gerdau/logistics/autoatendimento/controller/ErrorHandler"	
], function(UIComponent, Device, JSONModel, ResourceModel, models, ListSelector, ErrorHandler) {
	"use strict";
	return UIComponent.extend("com.gerdau.logistics.autoatendimento.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			this.oListSelector = new ListSelector();
			//this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			//this.getModel().setUseBatch(false);

			var oRouter = this.getRouter();			
			oRouter.initialize();
			
			jQuery(document).ajaxComplete(function(e, jqXHR){				
			  if(jqXHR.getResponseHeader("x-sap-login-page")){
				  //alert("Session is expired, page shall be reloaded.");
				  window.location.reload();
			  }
			});

		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ListSelector and ErrorHandler are destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this.oListSelector.destroy();
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});
