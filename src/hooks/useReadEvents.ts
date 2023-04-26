import React from "react";
import { BigNumber, ethers } from "ethers";
import { rpcProvider, convertFromHexString } from "../utils";
import { CONTRACT_DEPLOY_BLOCK, CONTRACT_ADDRESS } from "../config";

const FILTER_BLOCK_STEP = 20000;
const TOPIC_ID = ethers.utils.id("Deposit(address,address,uint256)");

type DepositEvent = {
  blockNumber: number;
  hash: string;
  account: string;
  token: string;
  amount: string;
};

interface Props {
  onReadEvents: (data?: DepositEvent[]) => unknown;
  setReading: (finished: boolean) => unknown;
}

export const useReadEvents = async ({ onReadEvents, setReading }: Props) => {
  React.useEffect(() => {
    let status = 0;
    const run = async () => {
      setReading(true);

      try {
        const endBlock = await rpcProvider.getBlockNumber();
        status = 1;

        for (
          let block = CONTRACT_DEPLOY_BLOCK;
          block <= endBlock && status > 0;
          block += FILTER_BLOCK_STEP
        ) {
          let toBlock = block + FILTER_BLOCK_STEP;
          if (toBlock > endBlock) toBlock = endBlock;

          const logs = await rpcProvider.getLogs({
            fromBlock: block,
            toBlock: toBlock,
            address: CONTRACT_ADDRESS,
            topics: [TOPIC_ID]
          });

          onReadEvents(
            logs
              .filter((log) => !log.removed)
              .map((log) => ({
                blockNumber: log.blockNumber,
                hash: log.transactionHash,
                account: convertFromHexString(log.topics[1]),
                token: convertFromHexString(log.topics[2]),
                amount: BigNumber.from(
                  ethers.utils.hexStripZeros(log.topics[3])
                ).toString()
              }))
          );
        }
      } catch (error) {
        console.error("Get event error", error);
      } finally {
        setReading(false);
      }
    };

    run();

    return () => {
      if (status > 0) {
        status = -1;
        setReading(false);
        onReadEvents();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
