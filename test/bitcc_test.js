var should = require('should'),
    bitcc = require('../lib/bitcc.js')


describe('bitcc', function () {
    before(function () {

    })
    it('should be awesome', function(){
        bitcc.awesome().should.eql('awesome')
    })
})