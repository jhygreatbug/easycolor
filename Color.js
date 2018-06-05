(function () {
	function simpleExtend (o1, o2) {
		var key;
		for (key in o2) {
			if (!o2.hasOwnProperty(key)) return;
			o1[key] = o2[key];
		}
	}

	var keywords = {
		black: "000000",
		silver: "c0c0c0",
		gray: "808080",
		white: "ffffff",
		maroon: "800000",
		red: "ff0000",
		purple: "800080",
		fuchsia: "ff00ff",
		green: "008000",
		lime: "00ff00",
		olive: "808000",
		yellow: "ffff00",
		navy: "000080",
		blue: "0000ff",
		teal: "008080",
		aqua: "00ffff",
		orange: "ffa500",
		aliceblue: "f0f8ff",
		antiquewhite: "faebd7",
		aquamarine: "7fffd4",
		azure: "f0ffff",
		beige: "f5f5dc",
		bisque: "ffe4c4",
		blanchedalmond: "ffe4c4",
		blueviolet: "8a2be2",
		brown: "a52a2a",
		burlywood: "deb887",
		cadetblue: "5f9ea0",
		chartreuse: "7fff00",
		chocolate: "d2691e",
		coral: "ff7f50",
		cornflowerblue: "6495ed",
		cornsilk: "fff8dc",
		crimson: "dc143c",
		darkblue: "00008b",
		darkcyan: "008b8b",
		darkgoldenrod: "b8860b",
		darkgray: "a9a9a9",
		darkgreen: "006400",
		darkgrey: "a9a9a9",
		darkkhaki: "bdb76b",
		darkmagenta: "8b008b",
		darkolivegreen: "556b2f",
		darkorange: "ff8c00",
		darkorchid: "9932cc",
		darkred: "8b0000",
		darksalmon: "e9967a",
		darkseagreen: "8fbc8f",
		darkslateblue: "483d8b",
		darkslategray: "2f4f4f",
		darkslategrey: "2f4f4f",
		darkturquoise: "00ced1",
		darkviolet: "9400d3",
		deeppink: "ff1493",
		deepskyblue: "00bfff",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1e90ff",
		firebrick: "b22222",
		floralwhite: "fffaf0",
		forestgreen: "228b22",
		gainsboro: "dcdcdc",
		ghostwhite: "f8f8ff",
		gold: "ffd700",
		goldenrod: "daa520",
		greenyellow: "adff2f",
		grey: "808080",
		honeydew: "f0fff0",
		hotpink: "ff69b4",
		indianred: "cd5c5c",
		indigo: "4b0082",
		ivory: "fffff0",
		khaki: "f0e68c",
		lavender: "e6e6fa",
		lavenderblush: "fff0f5",
		lawngreen: "7cfc00",
		lemonchiffon: "fffacd",
		lightblue: "add8e6",
		lightcoral: "f08080",
		lightcyan: "e0ffff",
		lightgoldenrodyellow: "fafad2",
		lightgray: "d3d3d3",
		lightgreen: "90ee90",
		lightgrey: "d3d3d3",
		lightpink: "ffb6c1",
		lightsalmon: "ffa07a",
		lightseagreen: "20b2aa",
		lightskyblue: "87cefa",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "b0c4de",
		lightyellow: "ffffe0",
		limegreen: "32cd32",
		linen: "faf0e6",
		mediumaquamarine: "66cdaa",
		mediumblue: "0000cd",
		mediumorchid: "ba55d3",
		mediumpurple: "9370db",
		mediumseagreen: "3cb371",
		mediumslateblue: "7b68ee",
		mediumspringgreen: "00fa9a",
		mediumturquoise: "48d1cc",
		mediumvioletred: "c71585",
		midnightblue: "191970",
		mintcream: "f5fffa",
		mistyrose: "ffe4e1",
		moccasin: "ffe4b5",
		navajowhite: "ffdead",
		oldlace: "fdf5e6",
		olivedrab: "6b8e23",
		orangered: "ff4500",
		orchid: "da70d6",
		palegoldenrod: "eee8aa",
		palegreen: "98fb98",
		paleturquoise: "afeeee",
		palevioletred: "db7093",
		papayawhip: "ffefd5",
		peachpuff: "ffdab9",
		peru: "cd853f",
		pink: "ffc0cb",
		plum: "dda0dd",
		powderblue: "b0e0e6",
		rosybrown: "bc8f8f",
		royalblue: "4169e1",
		saddlebrown: "8b4513",
		salmon: "fa8072",
		sandybrown: "f4a460",
		seagreen: "2e8b57",
		seashell: "fff5ee",
		sienna: "a0522d",
		skyblue: "87ceeb",
		slateblue: "6a5acd",
		slategray: "708090",
		slategrey: "708090",
		snow: "fffafa",
		springgreen: "00ff7f",
		steelblue: "4682b4",
		tan: "d2b48c",
		thistle: "d8bfd8",
		tomato: "ff6347",
		turquoise: "40e0d0",
		violet: "ee82ee",
		wheat: "f5deb3",
		whitesmoke: "f5f5f5",
		yellowgreen: "9acd32",
		rebeccapurple: "663399"
	};

	var token = {
		number: /(?:[-+]?(?:(?:\d*\.\d+)|(?:\d+))(?:e[-+]?\d+)?)/,
		percent: /(?:number%)/,
		angle: /(?:number(?:deg|grad|rad|turn))/,
		unit: /(?:number|percent)/,
		hue: /(?:number|angle)/,
		rgb: /rgb\(\s*(number)[,\s]+(number)[,\s]+(number)\s*\)/,
		rgbpercent: /rgb\(\s*(percent)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		rgba: /rgba\(\s*(number)[,\s]+(number)[,\s]+(number)[,\s]+(unit)\)/,
		rgbapercent: /rgba\(\s*(percent)[,\s]+(percent)[,\s]+(percent)[,\s]+(unit)\)/,
		hsl: /hsl\(\s*(hue)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		hsla: /hsla\(\s*(hue)[,\s]+(percent)[,\s]+(percent)[,\s]+(unit)\s*\)/,
		hsv: /hsl\(\s*(hue)[,\s]+(percent)[,\s]+(percent)\s*\)/,
		hsva: /hsla\(\s*(hue)[,\s]+(percent)[,\s]+(percent)[,\s]+(unit)\s*\)/,
		hex1: /[0-9a-f]/,
		hex2: /[0-9a-f]{2}/,
		hex3: /#(hex1)(hex1)(hex1)/,
		hex4: /#(hex1)(hex1)(hex1)(hex1)/,
		hex6: /#(hex2)(hex2)(hex2)/,
		hex8: /#(hex2)(hex2)(hex2)(hex2)/,
	}

	var replaceTokens = ['number', 'hex1', 'hex2', 'percent', 'angle', 'unit', 'hue'];
	var finalTokens = ['number', 'hex1', 'hex2'];

	function replaceReg (regStr, name) {
		if (finalTokens.indexOf(name) >= 0) {
			return regStr;
		}
		return regStr.replace(new RegExp(replaceTokens.join('|'), 'g'), function (match) {
			return replaceReg(token[match].source, match);
		});
	}

	function getReg (name) {
		return new RegExp('^' + replaceReg(token[name].source, name) + '$', 'i');
	}

	function isMatch (val, name) {
		return getReg(name).exec(val);
	}

	function parseRgbNumber (val) {
		return Math.min(255, Math.max(0, Number(val)));
	}

	function parsePercent (val) {
		var num = isMatch(val, 'percent') ? val.slice(0, -1) : val;
		return Math.min(100, Math.max(0, Number(num)));
	}

	function parseUnit (val) {
		return isMatch(val, 'percent') ? parsePercent(val) : Number(val);
	}

	function parseHue (val) {
		return Number(val);
	}

	function parseHex (val) {
		return parseInt(val, 16);
	}

	function parseAlpha (val) {
		if (isMatch(val, 'percent')) {
			return parsePercent(val) / 100;
		} else {
			return Math.min(1, Math.max(0, Number(val)));
		}
	}

	function toHexString (val) {
		var s = parseInt(val, 16).toString();
		return s.length < 2 ? '0' + s : s;
	}

	function Color (color, options) {
		if (color instanceof Color) {
			return color.clone();
		}
		if (!(this instanceof Color)) {
			return new Color(color, options);
		}

		if (typeof color === 'string') {
			var match;
			if (color in keywords) {
				color = keywords[color];
				color = { r: color.slice(0, 1), g: color.slice(2, 3), b: color.slice(4, 5) };
			} else if (match = isMatch(color, 'rgb') || isMatch(color, 'rgbpercent')) {
				color = { r: match[1], g: match[2], b: match[3] };
			} else if (match = isMatch(color, 'rgba') || isMatch(color, 'rgbapercent')) {
				color = { r: match[1], g: match[2], b: match[3], a: match[4] };
			} else if (match = isMatch(color, 'hex3')) {
				color = { r: parseHex(match[1] + match[1]), g: parseHex(match[2] + match[2]), b: parseHex(match[3] + match[3]) };
			} else if (match = isMatch(color, 'hex6')) {
				color = { r: parseHex(match[1]), g: parseHex(match[2]), b: parseHex(match[3]) };
			} else if (match = isMatch(color, 'hex4')) {
				color = { r: parseHex(match[1] + match[1]), g: parseHex(match[2] + match[2]), b: parseHex(match[3] + match[3]), a: parseHex(match[4] + match[4]) / 255 };
			} else if (match = isMatch(color, 'hex8')) {
				color = { r: parseHex(match[1]), g: parseHex(match[2]), b: parseHex(match[3]), a: parseHex(match[4]) / 255 };
			} else if (match = isMatch(color, 'hsl')) {
				color = { h: match[1], s: match[2], l: match[3] };
			} else if (match = isMatch(color, 'hsla')) {
				color = { h: match[1], s: match[2], l: match[3], a: match[4] };
			} else if (match = isMatch(color, 'hsv')) {
				color = { h: match[1], s: match[2], v: match[3] };
			} else if (match = isMatch(color, 'hsva')) {
				color = { h: match[1], s: match[2], v: match[3], a: match[4] };
			}
		}

		if (typeof color === 'object') {
			var val = { r: 0, g: 0, b: 0 };
			var type = 'rgb';
			var percentage = false;
			if (isMatch(color.r, 'number') && isMatch(color.g, 'number') && isMatch(color.b, 'number')) {
				type = 'rgb';
				val = {
					r: parseRgbNumber(color.r),
					g: parseRgbNumber(color.g),
					b: parseRgbNumber(color.b)
				};
				if (val.r <= 1 && val.g <= 1 && val.b <= 1) {
					val.r *= 100;
					val.g *= 100;
					val.b *= 100;
					percentage = true;
				}
			} else if (isMatch(color.r, 'percent') && isMatch(color.g, 'percent') && isMatch(color.b, 'percent')) {
				type = 'rgb';
				val = {
					r: parsePercent(color.r),
					g: parsePercent(color.g),
					b: parsePercent(color.b)
				};
				percentage = true;
			} else if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.l, 'unit')) {
				type = 'hsl';
				val = {
					h: parseHue(color.h),
					s: parseUnit(color.s),
					l: parseUnit(color.l)
				};
				if (val.s <= 1 && isMatch(color.s, 'number')) {
					val.s *= 100;
				}
				if (val.l <= 1 && isMatch(color.l, 'number')) {
					val.l *= 100;
				}
			} else if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.v, 'unit')) {
				type = 'hsv';
				val = {
					h: parseHue(color.h),
					s: parseUnit(color.s),
					v: parseUnit(color.v)
				};
				if (val.s <= 1 && isMatch(color.s, 'number')) {
					val.s *= 100;
				}
				if (val.v <= 1 && isMatch(color.v, 'number')) {
					val.v *= 100;
				}
			}
			if (isMatch(color.a, 'unit')) {
				val.a = parseAlpha(color.a);
			}
		}
		this._type = type;
		this._val = val;
		this._percentage = percentage;
	}

	Color.random = function () {

	};

	Color.interpolation = function () {

	};

	Color.interpolation2d = function () {

	};

	Color.mix = function () {

	}

	simpleExtend(Color.prototype, {
		toString: function (oType) {
			var type = oType || this._type;
			var val = this._val;
			var percent = this._percentRgb;
			if (type === 'rgb') {
				if (percent) {
					return val.a === 1 ?
						'rgb(' + val.r + '%,' + val.g + '%,' + val.b + ')' :
						'rgba(' + val.r + '%,' + val.g + '%,' + val.b + ',' + val.a + ')';
				} else {
					return val.a === 1 ?
					'rgb(' + val.r + ',' + val.g + ',' + val.b + ')' :
					'rgba(' + val.r + ',' + val.g + ',' + val.b + ',' + val.a + ')';
				}
			} else if (type === 'hsl') {
				return val.a === 1 ?
					'hsl(' + val.h + ',' + val.s + '%,' + val.l + '%)' :
					'hsla(' + val.h + ',' + val.s + '%,' + val.l + '%,' + val.a + ')';
			} else if (type === 'hsv') {
				return val.a === 1 ?
					'hsv(' + val.h + ',' + val.s + '%,' + val.v + '%)' :
					'hsva(' + val.h + ',' + val.s + '%,' + val.v + '%,' + val.a + ')';
			} else if (type === 'hex') {
				return val.a === 1 ?
					'#' + toHexString(val.r) + toHexString(val.g) + toHexString(val.b) :
					'#' + toHexString(val.r) + toHexString(val.g) + toHexString(val.b) + toHexString(val.a * 255);
			}
		},

		red: function () {

		},
		setRed: function () {

		},
		green: function () {

		},
		setGreen: function () {

		},
		blue: function () {

		},
		setBlue: function () {

		},
		hue: function () {

		},
		setHue: function () {

		},
		satarate: function () {

		},
		setSataration: function () {

		},
		light: function () {

		},
		setLightness: function () {

		},
		bright: function () {

		},
		setBrightness: function () {

		},
		alpha: function () {

		},
		setAlpha: function () {

		},

		grayed: function () {

		},
		inverting: function () {

		},

		interpolation: function () {

		},
		interpolation2d: function () {

		},
		mix: function () {

		},

		clone: function () {

		},
	});

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Color;
	} else {
		window.Color = Color;
	}

})();
