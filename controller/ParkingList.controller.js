sap.ui.define([
		"com/gerdau/logistics/autoatendimento/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		
	], function (BaseController, JSONModel) {
		"use strict";
		

		return BaseController.extend("com.gerdau.logistics.autoatendimento.controller.ParkingList", {

			/**
			* Called when a controller is instantiated and its View controls (if available) are already created.
			* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			* @memberOf view.Menu
			*/
				onInit: function() {
					var oViewModel = new this.JSONModel({});					
					this.setModel(oViewModel, "parkingListView");
					this.getRouter().getTargets().getTarget("parkingList").attachDisplay(null, this._onDisplay, this);
					this._schedule;
														
					//this.getRouter().getRoute("menu").attachPatternMatched(this._onMasterMatched, this);
					/*
					this.oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
					
					this.oRouter.attachRouteMatched(function(oEvent) {
						
						var sRoute = oEvent.getParameter("name");
						var oView = oEvent.getParameter("view");
						
						var app = sap.ui.getCore().byId("fioriShell").getContent()[0].getComponentInstance().byId("app");
			    		
						if (sRoute == "menu"){
							//oEventBus.subscribe("FullScreen","changeApp",app.changeApp,app);
						}else{
							//oEventBus.subscribe("Detail","changeApp",app.changeApp,app);
						}
					});*/
					
					this.oBundle = this.getViewResourceBundle();
				},
				
			/**
			* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			* (NOT before the first rendering! onInit() is used for that one!).
			* @memberOf view.Menu
			*/
			//	onBeforeRendering: function() {
			//
			//	},
			
			/**
			* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			* This hook is the same one that SAPUI5 controls get after being rendered.
			* @memberOf view.Menu
			*/
				onAfterRendering: function() {
						
				},
											
			/**
			* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			* @memberOf view.Menu
			*/
			//	onExit: function() {
			//
			//	}
				
				onSelectionChange: function(oEvent) {
					//console.log(oEvent);
					
					var oSource = oEvent.getSource();
					var oObject = oSource.getSelectedItem().getBindingContext('parkingListView').getObject();
					
					this._doCheckin(this._schedule, oObject.ID_PARKING);													
				},
								
				
				_onDisplay: function(oEvent) {
					//this.MessageBox.alert('teste');
					var data = oEvent.getParameter("data");					
					var oViewModel = new this.JSONModel(data.list);					
					this.setModel(oViewModel, "parkingListView");
					this._schedule = data.schedule;
				},
								
				_showMessage: function(pMessage) {
					var fncClose = jQuery.proxy(function() { 
						this.getRouter().getTargets().display("access");
					},this);
					
					this.MessageBox.alert(
							this.oBundle.getText(pMessage),
							{        						
								onClose: fncClose
							}
						);
				},
				
				_doCheckin: function(pSchedule, pParking) {
					//console.log('Schedule: '+pSchedule+' Parking: '+pParking);
					var oAppModel = this.getModel('appView');
					
					oAppModel.setProperty("/busy", true);
					var url = oAppModel.getProperty('/proxy') + "/logistics/autoatendimento/services/schedule/schedule.service.xsjs?cmd=checkin";
					
					var data = {
						"checkin":{
							"schedule": { "idSchedule": pSchedule},
							"checkinType": {"idCheckingtype":1},
							"idTableReference": pParking
						}
					};
					
					var fncSuccess = function(vReturn) {
						oAppModel.setProperty("/busy", false);
						//console.log(vReturn);
						this._showMessage('ParkingView.Message.ConfirmSchedule');
					}
					var fncFail = function(vReturn) {
						oAppModel.setProperty("/busy", false);
						this._showMessage('ParkingView.Message.ErrorConfirmSchedule');											
					}

					jQuery.post(url, JSON.stringify(data), jQuery.proxy(fncSuccess, this))
						.fail(jQuery.proxy(fncFail, this));	
														
				},
				
				
		});
	}			
);