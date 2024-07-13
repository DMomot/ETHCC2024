import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";

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

  return (
    <Web3Context.Provider value={{ web3, account, handleConnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
