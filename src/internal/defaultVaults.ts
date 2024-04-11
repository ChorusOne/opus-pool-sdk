import { Hex } from 'viem';
import { Networks } from '../types/enums';

/**
 * Retrieves the default vaults for the given network
 * @param network The network to retrieve the default vaults for.
 * Supported values are `Networks.Holesky` and `Networks.Ethereum`
 * @returns An array of default vaults
 */
export function getDefaultVaults(network: Networks): Array<Hex> {
    switch (network) {
        case Networks.Holesky:
            return ['0x95d0db03d59658e1af0d977ecfe142f178930ac5'];
        case Networks.Ethereum:
            return ['0xe6d8d8ac54461b1c5ed15740eee322043f696c08'];
        case Networks.Hardhat:
            return ['0xd68af28aee9536144d4b9b6c0904caf7e794b3d3'];
        default:
            throw new Error(`Invalid Opus-Pool network passed: ${network}`);
    }
}
