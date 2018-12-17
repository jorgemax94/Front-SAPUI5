/*eslint-disable*/
sap.ui.define(function () {
	"use strict";

	/**
	 * Extensão para prover funcionalidade de format string,
	 * geralmente usada em liguagens orientadas a objeto.
	 *
	 * @example
	 *  "this is a {0}".format("example");
	 *  --> result = this is a example
	 *
	 **/
	if (!String.prototype.format) {
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] !== 'undefined' ? args[number] : match;
			});
		};
	}

	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function (searchStr, replaceStr) {
			var str = this;

			// escape regexp special characters in search string
			searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

			return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
		};
	}
	
	if (!String.prototype.ltrim) {
		String.prototype.ltrim = function(char) {
		    var str = this;	
		    if (str.slice(0, char.length) === char) {
		        return str.substr(char.length).ltrim(char);
		    } else {
		        return str.toString();
		    }
		}
	}	
	
	if (!String.prototype.rtrim) {
		String.prototype.rtrim = function(char) {
		    var str = this;	
		    if (str.slice(str.length-char.length) === char) {
		        return str.substr(0,(str.length-char.length)).rtrim(char);
		    } else {
		        return str.toString();
		    }
		}
	}

	if (!String.prototype.padLeft) {
		String.prototype.padLeft = function (n,str){
		    return Array(n-String(this).length+1).join(str||'0')+this;
		}
	}	
	
	if (!Number.prototype.padLeft) {
		Number.prototype.padLeft = function (n,str){
		    return Array(n-String(this).length+1).join(str||'0')+this;
		}
	}	

	if (!Number.prototype.pad) {
		Number.prototype.pad = function (n) {
			return new Array(n).join('0').slice((n || 2) * -1) + this;
		}
	}	

	if (!Array.prototype.clone) {
		Array.prototype.clone = function () {
			return this.slice(0);
		};
	}	

	if (!String.prototype.initCap) {
		String.prototype.initCap = function () {
			return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
				return m.toUpperCase();
			});
		};
	}	

	if (!Array.prototype.getByProperties) {
		Array.prototype.getByProperties = function (specification) {
			if (!specification)
				return;
	
			if (typeof specification === "string")
				specification = JSON.parse(specification);
	
	
			if (typeof specification !== "object")
				return;
	
			var result = undefined;
			var array = this;
			for (var index in array) {
	
				var item = array[index];
				var hasAllProperties = true;
				for (var prop in specification) {
					if (!item[prop] ||
						typeof item[prop] !== typeof specification[prop] ||
						item[prop] !== specification[prop]) {
						hasAllProperties = false;
						break;
					}
				}
	
				if (hasAllProperties) {
					result = item;
					break;
				}
	
			}
	
			return result;
		};
	}	

});
