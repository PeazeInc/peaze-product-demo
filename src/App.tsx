import { PeazeSDK, SupportedNetwork } from "@peaze-labs/react";
import {
  Button,
  Box,
  Container,
  Text,
  VStack,
  Link,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  LightMode,
  Flex,
  Spacer
} from "@chakra-ui/react";
import { ethers, constants } from "ethers";
import { useState, useCallback } from "react";
import CrowdFundingEventAbi from "./abi.json";
import { DepositHistory, Header, PeazeHeading } from "./components";
import { CONTRACT_ADDRESS, CONTRACT_LINK } from "./config";
import { combineDatasets, rpcProvider } from "./utils";
import { useReadEvents } from "./hooks/useReadEvents";
import { useSubscribeEvent } from "./hooks/useSubscribeEvent";

const peaze = new PeazeSDK({
  id:
    process.env.REACT_APP_SDK_ID ||
    "2b122d676fbd9ddc37d4e0c39814134cdf31bc04ccc8c554b191b0efc6d3ac66",
  key:
    process.env.REACT_APP_SDK_KEY ||
    "bddcdeed6109ecf84079eec01a414048985f218e85604862f099bdc24b3f2271",
  environment: "PRODUCTION",
  network: {
    chainId: SupportedNetwork.PolygonMumbai
  }
});

type DepositEvent = {
  blockNumber: number;
  hash: string;
  account: string;
  token: string;
  amount: string;
};

export default function App() {
  const [signer, setSigner] = useState<any>(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [data, setData] = useState<DepositEvent[]>([]);
  const [fetching, setFetching] = useState(false);
  const [reading, setReading] = useState(false);

  const onReadEvents = useCallback((newData?: DepositEvent[]) => {
    if (newData) {
      setData((data) => {
        const updatedData = combineDatasets(data, newData);
        updatedData.sort((a, b) => b.blockNumber - a.blockNumber);
        return updatedData;
      });
    } else {
      setData([]);
    }
  }, []);

  const onNewEvent = useCallback((event: DepositEvent) => {
    setData((data) => {
      const updatedData = combineDatasets(data, [event]);
      updatedData.sort((a, b) => b.blockNumber - a.blockNumber);
      return updatedData;
    });

    setFetching(false);
  }, []);

  const getSigner = async () => {
    const signer = await peaze.getSigner(rpcProvider);
    setSigner(signer);
    setIsLoggedin(true);
  };

  const deposit = async () => {
    try {
      const eventContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CrowdFundingEventAbi,
        signer
      );
      await eventContract.deposit(constants.AddressZero, 0, {
        value: ethers.utils.parseEther("1")
      });

      // TODO: This line never reaches
      setFetching(true);
    } catch (error) {
      console.error("Deposit error", error);
    }
  };

  // Add this back later
  const openWallet = async () => {
    await peaze.getWallet();
  };

  useReadEvents({
    onReadEvents,
    setReading
  });

  useSubscribeEvent({ onNewEvent });

  const filteredData = data.filter(
    ({ account }) => account === signer?.address
  );

  return (
    <Box height="100vh">
      <LightMode>
        <Header />
        <Container
          maxW={"lg"}
          centerContent
          height={{ base: "calc(100% - 130px)", sm: "calc(100% - 110px)" }}
        >
          {!isLoggedin ? (
            <>
              <Flex
                alignContent="center"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Spacer />
                <VStack>
                  <PeazeHeading />
                  <Text mb={4} align="center">
                    Sign in with your email
                    <br />
                    to see the Peaze SDK create a wallet for you
                  </Text>
                  <Button onClick={getSigner} colorScheme="purple">
                    Sign In
                  </Button>
                </VStack>
                <Spacer />
              </Flex>
            </>
          ) : (
            <>
              <VStack mb={7} mt={2} spacing={5}>
                <PeazeHeading />
                <Text mb={4} align="center">
                  Peaze enables{" "}
                  <Link color="purple.500" href={CONTRACT_LINK} isExternal>
                    fiat to smart contract
                  </Link>{" "}
                  funding with a credit card.
                  <br />
                  Click "Deposit" below to get started.
                </Text>
                <VStack>
                  <HStack>
                    <InputGroup size="md">
                      <Input
                        pr="7.5rem"
                        type="number"
                        placeholder="1"
                        disabled={true}
                      />
                      <InputRightElement width={"4rem"} pr="0.1rem">
                        <Text>MATIC</Text>
                      </InputRightElement>
                    </InputGroup>
                    <Button colorScheme="purple" onClick={deposit}>
                      Deposit
                    </Button>
                    {/* We will add this back later  */}
                    <Button colorScheme="purple" onClick={openWallet}>
                      Wallet
                    </Button>
                  </HStack>
                  <DepositHistory
                    loading={reading || fetching}
                    data={filteredData}
                  />
                </VStack>
              </VStack>
            </>
          )}
        </Container>
      </LightMode>
    </Box>
  );
}
