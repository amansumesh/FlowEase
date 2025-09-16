import React, { useState } from "react";
function Collect() {
  const [clientID, setClientID] = useState("");

  const [clientSecret, setClientSecret] = useState("");

  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    console.log({ clientID, clientSecret, phone });
  };

  return (
    <div className="w-[800px] gap-3 p-5 rounded-2xl bg-white">
      <h1 className="text-xl text-center font-bold mb-5">Configurations</h1>
      <form onSubmit={handleSubmit}>
        <h1 className="text-md font-medium mt-6">Client ID</h1>
        <input
          value={clientID}
          onChange={(e) => setClientID(e.target.value)}
          placeholder="Enter Client ID"
          type="text"
          required
          className="w-[450px] pl-3 mt-3 border border-gray-300 rounded-lg"
        />
        <h1 className="text-md font-medium mt-6">Client Secret</h1>
        <input
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="Enter Client Secret"
          type="text"
          required
          className="w-[450px] pl-3 mt-3 border border-gray-300 rounded-lg"
        />
        <h1 className="text-md font-medium  mt-6">Phone Number</h1>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter Phone Number"
          type="tel"
          pattern="[0-9]{10}"
          required
          className="w-[450px] mt-3 pl-3 border border-gray-300 rounded-lg"
        />
        <div className="mt-6 flex justify-center">
          <input
            type="submit"
            value="Update"
            className="w-[250px] p-2 color font-medium bg-gradient-to-b from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}

export default Collect;
