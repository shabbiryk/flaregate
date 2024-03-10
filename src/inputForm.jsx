import { useState } from "react";
import { ethers } from "ethers";

const BridgeInputPage = ({ connectedAccount }) => {
  const [signerR, setSignerR] = useState("");
  const [inputs, setInputs] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };
  const inputSanitation = (inputs) => {};
  const approveFirst = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setSignerR(signer);

    const tokenContract = new ethers.Contract(
      "0x7977957C48849e1f3A4Dc16bEEE9b9097a1d2271",
      ["function approve(address spender, uint256 amount)"],
      signer
    );
    try {
      const spender = "0x2f48135AdF44c99999cA0d6d21bD49466AaD74Fd";
      const tx = await tokenContract.approve(spender, 20);
      await tx.wait();
      console.log(tx.hash);
    } catch (error) {
      console.log(error);
    }
  };
  const callRelayer = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x2f48135AdF44c99999cA0d6d21bD49466AaD74Fd",
      [
        "function requestRelay(address _relayTarget, bytes memory _additionalCalldata, address _sourceToken, uint256 _amount)",
      ],
      signer
    );
    const tokenContractAddress = "0x7977957C48849e1f3A4Dc16bEEE9b9097a1d2271";
    try {
      // Call your contract function
      const tx = await contract.requestRelay(
        "0xE3224C9A2A1F5CcEdad97e07C426D7eE3F6332E2",
        "0x",
        tokenContractAddress,
        20
      );

      // Wait for the transaction to be mined
      await tx.wait();

      console.log("Contract function call successful:", tx.hash);
    } catch (error) {
      console.error("Error calling contract function:", error.message);
    }
  };
  const handleStartButtonClick = async () => {
    await approveFirst();
    await callRelayer();
    console.log(connectedAccount);
  };

  return (
    <div className="w-1/2 mx-auto p-4">
      <div className="mb-2">
        <label htmlFor="input4" className="block mb-1 font-semibold">
          Destination Chain
        </label>
        <input
          type="text"
          id="input4"
          name="input4"
          value={inputs.input4}
          onChange={handleInputChange}
          placeholder="Enter destination chain either Coston or Sepolia"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="input1" className="block mb-1 font-semibold">
          Token Address
        </label>
        <input
          type="text"
          id="input1"
          name="input1"
          value={inputs.input1}
          onChange={handleInputChange}
          placeholder="Choose from whitelisted testnet address"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="input2" className="block mb-1 font-semibold">
          Receiver Address
        </label>
        <input
          type="text"
          id="input2"
          name="input2"
          value={inputs.input2}
          onChange={handleInputChange}
          placeholder="Enter the recipient address"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="input3" className="block mb-1 font-semibold">
          Amount
        </label>
        <input
          type="text"
          id="input3"
          name="input3"
          value={inputs.input3}
          onChange={handleInputChange}
          placeholder="Enter the amount to send"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <button
        onClick={handleStartButtonClick}
        className="bg-black text-white px-4 py-2 rounded-md w-full"
      >
        Send
      </button>
    </div>
  );
};

export default BridgeInputPage;
