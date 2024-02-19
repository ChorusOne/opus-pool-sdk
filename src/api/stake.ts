import { OpusPool, StakeTransactionData } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { Hex, encodeFunctionData, zeroAddress } from 'viem';
import { keeperABI } from '../internal/contracts/keeperAbi';
import { getHarvestParams } from './getHarvestParams';

export default async function stake(
    pool: OpusPool,
    request: { vault: Hex; amount: bigint; referrer?: Hex },
): Promise<StakeTransactionData> {
    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();
    const canHarvest = await pool.connector.eth.readContract({
        abi: keeperABI,
        address: pool.connector.keeper,
        functionName: 'canHarvest',
        args: [request.vault],
    });

    let gasEstimate = 0n;
    let tx: Hex;

    const harvestParams = await getHarvestParams(pool.connector, request.vault);

    // Calculate gas prediction
    if (canHarvest) {
        gasEstimate = await pool.connector.eth.estimateContractGas({
            abi: VaultABI,
            functionName: 'updateStateAndDeposit',
            account: pool.userAccount,
            value: request.amount,
            address: request.vault,
            args: [
                pool.userAccount,
                request.referrer || zeroAddress,
                {
                    proof: harvestParams.proof,
                    rewardsRoot: harvestParams.rewardsRoot,
                    reward: harvestParams.reward,
                    unlockedMevReward: harvestParams.unlockedMevReward,
                },
            ],
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
        tx = encodeFunctionData({
            abi: VaultABI,
            functionName: 'updateStateAndDeposit',
            args: [
                pool.userAccount,
                request.referrer || zeroAddress,
                {
                    proof: harvestParams.proof,
                    rewardsRoot: harvestParams.rewardsRoot,
                    reward: harvestParams.reward,
                    unlockedMevReward: harvestParams.unlockedMevReward,
                },
            ],
        });
    } else {
        gasEstimate = await pool.connector.eth.estimateContractGas({
            abi: VaultABI,
            functionName: 'deposit',
            args: [pool.userAccount, request.referrer || zeroAddress],
            value: request.amount,
            address: request.vault,
            account: pool.userAccount,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
        tx = encodeFunctionData({
            abi: VaultABI,
            functionName: 'deposit',
            args: [pool.userAccount, request.referrer || zeroAddress],
        });
    }

    // For this contract, set higher default denominator
    // to guarantee getting through,
    // default viem value gets reverted often
    const gasDenominator = 2.5;

    return {
        transaction: tx,
        amount: request.amount,
        gasEstimation: BigInt((Number(gasEstimate) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
