import { isMatch } from './CSSTokenReg';
import { rgbToHue, rgbToHsl, rgbToHsv, hueToRgb, hslToRgb, hsvToRgb } from './colorModeConvert';
import { keywords, hexKeywords } from './CSSKeywordColor';

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
	return Math.min(255, Math.max(0, Number(val)));
};

cp.percent = function (val) {
	var num = typeof val === 'string' && val[val.length - 1] === '%' ? val.slice(0, -1) : val;
	return Math.min(100, Math.max(0, Number(num)));
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
	return Number(val);
};

cp.hex = function (val) {
	return cp.rgbNumber(parseInt(val, 16));
};

cp.alpha = function (val) {
	if (val[val.length - 1] === '%') {
		val = cp.percent(val) / 100;
	}
	return Math.min(1, Math.max(0, Number(val)));
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
	if (isMatch(color.r, 'number') && isMatch(color.g, 'number') && isMatch(color.b, 'number')) {
		val = {
			r: cp.rgbNumber(color.r),
			g: cp.rgbNumber(color.g),
			b: cp.rgbNumber(color.b)
		};
	} else if (isMatch(color.r, 'percent') && isMatch(color.g, 'percent') && isMatch(color.b, 'percent')) {
		val = {
			r: cp.percent(color.r) / 100 * 255,
			g: cp.percent(color.g) / 100 * 255,
			b: cp.percent(color.b) / 100 * 255
		};
	}
	if (typeof val === 'undefined') {
		return nullColor();
	}
	val.a = isMatch(color.a, 'unit') ? cp.alpha(color.a) : 1;
	return {
		type: 'rgb',
		val: val
	}
});

cp.object.hsl = vaildObject(function (color) {
	var val;
	if (isMatch(color.h, 'hue') && isMatch(color.s, 'unit') && isMatch(color.l, 'unit')) {
		val = hslToRgb(cp.hue(color.h), cp.percent(color.s), cp.percent(color.l));
		val.a = isMatch(color.a, 'unit') ? cp.alpha(color.a) : 1;
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
		val.a = isMatch(color.a, 'unit') ? cp.alpha(color.a) : 1;
		return {
			type: 'hsv',
			val: val
		};
	}
	return nullColor();
});

function nullColor () {
	return {
		type: 'hex',
		val: { r: 0, g: 0, b: 0, a: 1 }
	};
}

function isArray (o) {
	return Object.prototype.toString.apply(o) === '[object Array]';
}

