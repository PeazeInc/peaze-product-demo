import React from "react";
import { BigNumber, ethers } from "ethers";
import { rpcProvider } from "../utils";
import { CONTRACT_ADDRESS } from "../config";
import CrowdFundingEventAbi from "../abi.json";

const eventContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CrowdFundingEventAbi,
  rpcProvider
);

type DepositEvent = {
  blockNumber: number;
  hash: string;
  account: string;
  token: string;
  amount: string;
};

interface Props {
  onNewEvent: (event: DepositEvent) => unknown;
}

export const useSubscribeEvent = ({ onNewEvent }: Props) => {
  React.useEffect(() => {
    const run = () => {
      console.log("startListener Deposit");

      eventContract.on("Deposit", (account, token, amount, log) => {
        onNewEvent({
          blockNumber: log.blockNumber,
          hash: log.transactionHash,
          account,
          token,
          amount: BigNumber.from(amount).toString()
        });
      });
    };

    run();

    return () => {
      eventContract.removeListener("Deposit", (...args) => {
        console.log("remove deposit listener", args);
      });
    };
  }, [onNewEvent]);
};
