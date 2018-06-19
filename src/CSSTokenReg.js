
var sourceToken = {
	number: /(?:[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?)/,
	percent: /(?:number%)/,
	angle: /(?:number(?:deg|grad|rad|turn))/,
	unit: /(?:number|percent)/,
	hue: /(?:number|angle)/,
	rgb: /rgba?\(\s*(number)[,\s]+(number)[,\s]+(number)(?:(?:[,\s]*\/[,\s]*|[,\s]+)(unit))?\s*\)/,
	rgbp: /rgba?\(\s*(percent)[,\s]+(percent)[,\s]+(percent)(?:(?:[,\s]*\/[,\s]*|[,\s]+)(unit))?\s*\)/,
	hsl: /hsla?\(\s*(hue)[,\s]+(percent)[,\s]+(percent)(?:(?:[,\s]*\/[,\s]*|[,\s]+)(unit))?\s*\)/,
	hsv: /hs(?:v|b)a?\(\s*(hue)[,\s]+(percent)[,\s]+(percent)(?:(?:[,\s]*\/[,\s]*|[,\s]+)(unit))?\s*\)/,
	hex: /#(?:[0-9a-f]{2}){3,4}/,
	hexs: /#[0-9a-f]{3,4}/,
}
var cacheToken = {
	number: sourceToken.number.source,
};
var token = {};

var replaceTokens = ['number', 'percent', 'angle', 'unit', 'hue'];

for (var key in sourceToken) {
	token[key] = getReg(key);
}

function replaceReg (regStr, name) {
	if (name in cacheToken) {
		return regStr;
	}
	var result = regStr.replace(new RegExp(replaceTokens.join('|'), 'g'), function (match) {
		if (match in cacheToken) {
			return cacheToken[match];
		}
		return replaceReg(token[match].source, match);
	});
	cacheToken[name] = result;
	return result;
}

function getReg (name) {
	return new RegExp('^' + replaceReg(sourceToken[name].source, name) + '$', 'i');
}

export function isMatch (val, name) {
	if (typeof val === 'undefined' || val === null) return null;
	return token[name].exec(val);
}
