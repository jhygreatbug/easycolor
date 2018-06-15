export function rgbToHue(r, g, b) {
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

export function rgbToHsl(r, g, b) {
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

export function rgbToHsv(r, g, b) {
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

export function hueToRgb(m1, m2, h) {
	if (h < 0) h += 1;
	if (h > 1) h -= 1;
	if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
	if (h * 2 < 1) return m2;
	if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
	return m1;
}

export function hslToRgb(h, s, l) {
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

export function hsvToRgb(h, s, v) {
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
