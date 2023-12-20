/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-toolbox-viem');
require('@nomicfoundation/hardhat-viem');

module.exports = {
    solidity: '0.8.20',
    networks: {
        hardhat: {
            forking: {
                url: 'https://ethereum-holesky.publicnode.com',
            },
        },
    },
};
