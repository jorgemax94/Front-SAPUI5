sap.ui.define([
				"com/gerdau/logistics/autoatendimento/controller/BaseController",
				"sap/ui/model/json/JSONModel",
                "sap/m/MessageBox",
                "sap/m/MessageToast"
               ], function (BaseController, JSONModel, MessageBox, MessageToast) {
				   

	"use strict";

	return BaseController.extend("com.gerdau.logistics.autoatendimento.controller.PlantConfig", {

		onBackAction: "Access",

	onInit: function () {

		

		this._getPlant();
		this.onNavButtonPress();
		this.onSave();

		

	},

	_getPlant: function(){
		
		var that = this;
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
			that._populatePlant(response)
		  });
	},

	_populatePlant: function(response){
		var oModel = new sap.ui.model.json.JSONModel(response);
			this.getView().setModel(oModel);

			var states = [
				{
				  "BLAND": "AC",
				  "BEZEI": "Acre"
				}
			  ];
			var oStates = new sap.ui.model.json.JSONModel(states);
			this.getView().setModel(oStates, 'STATES');

	},
	onChangePlant: function(){
		var that = this;
		var plantName = this.getView().byId('comboPlant').getValue();
		console.log(plantName);
		that.onSave(plantName);
	},

	onSave: function(plantName){

		var msg = "Método Salvar Iniciado";
			MessageToast.show(msg);
			
	//	console.log(this.getView().byId('urlQa').getValue());
	//	console.log(this.getView().byId('urlProd').getValue());
		
	//	this.onChangePlant().getView().byId('comboPlant').getValue();
		console.log(plantName);
		var urlQ = this.getView().byId('urlQa').getValue();
		var urlP = this.getView().byId('urlProd').getValue();
		console.log(urlQ)
		console.log(urlP)
		//console.log(this.getView().byId('comboPlant').selectedItemId());
		
		

		
		
	},

	onNavButtonPress: function(){
		this.getRouter().getTargets().display("access");
},
	onCancel: function(){
		var that = this;
		var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		MessageBox.warning(
			"Todos os dados digitados serão perdidos",
			{
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function(sAction) {
					if(sAction === 'OK'){
					that.onNavButtonPress();
					}else {

					}
				}
			}
		);


		}


});

});
