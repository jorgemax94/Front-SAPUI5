/*global history, moment, _ */
/* eslint-disable no-use-before-define, max-params, no-unused-vars, no-extend-native, no-console */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/Device",
		"sap/ui/model/json/JSONModel",
		"com/gerdau/logistics/autoatendimento/model/formatter",
		"sap/m/MessageBox",
		"com/gerdau/logistics/autoatendimento/util/utils.factory",
		"com/gerdau/logistics/autoatendimento/util/extensions"
	],
	function (Controller, History, Device, JSONModel, formatter, MessageBox, Utils) {
		"use strict";

		return Controller.extend("com.gerdau.logistics.autoatendimento.controller.BaseController", {

			Device: Device,
			JSONModel: JSONModel,
			formatter: formatter,
			MessageBox: MessageBox,	
			utils: new Utils(),
			eventBus: sap.ui.getCore().getEventBus(),
			History: History,			


			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter: function () {
				return this.getOwnerComponent().getRouter();
			},


			showLoading: function () {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", true);
			},

			hideLoading: function () {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);
			},
			registerOnShowEvent: function () {
				this.getView().addEventDelegate({
					onAfterShow: jQuery.proxy(function (evt) {
						this.onShow(evt);
					}, this)
				});
			},

			onNavBack: function () {
				console.log("Base - onNavBack");
				/*				
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
					oRouter.navTo("menu", true);
				}
				*/
				var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
				oRouter.navTo("menu", true);
			},

		/*onNavBack : function() {
				console.log("Base - onNavBack");
				var sPreviousHash = History.getInstance().getPreviousHash();

					if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("menu", {}, true);
				}
			},*/

			returnToDetails: function (navTo, settings, bReplace) {
				this.getRouter().navTo(navTo, settings, bReplace);
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel: function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel: function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle: function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			loadResource: function (callback, subPath) {
				var corePath = "com.gerdau.logistics.autoatendimento",
					oView = this.getView(),
					viewName = oView.getViewName() || oView.sViewName,
					indexControllerName = viewName.lastIndexOf('.'),
					completePath = viewName.substr(0, indexControllerName),
					path = completePath.substr(corePath.length + 1);

				if (!!callback && typeof callback !== "function") {
					subPath = callback;
					callback = undefined;
				}

				if (!!subPath && subPath.trim() !== "")
					path = path.replace(".{0}".format(subPath), "");


				var resource = oView.getModel("i18n");
				if (resource) {
					oView.setModel(resource, "i18n");
					return;
				}
				var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "{0}/i18n/i18n.properties".format(path ? path.replaceAll('.', '/') : "", name)
				});
				//Join Resources
				var defaultResource = this.getOwnerComponent().getModel('i18n');
				oI18nModel.enhance(defaultResource.getResourceBundle());
				oView.setModel(oI18nModel, "i18n");
				if (callback) {
					var resourceBundle = oView.getModel("i18n").getResourceBundle();
					callback(resourceBundle);
				}
			},

			getViewResourceBundle: function () {
				var model = this.getView().getModel("i18n");
				if (!model) {
					this.loadResource();
					model = this.getView().getModel("i18n");
				}
				return model.getResourceBundle();
			},

			showErrorAlert: function (sMessage) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(sMessage);
			},

			handleErrorMessageBox: function (error, codeMessage) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				var data = JSON.parse(error.responseText || error),
					message = (data.message || data.error.message.value),
					isConstraintError = message.indexOf("301") !== -1,
					errorMessage = this.getViewResourceBundle().getText("500");
				if (isConstraintError) {
					errorMessage = codeMessage ?
						this.getViewResourceBundle().getText(codeMessage) :
						this.getViewResourceBundle().getText("301");
				}
				if (data.status && data.status === 400) {
					errorMessage = data.message;
				}
				this.MessageBox.error(errorMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
				console.log("handleErrorMessageBox: ", data);
			},

			validateNumber: function(oEvent) {
				//var oCapacity = this.getView().byId("QT_LOAD_CAPACITY");
				var vReturn;
				var oField = oEvent.getSource();
				var oFormatOptions = oField.getBindingInfo("value").type.oFormatOptions;
				var nValue = oField.getValue().split(oFormatOptions.groupingSeparator).join('').replace(oFormatOptions.decimalSeparator,'.');
				var sValue;

				//Round
				nValue = Math.round(nValue * (Math.pow(10,oFormatOptions.maxFractionDigits))) / Math.pow(10,oFormatOptions.maxFractionDigits);
				sValue = nValue.toString();

				if (parseInt(nValue).toString().length > oFormatOptions.maxIntegerDigits) {
					vReturn = '?'.repeat(oFormatOptions.maxIntegerDigits);
					vReturn = this._includeGroupingSeparator(vReturn,oFormatOptions.groupingSeparator);
					if (sValue.indexOf('.') != -1) {
						vReturn += oFormatOptions.decimalSeparator+sValue.substr(sValue.indexOf('.')+1);
					}
				} else {
					vReturn = this._includeGroupingSeparator(parseInt(nValue).toString(),oFormatOptions.groupingSeparator);
					if (sValue.indexOf('.') != -1) {
						vReturn += oFormatOptions.decimalSeparator+sValue.substr(sValue.indexOf('.')+1);
					}
				}

				oField.setValue(vReturn);
			},

			_includeGroupingSeparator: function(sValue, sGroupSeparator) {
				var sReturn = '';
				var n = 0;
				for (var i=(sValue.length-1); i>=0; i--) {
					if ((n != 0) && ((n%3) == 0)) sReturn = sValue[i]+sGroupSeparator+sReturn;
					else sReturn = sValue[i]+sReturn;
					n++;
				}
				return sReturn;
			},

			_getControllerName: function(oObject) {
				if (typeof(oObject) !== 'object') return;
				if (typeof(oObject.getControllerName)  === 'function') {
					return oObject.getControllerName();
				}
				if (typeof(oObject.getParent) === 'function') {
					return this._getControllerName(oObject.getParent());
				} else {
					return;
				}
			},

		});

	});
