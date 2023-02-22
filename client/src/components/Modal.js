import { useEffect, useState } from "react";
import "./Modal.css";
const Modal = ({ setModalOpen, contract }) => {
  const [selectOptions, setSelectOptions] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedAddressState, setSelectedAddressState] = useState('')
  const [addressInput, setAddressInput] = useState('')

  const accessList = async () => {
    const addressList = await contract.shareAccess();
    setSelectOptions(addressList)
  };

  useEffect(() => {
    setSelectOptions([])
    setSelectedAddress('')
    setAddressInput('')
    contract && accessList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const handleSelect = (e) => {
    if (e.target.value === '') {
      setSelectedAddress('')
      setSelectedAddressState('')
      setAddressInput('')
      return
    }
    const value = e.target.value.split(',')
    console.log(value);
    setSelectedAddress(value[0])
    setSelectedAddressState(value[1])
    setAddressInput(value[0])
  }

  const handleShare = async () => {
    const address = document.querySelector(".modalContainer .address-input").value;
    contract.allow(address)
      .then(() => {
        contract && accessList();
        setSelectOptions('')
        setSelectedAddress('')
        setAddressInput('')
        setModalOpen(false);
      })
  };

  const handleRevoke = async () => {
    contract.disallow(selectedAddress)
      .then(() => {
        contract && accessList();
        setSelectOptions('')
        setSelectedAddress('')
        setAddressInput('')
        setModalOpen(false);
      })
  }

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">{selectedAddress ? 'Revoke selected' : 'Share with'}</div>
          <div className="body">
            <input
              type="text"
              className="address-input modal-address-input"
              placeholder="Enter Address"
              defaultValue={addressInput}
              onChange={(e) => { setAddressInput(e.target.value) }}
            />
          </div>
          <form id="myForm">
            <select id="selectNumber" defaultValue={selectedAddress} onChange={(e) => { handleSelect(e); }} className="address-select">
              <option className="address" value={''}>People With Access</option>
              {
                selectOptions && selectOptions.map((address) => {
                  return <option className="address" key={address} value={address}>{address.toString()}</option>
                })
              }
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
              className="cancel-btn"
            >
              Cancel
            </button>
            {
              selectedAddress === addressInput && selectedAddress !== '' && selectedAddressState === 'true'
                ? <button onClick={() => { handleRevoke() }} className="revoke-btn">Revoke</button>
                : <button onClick={() => handleShare()} className="share-btn">Share</button>
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
