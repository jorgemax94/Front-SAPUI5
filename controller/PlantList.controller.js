sap.ui.define([
		"com/gerdau/logistics/autoatendimento/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, Filter, FilterOperator) {
		"use strict";
		

		return BaseController.extend("com.gerdau.logistics.autoatendimento.controller.PlantList", {

			/**
			* Called when a controller is instantiated and its View controls (if available) are already created.
			* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			* @memberOf view.Menu
			*/
				onInit: function() {
					var oViewModel = new this.JSONModel({});					
					this.setModel(oViewModel, "plantListView");
					this.getRouter().getTargets().getTarget("plantList").attachDisplay(null, this._onDisplay, this);
					
					this._oList = this.getView().byId("idPlantList");
					this._oListFilterState = {
							aFilter: [],
							aSearch: []
						};
														
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
				
				onSearch: function(oEvent) {
					if (oEvent.getParameters().refreshButtonPressed) {
						// Search field's 'refresh' button has been pressed.
						// This is visible if you select any master list item.
						// In this case no new search is triggered, we only
						// refresh the list binding.
						this.onRefresh();
						return;
					}

					var sQuery = oEvent.getParameter("query");
					var aFilter = [];

					if (sQuery) {
						var isNumber = !isNaN(sQuery);
						if (isNumber) {
							aFilter.push(new Filter("ID_PLANT", FilterOperator.EQ, sQuery));							
							aFilter.push(new Filter("SAP_PLANT", FilterOperator.Contains, sQuery));
						} else {
							aFilter.push(new Filter("DS_PLANT", FilterOperator.Contains, sQuery.toUpperCase()));
							aFilter.push(new Filter("DS_PLANT_CITY", FilterOperator.Contains, sQuery.toUpperCase()));
							aFilter.push(new Filter("DS_PLANT_REGION", FilterOperator.Contains, sQuery.toUpperCase()));							
						}
						
						this._oListFilterState.aSearch = [new Filter({
							filters: aFilter,
							and: false
						})];
					} else {
						this._oListFilterState.aSearch = aFilter;
					}
																		
					this._applyFilterSearch();

				},
						
				
				onRefresh: function() {
					this._oList.getBinding("items").refresh();
				},
			/**
			* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			* @memberOf view.Menu
			*/
			//	onExit: function() {
			//
			//	}
				
				_applyFilterSearch: function() {
					var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter);
					//						oViewModel = this.getModel("masterView");
					this._oList.getBinding("items").filter(aFilters, "Application");
					// changes the noDataText of the list in case there are no filter results
					//if (aFilters.length !== 0) {
					//	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
					//} else if (this._oListFilterState.aSearch.length > 0) {
					//	// only reset the no data text to default when no new search was triggered
					//	oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
					//}
				},
				
				_onDisplay: function(oEvent) {
					//this.MessageBox.alert('teste');
					var oAppModel = this.getModel('appView');
					
					oAppModel.setProperty("/busy", true);
					var url = oAppModel.getProperty('/proxy') + "/logistics/autoatendimento/services/schedule/schedule.service.xsjs?cmd=plant";
					
					var fncSuccess = function(vReturn) {
						oAppModel.setProperty("/busy", false);
						//console.log(vReturn);
						if (vReturn.length === 0) {
							this.MessageBox.alert(this.oBundle.getText('PlantView.Message.PlantNotFound'));									
						} else {									
							var oViewModel = new this.JSONModel(vReturn);
							this.setModel(oViewModel, "plantListView");
						}
					}
					var fncFail = function(vReturn) {
						oAppModel.setProperty("/busy", false);
						this.MessageBox.alert(vReturn.responseJSON.message);							
					}

					jQuery.get(url, jQuery.proxy(fncSuccess, this))
						.fail(jQuery.proxy(fncFail, this));										
				},
				
				onSelectionChange: function(oEvent) {					
					var oSource = oEvent.getSource();
					var oObject = oSource.getSelectedItem().getBindingContext('plantListView').getObject();					
					
					var oAppModel = this.getModel('appView');
					oAppModel.setProperty("/sapPlant", oObject.SAP_PLANT);
										
					this.getRouter().navTo("access");
				}
		});
	}			
);