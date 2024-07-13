import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Web3 from "web3";
import { abi, address } from "../web3/launchpad";
import { Button } from "@mui/material";

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(undefined);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
          }
        })
        .catch((error) =>
          console.error("Error checking connected accounts:", error)
        );
    } else {
      console.error("MetaMask not found");
    }
  }, []);

  const handleConnectWallet = () => {
    return window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => setAccount(accounts[0]))
      .catch((error) => console.error(error));
  };

  const launchpadContract = useMemo(() => {
    if (!web3) return;

    return new web3.eth.Contract(abi, address);
  }, [web3]);

  const createToken = useCallback(
    async (name, symbol) => {
      if (!account) return;
      if (!name || !symbol) return;

      try {
        const res = await launchpadContract.methods
          .createToken(name, symbol)
          .send({
            from: account,
            value: web3.utils.toWei("0.000001", "ether"),
            maxPriorityFeePerGas: web3.utils.toWei("0.004", "gwei"),
            maxFeePerGas: web3.utils.toWei("0.004", "gwei"),
          });

        const tokenContractAddress =
          res?.events?.TokenCreated?.returnValues?.tokenAddress;
        if (!tokenContractAddress) throw new Error(`Could now create token`);

        return tokenContractAddress;
      } catch (err) {
        console.log("Create token error: ", err);
        return false;
      }
    },
    [launchpadContract, account, web3]
  );

  // const buyToken = useCallback(
  //   async (name, symbol) => {
  //     if (!account) return;
  //     if (!name || !symbol) return;

  //     try {
  //       const res = await launchpadContract.methods
  //         .createToken(name, symbol)
  //         .send({
  //           from: account,
  //           value: web3.utils.toWei("0.000001", "ether"),
  //           maxPriorityFeePerGas: web3.utils.toWei("0.004", "gwei"),
  //           maxFeePerGas: web3.utils.toWei("0.004", "gwei"),
  //         });

  //       const tokenContractAddress =
  //         res?.events?.TokenCreated?.returnValues?.tokenAddress;
  //       if (!tokenContractAddress) throw new Error(`Could now create token`);

  //       return tokenContractAddress;
  //     } catch (err) {
  //       console.log("Create token error: ", err);
  //       return false;
  //     }
  //   },
  //   [launchpadContract, account, web3]
  // );

  // const sellToken = useCallback(
  //   async (name, symbol) => {
  //     if (!account) return;
  //     if (!name || !symbol) return;

  //     try {
  //       const res = await launchpadContract.methods
  //         .createToken(name, symbol)
  //         .send({
  //           from: account,
  //           value: web3.utils.toWei("0.000001", "ether"),
  //           maxPriorityFeePerGas: web3.utils.toWei("0.004", "gwei"),
  //           maxFeePerGas: web3.utils.toWei("0.004", "gwei"),
  //         });

  //       const tokenContractAddress =
  //         res?.events?.TokenCreated?.returnValues?.tokenAddress;
  //       if (!tokenContractAddress) throw new Error(`Could now create token`);

  //       return tokenContractAddress;
  //     } catch (err) {
  //       console.log("Create token error: ", err);
  //       return false;
  //     }
  //   },
  //   [launchpadContract, account, web3]
  // );

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        handleConnectWallet,
        createToken,
        // buyToken,
        // sellToken,
      }}
    >
      <Button onClick={() => createToken("test2", "t2")}>Click me</Button>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
