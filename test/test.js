var chai = require('chai');
var Color = require('../Color');
var should = chai.should();
describe('Input', function() {
	describe('Parse', function() {
		it('CSS Number and CSS Percent ', function() {
			Color({ r: '100', g: '200', b: '133' }).toString().should.equal('rgb(100,200,133)');
			Color({ r: '1e1', g: '100e-1', b: '1e+1' }).toString().should.equal('rgb(10,10,10)');
			Color({ h: '-100', s: 50, l: 50 }).toString().should.equal('hsl(260,50%,50%)');
			Color({ h: '+100', s: 50, l: 50 }).toString().should.equal('hsl(100,50%,50%)');

			Color({ r: '50.5%', g: '.5%', b: '0.5%' }).toString().should.equal('rgb(50.5%,0.5%,0.5%)');
			Color({ r: '50.5%', g: '-.5%', b: '+.5%' }).toString().should.equal('rgb(50.5%,0%,0.5%)');
		});
		it('Hue', function() {
			Color({ h: '100', s: 50, l: 50}).toString().should.equal('hsl(100,50%,50%)');
			Color({ h: '100.5', s: 50, l: 50}).toString().should.equal('hsl(100.5,50%,50%)');
			Color({ h: '100deg', s: 50, l: 50}).toString().should.equal('hsl(100,50%,50%)');
			Color({ h: '100grad', s: 50, l: 50}).toString().should.equal('hsl(90,50%,50%)');
			Color({ h: '2rad', s: 50, l: 50}).toString().should.equal('hsl(114.592,50%,50%)');
			Color({ h: '0.5turn', s: 50, l: 50}).toString().should.equal('hsl(180,50%,50%)');
		});
		it('Alpha', function() {
			Color({ r: 100, g: 100, b: 100, a: '0.5' }).toString().should.equal('rgba(100,100,100,0.5)');
			Color({ r: 100, g: 100, b: 100, a: '-0.5' }).toString().should.equal('rgba(100,100,100,0)');
			Color({ r: 100, g: 100, b: 100, a: '1.5' }).toString().should.equal('rgb(100,100,100)');
			Color({ r: 100, g: 100, b: 100, a: '50%' }).toString().should.equal('rgba(100,100,100,0.5)');
		});
		it('RGB', function() {
			Color('rgb(100,200,133)').toString().should.equal('rgb(100,200,133)');
			Color('rgb( 100	, 200,133	)').toString().should.equal('rgb(100,200,133)');
			Color('rgb( 100	200 133	)').toString().should.equal('rgb(100,200,133)');

			Color('rgb(50%,200%,80.5%)').toString().should.equal('rgb(50%,100%,80.5%)');
			Color('rgb(50%	,200%,80.5%  )').toString().should.equal('rgb(50%,100%,80.5%)');

			Color('rgb( 100	200% 133	)').toString().should.equal('rgb(0,0,0)');
			Color('rgb(-100,266,133.6)').toString().should.equal('rgb(0,255,133)');
		});
		it('HSL', function() {
		});
		it('HSV', function() {
		});
		it('HEX', function() {
			Color('#abc').toString().should.equal('rgb(170,187,204)');
			Color('#abca').toString().should.equal('rgba(170,187,204,0.667)');
			Color('#aabbcc').toString().should.equal('rgb(170,187,204)');
			Color('#aabbccaa').toString().should.equal('rgba(170,187,204,0.667)');

			Color('#abcde').toString().should.equal('rgb(0,0,0)');
			Color('#abg').toString().should.equal('rgb(0,0,0)');
		});
	});
});
