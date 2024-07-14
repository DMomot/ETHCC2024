import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Web3 from "web3";
import { launchpadAbi, erc20Abi, launchpadAddress } from "../web3/launchpad";

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

    return new web3.eth.Contract(launchpadAbi, launchpadAddress);
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
            maxPriorityFeePerGas: web3.utils.toWei("0.04", "gwei"),
            maxFeePerGas: web3.utils.toWei("0.04", "gwei"),
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

  const buyToken = useCallback(
    async (token_address, amount) => {
      if (!account) return;
      if (!token_address || !amount) return;

      console.log(token_address, 0, web3.utils.toWei(amount, "ether"));
      console.log(
        account,
        web3.utils.toWei(amount, "ether"),
        web3.utils.toWei("0.04", "gwei"),
        web3.utils.toWei("0.04", "gwei")
      );
      try {
        const res = await launchpadContract.methods
          .swap(token_address, 0, web3.utils.toWei(amount, "ether"))
          .send({
            from: account,
            value: web3.utils.toWei(amount, "ether"),
            maxPriorityFeePerGas: web3.utils.toWei("0.04", "gwei"),
            maxFeePerGas: web3.utils.toWei("0.04", "gwei"),
          });

        if (!res) throw new Error(`Could now buy token`);

        return true;
      } catch (err) {
        console.log("Buy token error: ", err);
        return false;
      }
    },
    [launchpadContract, account, web3]
  );

  const sellToken = useCallback(
    async (token_address, amount) => {
      if (!account) return;
      if (!token_address || !amount) return;

      try {
        const tokenContract = new web3.eth.Contract(erc20Abi, token_address);

        const approveRes = await tokenContract.methods
          .approve(launchpadAddress, web3.utils.toWei(amount, "ether"))
          .send({
            from: account,
            value: web3.utils.toWei("0", "ether"),
            maxPriorityFeePerGas: web3.utils.toWei("0.04", "gwei"),
            maxFeePerGas: web3.utils.toWei("0.04", "gwei"),
          });

        if (!approveRes) throw new Error();

        const sellRes = await launchpadContract.methods
          .swap(token_address, web3.utils.toWei(amount, "ether"), 0)
          .send({
            from: account,
            value: web3.utils.toWei("0", "ether"),
            maxPriorityFeePerGas: web3.utils.toWei("0.04", "gwei"),
            maxFeePerGas: web3.utils.toWei("0.04", "gwei"),
          });

        if (!sellRes) throw new Error(`Could now sell token`);

        return true;
      } catch (err) {
        console.log("Sell token error: ", err);
        return false;
      }
    },
    [launchpadContract, account, web3]
  );

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        handleConnectWallet,
        createToken,
        buyToken,
        sellToken,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
