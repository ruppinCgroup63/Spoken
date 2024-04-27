import React, { useState } from 'react';

const Block = ({ index }) => {
  return (
    <div className="my-2 p-4 bg-white shadow-md rounded-md">
      <input
        type="text"
        placeholder={`Headline for block ${index}`}
        className="input input-bordered input-sm w-full mb-2"
      />
      <textarea
        placeholder="Enter text..."
        className="textarea textarea-bordered w-full h-24"
      ></textarea>
    </div>
  );
};

function TemplateBuilder() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = () => {
    setBlocks((prevBlocks) => [...prevBlocks, <Block index={prevBlocks.length + 1} key={prevBlocks.length} />]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-500 text-white text-lg font-bold">
          Template Structure
        </div>
        <div className="p-4">
          <div>Name: Accepting a new client</div>
          <div className="my-4">
            {blocks}
            <button
              className="btn btn-circle btn-success my-2"
              onClick={addBlock}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between p-4 bg-gray-200">
          <button className="btn btn-outline">Back</button>
          <button className="btn btn-primary">Continue</button>
        </div>
      </div>
    </div>
  );
}

export default TemplateBuilder;
