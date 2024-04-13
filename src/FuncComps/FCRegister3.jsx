import React, { useState } from 'react';

function RegistrationPage3() {


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };
 
    return (
        <>

            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5"  >
                    <div className="card-body flex items-center justify-center">
                        <h2 style={{ fontFamily: "" }} className="card-title text-center text-dark-blue-500">Register</h2>
                        <br />
                        <form onSubmit={handleSubmit}  >
                            <label className="btn btn-circle swap swap-rotate" style={{position: 'absolute', top: '30px', right: '20px'}}>

                                {/* this hidden checkbox controls the state */}
                                <input type="checkbox" />

                                {/* hamburger icon */}
                                <svg className="swap-off fill-current" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                                </svg>

                                {/* close icon */}
                                <svg className="swap-on fill-current" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                                </svg>

                            </label>
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className="steps ">
                                <div style={{ marginRight: '1rem' }} data-content="✓" className="step step-primary">General</div>
                                <div style={{ marginRight: '1rem' }}  data-content="✓" className="step  step-primary">More<br></br>details</div>
                                <div style={{ marginRight: '1rem' }} className="step step-primary" >Signature</div>
                            </div>
                            <br /><br />
                           <b><h1 style={{fontSize:'15px'}}>Set a signature</h1></b>
                            <span style={{fontSize:'12px'}}>set your signature in the rectangle below</span>
                            <br></br>
                            <br></br>
                       
   
   
                            <br />
                            <div className="form-control mt-6">
                                <button type="submit" onClick={() => window.location.href = '/'} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-primary">Save</button>
                            </div>
                            <div className="form-control mt-6">
                                <button type="button" onClick={() => window.location.href = '/register2'} className="btn  btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-outline btn-primary">Back</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegistrationPage3;
