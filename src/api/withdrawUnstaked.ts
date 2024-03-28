import { Hex, encodeFunctionData } from 'viem';
import { Networks, OpusPool, UnstakeQueueItem } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { UnstakeTransactionData } from '../types/unstake';

export default async function withdrawUnstaked(
    pool: OpusPool,
    vault: Hex,
    queueItems: UnstakeQueueItem[],
): Promise<UnstakeTransactionData> {
    const multicallArgs = queueItems.map((item) => {
        const timestamp = Math.floor(item.when.getTime() / 1000);
        if (item.exitQueueIndex === undefined) {
            throw new Error('Exit queue index is missing');
        }
        if (!item.isWithdrawable) {
            throw new Error('Item is not withdrawable');
        }

        return encodeFunctionData({
            abi: VaultABI,
            functionName: 'claimExitedAssets',
            args: [item.positionTicket, BigInt(timestamp), item.exitQueueIndex],
        });
    });
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();

    const tx = encodeFunctionData({
        abi: VaultABI,
        functionName: 'multicall',
        args: [multicallArgs],
    });

    let gas: bigint;
    if (pool.connector.network != Networks.Hardhat) {
        gas = await pool.connector.eth.estimateContractGas({
            abi: VaultABI,
            functionName: 'multicall',
            args: [multicallArgs],
            address: vault,
            account: pool.userAccount,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    } else {
        // Estimation is broken on Hardhat
        gas = BigInt(200000);
    }

    const gasDenominator = 2;

    return {
        transaction: tx,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
