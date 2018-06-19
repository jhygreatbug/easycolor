import { rgbToHue, rgbToHsl, rgbToHsv, hueToRgb, hslToRgb, hsvToRgb } from './colorModeConvert';
import { vaildType } from './const';
import { colorParser as cp } from './colorParser';

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

	var result = cp(color, opt.type);
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
			return cp.to.rgbNumber(this._val[item.key]);
		},
		set: function (val) {
			this._val[item.key] = cp.rgbNumber(val);
		}
	});
});

['hue', 'h'].forEach(function (item) {
	Object.defineProperty(easycolor.prototype, item, {
		get: function () {
			var val = this._val;
			return cp.to.hue(rgbToHue(val.r, val.g, val.b));
		},
		set: function (val) {
			var old = this._val;
			var hsl = rgbToHsl(old.r, old.g, old.b);
			hsl.h = cp.hue(val);
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
			return cp.to.percent(rgbToHsl(val.r, val.g, val.b)[item.key === 'sl' ? 's' : item.key]);
		},
		set: function (val) {
			var old = this._val;
			var hsl = rgbToHsl(old.r, old.g, old.b);
			hsl[item.key === 'sl' ? 's' : item.key] = cp.percent(val);
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
			return cp.to.percent(rgbToHsv(val.r, val.g, val.b)[item.key === 'sv' ? 's' : item.key]);
		},
		set: function (val) {
			var old = this._val;
			var hsv = rgbToHsv(old.r, old.g, old.b);
			hsv[item.key === 'sv' ? 's' : item.key] = cp.percent(val);
			this._val = hsvToRgb(hsv.h, hsv.s, hsv.v);
			this._val.a = old.a;
		}
	});
});

['alpha', 'a'].forEach(function (item) {
	Object.defineProperty(easycolor.prototype, item, {
		get: function () {
			return cp.to.alpha(this._val.a);
		},
		set: function (val) {
			this._val.a = cp.alpha(val);
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
		return cp.to.rgb(val.r, val.g, val.b, val.a);
	},
	toRgbPercentString: function () {
		var val = this._val;
		return cp.to.rgbp(val.r, val.g, val.b, val.a);
	},
	toHslString: function () {
		var val = this._val;
		var hsl = rgbToHsl(val.r, val.g, val.b);
		return cp.to.hsl(hsl.h, hsl.s, hsl.l, val.a);
	},
	toHsvString: function () {
		var val = this._val;
		var hsv = rgbToHsv(val.r, val.g, val.b);
		return cp.to.hsv(hsv.h, hsv.s, hsv.v, val.a);
	},
	toHexString: function () {
		var val = this._val;
		return cp.to.hex(val.r, val.g, val.b, val.a);
	},
	toKeyword: function () {
		var val = this._val;
		return cp.to.keyword(val.r, val.g, val.b);
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
