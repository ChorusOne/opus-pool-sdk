import { OpusPool, StakingTypeEnum } from '..';
import { StakingTransactionData } from '../types/stake';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { Hex, encodeFunctionData, zeroAddress } from 'viem';

export default async function stake(
    pool: OpusPool,
    request: { vault: Hex; amount: bigint, referrer?: Hex; },
): Promise<StakingTransactionData> {
    // These parameters may differ per network
    const maxFeePerGas = pool.connector.maxFeePerGas;
    const maxPriorityFeePerGas = pool.connector.maxPriorityFeePerGas;

    // Encode transaction into hex form
    const tx: Hex = encodeFunctionData({
        abi: VaultABI,
        functionName: 'deposit',
        args: [pool.userAccount, request.referrer || zeroAddress],
    });

    // Calculate gas prediction
    const gas: bigint = await pool.connector.eth.estimateContractGas({
        abi: VaultABI,
        functionName: 'deposit',
        args: [pool.userAccount, request.referrer || zeroAddress],
        value: request.amount,
        address: request.vault,
        account: pool.userAccount,
        maxFeePerGas,
        maxPriorityFeePerGas,
    });

    // For this contract, set higher default denominator
    // to guarantee getting through,
    // default viem value gets reverted often
    const gasDenominator = 2.5;

    return {
        type: StakingTypeEnum.Stake,
        transaction: tx,
        amount: request.amount,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas,
        maxPriorityFeePerGas,
    };
}
