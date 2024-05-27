## Table of Contents

-   [Overview](#overview)
-   [Initializing the Pool and Fetching Rewards History](#initializing-the-pool-and-fetching-rewards-history)
-   [Visualizing Rewards Data with a Chart](#visualizing-rewards-data-with-a-chart)
-   [Chart Representation on the Screen](#chart-representation-on-the-screen)

## Overview

In this section, we’ll explore the process of fetching and visualizing rewards history using the OPUS Pool SDK. Visualizing reward data helps users gain insights into their earnings over time and make informed decisions about their staking activities.

We will guide you through fetching the necessary data, and presenting it in a user-friendly chart.

## Initializing the Pool and Fetching Rewards History

As with our previous tasks, we begin by initializing the `OpusPool`. Then, we’ll use the `getRewardsHistory` method to gather the rewards history. You can find the relevant code [here][get-rewards-history-usage].

**Below is a sample code snippet for fetching rewards history:**

```typescript
const pool = new OpusPool({
    address,
    network,
});

// Setting the date range: from 1 month ago to today
const from = new Date();
from.setMonth(from.getMonth() - 1);
const to = new Date();

const rewardsHistory = await pool.getRewardsHistory({
    from,
    to,
    vault,
});
```

The `getRewardsHistory` method requires an object with the following parameters:

-   **`from` (Date)**: The starting date for the rewards retrieval query.
-   **`to` (Date)**: The end date for the rewards retrieval query.
-   **`vault` (Hex)**: The vault address for which to retrieve rewards.

The method returns an array of `RewardsDataPoint` objects, each containing:

-   **`when` (Date)**: The reference date for the rewards received.
-   **`amount` (bigint)**: The amount of rewards received, denoted in wei.
-   **`vault` (Hex)**: The address of the vault that generated the rewards.

Check out the demo project implementation [here][get-rewards-history-usage] for a working example of the rewards history fetching.

## Visualizing Rewards Data with a Chart

We will use a chart to provide a more visual representation of the rewards. We have chosen to use [Recharts][recharts], a composable library built on React components for this guide. However, feel free to use any other charting library that suits your needs. The complete code for this implementation and additional details can be found [here][get-rewards-history-ui].

**First, we’ll transform the rewards history data into a format suitable for Recharts:**

```typescript
const chartData = rewardsHistory.map((point) => {
    return {
        date: point.when.toDateString(),
        amount: Number(formatEther(point.amount)),
    };
});
```

In this transformation, each rewards data point is converted into an object with `date` and `amount` properties, where `date` is a string representation of the date, and `amount` is the reward amount in Ether (converted from wei).

**Here’s the code snippet for creating a line chart with our rewards data:**

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

type ChartDataPoint = {
    amount: number;
    date: string;
};

const RewardsChart = ({ data }: { data: ChartDataPoint[] }) => {
    return (
        <LineChart width={700} height={300} data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Line type="monotone" dataKey="amount" />
        </LineChart>
    );
};
```

In this snippet, we import the necessary components from Recharts and define the `RewardsChart` component. This component takes an array of `ChartDataPoint` objects and renders them in a LineChart. The `XAxis` and `YAxis` components provide the chart’s axises, while the `Line` component plots the transaction amounts over time.

## Chart Representation on the Screen

Once rendered, the line chart provides a clear view of reward trends over time.

![Rewards chart](../media/rewards.png)

# Wrapping Up

Throughout this guide, we explored the powerful capabilities of the OPUS Pool SDK, unlocking its potential for various key operations.

We started by setting up the SDK and quickly moved into practical tasks like fetching and displaying vault details. From there, we dived into staking, showing how to lock ETH seamlessly and earn rewards.

Next, we guided you through the process of minting osETH tokens to maintain liquidity, and the essential steps to burn these tokens and reclaim your staked ETH.

Our step-by-step instructions made unstaking your ETH and navigating the exit queue a breeze, highlighting the user-friendly nature of the OPUS Pool SDK.

We also covered how to track transaction history, giving you clear insights into all your staking, unstaking, and other activities. Lastly, we wrapped up by visualizing rewards history, helping you understand the benefits accrued from the vault.

By the end of this guide, you should feel confident in leveraging the OPUS Pool SDK to enhance your Ethereum-based applications. Happy staking! 📥

{% hint style=“info” %}

For more detailed information on the OPUS Pool SDK, visit the [API Documentation][api] to explore all available methods and their usages.

{% endhint %}

[get-rewards-history-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/hooks/useRewards.ts#L27
[recharts]: https://recharts.org
[get-rewards-history-ui]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/components/Rewards.tsx#L26
[api]: ../docs/classes/OpusPool.md
