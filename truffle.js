const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
    networks: {
        "kovan-infura": {
            provider: () => new HDWalletProvider(
                        "mesh almost stairs envelope earth plastic interest hat stock camera panda boat", 
                        "https://kovan.infura.io/v3/37bd907f93a146679960d54e729cd51a"
                    ),
            network_id: 42,
            gas: 4700000
          }
        // development: {
        //     host: "127.0.0.1",
        //     port: 8545,
        //     network_id: "*" 
        // }
    },
    solc: {
         optimizer: {
           enabled: false,
           runs: 200
         }
    }
};