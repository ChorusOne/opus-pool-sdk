import { OpusPool } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { Hex, encodeFunctionData, zeroAddress } from 'viem';
import { StakeTransactionData } from '../types/stake';

export default async function stake(
    pool: OpusPool,
    request: { vault: Hex; amount: bigint; referrer?: Hex },
): Promise<StakeTransactionData> {
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();

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
        transaction: tx,
        amount: request.amount,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
