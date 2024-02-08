import { OpusPool, BurnTransactionData } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { Hex, encodeFunctionData } from 'viem';

export default async function burn(
    pool: OpusPool,
    request: {
        shares: bigint;
        vault: Hex;
    },
): Promise<BurnTransactionData> {
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();

    const gasEstimate = await pool.connector.eth.estimateContractGas({
        abi: VaultABI,
        functionName: 'burnOsToken',
        args: [request.shares],
        address: request.vault,
        account: pool.userAccount,
        maxFeePerGas,
        maxPriorityFeePerGas,
    });
    const tx = encodeFunctionData({
        abi: VaultABI,
        functionName: 'burnOsToken',
        args: [request.shares],
    });

    // For this contract, set higher default denominator
    // to guarantee getting through,
    // default viem value gets reverted often
    const gasDenominator = 2.5;

    return {
        transaction: tx,
        gasEstimation: BigInt((Number(gasEstimate) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
