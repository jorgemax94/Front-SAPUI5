/*global moment, accounting*/
/* eslint-disable no-use-before-define, max-params, new-cap, no-console */
sap.ui.define([
	//"com/gerdau/logistics/autoatendimento/util/utils.factory"
], function () {
	"use strict";
	//var utils = new Utils();
	return {
		initCap: function(sValue) {
			return sValue[0].toUpperCase() + sValue.substring(1).toLowerCase();			
		},
		
		formatCPF: function(sValue) {
			if (sValue) {
				var cpfFormat = sValue.substr(0,3)+'.'+sValue.substr(3,3)+'.'+sValue.substr(6,3)+'-'+sValue.substr(9,2)
				return cpfFormat;
			} else {
				return "";
			}
		},
		
		getScheduleType: function(sValue) {
			var bundle = this.getOwnerComponent().getModel('i18n').getResourceBundle();
			switch(sValue) {
				case '1':
					return bundle.getText('UNLOAD');
				case '2':	
					return bundle.getText('LOAD');
				case '3':	
					return bundle.getText('MINE');
				default:
					return;
			}
		}
	};

});
