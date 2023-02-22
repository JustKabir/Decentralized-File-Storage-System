import React from 'react'
import './getDataInput.css'

const GetDataInput = ({ contract, account, setData }) => {

  const getData = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address-input").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      console.log(str);
      console.log(str_array);
      const images = str_array.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank" rel="noreferrer">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt="new"
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };

  return (
    <div>
      <p className='address-title'>Get your data</p>
      <input
        type="text"
        placeholder="Enter Address"
        className="address-input"
      />
      <button className="get-data-btn" onClick={() => getData()}>
        Get Data
      </button>
    </div>
  )
}

export default GetDataInput