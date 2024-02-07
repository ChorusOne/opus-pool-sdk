import { Hex, encodeFunctionData } from 'viem';
import { Networks, OpusPool } from '..';
import { keeperABI } from '../internal/contracts/keeperAbi';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { UnstakeTransactionData } from '../types/unstake';

export default async function unstake(
    pool: OpusPool,
    request: { vault: Hex; amount: bigint },
): Promise<UnstakeTransactionData> {
    const isCollateralized: boolean = await pool.connector.eth.readContract({
        abi: keeperABI,
        address: pool.connector.keeper,
        functionName: 'isCollateralized',
        args: [request.vault],
    });

    const shares: bigint = await pool.connector.eth.readContract({
        abi: VaultABI,
        address: request.vault,
        functionName: 'convertToShares',
        args: [request.amount],
    });

    const { maxFeePerGas, maxPriorityFeePerGas } = await pool.connector.eth.estimateFeesPerGas();
    let tx: Hex;
    let gas: bigint;

    if (isCollateralized) {
        // This branch of logic is invoked when the stake locked in Vault
        // is collateralized in form of beacon chain validators
        tx = encodeFunctionData({
            abi: VaultABI,
            functionName: 'enterExitQueue',
            args: [shares, pool.userAccount],
        });

        if (pool.connector.network != Networks.Hardhat) {
            gas = await pool.connector.eth.estimateContractGas({
                abi: VaultABI,
                functionName: 'enterExitQueue',
                args: [shares, pool.userAccount],
                address: request.vault,
                account: pool.userAccount,
                maxFeePerGas,
                maxPriorityFeePerGas,
            });
        } else {
            gas = BigInt(200000);
        }
    } else {
        // This branch of logic is invoked when the stake locked in Vault
        // does not actually power any validators
        tx = encodeFunctionData({
            abi: VaultABI,
            functionName: 'redeem',
            args: [shares, pool.userAccount],
        });

        if (pool.connector.network != Networks.Hardhat) {
            gas = await pool.connector.eth.estimateContractGas({
                abi: VaultABI,
                functionName: 'redeem',
                args: [shares, pool.userAccount],
                address: request.vault,
                account: pool.userAccount,
                maxFeePerGas,
                maxPriorityFeePerGas,
            });
        } else {
            // Estimation is broken on Hardhat
            gas = BigInt(200000);
        }
    }

    // Unstake requires more gas than stake
    // TODO: figure out if it's different for mainnet
    const gasDenominator = 3.5;

    return {
        transaction: tx,
        gasEstimation: BigInt((Number(gas) * gasDenominator) | 0),
        maxFeePerGas: maxFeePerGas || pool.connector.maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas || pool.connector.maxPriorityFeePerGas,
    };
}
