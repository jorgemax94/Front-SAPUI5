sap.ui.define([
		"com/gerdau/logistics/autoatendimento/controller/BaseController",
		"sap/ui/model/json/JSONModel"
		
	], function (BaseController, JSONModel) {
		"use strict";
		

		return BaseController.extend("com.gerdau.logistics.autoatendimento.controller.Access", {

			/**
			* Called when a controller is instantiated and its View controls (if available) are already created.
			* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			* @memberOf view.Menu
			*/
				onInit: function() {
					
					//this.getRouter().getRoute("access").attachPatternMatched(this._onObjectMatched, this);
					this.getRouter().getTargets().getTarget("access").attachDisplay(null, this._onDisplay, this);
					
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

				onPressConfig: function(){

					
					this.getModel("appView").setProperty("/addEnabled", false);
					this.getRouter().getTargets().display("create");

				},
				
				onPressPlant: function(oEvent){

					

					var settings = {
						"url": "https://gerdauyardserviced1f60cca1.us2.hana.ondemand.com/gerdau-yard-service/rest/plant/getPlantList",
						"method": "GET",
						"timeout": 0
						,
						"headers": {
							'Authorization': 'Basic eWFyZDp5YXJk'
						}
					  };
					  $.ajax(settings).done(function (response) {
						console.log(response);
					  });

				},
											
				onPressLogon: function(oEvent) {
					try {	
						var oAppModel = this.getModel('appView');
						
						if (!oAppModel.getProperty('/sapPlant')) {
							this.MessageBox.alert(this.oBundle.getText('AccessView.Message.PlantNotFound'));
						} else if (this.getView().byId('idDriverCPF').getValue() === '') {
							this.MessageBox.alert(this.oBundle.getText('AccessView.Message.InvalidCPF'));
						} else if (!this.utils.validateCPF(this.getView().byId('idDriverCPF').getValue())) {
							this.MessageBox.alert(this.oBundle.getText('AccessView.Message.InvalidCPF'));	
						} else if (this.getView().byId('idTruckPlate').getValue() === '') {
							this.MessageBox.alert(this.oBundle.getText('AccessView.Message.InvalidTruckPlate'));										
						} else if (this.getView().byId('idTruckPlate').getValue().length !== 7) {
							this.MessageBox.alert(this.oBundle.getText('AccessView.Message.InvalidTruckPlate'));	
						} else {
							
							oAppModel.setProperty("/busy", true);
							
							var parameter = oAppModel.getProperty('/sapPlant')+','+
											this.getView().byId('idDriverCPF').getValue().replaceAll('.','').replaceAll('-','')+','+
											this.getView().byId('idTruckPlate').getValue();
							var url = oAppModel.getProperty('/proxy') + "/logistics/autoatendimento/services/schedule/schedule.service.xsjs?parameters="+parameter;							
							var fncSuccess = function(vReturn) {
								oAppModel.setProperty("/busy", false);
								//console.log(vReturn);
								if (vReturn.length === 0) {
									this.MessageBox.alert(this.oBundle.getText('AccessView.Message.ScheduleNotFound'));									
								} else {									
									this.getRouter().getTargets().display("scheduleList", {
										fromTarget : "access",
										list : vReturn								
									});
									this.getView().byId('idDriverCPF').setValue('');
									this.getView().byId('idTruckPlate').setValue('');
								}
							}
							var fncFail = function(vReturn) {
								oAppModel.setProperty("/busy", false);
								this.MessageBox.alert(vReturn.responseJSON.message);							
							}

							jQuery.get(url, jQuery.proxy(fncSuccess, this))
								.fail(jQuery.proxy(fncFail, this));													
						}						
					} catch (e) {
						console.log(e);
					}	
				},
			
			/**
			* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			* @memberOf view.Menu
			*/
			//	onExit: function() {
			//
			//	}
				
				_onDisplay : function (oEvent) {
					//this.getView().byId('idDriverCPF').setValue('06498581409');
					//this.getView().byId('idTruckPlate').setValue('BAR1234');					
				},					
		});
	}			
);