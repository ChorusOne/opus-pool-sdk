/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox-viem');

module.exports = {
    solidity: '0.8.20',
    networks: {
        hardhat: {
            forking: {
                url: 'https://ethereum-holesky.publicnode.com',
            },
            accounts: [
                {
                    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
                    balance: '10000000000000000000000',
                },
            ],
        },
    },
};
