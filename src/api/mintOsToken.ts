import { Hex, encodeFunctionData, zeroAddress } from 'viem';
import { Networks, OpusPool, StakingTransactionData, StakingTypeEnum } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';

export const mintOsToken = async (
    pool: OpusPool,
    request: {
        shares: bigint;
        vault: Hex;
        referrer?: Hex;
    },
): Promise<StakingTransactionData> => {
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
        type: StakingTypeEnum.Mint,
        transaction: tx,
        amount: request.shares,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
};
