(function () {
	var decimalPoint = 3;
	function simpleExtend (o1, o2) {
		var key;
		for (key in o2) {
			if (!o2.hasOwnProperty(key)) return;
			o1[key] = o2[key];
		}
	}
	function isArray (o) {
		return Object.prototype.toString.apply(o) === '[object Array]';
	}
	function addVector(v1, v2) {
		return v1.map((item, index) => v1[index] + v2[index]);
	}

	function subtractVector(v1, v2) {
		return v1.map((item, index) => v1[index] - v2[index]);
	}

	function multiplyVector(v1, num) {
		return v1.map(item => item * num);
	}

	function divisionVector(v1, num) {
		return v1.map(item => item / num);
	}

	var vaildType = {
		'transparent': true,
		'keyword': true,
		'hex': true,
		'rgb': true,
		'hsl': true,
		'hsv': true
	};

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

	var sourceToken = {
		number: /(?:[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?)/,
		percent: /(?:number%)/,
		angle: /(?:number(?:deg|grad|rad|turn))/,
		unit: /(?:number|percent)/,
		hue: /(?:number|angle)/,
		rgb: /rgb\(\s*(number)[,\s]+(number)[,\s]+(number)\s*\)/,
		rgbpercent: /rgb\(\s*(percent)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		rgba: /rgba\(\s*(number)[,\s]+(number)[,\s]+(number)(?:[,\s]*\/[,\s]*|[,\s]+)(unit)\)/,
		rgbapercent: /rgba\(\s*(percent)[,\s]+(percent)[,\s]+(percent)(?:[,\s]*\/[,\s]*|[,\s]+)(unit)\)/,
		hsl: /hsl\(\s*(hue)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		hsla: /hsla\(\s*(hue)[,\s]+(percent)[,\s]+(percent)(?:[,\s]*\/[,\s]*|[,\s]+)(unit)\s*\)/,
		hsv: /hs(?:v|b)\(\s*(hue)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		hsva: /hs(?:v|b)a\(\s*(hue)[,\s]+(percent)[,\s]+(percent)(?:[,\s]*\/[,\s]*|[,\s]+)(unit)\s*\)/,
		hex1: /[0-9a-f]/,
		hex2: /[0-9a-f]{2}/,
		hex3: /#(hex1)(hex1)(hex1)/,
		hex4: /#(hex1)(hex1)(hex1)(hex1)/,
		hex6: /#(hex2)(hex2)(hex2)/,
		hex8: /#(hex2)(hex2)(hex2)(hex2)/,
	}
	var cacheToken = {
		number: sourceToken.number.source,
		hex1: sourceToken.hex1.source,
		hex2: sourceToken.hex2.source
	};
	var token = {};

	var replaceTokens = ['number', 'hex1', 'hex2', 'percent', 'angle', 'unit', 'hue'];

	for (key in sourceToken) {
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

	function parseRgbNumber (val) {
		return Math.min(255, Math.max(0, Number(val)));
	}

	function parsePercent (val) {
		var num = typeof val === 'string' && val[val.length - 1] === '%' ? val.slice(0, -1) : val;
		return Math.min(100, Math.max(0, Number(num)));
	}

	function parseHue (val) {
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
		return Number(val);
	}

	function parseHex (val) {
		return parseRgbNumber(parseInt(val, 16));
	}

	function parseAlpha (val) {
		if (val[val.length - 1] === '%') {
			val = parsePercent(val) / 100;
		}
		return Math.min(1, Math.max(0, Number(val)));
	}

	function toHexString (val) {
		var s = Math.round(val).toString(16);
		return s.length < 2 ? '0' + s : s;
	}

	function toFixed (val, n) {
		n = Number('1e' + n);
		return Math.round(val * n) / n;
	}

	function rgbToPercent (val, n) {
		return toFixed(val * 100 / 255, n);
	}

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
		var dist = max - min;
		var sum = max + min;
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
		if (typeof options.percentage !== 'undefined') {
			opt.percentage = Boolean(options.percentage);
		}

		var percentage = false;
		var val;
		var type;

		if (typeof color === 'string') {
			var match;
			if (color === 'transparent') {
				type = 'transparent';
				color = { r: 0, g: 0, b: 0, a: 0 };
			} else if (color in keywords) {
				type = 'keyword';
				color = keywords[color];
				color = { r: color.slice(0, 2), g: color.slice(2, 4), b: color.slice(4, 6) };
			} else if (match = isMatch(color, 'rgb')) {
				type = 'rgb';
				color = { r: match[1], g: match[2], b: match[3] };
			} else if (match = isMatch(color, 'rgbpercent')) {
				type = 'rgb';
				percentage = true;
				color = { r: match[1], g: match[2], b: match[3] };
			} else if (match = isMatch(color, 'rgba')) {
				type = 'rgb';
				color = { r: match[1], g: match[2], b: match[3], a: match[4] };
			} else if (match = isMatch(color, 'rgbapercent')) {
				type = 'rgb';
				percentage = true;
				color = { r: match[1], g: match[2], b: match[3], a: match[4] };
			} else if (match = isMatch(color, 'hex3')) {
				type = 'hex';
				color = { r: match[1] + match[1], g: match[2] + match[2], b: match[3] + match[3] };
			} else if (match = isMatch(color, 'hex6')) {
				type = 'hex';
				color = { r: match[1], g: match[2], b: match[3] };
			} else if (match = isMatch(color, 'hex4')) {
				type = 'hex';
				color = { r: match[1] + match[1], g: match[2] + match[2], b: match[3] + match[3], a: match[4] + match[4] };
			} else if (match = isMatch(color, 'hex8')) {
				type = 'hex';
				color = { r: match[1], g: match[2], b: match[3], a: match[4] };
			} else if (match = isMatch(color, 'hsl')) {
				type = 'hsl';
				color = { h: match[1], s: match[2], l: match[3] };
			} else if (match = isMatch(color, 'hsla')) {
				type = 'hsl';
				color = { h: match[1], s: match[2], l: match[3], a: match[4] };
			} else if (match = isMatch(color, 'hsv')) {
				type = 'hsv';
				color = { h: match[1], s: match[2], v: match[3] };
			} else if (match = isMatch(color, 'hsva')) {
				type = 'hsv';
				color = { h: match[1], s: match[2], v: match[3], a: match[4] };
			}
		}

		if (isArray(color) && color.length >= 3) {
			var arr = color;
			if (opt.type) {
				type = opt.type;
			} else {
				type = 'rgb';
			}
			if (type === 'hsl') {
				color = { h: arr[0], s: arr[1], l: arr[2] };
			} else if (type === 'hsv') {
				color = { h: arr[0], s: arr[1], v: arr[2] };
			} else {
				color = { r: arr[0], g: arr[1], b: arr[2] };
			}
			if (arr.length > 3) {
				color.a = arr[3];
			}
		}

		if (typeof type === 'undefined' && typeof color === 'object') {
			if (isMatch(color.r, 'number') && isMatch(color.g, 'number') && isMatch(color.b, 'number')) {
				type = 'rgb';
			} else if (isMatch(color.r, 'percent') && isMatch(color.g, 'percent') && isMatch(color.b, 'percent')) {
				type = 'rgb';
				percentage = true;
			} else if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.l, 'unit')) {
				type = 'hsl';
			} else if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.v, 'unit')) {
				type = 'hsv';
			}
		}

		if (type === 'transparent') {
			val = color;
		} else if (type === 'hex' || type === 'keyword') {
			val = {
				r: parseHex(color.r),
				g: parseHex(color.g),
				b: parseHex(color.b)
			}
			if (color.a) {
				color.a = parseHex(color.a) / 255;
			}
		} else if (type === 'rgb') {
			if (percentage === true) {
				val = {
					r: parsePercent(color.r) / 100 * 255,
					g: parsePercent(color.g) / 100 * 255,
					b: parsePercent(color.b) / 100 * 255
				};
			} else {
				val = {
					r: parseRgbNumber(color.r),
					g: parseRgbNumber(color.g),
					b: parseRgbNumber(color.b)
				};
			}
		} else if (type === 'hsl') {
			val = hslToRgb(parseHue(color.h), parsePercent(color.s), parsePercent(color.l));
		} else if (type === 'hsv') {
			val = hsvToRgb(parseHue(color.h), parsePercent(color.s), parsePercent(color.v));
		}
		if (typeof val === 'undefined') {
			val = { r: 0, g: 0, b: 0, a: 1 };
		} else {
			val.a = isMatch(color.a, 'unit') ? parseAlpha(color.a) : 1;
		}

		if (type === 'rgb' && !opt.type) {
			opt.type = 'hex';
		}
		this._val = val;
		this._type = opt.type || type || 'hex';
		this._percentage = typeof opt.percentage === 'undefined' ? percentage : Boolean(opt.percentage);
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
		for (let i = 1; i <= count - 2; i++) {
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
		}
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
				return Math.round(this._val[item.key]);
			},
			set: function (val) {
				if (isMatch(val, 'number')) {
					this._val[item.key] = parseRgbNumber(val);
				} else if (isMatch(val, 'percent')) {
					this._val[item.key] = parsePercent(val) / 100 * 255;
				} else {
					this._val[item.key] = 0;
				}
			},
		});
	});

	['hue', 'h'].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item, {
			get: function () {
				var val = this._val;
				return toFixed(rgbToHue(val.r, val.g, val.b), decimalPoint);
			},
			set: function (val) {
				var old = this._val;
				var hsl = rgbToHsl(old.r, old.g, old.b);
				if (isMatch(val, 'hue')) {
					hsl.h = parseHue(val);
				} else {
					hsl.h = 0;
				}
				this._val = hslToRgb(hsl.h, hsl.s, hsl.l);
				this._val.a = old.a;
			},
		});
	});

	[
		{ name: 'satarate', key: 's' },
		{ name: 's', key: 's' },
		{ name: 'light', key: 'l' },
		{ name: 'l', key: 'l' }
	].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item.name, {
			get: function () {
				var val = this._val;
				return toFixed(rgbToHsl(val.r, val.g, val.b)[item.key], decimalPoint);
			},
			set: function (val) {
				var old = this._val;
				var hsl = rgbToHsl(old.r, old.g, old.b);
				if (isMatch(val, 'unit')) {
					hsl[item.key] = parsePercent(val);
				} else {
					hsl[item.key] = 0;
				}
				this._val = hslToRgb(hsl.h, hsl.s, hsl.l);
				this._val.a = old.a;
			},
		});
	});

	['bright', 'v'].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item, {
			get: function () {
				var val = this._val;
				return toFixed(rgbToHsv(val.r, val.g, val.b).v, decimalPoint);
			},
			set: function (val) {
				var old = this._val;
				var hsv = rgbToHsv(old.r, old.g, old.b);
				if (isMatch(val, 'unit')) {
					hsv.v = parsePercent(val);
				} else {
					hsv.v = 0;
				}
				this._val = hsvToRgb(hsv.h, hsv.s, hsv.v);
				this._val.a = old.a;
			},
		});
	});

	['alpha', 'a'].forEach(function (item) {
		Object.defineProperty(easycolor.prototype, item, {
			get: function () {
				return toFixed(this._val.a, decimalPoint);
			},
			set: function (val) {
				if (isMatch(val, 'number')) {
					this._val.a = parseRgbNumber(val);
				} else if (isMatch(val, 'percent')) {
					this._val.a = parsePercent(val) / 100;
				} else {
					this._val.a = 1;
				}
			},
		});
	});

	simpleExtend(easycolor.prototype, {
		toString: function (oType) {
			var val = this._val;
			var type = (oType in vaildType && oType) || this._type;
			var percent = this._percentage;
			if (type === 'transparent') {
				if (val.a === 0) {
					return 'transparent';
				} else {
					type = 'hex';
				}
			}
			if (type === 'keyword') {
				var hex = toHexString(val.r) + toHexString(val.g) + toHexString(val.b);
				if (val.a !== 1 || !(hex in hexKeywords)) {
					type = 'hex';
				} else {
					return hexKeywords[hex];
				}
			}
			if (oType !== 'hex' && type === 'hex' && val.a !== 1) {
				type = 'rgb';
			}
			if (type === 'rgb') {
				return percent ? this.toRgbPercentString() : this.toRgbString();
			} else if (type === 'hsl') {
				return this.toHslString();
			} else if (type === 'hsv') {
				return this.toHsvString();
			} else if (type === 'hex') {
				return this.toHexString();
			}
		},
		toRgbString: function () {
			var val = this._val;
			return val.a === 1 ?
			'rgb(' + this.r + ',' + this.g + ',' + this.b + ')' :
			'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
		},
		toRgbPercentString: function () {
			var val = this._val;
			return val.a === 1 ?
				'rgb(' + rgbToPercent(val.r, decimalPoint) + '%,' + rgbToPercent(val.g, decimalPoint) + '%,' + rgbToPercent(val.b, decimalPoint) + '%)' :
				'rgba(' + rgbToPercent(val.r, decimalPoint) + '%,' + rgbToPercent(val.g, decimalPoint) + '%,' + rgbToPercent(val.b, decimalPoint) + '%,' + this.a + ')';
		},
		toHslString: function () {
			var val = this._val;
			var hsl = rgbToHsl(val.r, val.g, val.b);
			return val.a === 1 ?
				'hsl(' + toFixed(hsl.h, decimalPoint) + ',' + toFixed(hsl.s, decimalPoint) + '%,' + toFixed(hsl.l, decimalPoint) + '%)' :
				'hsla(' + toFixed(hsl.h, decimalPoint) + ',' + toFixed(hsl.s, decimalPoint) + '%,' + toFixed(hsl.l, decimalPoint) + '%,' + this.a + ')';
		},
		toHsvString: function () {
			var val = this._val;
			var hsv = rgbToHsv(val.r, val.g, val.b);
			return val.a === 1 ?
				'hsv(' + toFixed(hsv.h, decimalPoint) + ',' + toFixed(hsv.s, decimalPoint) + '%,' + toFixed(hsv.v, decimalPoint) + '%)' :
				'hsva(' + toFixed(hsv.h, decimalPoint) + ',' + toFixed(hsv.s, decimalPoint) + '%,' + toFixed(hsv.v, decimalPoint) + '%,' + this.a + ')';
		},
		toHexString: function () {
			var val = this._val;
			return val.a === 1 ?
				'#' + toHexString(val.r) + toHexString(val.g) + toHexString(val.b) :
				'#' + toHexString(val.r) + toHexString(val.g) + toHexString(val.b) + toHexString(val.a * 255);
		},
		toKeyword: function () {
			var val = this._val;
			var hex = toHexString(val.r) + toHexString(val.g) + toHexString(val.b);
			return hex in hexKeywords ? hexKeywords[hex] : '';
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
				type: this._type,
				percentage: this._percentage
			});
		},
	});

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = easycolor;
	} else {
		window.easycolor = easycolor;
	}

})();