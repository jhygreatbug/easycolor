var chai = require('chai');
var expect = chai.expect;
describe('Input', function() {
	describe('string', function() {
		it('rgb', function() {
			expect({a: 1}).to.not.have.property('b');
		});
	});
});
