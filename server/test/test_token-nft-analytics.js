var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
chai.should();
var Token = require('../models').Token;

chai.use(chaiHttp);

describe('Token NFT Analytics API', function () {

  beforeEach(function (done) {
    Token.destroy({
      where: {},
      truncate: true
    }).then(() => done());
  });

  describe('GET /token/nft-analytics', function () {

    it('should return valid structure with empty database', function (done) {
      chai.request(app).get('/token/nft-analytics').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.error.should.equal(false);
        res.body.data.should.have.property('totalNFTs');
        res.body.data.should.have.property('walletAddresses');
        res.body.data.totalNFTs.should.equal(0);
        res.body.data.walletAddresses.should.be.a('array');
        res.body.data.walletAddresses.length.should.equal(0);
        done();
      });
    });

    it('should count NFTs correctly', function (done) {
      Token.bulkCreate([
        { name: 'NFT One',   symbol: 'N1', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { name: 'NFT Two',   symbol: 'N2', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { name: 'NFT Three', symbol: 'N3', address: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5' },
      ]).then(function () {
        chai.request(app).get('/token/nft-analytics').end(function (err, res) {
          res.should.have.status(200);
          res.body.error.should.equal(false);
          res.body.data.totalNFTs.should.equal(3);
          done();
        });
      });
    });

    it('should return unique wallet addresses only', function (done) {
      Token.bulkCreate([
        { name: 'NFT One',   symbol: 'N1', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { name: 'NFT Two',   symbol: 'N2', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }, // duplicate
        { name: 'NFT Three', symbol: 'N3', address: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5' },
      ]).then(function () {
        chai.request(app).get('/token/nft-analytics').end(function (err, res) {
          res.should.have.status(200);
          res.body.data.walletAddresses.length.should.equal(2); // deduplicated
          done();
        });
      });
    });

    it('should only include valid Ethereum addresses', function (done) {
      Token.bulkCreate([
        { name: 'Valid',   symbol: 'V1', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { name: 'Invalid', symbol: 'V2', address: 'not-an-address' },
      ]).then(function () {
        chai.request(app).get('/token/nft-analytics').end(function (err, res) {
          res.should.have.status(200);
          res.body.data.walletAddresses.length.should.equal(1);
          res.body.data.walletAddresses[0].should.equal('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
          done();
        });
      });
    });

  });
});