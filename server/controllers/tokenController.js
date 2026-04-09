const { Token } = require("../models");


module.exports = {
  list(req, res) {
    Token.findAll({})
      .then((tokens) =>
        res.status(201).json({
          error: false,
          data: tokens,
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          message: error,
        })
      );
  },

nftAnalytics(req, res) {

const { isAddress } = require("@ethersproject/address");

  Token.findAll({})
    .then((tokens) => {
      const totalNFTs = tokens.length;

      const walletAddresses = [
        ...new Set(
          tokens
            .map((token) => token.address)
            .filter((addr) => {
              try {
                return addr && isAddress(addr);
              } catch (e) {
                return false;
              }
            })
        ),
      ];

      res.status(200).json({
        error: false,
        data: {
          totalNFTs,
          walletAddresses,
        },
      });
    })
    .catch((error) =>
      res.status(500).json({
        error: true,
        message: error.message || "Internal server error",
      })
    );
},

  add(req, res) {
    const { name, symbol, address } = req.body;

    Token.create({
      name: name,
      symbol: symbol,
      address: address,
    });
  },

  delete(req, res) {
      
    const { address } = req.body;

    console.log(req.body)

    Token.destroy({
      where: {
        address: address,
      },
    })
      .then((status) =>
        res.status(201).json({
          error: false,
          message: "token has been deleted",
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          message: error.message || "Internal server error",
        })
      );
  },
};
