sap.ui.define([
    "com/gerdau/logistics/autoatendimento/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Controller, MessageToast,JSONModel) {
    "use strict";

    return BaseController.extend("com.gerdau.logistics.autoatendimento.controller.App", {

    	onInit : function () {
			var oViewModel,
				fnSetAppNotBusy,
				oListSelector = this.getOwnerComponent().oListSelector,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				//proxy : '/firstProxy', //desenv
				proxy: '', //prod
				sapPlant: ''//'1407'
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			//this.getOwnerComponent().getModel().metadataLoaded()
			//		.then(fnSetAppNotBusy);			

			// apply content density mode to root view
			//this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

    });
});
