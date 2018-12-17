/* eslint-disable no-use-before-define, max-params, no-unused-vars, new-cap */
/*global moment, _*/
sap.ui.define([
		"sap/ui/core/message/Message",
		"sap/ui/core/MessageType",
		"sap/m/MessageToast",
		//globais, não precisa referenciar
		"com/gerdau/logistics/autoatendimento/util/extensions",
		//"com/gerdau/external/libs/accounting.min",
		//"com/gerdau/external/libs/jquery.mask.min",
		//"com/gerdau/external/libs/jquery.maskMoney.min",
		//"com/gerdau/external/libs/lodash.min",
		//"com/gerdau/external/libs/FileSaver.min",
		//"com/gerdau/external/libs/accounting.min",		
		//"com/gerdau/external/libs/polyfill.min"
	],
	function (Message, MessageType, MessageToast) {
		'use strict';

		function Utils() {
			this.max = 99999999;
			this.min = 1;
			this._message = {};
		}

		Utils.log = jQuery.sap.log;


		/**
		 * Returns a random number between min (inclusive) and max (exclusive)
		 * @param  {integer} min The min number for initiate random. Default: 0
		 * @param  {integer} max The max number for end random. Default: 99999999
		 * @return {integer}     Random number
		 */
		Utils.prototype.getRandomArbitrary = function (min, max) {
			return Math.random() * ((max || this.max) - (min || this.min) + (min || this.min));
		};

		/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 * Using Math.round() will give you a non-uniform distribution!
		 *
		 * @param  {integer} min The min number for initiate random. Default: 0
		 * @param  {integer} max The max number for end random. Default: 99999999
		 * @return {integer}     Random number
		 */
		Utils.prototype.getRandomInt = function (min, max) {
			return Math.floor(Math.random() * ((max || this.max) - (min || this.min) + 1)) + (min || this.min);
		};


		/*
		 * Create Query string for post in ajax
		 * @param  {Object} data
		 * @return {JSON}      Object JSON
		 */
		Utils.prototype.createQueryString = function (data) {
			return jQuery.param(data);
		};

		/**
		 * Show Toastr message
		 * @param  {string} message Message for showing
		 */
		Utils.prototype.showToast = function (message) {
			MessageToast.show(message);
		};

		/**
		 * Format Date PT_BR DD/MM/YYYY, this use moment to format
		 * @param  {string/Date} sValue Date to Format
		 * @param  {string} format Format for Date. eg. YYYY/MM - HH:mm:ss
		 * @return {string}        Date formatted DD/MM/YYYY
		 */
		Utils.prototype.formatDate = function (sValue, format) {
			if (sValue) {
				var date = moment.utc(sValue);

				return date.format(format || "DD/MM/YYYY");
			} else {
				return sValue;
			}
		};

		/**
		 * Format Date PT_BR DD/MM/YYYY - HH:mm, this use moment to format
		 * @param  {string/Date} sValue Date to Format
		 * @return {string}        Date formatted DD/MM/YYYY - HH:mm
		 */
		Utils.prototype.formatDateTime = function (sValue) {
			if (sValue) {
				var date = moment.utc(sValue);

				return date.format("DD/MM/YYYY - HH:mm");
			} else {
				return sValue;
			}
		};

		/**
		 * Format Date PT_BR DD/MM - HH:mm, this use moment to format
		 * @param  {string/Date} sValue Date to Format
		 * @return {string}        Date formatted DD/MM - HH:mm
		 */
		Utils.prototype.formatDateTimeNoYear = function (sValue) {
			if (sValue) {
				var date = moment.utc(sValue);

				return date.format("DD/MM - HH:mm");
			} else {
				return sValue;
			}
		};

		
		/**
		 * Format Time PT_BR HH:mm, this use moment to format
		 * @param  {string/Date} sValue Date to Format
		 * @return {string}        Time formatted HH:mm
		 */
		Utils.prototype.formatTime = function (sValue) {
			if (sValue) {
				var date = moment.utc(sValue);

				return date.format("HH:mm");
			} else {
				return "--:--";
			}
		};
		

		/**
		 * Validate CPF
		 * @param  {string} cpf CPF to Validade
		 * @return {bollean}     true or false
		 */
		Utils.prototype.validateCPF = function (cpf) {
			cpf = cpf.replace(/[^\d]+/g, '');
			if (cpf === "") {
				return false;
			}
			// Elimina CPFs invalidos conhecidos
			if (cpf.length !== 11 ||
				cpf === "00000000000" ||
				cpf === "11111111111" ||
				cpf === "22222222222" ||
				cpf === "33333333333" ||
				cpf === "44444444444" ||
				cpf === "55555555555" ||
				cpf === "66666666666" ||
				cpf === "77777777777" ||
				cpf === "88888888888" ||
				cpf === "99999999999") {
				return false;
			}
			// Valida 1o digito
			var add = 0;
			for (var j = 0; j < 9; j++) {
				add += parseInt(cpf.charAt(j), 10) * (10 - j);
			}
			var rev = 11 - (add % 11);
			if (rev === 10 || rev === 11) {
				rev = 0;
			}
			if (rev !== parseInt(cpf.charAt(9), 10)) {
				return false;
			}
			// Valida 2o digito
			add = 0;
			for (var i = 0; i < 10; i++) {
				add += parseInt(cpf.charAt(i), 10) * (11 - i);
			}
			rev = 11 - (add % 11);
			if (rev === 10 || rev === 11) {
				rev = 0;
			}
			if (rev !== parseInt(cpf.charAt(10), 10)) {
				return false;
			}
			return true;
		};

		Utils.prototype.validatePlate = function (plate) {
			
			var isPlate = plate.match(/^[a-zA-Z]{3}[0-9]{4}$/);
			
		    if (isPlate)
		    {
		        return true;
		    } else {
			    return false;
		    }
		};

		/**
		 * Set fiels Error
		 * @param {Object} config  Config error
		 * @param {boolean} bRemove Destroy message
		 */
		Utils.prototype.setFieldError = function (config, bRemove) {
			var defaultConfig = {
				type: MessageType.Error,
				date: new Date(),
				description: "",
				message: "",
				code: "",
				processor: {},
				target: ""
			};
			var msg = jQuery.extend(defaultConfig, config);
			if (!(msg.target in this._message)) {
				this._message[msg.target] = new Message(msg);
			}

			if (bRemove) {
				sap.ui.getCore().getMessageManager().removeMessages(
					this._message[msg.target]
				);
				delete this._message[msg.target];
			} else {
				sap.ui.getCore().getMessageManager().addMessages(
					this._message[msg.target]
				);
			}
		};

		/**
		 * Encode Url
		 * @param  {string} str Url to encode
		 * @return {string}     Url encoded
		 */
		Utils.prototype.urlencode = function (str) {
			str = (str + '')
				.toString();

			return encodeURIComponent(str)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A');
		};

		/**
		 * Get size to file from Base64 value
		 * @param  {string} sValue Base64 string
		 * @return {string}        Size of file formatted
		 */
		Utils.prototype.getSizeBase64 = function (sValue) {
			if (sValue) {
				var len = window.atob(sValue).length;
				jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
				return sap.ui.core.format.FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 2,
					maxIntegerDigits: 3
				}).format(len * 1000);
			} else {
				return sValue;
			}
		};


		/**
		 * Get Extension by file mime type with support icons SAPUI5
		 * @param  {string} mimeType MIME TYPE to file
		 * @return {Object}          {extension: [string], icon: [string]}
		 */
		Utils.prototype.getExtendionFileTypeByMime = function (mimeType) {
			var listTypes = {};
			listTypes["text/plain"] = {
				extension: ".txt",
				icon: "sap-icon://document-text"
			};
			listTypes["text/html"] = {
				extension: ".html",
				icon: ""
			};
			listTypes["text/plain"] = {
				extension: ".txt",
				icon: ""
			};
			listTypes["application/json"] = {
				extension: ".json",
				icon: ""
			};
			listTypes["image/gif"] = {
				extension: ".gif",
				icon: ""
			};
			listTypes["image/png"] = {
				extension: ".png",
				icon: "sap-icon://picture"
			};
			listTypes["image/jpeg"] = {
				extension: ".jpeg",
				icon: "sap-icon://picture"
			};
			listTypes["image/bmp"] = {
				extension: ".bmp",
				icon: "sap-icon://picture"
			};
			listTypes["audio/midi"] = {
				extension: ".midi",
				icon: ""
			};
			listTypes["audio/mpeg"] = {
				extension: ".mpeg",
				icon: "sap-icon://picture"
			};
			listTypes["audio/webm"] = {
				extension: ".webm",
				icon: ""
			};
			listTypes["audio/ogg"] = {
				extension: ".ogg",
				icon: ""
			};
			listTypes["audio/wav"] = {
				extension: ".wav",
				icon: ""
			};
			listTypes["video/webm"] = {
				extension: ".webm",
				icon: ""
			};
			listTypes["application/octet-stream"] = {
				extension: ".ogg",
				icon: ""
			};
			listTypes["application/pkcs12"] = {
				extension: ".pkcs12",
				icon: ""
			};
			listTypes["application/vnd.mspowerpoint"] = {
				extension: ".ptt",
				icon: ""
			};
			listTypes["application/xhtml+xml"] = {
				extension: ".xhtml",
				icon: ""
			};
			listTypes["application/xml"] = {
				extension: ".xml",
				icon: ""
			};
			listTypes["application/pdf"] = {
				extension: ".pdf",
				icon: ""
			};
			listTypes["application/vnd.ms-excel"] = {
				extension: ".xls",
				icon: ""
			};
			listTypes["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = {
				extension: ".docx",
				icon: ""
			};
			listTypes["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = {
				extension: ".xlsx",
				icon: ""
			};

			return listTypes[mimeType];
		};

		Utils.prototype.toggleBusyindicator = function (state) {
			if (state) {
				sap.ui.core.BusyIndicator.show(0);
			} else {
				sap.ui.core.BusyIndicator.hide();
			}
		};

		Utils.prototype.createIdForElementInnerFragment = function (fragId, elementId) {
			return sap.ui.core.Fragment.createId(fragId, elementId);
		};

		return Utils;
	});
