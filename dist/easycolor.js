(function () {
	'use strict';

	function rgbToHue(r, g, b) {
		var max = Math.max(Math.max(r, g), b);
		var min = Math.min(Math.min(r, g), b);
		var dist = max - min;
		if (dist === 0) {
			return 0;
		} else {
			switch (max) {
				case r:
					return (g - b) / dist * 60 + (g >= b ? 0 : 360);
				case g:
					return (b - r) / dist * 60 + 120;
				case b:
					return (r - g) / dist * 60 + 240;
			}
		}
	}

	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(Math.max(r, g), b);
		var min = Math.min(Math.min(r, g), b);
		var dist = max - min;
		var sum = max + min;
		var h, s, l;
		h = rgbToHue(r, g, b);
		l = sum / 2;
		if (sum === 0 || dist === 0) {
			s = 0;
		} else if (l <= 0.5) {
			s = dist / sum;
		} else {
			s = dist / (2 - sum);
		}
		return { h: h, s: s * 100, l: l * 100 };
	}

	function rgbToHsv(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(Math.max(r, g), b);
		var min = Math.min(Math.min(r, g), b);
		var h = rgbToHue(r, g, b);
		var s = max === 0 ? 0 : 1 - min / max;
		var v = max;
		return { h: h, s: s * 100, v: v * 100 };
	}

	function hueToRgb(m1, m2, h) {
		if (h < 0) h += 1;
		if (h > 1) h -= 1;
		if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
		if (h * 2 < 1) return m2;
		if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
		return m1;
	}

	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;
		var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
		var m1 = l * 2 - m2;
		var r = hueToRgb(m1, m2, h + 1 / 3) * 255;
		var g = hueToRgb(m1, m2, h) * 255;
		var b = hueToRgb(m1, m2, h - 1 / 3) * 255;
		return { r: r, g: g, b: b };
	}

	function hsvToRgb(h, s, v) {
		h %= 360;
		if (h < 0) h += 360;
		s /= 100;
		v /= 100;
		var hi = Math.floor(h / 60) % 6;
		var f = h / 60 - hi;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		var r, g, b;
		switch (hi) {
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}
		return {
			r: r * 255,
			g: g * 255,
			b: b * 255,
		}
	}

	var decimalPoint = 3;

	var vaildType = {
		'transparent': true,
		'keyword': true,
		'hex': true,
		'rgb': true,
		'rgbp': true,
		'hsl': true,
		'hsv': true
	};

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
	};
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

	function isMatch (val, name) {
		if (typeof val === 'undefined' || val === null) return null;
		return token[name].exec(val);
	}

	var keywords = {
		black: '000000',
		silver: 'c0c0c0',
		grey: '808080',
		gray: '808080',
		white: 'ffffff',
		maroon: '800000',
		red: 'ff0000',
		purple: '800080',
		fuchsia: 'ff00ff',
		green: '008000',
		lime: '00ff00',
		olive: '808000',
		yellow: 'ffff00',
		navy: '000080',
		blue: '0000ff',
		teal: '008080',
		aqua: '00ffff',
		orange: 'ffa500',
		aliceblue: 'f0f8ff',
		antiquewhite: 'faebd7',
		aquamarine: '7fffd4',
		azure: 'f0ffff',
		beige: 'f5f5dc',
		blanchedalmond: 'ffe4c4',
		bisque: 'ffe4c4',
		blueviolet: '8a2be2',
		brown: 'a52a2a',
		burlywood: 'deb887',
		cadetblue: '5f9ea0',
		chartreuse: '7fff00',
		chocolate: 'd2691e',
		coral: 'ff7f50',
		cornflowerblue: '6495ed',
		cornsilk: 'fff8dc',
		crimson: 'dc143c',
		darkblue: '00008b',
		darkcyan: '008b8b',
		darkgoldenrod: 'b8860b',
		darkgrey: 'a9a9a9',
		darkgray: 'a9a9a9',
		darkgreen: '006400',
		darkkhaki: 'bdb76b',
		darkmagenta: '8b008b',
		darkolivegreen: '556b2f',
		darkorange: 'ff8c00',
		darkorchid: '9932cc',
		darkred: '8b0000',
		darksalmon: 'e9967a',
		darkseagreen: '8fbc8f',
		darkslateblue: '483d8b',
		darkslategrey: '2f4f4f',
		darkslategray: '2f4f4f',
		darkturquoise: '00ced1',
		darkviolet: '9400d3',
		deeppink: 'ff1493',
		deepskyblue: '00bfff',
		dimgrey: '696969',
		dimgray: '696969',
		dodgerblue: '1e90ff',
		firebrick: 'b22222',
		floralwhite: 'fffaf0',
		forestgreen: '228b22',
		gainsboro: 'dcdcdc',
		ghostwhite: 'f8f8ff',
		gold: 'ffd700',
		goldenrod: 'daa520',
		greenyellow: 'adff2f',
		honeydew: 'f0fff0',
		hotpink: 'ff69b4',
		indianred: 'cd5c5c',
		indigo: '4b0082',
		ivory: 'fffff0',
		khaki: 'f0e68c',
		lavender: 'e6e6fa',
		lavenderblush: 'fff0f5',
		lawngreen: '7cfc00',
		lemonchiffon: 'fffacd',
		lightblue: 'add8e6',
		lightcoral: 'f08080',
		lightcyan: 'e0ffff',
		lightgoldenrodyellow: 'fafad2',
		lightgrey: 'd3d3d3',
		lightgray: 'd3d3d3',
		lightgreen: '90ee90',
		lightpink: 'ffb6c1',
		lightsalmon: 'ffa07a',
		lightseagreen: '20b2aa',
		lightskyblue: '87cefa',
		lightslategrey: '778899',
		lightslategray: '778899',
		lightsteelblue: 'b0c4de',
		lightyellow: 'ffffe0',
		limegreen: '32cd32',
		linen: 'faf0e6',
		mediumaquamarine: '66cdaa',
		mediumblue: '0000cd',
		mediumorchid: 'ba55d3',
		mediumpurple: '9370db',
		mediumseagreen: '3cb371',
		mediumslateblue: '7b68ee',
		mediumspringgreen: '00fa9a',
		mediumturquoise: '48d1cc',
		mediumvioletred: 'c71585',
		midnightblue: '191970',
		mintcream: 'f5fffa',
		mistyrose: 'ffe4e1',
		moccasin: 'ffe4b5',
		navajowhite: 'ffdead',
		oldlace: 'fdf5e6',
		olivedrab: '6b8e23',
		orangered: 'ff4500',
		orchid: 'da70d6',
		palegoldenrod: 'eee8aa',
		palegreen: '98fb98',
		paleturquoise: 'afeeee',
		palevioletred: 'db7093',
		papayawhip: 'ffefd5',
		peachpuff: 'ffdab9',
		peru: 'cd853f',
		pink: 'ffc0cb',
		plum: 'dda0dd',
		powderblue: 'b0e0e6',
		rosybrown: 'bc8f8f',
		royalblue: '4169e1',
		saddlebrown: '8b4513',
		salmon: 'fa8072',
		sandybrown: 'f4a460',
		seagreen: '2e8b57',
		seashell: 'fff5ee',
		sienna: 'a0522d',
		skyblue: '87ceeb',
		slateblue: '6a5acd',
		slategrey: '708090',
		slategray: '708090',
		snow: 'fffafa',
		springgreen: '00ff7f',
		steelblue: '4682b4',
		tan: 'd2b48c',
		thistle: 'd8bfd8',
		tomato: 'ff6347',
		turquoise: '40e0d0',
		violet: 'ee82ee',
		wheat: 'f5deb3',
		whitesmoke: 'f5f5f5',
		yellowgreen: '9acd32',
		rebeccapurple: '663399'
	};

	var hexKeywords = (function(source) {
		var key, result = {};
		for (key in source) {
			result[source[key]] = key;
		}
		return result;
	})(keywords);

	function colorParser (color, type) {
		if (typeof color === 'string') {
			return cp.string(color);
		}
		if (isArray(color)) {
			return cp.array(color, type);
		}
		if (typeof color === 'object') {
			return cp.object(color);
		}
	}
	var cp = colorParser;

	cp.rgbNumber = function (val) {
		if (isMatch(val, 'number')) ; else if (isMatch(val, 'percent')) {
			val = cp.percent(val) / 100 * 255;
		} else {
			val = 0;
		}
		return inRange(val, 0, 255);
	};

	cp.percent = function (val) {
		var num = typeof val === 'string' && val[val.length - 1] === '%' ? val.slice(0, -1) : val;
		return inRange(num, 0, 100);
	};

	cp.hue = function (val) {
		if (typeof val === 'string') {
			if (val.indexOf('deg') !== -1) {
				val = val.slice(0, -3);
			} else if (val.indexOf('grad') !== -1) {
				val = val.slice(0, -4) * 360 / 400;
			} else if (val.indexOf('rad') !== -1) {
				val = val.slice(0, -3) * 360 / 2 / Math.PI;
			} else if (val.indexOf('turn') !== -1) {
				val = val.slice(0, -4) * 360;
			}
		}
		var val = Number(val);
		return isNaN(val) ? 0 : val;
	};

	cp.hex = function (val) {
		return cp.rgbNumber(parseInt(val, 16));
	};

	cp.alpha = function (val) {
		if (typeof val === 'string' && val[val.length - 1] === '%') {
			val = cp.percent(val) / 100;
		}
		val = Number(val);
		if (isNaN(val)) {
			return 1;
		} else {
			return inRange(val, 0, 1);
		}
	};

	cp.string = function (color) {

		var match, arr, result;
		var pre = color.trim().slice(0, 3);

		if (color === 'transparent') {
			return {
				type: 'transparent',
				val: { r: 0, g: 0, b: 0, a: 0 }
			};
		} else if (color in keywords) {
			var keyhex = keywords[color];
			result = cp.array.hex([keyhex.slice(0, 2), keyhex.slice(2, 4), keyhex.slice(4, 6)]);
			result.type = 'keyword';
			return result;
		}

		if (pre === 'rgb') {
			if (match = isMatch(color, 'rgb')) {
				return cp.array.rgb(sliceMatch(match));
			} else if (match = isMatch(color, 'rgbp')) {
				result = cp.array.rgb(sliceMatch(match));
				result.type = 'rgbp';
				return result;
			}
		} else if (pre === 'hsl' && (match = isMatch(color, 'hsl'))) {
			return cp.array.hsl(sliceMatch(match));
		} else if ((pre === 'hsv' || pre === 'hsb') && (match = isMatch(color, 'hsv'))) {
			return cp.array.hsv(sliceMatch(match));
		} else if (match = isMatch(color, 'hex')) {
			arr = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)];
			if (color.length === 9) {
				arr.push(color.slice(7));
			}
			result = cp.array.hex(arr);
			result.type = 'hex';
			return result;
		} else if (match = isMatch(color, 'hexs')) {
			arr = [color[1] + color[1], color[2] + color[2], color[3] + color[3]];
			if (color.length === 5) {
				arr.push(color[4] + color[4]);
			}
			result = cp.array.hex(arr);
			result.type = 'hex';
			return result;
		}

		return nullColor();
	};

	function sliceMatch(match) {
		if (typeof match[4] === 'undefined') {
			return match.slice(1, 4);
		} else {
			return match.slice(1, 5);
		}
	}

	function vaildArray (func) {
		return function (color, type) {
			if (!isArray(color) || color.length < 3) {
				return nullColor();
			}
			return func(color, type);
		}
	}

	cp.array = vaildArray(function (color, type) {
		if (type === 'hsl') {
			return cp.array.hsl(color);
		} else if (type === 'hsv') {
			return cp.array.hsv(color);
		} else if (type === 'hex') {
			return cp.array.hex(color);
		} else {
			return cp.array.rgb(color);
		}
	});

	cp.array.hsl = vaildArray(function (color) {
		var obj = { h: color[0], s: color[1], l: color[2] };
		if (color.length > 3) {
			obj.a = color[3];
		}
		return cp.object.hsl(obj);
	});

	cp.array.hsv = vaildArray(function (color) {
		var obj = { h: color[0], s: color[1], v: color[2] };
		if (color.length > 3) {
			obj.a = color[3];
		}
		return cp.object.hsv(obj);
	});

	cp.array.hex = vaildArray(function (color) {
		var obj = { r: cp.hex(color[0]), g: cp.hex(color[1]), b: cp.hex(color[2]) };
		if (color.length > 3) {
			obj.a = cp.hex(color[3]) / 255;
		}
		return cp.object.rgb(obj);
	});

	cp.array.rgb = vaildArray(function (color) {
		var obj = { r: color[0], g: color[1], b: color[2] };
		if (color.length > 3) {
			obj.a = color[3];
		}
		return cp.object.rgb(obj);
	});


	function vaildObject (func) {
		return function (color) {
			if (typeof color !== 'object') {
				return nullColor();
			}
			return func(color);
		}
	}
	cp.object = vaildObject(function (color) {
		if (typeof color.r !== 'undefined') {
			return cp.object.rgb(color);
		} else if (typeof color.l !== 'undefined') {
			return cp.object.hsl(color);
		} else if (typeof color.v !== 'undefined') {
			return cp.object.hsv(color);
		}
		return nullColor();
	});

	cp.object.rgb = vaildObject(function (color) {
		var val;
		val = {
			r: cp.rgbNumber(color.r),
			g: cp.rgbNumber(color.g),
			b: cp.rgbNumber(color.b)
		};
		if (typeof val === 'undefined') {
			return nullColor();
		}
		val.a = cp.alpha(color.a);
		return {
			type: 'rgb',
			val: val
		}
	});

	cp.object.hsl = vaildObject(function (color) {
		var val;
		if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.l, 'unit')) {
			val = hslToRgb(cp.hue(color.h), cp.percent(color.s), cp.percent(color.l));
			val.a = cp.alpha(color.a);
			return {
				type: 'hsl',
				val: val
			};
		}
		return nullColor();
	});

	cp.object.hsv = vaildObject(function (color) {
		var val;
		if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.v, 'unit')) {
			val = hsvToRgb(cp.hue(color.h), cp.percent(color.s), cp.percent(color.v));
			val.a = cp.alpha(color.a);
			return {
				type: 'hsv',
				val: val
			};
		}
		return nullColor();
	});

	cp.to = {};

	cp.to.rgbNumber = function (n) {
		return Math.round(n);
	};

	cp.to.rgbpNumber = function (n) {
		return toFixed(n * 100 / 255, decimalPoint);
	};

	cp.to.alpha = function (n) {
		return toFixed(n, decimalPoint);
	};

	cp.to.hue = function (n) {
		return toFixed(n, decimalPoint);
	};

	cp.to.percent = function (n) {
		return toFixed(n, decimalPoint);
	};

	cp.to.rgb = function (r, g, b, a) {
		return a === 1 ?
		'rgb(' + cp.to.rgbNumber(r) + ',' + cp.to.rgbNumber(g) + ',' + cp.to.rgbNumber(b) + ')' :
		'rgba(' + cp.to.rgbNumber(r) + ',' + cp.to.rgbNumber(g) + ',' + cp.to.rgbNumber(b) + ',' + cp.to.alpha(a) + ')';
	};

	cp.to.rgbp = function (r, g, b, a) {
		return a === 1 ?
			'rgb(' + cp.to.rgbpNumber(r, decimalPoint) + '%,' + cp.to.rgbpNumber(g, decimalPoint) + '%,' + cp.to.rgbpNumber(b, decimalPoint) + '%)' :
			'rgba(' + cp.to.rgbpNumber(r, decimalPoint) + '%,' + cp.to.rgbpNumber(g, decimalPoint) + '%,' + cp.to.rgbpNumber(b, decimalPoint) + '%,' + cp.to.alpha(a) + ')';
	};

	cp.to.hsl = function (h, s, l, a) {
		return a === 1 ?
			'hsl(' + cp.to.hue(h) + ',' + cp.to.percent(s) + '%,' + cp.to.percent(l) + '%)' :
			'hsla(' + cp.to.hue(h) + ',' + cp.to.percent(s) + '%,' + cp.to.percent(l) + '%,' + cp.to.alpha(a) + ')';
	};

	cp.to.hsv = function (h, s, v, a) {
		return a === 1 ?
			'hsv(' + cp.to.hue(h) + ',' + cp.to.percent(s) + '%,' + cp.to.percent(v) + '%)' :
			'hsva(' + cp.to.hue(h) + ',' + cp.to.percent(s) + '%,' + cp.to.percent(v) + '%,' + cp.to.alpha(a) + ')';
	};

	cp.to.hex = function (r, g, b, a) {
		return a === 1 ?
			'#' + toHexString(r) + toHexString(g) + toHexString(b) :
			'#' + toHexString(r) + toHexString(g) + toHexString(b) + toHexString(a * 255);
	};

	cp.to.keyword = function (r, g, b) {
		var hex = toHexString(r) + toHexString(g) + toHexString(b);
		return hex in hexKeywords ? hexKeywords[hex] : '';
	};

	function nullColor () {
		return {
			type: 'hex',
			val: { r: 0, g: 0, b: 0, a: 1 }
		};
	}

	function isArray (o) {
		return Object.prototype.toString.apply(o) === '[object Array]';
	}

	function inRange (val, l, r) {
		var n = Number(val);
		if (isNaN(n)) return l;
		return Math.min(r, Math.max(l, n));
	}

	function toFixed (val, n) {
		n = Number('1e' + n);
		return Math.round(val * n) / n;
	}

	function toHexString (val) {
		var s = Math.round(val).toString(16);
		return s.length < 2 ? '0' + s : s;
	}

	function easycolor (color, options) {
		if (color instanceof easycolor) {
			return color.clone();
		}
		if (!(this instanceof easycolor)) {
			return new easycolor(color, options);
		}

		options = options || {};
		var opt = {};
		if (options.type in vaildType) {
			opt.type = options.type;
		}

		var result = colorParser(color, opt.type);
		if (result.type === 'rgb') {
			result.type = 'hex';
		}
		this._val = result.val;
		this._type = opt.type || result.type || 'hex';
	}

	easycolor.random = function () {
		return easycolor({
			r: Math.floor(Math.random() * 256),
			g: Math.floor(Math.random() * 256),
			b: Math.floor(Math.random() * 256),
		});
	};

	easycolor.interpolation = function (start, end, count) {
		if (!(start instanceof easycolor) ||
			!(end instanceof easycolor)
		) {
			throw new TypeError();
		}
		if (!count) return [];
		var colors = [start.clone()];
		if (count === 1) return colors;
		var step = divisionVector(subtractVector(end.getValue(), start.getValue()), count - 1);
		for (var i = 1; i <= count - 2; i++) {
			colors.push(easycolor(addVector(colors[colors.length - 1].getValue(), step)));
		}
		colors.push(end.clone());
		return colors;
	};

	easycolor.interpolation2d = function (tl, tr, bl, br, width, height) {
		if (!(tl instanceof easycolor) ||
			!(tr instanceof easycolor) ||
			!(bl instanceof easycolor) ||
			!(br instanceof easycolor)
		) {
			throw new TypeError();
		}
		if (!width || !height) return [];
		if (width === 1 && height === 1) return [[tl.clone()]];
		if (height === 1) {
			return [easycolor.interpolation(tl, br, width)];
		}
		if (width === 1) {
			return easycolor.interpolation(tl, br, height).map(function (item) {
				return [item];
			});
		}
		var lineHeads = easycolor.interpolation(tl, bl, height);
		var lineTails = easycolor.interpolation(tr, br, height);
		return lineHeads.map(function (item, index) {
			return easycolor.interpolation(lineHeads[index], lineTails[index], width);
		});
	};

	easycolor.mixAlpha = function (a, b) {
		var a1 = a.a, a2 = b.a;
		var color1 = a.getValue();
		var color2 = b.getValue();
		var alpha = a1 + a2 - a1 * a2;
		var rgb = divisionVector(addVector(multiplyVector(color1, a1), multiplyVector(color2, a2 * (1 - a1))), alpha);
		var val = {
			r: rgb[0],
			g: rgb[1],
			b: rgb[2],
			a: alpha
		};
		return easycolor(val);
	};

	[
		{ name: 'red', key: 'r' },
		{ name: 'r', key: 'r' },
		{ name: 'green', key: 'g' },
		{ name: 'g', key: 'g' },
		{ name: 'blue', key: 'b' },
		{ name: 'b', key: 'b' }
	].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item.name, {
			get: function () {
				return colorParser.to.rgbNumber(this._val[item.key]);
			},
			set: function (val) {
				this._val[item.key] = colorParser.rgbNumber(val);
			}
		});
	});

	['hue', 'h'].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item, {
			get: function () {
				var val = this._val;
				return colorParser.to.hue(rgbToHue(val.r, val.g, val.b));
			},
			set: function (val) {
				var old = this._val;
				var hsl = rgbToHsl(old.r, old.g, old.b);
				hsl.h = colorParser.hue(val);
				this._val = hslToRgb(hsl.h, hsl.s, hsl.l);
				this._val.a = old.a;
			}
		});
	});

	[
		{ name: 'sataratel', key: 'sl' },
		{ name: 'sl', key: 'sl' },
		{ name: 'light', key: 'l' },
		{ name: 'l', key: 'l' }
	].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item.name, {
			get: function () {
				var val = this._val;
				return colorParser.to.percent(rgbToHsl(val.r, val.g, val.b)[item.key === 'sl' ? 's' : item.key]);
			},
			set: function (val) {
				var old = this._val;
				var hsl = rgbToHsl(old.r, old.g, old.b);
				hsl[item.key === 'sl' ? 's' : item.key] = colorParser.percent(val);
				this._val = hslToRgb(hsl.h, hsl.s, hsl.l);
				this._val.a = old.a;
			}
		});
	});

	[
		{ name: 'sataratev', key: 'sv' },
		{ name: 'sv', key: 'sv' },
		{ name: 'bright', key: 'v' },
		{ name: 'v', key: 'v' }
	].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item.name, {
			get: function () {
				var val = this._val;
				return colorParser.to.percent(rgbToHsv(val.r, val.g, val.b)[item.key === 'sv' ? 's' : item.key]);
			},
			set: function (val) {
				var old = this._val;
				var hsv = rgbToHsv(old.r, old.g, old.b);
				hsv[item.key === 'sv' ? 's' : item.key] = colorParser.percent(val);
				this._val = hsvToRgb(hsv.h, hsv.s, hsv.v);
				this._val.a = old.a;
			}
		});
	});

	['alpha', 'a'].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item, {
			get: function () {
				return colorParser.to.alpha(this._val.a);
			},
			set: function (val) {
				this._val.a = colorParser.alpha(val);
			}
		});
	});

	simpleExtend(easycolor.prototype, {
		toString: function (oType) {
			var val = this._val;
			var type = (oType in vaildType && oType) || this._type;
			if (type === 'transparent') {
				if (val.a === 0) {
					return 'transparent';
				} else {
					type = 'hex';
				}
			}
			if (type === 'keyword') {
				if (val.a === 1) {
					var keyword = this.toKeyword();
					if (keyword) return keyword;
				}
				type = 'hex';
			}
			if (type === 'hex' && oType !== 'hex' && val.a !== 1) {
				type = 'rgb';
			}
			if (type === 'rgb') {
				return this.toRgbString();
			} else if (type === 'rgbp') {
				return this.toRgbPercentString();
			} else if (type === 'hsl') {
				return this.toHslString();
			} else if (type === 'hsv') {
				return this.toHsvString();
			} else if (type === 'hex') {
				return this.toHexString();
			}
			return '';
		},
		toRgbString: function () {
			var val = this._val;
			return colorParser.to.rgb(val.r, val.g, val.b, val.a);
		},
		toRgbPercentString: function () {
			var val = this._val;
			return colorParser.to.rgbp(val.r, val.g, val.b, val.a);
		},
		toHslString: function () {
			var val = this._val;
			var hsl = rgbToHsl(val.r, val.g, val.b);
			return colorParser.to.hsl(hsl.h, hsl.s, hsl.l, val.a);
		},
		toHsvString: function () {
			var val = this._val;
			var hsv = rgbToHsv(val.r, val.g, val.b);
			return colorParser.to.hsv(hsv.h, hsv.s, hsv.v, val.a);
		},
		toHexString: function () {
			var val = this._val;
			return colorParser.to.hex(val.r, val.g, val.b, val.a);
		},
		toKeyword: function () {
			var val = this._val;
			return colorParser.to.keyword(val.r, val.g, val.b);
		},

		getValue: function () {
			var val = this._val;
			return [val.r, val.g, val.b, val.a];
		},

		// todo: 可考虑换成ps的黑白算法https://blog.csdn.net/majinlei121/article/details/46372887
		grayed: function () {
			var val = this._val;
			var gray = val.r * 0.3 + val.g * 0.58 + val.b * 0.11;
			return easycolor({ r: gray, g: gray, b: gray, a: val.a });
		},
		inverting: function () {
			var val = this._val;
			return easycolor({ r: 255 - val.r, g: 255 - val.g, b: 255 - val.b });
		},

		interpolation: function (end, count) {
			return easycolor.interpolation(this, end, count);
		},
		interpolation2d: function (tr, bl, br, width, height) {
			return easycolor.interpolation2d(this, tr, bl, br, width, height);
		},
		mixAlpha: function (b) {
			return easycolor.mixAlpha(this, b);
		},

		clone: function () {
			return easycolor(this._val, {
				type: this._type
			});
		},
	});

	function simpleExtend (o1, o2) {
		var key;
		for (key in o2) {
			if (!o2.hasOwnProperty(key)) return;
			o1[key] = o2[key];
		}
	}

	function addVector(v1, v2) {
		return v1.map(function (item, index) {
			return v1[index] + v2[index];
		});
	}

	function subtractVector(v1, v2) {
		return v1.map(function (item, index) {
			return v1[index] - v2[index];
		});
	}

	function multiplyVector(v1, num) {
		return v1.map(function (item) {
			return item * num;
		});
	}

	function divisionVector(v1, num) {
		return v1.map(function (item) {
			return item / num;
		});
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = easycolor;
	} else {
		window.easycolor = easycolor;
	}

}());
