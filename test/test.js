var chai = require('chai');
var easycolor = require('../Color');
var should = chai.should();
describe('Input', function() {
	it('easycolor instance', function() {
		easycolor(easycolor({ r: 100, g: 100, b: 100, a: .5 })).toString().should.equal('rgba(100,100,100,0.5)');
	});
	it('Parse object', function() {
		easycolor({ r: 100, g: 100, b: 100, a: .5 }).toString().should.equal('rgba(100,100,100,0.5)');
		easycolor({ r: '100', g: '100', b: '100' }).getValue().should.deep.equal([100, 100, 100, 1]);
		easycolor({ r: '50%', g: '0%', b: '100%' }).getValue().should.deep.equal([127.5, 0, 255, 1]);
		easycolor({ h: 100, s: 50, l: 50 }).toString().should.equal('hsl(100,50%,50%)');
		easycolor({ h: '100', s: '50', l: '50' }).toString().should.equal('hsl(100,50%,50%)');
		easycolor({ h: 100, s: 50, v: 50 }).toString().should.equal('hsv(100,50%,50%)');
	});
	it('Parse Array', function() {
		easycolor([100, 100, 100]).toString().should.equal('#646464');
		easycolor([100, 100, 100], { type: 'hex'}).toString().should.equal('#ffffff');
		easycolor([100, 100, 100], { type: 'rgb'}).toString().should.equal('rgb(100,100,100)');
		easycolor([100, 50, 50], { type: 'hsl'}).toString().should.equal('hsl(100,50%,50%)');
		easycolor([100, 50, 50], { type: 'hsv'}).toString().should.equal('hsv(100,50%,50%)');
		easycolor([100, 100, 100, .2]).toString().should.equal('rgba(100,100,100,0.2)');
		easycolor([100, 50, 50, .2], { type: 'hsl'}).toString().should.equal('hsla(100,50%,50%,0.2)');
	});
	describe('Parse text', function() {
		it('CSS Number, CSS Percent and Unit', function() {
			easycolor({ r: '100', g: '200', b: '133' }).getValue().should.deep.equal([100, 200, 133, 1]);
			easycolor({ r: '1e1', g: '100e-1', b: '1e+1' }).getValue().should.deep.equal([10, 10, 10, 1], '科学计数法');
			easycolor({ h: '-100', s: 50, l: 50 }).h.should.equal(260, '带正号');
			easycolor({ h: '+100', s: 50, l: 50 }).h.should.equal(100, '带负号');

			easycolor({ r: '50.5%', g: '.6%', b: '0.6%' }).getValue().should.deep.equal([128.775, 1.53, 1.53, 1], '小数');
			easycolor({ r: '50.5%', g: '-.6%', b: '+.6%' }).getValue().should.deep.equal([128.775, 0, 1.53, 1], '带正负号的小数');

			easycolor({ h: 100, s: '-50%', l: 50 }).toString().should.equal('hsl(0,0%,50%)', '带负号');
		});
		it('Hue', function() {
			easycolor({ h: '100', s: 50, l: 50 }).h.should.equal(100);
			easycolor({ h: '100.5', s: 50, l: 50 }).h.should.equal(100.5, '小数');
			easycolor({ h: '100deg', s: 50, l: 50 }).h.should.equal(100, 'deg单位');
			easycolor({ h: '100grad', s: 50, l: 50 }).h.should.equal(90, 'grad单位');
			easycolor({ h: '2rad', s: 50, l: 50 }).h.should.equal(114.592, 'rad单位');
			easycolor({ h: '0.5turn', s: 50, l: 50 }).h.should.equal(180, 'turn单位');
		});
		it('Alpha', function() {
			easycolor({ r: 100, g: 100, b: 100, a: '0.5' }).a.should.equal(0.5);
			easycolor({ r: 100, g: 100, b: 100, a: '-0.5' }).a.should.equal(0, '小于0置为0');
			easycolor({ r: 100, g: 100, b: 100, a: '1.5' }).a.should.equal(1, '大于1置为1');
			easycolor({ r: 100, g: 100, b: 100, a: '50%' }).a.should.equal(0.5, '支持百分比');
			easycolor({ r: 100, g: 100, b: 100, a: 'awgwef' }).a.should.equal(1, '非数字');
		});
		it('RGB & RGBa', function() {
			easycolor('rgb(100,200,133)').toString().should.equal('rgb(100,200,133)');
			easycolor('rgb( 100	, 200,133	)').toString().should.equal('rgb(100,200,133)', '多余空白符');
			easycolor('rgb( 100	200 133	)').toString().should.equal('rgb(100,200,133)', '支持空白符分隔');

			easycolor('rgb(50%,200%,80.5%)').toString().should.equal('rgb(50%,100%,80.5%)', '支持百分比');
			easycolor('rgb(50%	,200%,80.5%  )').toString().should.equal('rgb(50%,100%,80.5%)', '百分比+多余空白符');

			easycolor('rgba(100,200,133,.5)').toString().should.equal('rgba(100,200,133,0.5)');
			easycolor('rgba(100,200,133 , .5)').toString().should.equal('rgba(100,200,133,0.5)');
			easycolor('rgba(100 200 133 .5)').toString().should.equal('rgba(100,200,133,0.5)');
			easycolor('rgba(100 200 133/.5)').toString().should.equal('rgba(100,200,133,0.5)');
			easycolor('rgba(100 200 133 / .5)').toString().should.equal('rgba(100,200,133,0.5)');
			easycolor('rgba(50%,200%,80.5%,50%)').toString().should.equal('rgba(50%,100%,80.5%,0.5)');

			easycolor('rgb(-100,266,133)').toString().should.equal('rgb(0,255,133)', '小于0置为0；大于255置为255');
			easycolor('rgb(100.1,200.5,133.6)').toString().should.equal('rgb(100,201,134)', '小数部分四舍五入');
			easycolor('rgb( 100	200% 133	)').toString().should.equal('#000000', '不支持百分比和数字混合');
		});
		it('HSL & HSLa', function() {
			easycolor('hsl(100,50%,50%)').toString().should.equal('hsl(100,50%,50%)');
			easycolor('hsl( 100	, 50%,50%	)').toString().should.equal('hsl(100,50%,50%)', '多余空白符');
			easycolor('hsl( 100	50% 50%	)').toString().should.equal('hsl(100,50%,50%)', '支持空白符分隔');

			easycolor('hsla(100,50%,50%,.5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			easycolor('hsla(100,50%,50% , .5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			easycolor('hsla(100 50% 50%  .5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			easycolor('hsla(100 50% 50%/.5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			easycolor('hsla(100 50% 50% / .5)').toString().should.equal('hsla(100,50%,50%,0.5)');

			easycolor('hsl(-100,50%,50%)').toString().should.equal('hsl(260,50%,50%)', 'hue可为任意数字');
			easycolor('hsl(0,-50%,150%)').toString().should.equal('hsl(0,0%,100%)', 'sl小于0置为0；大于100置为100');
			easycolor('hsl(100,50%,50)').toString().should.equal('#000000', 'sl不支持数字');
		});
		it('HSV & HSVa', function() {
			easycolor('hsv(100,50%,50%)').toString().should.equal('hsv(100,50%,50%)');
			easycolor('hsb(100,50%,50%)').toString().should.equal('hsv(100,50%,50%)');
			easycolor('hsv( 100	, 50%,50%	)').toString().should.equal('hsv(100,50%,50%)', '多余空白符');
			easycolor('hsv( 100	50% 50%	)').toString().should.equal('hsv(100,50%,50%)', '支持空白符分隔');

			easycolor('hsva(100,50%,50%,.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			easycolor('hsba(100,50%,50%,.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			easycolor('hsva(100,50%,50% , .5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			easycolor('hsva(100 50% 50%  .5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			easycolor('hsva(100 50% 50%/.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			easycolor('hsva(100 50% 50% / .5)').toString().should.equal('hsva(100,50%,50%,0.5)');

			easycolor('hsv(-100,50%,50%)').toString().should.equal('hsv(260,50%,50%)', 'hue可为任意数字');
			easycolor('hsv(0,-50%,150%)').toString().should.equal('hsv(0,0%,100%)', 'sv小于0置为0；大于100置为100');
			easycolor('hsv(100,50%,50)').toString().should.equal('#000000', 'sv不支持数字');
		});
		it('HEX', function() {
			easycolor('#abc').toString().should.equal('#aabbcc', '简写hex');
			easycolor('#abcc').toString().should.equal('rgba(170,187,204,0.8)', '简写hex8');
			easycolor('#aabbcc').toString().should.equal('#aabbcc', 'hex');
			easycolor('#aabbcccc').toString().should.equal('rgba(170,187,204,0.8)', 'hex8');

			easycolor('#abcde').toString().should.equal('#000000', '无效的hex');
			easycolor('#abg').toString().should.equal('#000000', '无效的hex');
		});
		it('Transparent', function() {
			easycolor('transparent').toString().should.equal('transparent');
		})
		it('Keyword', function() {
			easycolor('black').toString().should.equal('black');
			easycolor('silver').toString().should.equal('silver');
			easycolor('gray').toString().should.equal('gray');
			easycolor('white').toString().should.equal('white');
			easycolor('maroon').toString().should.equal('maroon');
			easycolor('red').toString().should.equal('red');
			easycolor('purple').toString().should.equal('purple');
			easycolor('fuchsia').toString().should.equal('fuchsia');
			easycolor('green').toString().should.equal('green');
			easycolor('lime').toString().should.equal('lime');
			easycolor('olive').toString().should.equal('olive');
			easycolor('yellow').toString().should.equal('yellow');
			easycolor('navy').toString().should.equal('navy');
			easycolor('blue').toString().should.equal('blue');
			easycolor('teal').toString().should.equal('teal');
			easycolor('aqua').toString().should.equal('aqua');
			easycolor('orange').toString().should.equal('orange');
			easycolor('aliceblue').toString().should.equal('aliceblue');
			easycolor('antiquewhite').toString().should.equal('antiquewhite');
			easycolor('aquamarine').toString().should.equal('aquamarine');
			easycolor('azure').toString().should.equal('azure');
			easycolor('beige').toString().should.equal('beige');
			easycolor('bisque').toString().should.equal('bisque');
			easycolor('blanchedalmond').toString().should.equal('bisque');
			easycolor('blueviolet').toString().should.equal('blueviolet');
			easycolor('brown').toString().should.equal('brown');
			easycolor('burlywood').toString().should.equal('burlywood');
			easycolor('cadetblue').toString().should.equal('cadetblue');
			easycolor('chartreuse').toString().should.equal('chartreuse');
			easycolor('chocolate').toString().should.equal('chocolate');
			easycolor('coral').toString().should.equal('coral');
			easycolor('cornflowerblue').toString().should.equal('cornflowerblue');
			easycolor('cornsilk').toString().should.equal('cornsilk');
			easycolor('crimson').toString().should.equal('crimson');
			easycolor('darkblue').toString().should.equal('darkblue');
			easycolor('darkcyan').toString().should.equal('darkcyan');
			easycolor('darkgoldenrod').toString().should.equal('darkgoldenrod');
			easycolor('darkgray').toString().should.equal('darkgray');
			easycolor('darkgreen').toString().should.equal('darkgreen');
			easycolor('darkgrey').toString().should.equal('darkgray');
			easycolor('darkkhaki').toString().should.equal('darkkhaki');
			easycolor('darkmagenta').toString().should.equal('darkmagenta');
			easycolor('darkolivegreen').toString().should.equal('darkolivegreen');
			easycolor('darkorange').toString().should.equal('darkorange');
			easycolor('darkorchid').toString().should.equal('darkorchid');
			easycolor('darkred').toString().should.equal('darkred');
			easycolor('darksalmon').toString().should.equal('darksalmon');
			easycolor('darkseagreen').toString().should.equal('darkseagreen');
			easycolor('darkslateblue').toString().should.equal('darkslateblue');
			easycolor('darkslategray').toString().should.equal('darkslategray');
			easycolor('darkslategrey').toString().should.equal('darkslategray');
			easycolor('darkturquoise').toString().should.equal('darkturquoise');
			easycolor('darkviolet').toString().should.equal('darkviolet');
			easycolor('deeppink').toString().should.equal('deeppink');
			easycolor('deepskyblue').toString().should.equal('deepskyblue');
			easycolor('dimgray').toString().should.equal('dimgray');
			easycolor('dimgrey').toString().should.equal('dimgray');
			easycolor('dodgerblue').toString().should.equal('dodgerblue');
			easycolor('firebrick').toString().should.equal('firebrick');
			easycolor('floralwhite').toString().should.equal('floralwhite');
			easycolor('forestgreen').toString().should.equal('forestgreen');
			easycolor('gainsboro').toString().should.equal('gainsboro');
			easycolor('ghostwhite').toString().should.equal('ghostwhite');
			easycolor('gold').toString().should.equal('gold');
			easycolor('goldenrod').toString().should.equal('goldenrod');
			easycolor('greenyellow').toString().should.equal('greenyellow');
			easycolor('grey').toString().should.equal('gray');
			easycolor('honeydew').toString().should.equal('honeydew');
			easycolor('hotpink').toString().should.equal('hotpink');
			easycolor('indianred').toString().should.equal('indianred');
			easycolor('indigo').toString().should.equal('indigo');
			easycolor('ivory').toString().should.equal('ivory');
			easycolor('khaki').toString().should.equal('khaki');
			easycolor('lavender').toString().should.equal('lavender');
			easycolor('lavenderblush').toString().should.equal('lavenderblush');
			easycolor('lawngreen').toString().should.equal('lawngreen');
			easycolor('lemonchiffon').toString().should.equal('lemonchiffon');
			easycolor('lightblue').toString().should.equal('lightblue');
			easycolor('lightcoral').toString().should.equal('lightcoral');
			easycolor('lightcyan').toString().should.equal('lightcyan');
			easycolor('lightgoldenrodyellow').toString().should.equal('lightgoldenrodyellow');
			easycolor('lightgray').toString().should.equal('lightgray');
			easycolor('lightgreen').toString().should.equal('lightgreen');
			easycolor('lightgrey').toString().should.equal('lightgray');
			easycolor('lightpink').toString().should.equal('lightpink');
			easycolor('lightsalmon').toString().should.equal('lightsalmon');
			easycolor('lightseagreen').toString().should.equal('lightseagreen');
			easycolor('lightskyblue').toString().should.equal('lightskyblue');
			easycolor('lightslategray').toString().should.equal('lightslategray');
			easycolor('lightslategrey').toString().should.equal('lightslategray');
			easycolor('lightsteelblue').toString().should.equal('lightsteelblue');
			easycolor('lightyellow').toString().should.equal('lightyellow');
			easycolor('limegreen').toString().should.equal('limegreen');
			easycolor('linen').toString().should.equal('linen');
			easycolor('mediumaquamarine').toString().should.equal('mediumaquamarine');
			easycolor('mediumblue').toString().should.equal('mediumblue');
			easycolor('mediumorchid').toString().should.equal('mediumorchid');
			easycolor('mediumpurple').toString().should.equal('mediumpurple');
			easycolor('mediumseagreen').toString().should.equal('mediumseagreen');
			easycolor('mediumslateblue').toString().should.equal('mediumslateblue');
			easycolor('mediumspringgreen').toString().should.equal('mediumspringgreen');
			easycolor('mediumturquoise').toString().should.equal('mediumturquoise');
			easycolor('mediumvioletred').toString().should.equal('mediumvioletred');
			easycolor('midnightblue').toString().should.equal('midnightblue');
			easycolor('mintcream').toString().should.equal('mintcream');
			easycolor('mistyrose').toString().should.equal('mistyrose');
			easycolor('moccasin').toString().should.equal('moccasin');
			easycolor('navajowhite').toString().should.equal('navajowhite');
			easycolor('oldlace').toString().should.equal('oldlace');
			easycolor('olivedrab').toString().should.equal('olivedrab');
			easycolor('orangered').toString().should.equal('orangered');
			easycolor('orchid').toString().should.equal('orchid');
			easycolor('palegoldenrod').toString().should.equal('palegoldenrod');
			easycolor('palegreen').toString().should.equal('palegreen');
			easycolor('paleturquoise').toString().should.equal('paleturquoise');
			easycolor('palevioletred').toString().should.equal('palevioletred');
			easycolor('papayawhip').toString().should.equal('papayawhip');
			easycolor('peachpuff').toString().should.equal('peachpuff');
			easycolor('peru').toString().should.equal('peru');
			easycolor('pink').toString().should.equal('pink');
			easycolor('plum').toString().should.equal('plum');
			easycolor('powderblue').toString().should.equal('powderblue');
			easycolor('rosybrown').toString().should.equal('rosybrown');
			easycolor('royalblue').toString().should.equal('royalblue');
			easycolor('saddlebrown').toString().should.equal('saddlebrown');
			easycolor('salmon').toString().should.equal('salmon');
			easycolor('sandybrown').toString().should.equal('sandybrown');
			easycolor('seagreen').toString().should.equal('seagreen');
			easycolor('seashell').toString().should.equal('seashell');
			easycolor('sienna').toString().should.equal('sienna');
			easycolor('skyblue').toString().should.equal('skyblue');
			easycolor('slateblue').toString().should.equal('slateblue');
			easycolor('slategray').toString().should.equal('slategray');
			easycolor('slategrey').toString().should.equal('slategray');
			easycolor('snow').toString().should.equal('snow');
			easycolor('springgreen').toString().should.equal('springgreen');
			easycolor('steelblue').toString().should.equal('steelblue');
			easycolor('tan').toString().should.equal('tan');
			easycolor('thistle').toString().should.equal('thistle');
			easycolor('tomato').toString().should.equal('tomato');
			easycolor('turquoise').toString().should.equal('turquoise');
			easycolor('violet').toString().should.equal('violet');
			easycolor('wheat').toString().should.equal('wheat');
			easycolor('whitesmoke').toString().should.equal('whitesmoke');
			easycolor('yellowgreen').toString().should.equal('yellowgreen');
			easycolor('rebeccapurple').toString().should.equal('rebeccapurple');
		});
	});
});

describe('Output', function() {
	it('toRgbString', function() {
		var rgb = easycolor('rgb(100,100,100)');
		var rgbp = easycolor('rgb(20%,20%,20%)');
		rgb.toRgbString().should.equal('rgb(100,100,100)');
		rgb.a = .2;
		rgb.toRgbString().should.equal('rgba(100,100,100,0.2)');
		rgbp.toRgbString().should.equal('rgb(20%,20%,20%)');
		rgbp.a = .2;
		rgbp.toRgbString().should.equal('rgba(20%,20%,20%,0.2)');

		easycolor('rgb(20.0001%,20.001%,20.50000%)').toRgbString().should.equal('rgb(20%,20.001%,20.5%)', '保留3位小数');
		easycolor('#abc').toRgbString().should.equal('rgb(170,187,204)');
	});
	it('toHslString', function() {
		var hsl = easycolor('hsl(100,50%,50%)');
		hsl.toHslString().should.equal('hsl(100,50%,50%)');
		hsl.a = .2;
		hsl.toHslString().should.equal('hsla(100,50%,50%,0.2)');

		easycolor('hsl(100.0001,20.001%,20.50000%)').toHslString().should.equal('hsl(100,20.001%,20.5%)', '保留3位小数');
	});
	it('toHsvString', function() {
		var hsl = easycolor('hsv(100,50%,50%)');
		hsl.toHsvString().should.equal('hsv(100,50%,50%)');
		hsl.a = .2;
		hsl.toHsvString().should.equal('hsva(100,50%,50%,0.2)');

		easycolor('hsv(100.0001,20.001%,20.50000%)').toHsvString().should.equal('hsv(100,20.001%,20.5%)', '保留3位小数');
	});
	it('toHexString', function() {
		var hex = easycolor('#abc');
		hex.toHexString().should.equal('#aabbcc');
		hex.a = .2;
		hex.toHexString().should.equal('#aabbcc33');
		hex.r = 170.5;
		hex.toHexString().should.equal('#abbbcc33');
		hex.r = 170.4;
		hex.toHexString().should.equal('#aabbcc33');
	});
	it('toKeyword', function() {
		var color = easycolor('silver');
		color.toKeyword().should.equal('silver');
		color.r = 0;
		color.toKeyword().should.equal('');
		color.g = 0; color.b = 0;
		color.toKeyword().should.equal('black');
	});
	describe('toString', function() {
		it('Transparent', function () {
			var color = easycolor('transparent');
			color.toString().should.equal('transparent');
			color.a = .5;
			color.toString().should.equal('rgba(0,0,0,0.5)');
		});
		it('Keyword', function() {
			var color1 = easycolor('silver');
			var color2 = easycolor('silver');
			color1.toString().should.equal('silver');
			color1.r = 100;
			color1.toString().should.equal('#64c0c0');
			color1.toKeyword().should.equal('');
			color2.a = .2;
			color2.toString().should.equal('rgba(192,192,192,0.2)');
			color2.toKeyword().should.equal('silver');
		});
		it('RGB', function() {
			var rgb = easycolor('rgb(100,100,100)');
			rgb.toString().should.equal('rgb(100,100,100)');
			rgb.h = 100;
			rgb.toString().should.equal('rgb(100,100,100)');
		});
		it('HSL', function() {
			var hsl = easycolor('hsl(100,50%,50%)');
			hsl.toString().should.equal('hsl(100,50%,50%)');
			hsl.r = 100;
			hsl.toString().should.equal('hsl(102.941,50%,50%)');
		});
		it('HSV', function() {
			var hsv = easycolor('hsv(100,50%,50%)');
			hsv.toString().should.equal('hsv(100,50%,50%)');
			hsv.r = 100;
			hsv.toString().should.equal('hsv(85.882,50%,50%)');
		});
		it('Hex', function() {
			var hex = easycolor('#abc');
			hex.toString().should.equal('#aabbcc');
			hex.a = .2;
			hex.toString().should.equal('rgba(170,187,204,0.2)');
		});
		it('指定输出类型', function() {
			easycolor('rgb(100,100,100)').toString('hex').should.equal('#646464');
			var color = easycolor('#abc');
			color.toString('transparent').should.equal('#aabbcc');
			color.toString('keyword').should.equal('#aabbcc');
			color.toString('rgb').should.equal('rgb(170,187,204)');
			color.toString('hsl').should.equal('hsl(210,25%,73.333%)');
			color.toString('hsv').should.equal('hsv(210,16.667%,80%)');
			color.toString('wag').should.equal('#aabbcc');
			color.a = .2;
			color.toString('hex').should.equal('#aabbcc33');
		});
	});
});

describe('Modify', function() {
	var modify = [{
		describe: 'RGB',
		it: [
			{ name: 'Red', longKey: 'red', shortKey: 'r' },
			{ name: 'Green', longKey: 'green', shortKey: 'g' },
			{ name: 'Blue', longKey: 'blue', shortKey: 'b' }
		],
		case: [[100, 100], ['20%', 51], ['agr', 0]]
	}, {
		describe: 'Hue',
		it: [
			{ name: 'Hue', longKey: 'hue', shortKey: 'h' }
		],
		case: [[100, 100], ['20%', 0]]
	}, {
		describe: 'Satarate, light and bright',
		it: [
			{ name: 'Satarate', longKey: 'satarate', shortKey: 's' },
			{ name: 'Light', longKey: 'light', shortKey: 'l' },
			{ name: 'Bright', longKey: 'bright', shortKey: 'v' }
		],
		case: [[50, 50], ['20%', 20], ['aweg', 0]]
	}];
	modify.forEach(function(desc) {
		describe(desc.describe, function() {
			desc.it.forEach(function(item) {
				it(item.name, function() {
					var color = easycolor('#0ac3');
					color[item.longKey] = desc.case[0][0];
					color[item.shortKey].should.equal(desc.case[0][1], item.longKey + '和' + item.shortKey + '对应同一数据');
					color.a.should.equal(0.2, 'Alpha不应被修改');
					desc.case.forEach(function(cItem) {
						var color2 = easycolor('#0ac3');
						color2[item.longKey] = cItem[0];
						color2[item.longKey].should.equal(cItem[1]);
					});
				});
			});
		});
	});
	it('Alpha', function() {
		var color = easycolor('#000');
		color.alpha = .5;
		color.a.should.equal(.5, 'Alpha和a对应同一数据');
		color.alpha = '30%';
		color.a.should.equal(.3);
		color.alpha = 'wagarg';
		color.a.should.equal(1);
	});
});

describe('Functions', function() {
	it('random', function() {
		easycolor.random().toString().should.not.equal('#000000');
		easycolor.random().toString().should.not.equal(easycolor.random().toString());
	});
	it('interpolation', function() {
		var start = easycolor('#0000');
		var end = easycolor('#fff');
		var result = 'rgba(0,0,0,0),rgba(85,85,85,0.333),rgba(170,170,170,0.667),#ffffff';
		easycolor.interpolation(start, end, 4).join(',').should.equal(result);
		start.interpolation(end, 4).join(',').should.equal(result);
		easycolor.interpolation(start, end).join(',').should.equal('');
		easycolor.interpolation(start, end, 1).join(',').should.equal('rgba(0,0,0,0)');
		var colors = easycolor.interpolation(start, end, 2);
		colors[0].should.not.equal(start);
		colors[1].should.not.equal(end);

	});
	it('interpolation2d', function() {
		var tl = easycolor('#000');
		var tr = easycolor('#0f0');
		var bl = easycolor('#f00');
		var br = easycolor('#ff0');
		var result = '#000000,#005500,#00aa00,#00ff00|#550000,#555500,#55aa00,#55ff00|#aa0000,#aa5500,#aaaa00,#aaff00|#ff0000,#ff5500,#ffaa00,#ffff00';
		var parseToString = function(arr) {
			return arr.map(function(item) { return item.join(','); }).join('|');
		}

		parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 4)).should.equal(result);
		parseToString(tl.interpolation2d(tr, bl, br, 4, 4)).should.equal(result);

		parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 1)).should.equal('#000000,#555500,#aaaa00,#ffff00');
		parseToString(easycolor.interpolation2d(tl, tr, bl, br, 1, 4)).should.equal('#000000|#555500|#aaaa00|#ffff00');

		var oneHAndOneW = easycolor.interpolation2d(tl, tr, bl, br, 1, 1);
		parseToString(oneHAndOneW).should.equal('#000000');
		oneHAndOneW[0][0].should.not.equal(tl);

		parseToString(easycolor.interpolation2d(tl, tr, bl, br)).should.equal('');
		parseToString(easycolor.interpolation2d(tl, tr, bl, br, 0, 4)).should.equal('');
		parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 0)).should.equal('');
	});
	it('mixAlpha', function() {
		easycolor.mixAlpha(easycolor('#000'), easycolor('#fff')).toString().should.equal('#000000');
		easycolor.mixAlpha(easycolor('#f003'), easycolor('#0f0')).toString().should.equal('#33cc00');
		easycolor.mixAlpha(easycolor('#f003'), easycolor('#0f0c')).toString().should.equal('rgba(61,194,0,0.84)');
		var color = easycolor('#000');
		var mix = color.mixAlpha(easycolor('#fff'));
		mix.toString().should.equal('#000000');
		mix.should.not.equal(color);
	});
	it('grayed', function() {
		var color = easycolor('orange');
		var gray = color.grayed();
		gray.s.should.equal(0);
		gray.should.not.equal(color);
	});
	it('inverting', function() {
		var color = easycolor('#333');
		var inverting = color.inverting();
		inverting.toString().should.equal('#cccccc');
		inverting.should.not.equal(color);
	});
});
