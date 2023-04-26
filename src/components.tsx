import { Heading } from "@chakra-ui/react";
import { Container, Box, Button, Image } from "@chakra-ui/react";
import { default as Logo } from "./assets/logo.svg";
import React from "react";
import {
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  Spinner,
  Text,
  Flex,
  Spacer
} from "@chakra-ui/react";
import { shortenHexString } from "./utils";
import { formatEther } from "ethers/lib/utils";
import { EXPLORER_URL } from "./config";

type DepositEvent = {
  blockNumber: number;
  hash: string;
  account: string;
  token: string;
  amount: string;
};

interface Props {
  data: DepositEvent[];
  loading: boolean;
}

export function DepositHistory({ data, loading }: Props) {
  return (
    <TableContainer width="100%">
      <Table variant="striped" colorScheme="gray">
        <TableCaption placement="top">
          <Flex alignItems="center">
            <div>
              {`Deposit history ${
                data.length === 0 ? " (No deposits yet) " : ""
              }`}{" "}
            </div>
            <Spacer />
            {loading && (
              <Text as="div">
                Updating <Spinner size="sm" />
              </Text>
            )}
          </Flex>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Transaction</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(({ hash, amount }, idx) => (
            <Tr key={idx}>
              <Td>
                <Link
                  color="purple.500"
                  href={`${EXPLORER_URL}/tx/${hash}`}
                  isExternal
                >
                  {shortenHexString(hash, 3)}
                </Link>
              </Td>
              <Td isNumeric>{`${formatEther(amount)} MATIC`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export function PeazeHeading() {
  return (
    <Heading textAlign="center" size="md">
      {`Welcome to Peaze’s`}
      <br />
      {`product demo`}
    </Heading>
  );
}

export function Header() {
  const handleHelpClick = () => {
    window.open("https://docs.peaze.com/docs#how-does-it-work", "_blank");
  };

  return (
    <Box
      position="sticky"
      width="100%"
      py={{ base: "20px", sm: "32px" }}
      height={{ base: "130px", sm: "110px" }}
      minHeight={{ base: "130px", sm: "auto" }}
      top={0}
      background="white"
      zIndex={99}
    >
      <Container maxW="3xl" width={{ base: "60%", sm: "auto" }} height="100%">
        <Flex
          justifyContent={{ base: "auto", sm: "space-between" }}
          flexDirection={{ base: "column", sm: "row" }}
          height="100%"
        >
          <Image
            src={Logo}
            alt="Peaze demo"
            marginBottom={{ base: 5 }}
            height="auto"
            width="auto"
            maxH="100%"
            maxW="100%"
          />
          <Button
            padding={{ base: "0px", sm: "16px" }}
            onClick={handleHelpClick}
          >
            How does it work?
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
