var chai = require('chai');
var Color = require('../Color');
var should = chai.should();
describe('Input', function() {
	it('Color instance', function() {
		Color(Color({ r: 100, g: 100, b: 100, a: .5 })).toString().should.equal('rgba(100,100,100,0.5)');
	});
	it('Parse object', function() {
		Color({ r: 100, g: 100, b: 100, a: .5 }).toString().should.equal('rgba(100,100,100,0.5)');
		Color({ r: '100', g: '100', b: '100' }).getValue().should.deep.equal([100, 100, 100, 1]);
		Color({ r: '50%', g: '0%', b: '100%' }).getValue().should.deep.equal([127.5, 0, 255, 1]);
		Color({ h: 100, s: 50, l: 50 }).toString().should.equal('hsl(100,50%,50%)');
		Color({ h: '100', s: '50', l: '50' }).toString().should.equal('hsl(100,50%,50%)');
		Color({ h: 100, s: 50, v: 50 }).toString().should.equal('hsv(100,50%,50%)');
	});
	it('Parse Array', function() {
		Color([100, 100, 100]).toString().should.equal('#646464');
		Color([100, 100, 100], { type: 'hex'}).toString().should.equal('#ffffff');
		Color([100, 100, 100], { type: 'rgb'}).toString().should.equal('rgb(100,100,100)');
		Color([100, 50, 50], { type: 'hsl'}).toString().should.equal('hsl(100,50%,50%)');
		Color([100, 50, 50], { type: 'hsv'}).toString().should.equal('hsv(100,50%,50%)');
		Color([100, 100, 100, .2]).toString().should.equal('rgba(100,100,100,0.2)');
		Color([100, 50, 50, .2], { type: 'hsl'}).toString().should.equal('hsla(100,50%,50%,0.2)');
	});
	describe('Parse text', function() {
		it('CSS Number, CSS Percent and Unit', function() {
			Color({ r: '100', g: '200', b: '133' }).getValue().should.deep.equal([100, 200, 133, 1]);
			Color({ r: '1e1', g: '100e-1', b: '1e+1' }).getValue().should.deep.equal([10, 10, 10, 1], '科学计数法');
			Color({ h: '-100', s: 50, l: 50 }).h.should.equal(260, '带正号');
			Color({ h: '+100', s: 50, l: 50 }).h.should.equal(100, '带负号');

			Color({ r: '50.5%', g: '.6%', b: '0.6%' }).getValue().should.deep.equal([128.775, 1.53, 1.53, 1], '小数');
			Color({ r: '50.5%', g: '-.6%', b: '+.6%' }).getValue().should.deep.equal([128.775, 0, 1.53, 1], '带正负号的小数');

			Color({ h: 100, s: '-50%', l: 50 }).toString().should.equal('hsl(0,0%,50%)', '带负号');
		});
		it('Hue', function() {
			Color({ h: '100', s: 50, l: 50 }).h.should.equal(100);
			Color({ h: '100.5', s: 50, l: 50 }).h.should.equal(100.5, '小数');
			Color({ h: '100deg', s: 50, l: 50 }).h.should.equal(100, 'deg单位');
			Color({ h: '100grad', s: 50, l: 50 }).h.should.equal(90, 'grad单位');
			Color({ h: '2rad', s: 50, l: 50 }).h.should.equal(114.592, 'rad单位');
			Color({ h: '0.5turn', s: 50, l: 50 }).h.should.equal(180, 'turn单位');
		});
		it('Alpha', function() {
			Color({ r: 100, g: 100, b: 100, a: '0.5' }).a.should.equal(0.5);
			Color({ r: 100, g: 100, b: 100, a: '-0.5' }).a.should.equal(0, '小于0置为0');
			Color({ r: 100, g: 100, b: 100, a: '1.5' }).a.should.equal(1, '大于1置为1');
			Color({ r: 100, g: 100, b: 100, a: '50%' }).a.should.equal(0.5, '支持百分比');
			Color({ r: 100, g: 100, b: 100, a: 'awgwef' }).a.should.equal(1, '非数字');
		});
		it('RGB & RGBa', function() {
			Color('rgb(100,200,133)').toString().should.equal('rgb(100,200,133)');
			Color('rgb( 100	, 200,133	)').toString().should.equal('rgb(100,200,133)', '多余空白符');
			Color('rgb( 100	200 133	)').toString().should.equal('rgb(100,200,133)', '支持空白符分隔');

			Color('rgb(50%,200%,80.5%)').toString().should.equal('rgb(50%,100%,80.5%)', '支持百分比');
			Color('rgb(50%	,200%,80.5%  )').toString().should.equal('rgb(50%,100%,80.5%)', '百分比+多余空白符');

			Color('rgba(100,200,133,.5)').toString().should.equal('rgba(100,200,133,0.5)');
			Color('rgba(100,200,133 , .5)').toString().should.equal('rgba(100,200,133,0.5)');
			Color('rgba(100 200 133 .5)').toString().should.equal('rgba(100,200,133,0.5)');
			Color('rgba(100 200 133/.5)').toString().should.equal('rgba(100,200,133,0.5)');
			Color('rgba(100 200 133 / .5)').toString().should.equal('rgba(100,200,133,0.5)');
			Color('rgba(50%,200%,80.5%,50%)').toString().should.equal('rgba(50%,100%,80.5%,0.5)');

			Color('rgb(-100,266,133)').toString().should.equal('rgb(0,255,133)', '小于0置为0；大于255置为255');
			Color('rgb(100.1,200.5,133.6)').toString().should.equal('rgb(100,201,134)', '小数部分四舍五入');
			Color('rgb( 100	200% 133	)').toString().should.equal('#000000', '不支持百分比和数字混合');
		});
		it('HSL & HSLa', function() {
			Color('hsl(100,50%,50%)').toString().should.equal('hsl(100,50%,50%)');
			Color('hsl( 100	, 50%,50%	)').toString().should.equal('hsl(100,50%,50%)', '多余空白符');
			Color('hsl( 100	50% 50%	)').toString().should.equal('hsl(100,50%,50%)', '支持空白符分隔');

			Color('hsla(100,50%,50%,.5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			Color('hsla(100,50%,50% , .5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			Color('hsla(100 50% 50%  .5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			Color('hsla(100 50% 50%/.5)').toString().should.equal('hsla(100,50%,50%,0.5)');
			Color('hsla(100 50% 50% / .5)').toString().should.equal('hsla(100,50%,50%,0.5)');

			Color('hsl(-100,50%,50%)').toString().should.equal('hsl(260,50%,50%)', 'hue可为任意数字');
			Color('hsl(0,-50%,150%)').toString().should.equal('hsl(0,0%,100%)', 'sl小于0置为0；大于100置为100');
			Color('hsl(100,50%,50)').toString().should.equal('#000000', 'sl不支持数字');
		});
		it('HSV & HSVa', function() {
			Color('hsv(100,50%,50%)').toString().should.equal('hsv(100,50%,50%)');
			Color('hsb(100,50%,50%)').toString().should.equal('hsv(100,50%,50%)');
			Color('hsv( 100	, 50%,50%	)').toString().should.equal('hsv(100,50%,50%)', '多余空白符');
			Color('hsv( 100	50% 50%	)').toString().should.equal('hsv(100,50%,50%)', '支持空白符分隔');

			Color('hsva(100,50%,50%,.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			Color('hsba(100,50%,50%,.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			Color('hsva(100,50%,50% , .5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			Color('hsva(100 50% 50%  .5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			Color('hsva(100 50% 50%/.5)').toString().should.equal('hsva(100,50%,50%,0.5)');
			Color('hsva(100 50% 50% / .5)').toString().should.equal('hsva(100,50%,50%,0.5)');

			Color('hsv(-100,50%,50%)').toString().should.equal('hsv(260,50%,50%)', 'hue可为任意数字');
			Color('hsv(0,-50%,150%)').toString().should.equal('hsv(0,0%,100%)', 'sv小于0置为0；大于100置为100');
			Color('hsv(100,50%,50)').toString().should.equal('#000000', 'sv不支持数字');
		});
		it('HEX', function() {
			Color('#abc').toString().should.equal('#aabbcc', '简写hex');
			Color('#abcc').toString().should.equal('rgba(170,187,204,0.8)', '简写hex8');
			Color('#aabbcc').toString().should.equal('#aabbcc', 'hex');
			Color('#aabbcccc').toString().should.equal('rgba(170,187,204,0.8)', 'hex8');

			Color('#abcde').toString().should.equal('#000000', '无效的hex');
			Color('#abg').toString().should.equal('#000000', '无效的hex');
		});
		it('Transparent', function() {
			Color('transparent').toString().should.equal('transparent');
		})
		it('Keyword', function() {
			Color('black').toString().should.equal('black');
			Color('silver').toString().should.equal('silver');
			Color('gray').toString().should.equal('gray');
			Color('white').toString().should.equal('white');
			Color('maroon').toString().should.equal('maroon');
			Color('red').toString().should.equal('red');
			Color('purple').toString().should.equal('purple');
			Color('fuchsia').toString().should.equal('fuchsia');
			Color('green').toString().should.equal('green');
			Color('lime').toString().should.equal('lime');
			Color('olive').toString().should.equal('olive');
			Color('yellow').toString().should.equal('yellow');
			Color('navy').toString().should.equal('navy');
			Color('blue').toString().should.equal('blue');
			Color('teal').toString().should.equal('teal');
			Color('aqua').toString().should.equal('aqua');
			Color('orange').toString().should.equal('orange');
			Color('aliceblue').toString().should.equal('aliceblue');
			Color('antiquewhite').toString().should.equal('antiquewhite');
			Color('aquamarine').toString().should.equal('aquamarine');
			Color('azure').toString().should.equal('azure');
			Color('beige').toString().should.equal('beige');
			Color('bisque').toString().should.equal('bisque');
			Color('blanchedalmond').toString().should.equal('bisque');
			Color('blueviolet').toString().should.equal('blueviolet');
			Color('brown').toString().should.equal('brown');
			Color('burlywood').toString().should.equal('burlywood');
			Color('cadetblue').toString().should.equal('cadetblue');
			Color('chartreuse').toString().should.equal('chartreuse');
			Color('chocolate').toString().should.equal('chocolate');
			Color('coral').toString().should.equal('coral');
			Color('cornflowerblue').toString().should.equal('cornflowerblue');
			Color('cornsilk').toString().should.equal('cornsilk');
			Color('crimson').toString().should.equal('crimson');
			Color('darkblue').toString().should.equal('darkblue');
			Color('darkcyan').toString().should.equal('darkcyan');
			Color('darkgoldenrod').toString().should.equal('darkgoldenrod');
			Color('darkgray').toString().should.equal('darkgray');
			Color('darkgreen').toString().should.equal('darkgreen');
			Color('darkgrey').toString().should.equal('darkgray');
			Color('darkkhaki').toString().should.equal('darkkhaki');
			Color('darkmagenta').toString().should.equal('darkmagenta');
			Color('darkolivegreen').toString().should.equal('darkolivegreen');
			Color('darkorange').toString().should.equal('darkorange');
			Color('darkorchid').toString().should.equal('darkorchid');
			Color('darkred').toString().should.equal('darkred');
			Color('darksalmon').toString().should.equal('darksalmon');
			Color('darkseagreen').toString().should.equal('darkseagreen');
			Color('darkslateblue').toString().should.equal('darkslateblue');
			Color('darkslategray').toString().should.equal('darkslategray');
			Color('darkslategrey').toString().should.equal('darkslategray');
			Color('darkturquoise').toString().should.equal('darkturquoise');
			Color('darkviolet').toString().should.equal('darkviolet');
			Color('deeppink').toString().should.equal('deeppink');
			Color('deepskyblue').toString().should.equal('deepskyblue');
			Color('dimgray').toString().should.equal('dimgray');
			Color('dimgrey').toString().should.equal('dimgray');
			Color('dodgerblue').toString().should.equal('dodgerblue');
			Color('firebrick').toString().should.equal('firebrick');
			Color('floralwhite').toString().should.equal('floralwhite');
			Color('forestgreen').toString().should.equal('forestgreen');
			Color('gainsboro').toString().should.equal('gainsboro');
			Color('ghostwhite').toString().should.equal('ghostwhite');
			Color('gold').toString().should.equal('gold');
			Color('goldenrod').toString().should.equal('goldenrod');
			Color('greenyellow').toString().should.equal('greenyellow');
			Color('grey').toString().should.equal('gray');
			Color('honeydew').toString().should.equal('honeydew');
			Color('hotpink').toString().should.equal('hotpink');
			Color('indianred').toString().should.equal('indianred');
			Color('indigo').toString().should.equal('indigo');
			Color('ivory').toString().should.equal('ivory');
			Color('khaki').toString().should.equal('khaki');
			Color('lavender').toString().should.equal('lavender');
			Color('lavenderblush').toString().should.equal('lavenderblush');
			Color('lawngreen').toString().should.equal('lawngreen');
			Color('lemonchiffon').toString().should.equal('lemonchiffon');
			Color('lightblue').toString().should.equal('lightblue');
			Color('lightcoral').toString().should.equal('lightcoral');
			Color('lightcyan').toString().should.equal('lightcyan');
			Color('lightgoldenrodyellow').toString().should.equal('lightgoldenrodyellow');
			Color('lightgray').toString().should.equal('lightgray');
			Color('lightgreen').toString().should.equal('lightgreen');
			Color('lightgrey').toString().should.equal('lightgray');
			Color('lightpink').toString().should.equal('lightpink');
			Color('lightsalmon').toString().should.equal('lightsalmon');
			Color('lightseagreen').toString().should.equal('lightseagreen');
			Color('lightskyblue').toString().should.equal('lightskyblue');
			Color('lightslategray').toString().should.equal('lightslategray');
			Color('lightslategrey').toString().should.equal('lightslategray');
			Color('lightsteelblue').toString().should.equal('lightsteelblue');
			Color('lightyellow').toString().should.equal('lightyellow');
			Color('limegreen').toString().should.equal('limegreen');
			Color('linen').toString().should.equal('linen');
			Color('mediumaquamarine').toString().should.equal('mediumaquamarine');
			Color('mediumblue').toString().should.equal('mediumblue');
			Color('mediumorchid').toString().should.equal('mediumorchid');
			Color('mediumpurple').toString().should.equal('mediumpurple');
			Color('mediumseagreen').toString().should.equal('mediumseagreen');
			Color('mediumslateblue').toString().should.equal('mediumslateblue');
			Color('mediumspringgreen').toString().should.equal('mediumspringgreen');
			Color('mediumturquoise').toString().should.equal('mediumturquoise');
			Color('mediumvioletred').toString().should.equal('mediumvioletred');
			Color('midnightblue').toString().should.equal('midnightblue');
			Color('mintcream').toString().should.equal('mintcream');
			Color('mistyrose').toString().should.equal('mistyrose');
			Color('moccasin').toString().should.equal('moccasin');
			Color('navajowhite').toString().should.equal('navajowhite');
			Color('oldlace').toString().should.equal('oldlace');
			Color('olivedrab').toString().should.equal('olivedrab');
			Color('orangered').toString().should.equal('orangered');
			Color('orchid').toString().should.equal('orchid');
			Color('palegoldenrod').toString().should.equal('palegoldenrod');
			Color('palegreen').toString().should.equal('palegreen');
			Color('paleturquoise').toString().should.equal('paleturquoise');
			Color('palevioletred').toString().should.equal('palevioletred');
			Color('papayawhip').toString().should.equal('papayawhip');
			Color('peachpuff').toString().should.equal('peachpuff');
			Color('peru').toString().should.equal('peru');
			Color('pink').toString().should.equal('pink');
			Color('plum').toString().should.equal('plum');
			Color('powderblue').toString().should.equal('powderblue');
			Color('rosybrown').toString().should.equal('rosybrown');
			Color('royalblue').toString().should.equal('royalblue');
			Color('saddlebrown').toString().should.equal('saddlebrown');
			Color('salmon').toString().should.equal('salmon');
			Color('sandybrown').toString().should.equal('sandybrown');
			Color('seagreen').toString().should.equal('seagreen');
			Color('seashell').toString().should.equal('seashell');
			Color('sienna').toString().should.equal('sienna');
			Color('skyblue').toString().should.equal('skyblue');
			Color('slateblue').toString().should.equal('slateblue');
			Color('slategray').toString().should.equal('slategray');
			Color('slategrey').toString().should.equal('slategray');
			Color('snow').toString().should.equal('snow');
			Color('springgreen').toString().should.equal('springgreen');
			Color('steelblue').toString().should.equal('steelblue');
			Color('tan').toString().should.equal('tan');
			Color('thistle').toString().should.equal('thistle');
			Color('tomato').toString().should.equal('tomato');
			Color('turquoise').toString().should.equal('turquoise');
			Color('violet').toString().should.equal('violet');
			Color('wheat').toString().should.equal('wheat');
			Color('whitesmoke').toString().should.equal('whitesmoke');
			Color('yellowgreen').toString().should.equal('yellowgreen');
			Color('rebeccapurple').toString().should.equal('rebeccapurple');
		});
	});
});

describe('Output', function() {
	it('toRgbString', function() {
		var rgb = Color('rgb(100,100,100)');
		var rgbp = Color('rgb(20%,20%,20%)');
		rgb.toRgbString().should.equal('rgb(100,100,100)');
		rgb.a = .2;
		rgb.toRgbString().should.equal('rgba(100,100,100,0.2)');
		rgbp.toRgbString().should.equal('rgb(20%,20%,20%)');
		rgbp.a = .2;
		rgbp.toRgbString().should.equal('rgba(20%,20%,20%,0.2)');

		Color('rgb(20.0001%,20.001%,20.50000%)').toRgbString().should.equal('rgb(20%,20.001%,20.5%)', '保留3位小数');
		Color('#abc').toRgbString().should.equal('rgb(170,187,204)');
	});
	it('toHslString', function() {
		var hsl = Color('hsl(100,50%,50%)');
		hsl.toHslString().should.equal('hsl(100,50%,50%)');
		hsl.a = .2;
		hsl.toHslString().should.equal('hsla(100,50%,50%,0.2)');

		Color('hsl(100.0001,20.001%,20.50000%)').toHslString().should.equal('hsl(100,20.001%,20.5%)', '保留3位小数');
	});
	it('toHsvString', function() {
		var hsl = Color('hsv(100,50%,50%)');
		hsl.toHsvString().should.equal('hsv(100,50%,50%)');
		hsl.a = .2;
		hsl.toHsvString().should.equal('hsva(100,50%,50%,0.2)');

		Color('hsv(100.0001,20.001%,20.50000%)').toHsvString().should.equal('hsv(100,20.001%,20.5%)', '保留3位小数');
	});
	it('toHexString', function() {
		var hex = Color('#abc');
		hex.toHexString().should.equal('#aabbcc');
		hex.a = .2;
		hex.toHexString().should.equal('#aabbcc33');
		hex.r = 170.5;
		hex.toHexString().should.equal('#abbbcc33');
		hex.r = 170.4;
		hex.toHexString().should.equal('#aabbcc33');
	});
	it('toKeyword', function() {
		var color = Color('silver');
		color.toKeyword().should.equal('silver');
		color.r = 0;
		color.toKeyword().should.equal('');
		color.g = 0; color.b = 0;
		color.toKeyword().should.equal('black');
	});
	describe('toString', function() {
		it('Transparent', function () {
			var color = Color('transparent');
			color.toString().should.equal('transparent');
			color.a = .5;
			color.toString().should.equal('rgba(0,0,0,0.5)');
		});
		it('Keyword', function() {
			var color1 = Color('silver');
			var color2 = Color('silver');
			color1.toString().should.equal('silver');
			color1.r = 100;
			color1.toString().should.equal('#64c0c0');
			color1.toKeyword().should.equal('');
			color2.a = .2;
			color2.toString().should.equal('rgba(192,192,192,0.2)');
			color2.toKeyword().should.equal('silver');
		});
		it('RGB', function() {
			var rgb = Color('rgb(100,100,100)');
			rgb.toString().should.equal('rgb(100,100,100)');
			rgb.h = 100;
			rgb.toString().should.equal('rgb(100,100,100)');
		});
		it('HSL', function() {
			var hsl = Color('hsl(100,50%,50%)');
			hsl.toString().should.equal('hsl(100,50%,50%)');
			hsl.r = 100;
			hsl.toString().should.equal('hsl(102.941,50%,50%)');
		});
		it('HSV', function() {
			var hsv = Color('hsv(100,50%,50%)');
			hsv.toString().should.equal('hsv(100,50%,50%)');
			hsv.r = 100;
			hsv.toString().should.equal('hsv(85.882,50%,50%)');
		});
		it('Hex', function() {
			var hex = Color('#abc');
			hex.toString().should.equal('#aabbcc');
			hex.a = .2;
			hex.toString().should.equal('rgba(170,187,204,0.2)');
		});
		it('指定输出类型', function() {
			Color('rgb(100,100,100)').toString('hex').should.equal('#646464');
			var color = Color('#abc');
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
					var color = Color('#0ac3');
					color[item.longKey] = desc.case[0][0];
					color[item.shortKey].should.equal(desc.case[0][1], item.longKey + '和' + item.shortKey + '对应同一数据');
					color.a.should.equal(0.2, 'Alpha不应被修改');
					desc.case.forEach(function(cItem) {
						var color2 = Color('#0ac3');
						color2[item.longKey] = cItem[0];
						color2[item.longKey].should.equal(cItem[1]);
					});
				});
			});
		});
	});
	it('Alpha', function() {
		var color = Color('#000');
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
		Color.random().toString().should.not.equal('#000000');
		Color.random().toString().should.not.equal(Color.random().toString());
	});
	it('interpolation', function() {
		var start = Color('#0000');
		var end = Color('#fff');
		var result = 'rgba(0,0,0,0),rgba(85,85,85,0.333),rgba(170,170,170,0.667),#ffffff';
		Color.interpolation(start, end, 4).join(',').should.equal(result);
		start.interpolation(end, 4).join(',').should.equal(result);
		Color.interpolation(start, end).join(',').should.equal('');
		Color.interpolation(start, end, 1).join(',').should.equal('rgba(0,0,0,0)');
		var colors = Color.interpolation(start, end, 2);
		colors[0].should.not.equal(start);
		colors[1].should.not.equal(end);

	});
	it('interpolation2d', function() {
		var tl = Color('#000');
		var tr = Color('#0f0');
		var bl = Color('#f00');
		var br = Color('#ff0');
		var result = '#000000,#005500,#00aa00,#00ff00|#550000,#555500,#55aa00,#55ff00|#aa0000,#aa5500,#aaaa00,#aaff00|#ff0000,#ff5500,#ffaa00,#ffff00';
		var parseToString = function(arr) {
			return arr.map(function(item) { return item.join(','); }).join('|');
		}

		parseToString(Color.interpolation2d(tl, tr, bl, br, 4, 4)).should.equal(result);
		parseToString(tl.interpolation2d(tr, bl, br, 4, 4)).should.equal(result);

		parseToString(Color.interpolation2d(tl, tr, bl, br, 4, 1)).should.equal('#000000,#555500,#aaaa00,#ffff00');
		parseToString(Color.interpolation2d(tl, tr, bl, br, 1, 4)).should.equal('#000000|#555500|#aaaa00|#ffff00');

		var oneHAndOneW = Color.interpolation2d(tl, tr, bl, br, 1, 1);
		parseToString(oneHAndOneW).should.equal('#000000');
		oneHAndOneW[0][0].should.not.equal(tl);

		parseToString(Color.interpolation2d(tl, tr, bl, br)).should.equal('');
		parseToString(Color.interpolation2d(tl, tr, bl, br, 0, 4)).should.equal('');
		parseToString(Color.interpolation2d(tl, tr, bl, br, 4, 0)).should.equal('');
	});
	it('mixAlpha', function() {
		Color.mixAlpha(Color('#000'), Color('#fff')).toString().should.equal('#000000');
		Color.mixAlpha(Color('#f003'), Color('#0f0')).toString().should.equal('#33cc00');
		Color.mixAlpha(Color('#f003'), Color('#0f0c')).toString().should.equal('rgba(61,194,0,0.84)');
		var color = Color('#000');
		var mix = color.mixAlpha(Color('#fff'));
		mix.toString().should.equal('#000000');
		mix.should.not.equal(color);
	});
	it('grayed', function() {
		var color = Color('orange');
		var gray = color.grayed();
		gray.s.should.equal(0);
		gray.should.not.equal(color);
	});
	it('inverting', function() {
		var color = Color('#333');
		var inverting = color.inverting();
		inverting.toString().should.equal('#cccccc');
		inverting.should.not.equal(color);
	});
});
