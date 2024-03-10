import React, { useState, useEffect } from "react";
const NavBar = ({ onAccountChange }) => {
  const [account, setAccount] = useState("");

  const checkAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        onAccountChange(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking account:", error);
    }
  };

  const handleConnect = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      checkAccount();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  useEffect(() => {
    checkAccount();
  }, []);
  return (
    <>
      <nav className="bg-black p-4 flex justify-between">
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">FlareBridge</span>
        </div>
        <div className="flex items-center">
          {account ? (
            <div>
              <p className="text-white">Connected Account: {account}</p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-white text-black px-6 py-2 mx-2 rounded-md"
            >
              Connect to MetaMask
            </button>
          )}
        </div>
      </nav>{" "}
    </>
  );
};
export default NavBar;
