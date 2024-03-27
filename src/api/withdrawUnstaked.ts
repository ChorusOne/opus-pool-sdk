import { Hex, encodeFunctionData } from 'viem';
import { Networks, OpusPool } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { UnstakeTransactionData } from '../types/unstake';

export default async function withdrawUnstaked(
    pool: OpusPool,
    request: {
        vault: Hex;
        positionTicket: bigint;
        when: Date;
        exitQueueIndex?: bigint;
    },
): Promise<UnstakeTransactionData> {
    if (request.exitQueueIndex === undefined) {
        throw new Error('exitQueueIndex is required');
    }

    const timestamp = Math.floor(request.when.getTime() / 1000);
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();

    const tx = encodeFunctionData({
        abi: VaultABI,
        functionName: 'claimExitedAssets',
        args: [request.positionTicket, BigInt(timestamp), request.exitQueueIndex],
    });
    let gas: bigint;
    if (pool.connector.network != Networks.Hardhat) {
        gas = await pool.connector.eth.estimateContractGas({
            abi: VaultABI,
            functionName: 'claimExitedAssets',
            args: [request.positionTicket, BigInt(timestamp), request.exitQueueIndex],
            address: request.vault,
            account: pool.userAccount,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    } else {
        // Estimation is broken on Hardhat
        gas = BigInt(200000);
    }

    // Unstake requires more gas than stake
    // TODO: figure out if it's different for mainnet
    const gasDenominator = 2;

    return {
        transaction: tx,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
