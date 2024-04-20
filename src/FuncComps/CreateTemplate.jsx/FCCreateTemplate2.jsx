import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Block = ({ index }) => {
  return (
    <div className="my-2 p-4 bg-white shadow-md rounded-md">
      <input
        type="text"
        placeholder={`Headline for block ${index}`} // Added template literal backticks
        className="input input-bordered input-sm w-full mb-2"
      />
      <textarea
        placeholder="Enter text..."
        className="textarea textarea-bordered w-full h-24"
      ></textarea>
    </div>
  );
};

function CreateTemplate2() {
  const navigate = useNavigate();
  const { state } = useLocation();
  let templateObj = state ;
  console.log(templateObj);

  const [blocks, setBlocks] = useState([]);
  const [template, setTemplate] = useState({
     name:  templateObj ? templateObj.template.name : '' 
    });

    console.log(template.name);

  const addBlock = () => {
    setBlocks((prevBlocks) => [...prevBlocks, <Block index={prevBlocks.length + 1} key={prevBlocks.length} />]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };
  return (
    <div className="flex items-center justify-center bg-light-blue-500 py-10"> {/* Removed min-h-screen and adjusted padding */}
      <div className="card max-w-xs mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Navigation Steps */}
            <div className="steps space-x-2 mb-4"> {/* Adjusted bottom margin */}
              <div className="step step-primary" data-content="✓">Name</div>
              <div className="step step-primary">Template structure</div>
              <div className="step">Key<br></br>words</div>
            </div>
            <h3 className="card-title text-dark-blue-500" style={{ display: 'block', margin: '0 auto', marginBottom: '0.5rem' }}>template structure</h3>
            
            
            <div>
            <label className={`input input-bordered flex items-center gap-2 relative`} >
                <input 
                type="text" 
                className={`grow`}
                value={template.name} 
                placeholder="User Name"
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                />
              </label>
              </div>

            {/* Blocks */}
            <div className="space-y-4"> {/* Added space between blocks */}
              {blocks}
            </div>

            {/* Add Block Button */}
            <div className="text-center"> {/* Centered button */}
              <button
                type="button"
                className="btn btn-circle btn-success"
                onClick={addBlock}
              >
                +
              </button>
            </div>

            

            {/* Action Buttons */}
            <div className="flex justify-between mt-6"> {/* Adjusted margin */}
              <button type="button" onClick={() => navigate('/CreateTemplate' , {state: {template}})} className="btn btn-outline btn-primary">Back</button>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplate2;