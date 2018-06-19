import { isMatch } from './CSSTokenReg';
import { rgbToHue, rgbToHsl, rgbToHsv, hueToRgb, hslToRgb, hsvToRgb } from './colorModeConvert';
import { keywords, hexKeywords } from './CSSKeywordColor';
import { decimalPoint } from './const';

export function colorParser (color, type) {
	if (typeof color === 'string') {
		return cp.string(color);
	}
	if (isArray(color)) {
		return cp.array(color, type);
	}
	if (typeof color === 'object') {
		return cp.object(color);
	}
};

var cp = colorParser;

cp.rgbNumber = function (val) {
	if (isMatch(val, 'number')) {
	} else if (isMatch(val, 'percent')) {
		val = cp.percent(val) / 100 * 255;
	} else {
		val = 0;
	}
	return inRange(val, 0, 255);
};

cp.percent = function (val) {
	var num = typeof val === 'string' && val[val.length - 1] === '%' ? val.slice(0, -1) : val;
	return inRange(num, 0, 100);
}

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
		obj.a = color[3]
	}
	return cp.object.hsl(obj);
});

cp.array.hsv = vaildArray(function (color) {
	var obj = { h: color[0], s: color[1], v: color[2] };
	if (color.length > 3) {
		obj.a = color[3]
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
