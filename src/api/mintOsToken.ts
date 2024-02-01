import { Hex, encodeFunctionData, zeroAddress } from 'viem';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { Networks } from '../types/enums';
import { OpusPool } from '..';
import { MintTransactionData } from '../types/mint';

export const mintOsToken = async (
    pool: OpusPool,
    request: {
        shares: bigint;
        vault: Hex;
        referrer?: Hex;
    },
): Promise<MintTransactionData> => {
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();
    const tx: Hex = encodeFunctionData({
        abi: VaultABI,
        functionName: 'mintOsToken',
        args: [pool.userAccount, request.shares, request.referrer || zeroAddress],
    });

    let gas: bigint = 2_000_000n;
    if (pool.connector.network != Networks.Hardhat) {
        gas = await pool.connector.eth.estimateContractGas({
            abi: VaultABI,
            functionName: 'mintOsToken',
            args: [pool.userAccount, request.shares, request.referrer || zeroAddress],
            address: request.vault,
            account: pool.userAccount,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    }

    const gasDenominator = 2.5;

    return {
        transaction: tx,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
};
