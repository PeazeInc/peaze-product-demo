import { AlchemyProvider } from "@ethersproject/providers";
import { getAddress, hexStripZeros } from "ethers/lib/utils";
import { SupportedNetwork, defaultRpcProviders } from '@peaze-labs/react';
import { CHAIN_ID } from "./config";
type DepositEvent = {
  blockNumber: number;
  hash: string;
  account: string;
  token: string;
  amount: string;
};

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// export const rpcProvider = new AlchemyProvider(CHAIN_ID, alchemyKey);
export const rpcProvider = defaultRpcProviders[SupportedNetwork.PolygonMumbai];

export const shortenHexString = (address: string, amount = 4) => {
  return address.slice(0, amount + 2) + "..." + address.slice(-amount);
};

export const checksumAddress = (address: string) => {
  return getAddress(address.toLowerCase());
};

export const convertFromHexString = (hexString: string) => {
  let strippped = hexStripZeros(hexString);
  const len = strippped.length;

  if (len < 42) {
    const missing = 42 - len;
    strippped = "0x" + "0".repeat(missing) + strippped.slice(2);
  }

  return checksumAddress(strippped);
};

export const combineDatasets = (
  data: DepositEvent[],
  newData: DepositEvent[]
) => {
  const obj: Record<string, boolean> = {};

  const result: DepositEvent[] = [];
  for (const row of data) {
    if (!obj[row.hash]) {
      obj[row.hash] = true;
    } else {
      continue;
    }

    result.push(row);
  }

  for (const row of newData) {
    if (!obj[row.hash]) {
      obj[row.hash] = true;
    } else {
      continue;
    }

    result.push(row);
  }

  return result;
};
