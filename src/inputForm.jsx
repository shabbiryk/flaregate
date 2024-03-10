import { useState } from "react";
import { ethers } from "ethers";

const BridgeInputPage = ({ connectedAccount }) => {
  const [destinationChain, setDestinationChain] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const sepoliaAddress = [
    "0xfE59201C767a9E6DDEc1fBe5D978DC41Ef8b5210",
    "0xa23296c562Fa47dbd47998ca28Eb32Ebd46006CF",
    "0x3Eaa2fA1b7dE17CC5bc130D63A73396914d4b8Fd",
    "0xC20f5542c8D3Cf035AB06d85818F0138edd6F684",
    "0x66bE4C58Bba3bAa5e2D36Ff1937E996A13d36B0e",
    "0xaBFEF12033F86d718A11C6E4e4FC2F54e2e48249",
    "0x0c59c66a8394963B6195B0B53d936e8e560a4d85",
  ];
  const canconAddress = [
    "0x7977957C48849e1f3A4Dc16bEEE9b9097a1d2271",
    "0xDf3E9fd1B69bc77e8bC4470E5690939082095f38",
    "0x01589CFEcd705dD654Db3Fa587aAB028cF252c3C",
    "0x10616a06B247Fc7eEE51dCA2b671878d18d036F1",
    "0x0FE38f8e2866a782a93aA950f7792A7a9Db8E3Bf",
    "0xA4331B3c6AEaE2C4828772b0Fa1E5848a1Ed433F",
    "0xEAc497403A613F0083DA9aA183838e2f27435C0c",
    "0x3F35402c436BB61dE85206E68bA0F30c239068b6",
    "0x2D49066303f6fFa88027Caa5c6F41Bd71109f4dB",
    "0x013F8ccB524E65DcDF5eD76a9678cf665e02cd4A",
  ];
  const [inputs, setInputs] = useState({
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
  const inputSanitation = () => {
    // first make clear that sepolia and coston is approved
    if (destinationChain !== "sepolia" || destinationChain !== "coston") {
      alert(`Please make sure destination is  either sepolia or coston`);
    }
  };
  const getSpenderContractAddress = () => {
    if (destinationChain === "sepolia") {
      return "0x2f48135AdF44c99999cA0d6d21bD49466AaD74Fd";
    } else {
      return "0x7b4d5e9388dBdB0161186D605379dafA3dc22100";
    }
  };
  const approveFirst = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function approve(address spender, uint256 amount)"],
      signer,
    );
    try {
      const spender = getSpenderContractAddress();
      const tx = await tokenContract.approve(spender, parseInt(inputs.input3));
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
      getSpenderContractAddress(),
      [
        "function requestRelay(address _relayTarget, bytes memory _additionalCalldata, address _sourceToken, uint256 _amount)",
      ],
      signer,
    );

    try {
      // Call your contract function
      const tx = await contract.requestRelay(
        inputs.input4,
        "0x",
        tokenAddress,
        parseInt(inputs.input3),
      );

      // Wait for the transaction to be mined
      await tx.wait();

      console.log("Contract function call successful:", tx.hash);
    } catch (error) {
      console.error("Error calling contract function:", error.message);
    }
  };
  const handleStartButtonClick = async () => {
    console.log(inputs);
    console.log(destinationChain);
    console.log(tokenAddress);
    console.log(connectedAccount);
    console.log(getSpenderContractAddress());
    try {
      await approveFirst();
      await callRelayer();
      setInputs({ input3: "", input4: "" });
      setDestinationChain("");
      setTokenAddress("");
    } catch (error) {
      alert("Sorry something went wrong, start again ?");
      console.log(error);
    }
  };

  return (
    <div className="w-1/2 mx-auto p-4">
      <div className="mb-2">
        <label htmlFor="input4" className="block mb-1 font-semibold">
          Destination Chain
        </label>
        <select
          value={destinationChain}
          onChange={(e) => {
            setDestinationChain(e.target.value);
          }}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        >
          <option value="" disabled>
            Select a destination chain
          </option>
          <option value="coston">coston</option>
          <option value="sepolia">Sepolia</option>
        </select>

        {/*<input
          type="text"
          id="input4"
          name="input4"
          value={inputs.input4}
          onChange={handleInputChange}
          placeholder="Enter destination chain either Coston or Sepolia"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />*/}
      </div>
      <div className="mb-2">
        <label htmlFor="input1" className="block mb-1 font-semibold">
          Token Address
        </label>
        {/*<input
          type="text"
          id="input1"
          name="input1"
          value={inputs.input1}
          onChange={handleInputChange}
          placeholder="Choose from whitelisted testnet address"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />*/}

        {destinationChain && (
          <select
            value={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          >
            <option value="" disabled>
              Choose Token Address
            </option>
            {destinationChain == "sepolia"
              ? canconAddress.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))
              : sepoliaAddress.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
          </select>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="input4" className="block mb-1 font-semibold">
          Receiver Address
        </label>
        <input
          type="text"
          id="input4"
          name="input4"
          value={inputs.input4}
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
