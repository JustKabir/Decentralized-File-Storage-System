import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
import GetDataInput from "./components/getDataInput";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);



  return (
    <>
      {
        modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract} />
        )
      }
      <div className="App">
        <div className="header">
          <h1 className="app-logo">DGdrive3.0</h1>
          <p className="account">
            Account : {account ? account : "Not connected"}
          </p>
        </div>
        <main>
          <div className="main-grid-container">
            <div className="sider">
              <FileUpload
                account={account}
                provider={provider}
                contract={contract}
              />
              <GetDataInput contract={contract} account={account} setData={setData} />
              {
                !modalOpen && (
                  <>
                    <p className="share-title">Share your data</p>
                    <button className="share-btn" onClick={() => setModalOpen(true)}>
                      Share
                    </button>
                  </>
                )
              }
            </div>
            <Display data={data} />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
