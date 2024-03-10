import React, { useState } from "react";

import BridgeInputPage from "./inputForm";
import NavBar from "./navbar";

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const handleAccountChange = (account) => {
    setConnectedAccount(account);
  };

  return (
    <>
      <NavBar onAccountChange={handleAccountChange} />
      <BridgeInputPage connectedAccount={connectedAccount} />
    </>
  );
}

export default App;
