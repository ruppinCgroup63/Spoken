import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



function CreateTemplate2() {
    const navigate = useNavigate();
    const { state } = useLocation();
    let templateObj = state;
     
    console.log(templateObj);

    const [template, setTemplate] = useState({
        name: '',


    });

    //בדיקת שגיאות
    const [errors, setErrors] = useState({
        name: '',

    });


    const handleValidation = (name, isValid, errorMessage) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: isValid ? '' : errorMessage,
        }));
    };


    //ולידציה לשם משתמש
    const validaterName = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('name', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setTemplate(prevUser => ({
                ...prevUser,
                name: text
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        navigate('/');
    };



    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card max-w-xs mx-auto bg-base-100 shadow-xl p-5">
                    <div className="card-body flex items-center justify-center">
                        <br />
                        <form onSubmit={handleSubmit}>
                            <label className="btn btn-circle swap swap-rotate" style={{ position: 'absolute', top: '30px', left: '20px' }}>

                                {/* this hidden checkbox controls the state */}
                                <input type="checkbox" />

                                {/* close icon */}
                                <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>

                            </label>
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }} className="steps">
                                <div style={{ marginRight: '1rem' }} className="step step-primary" data-content="✓">name</div>
                                <div style={{ marginRight: '1rem' }} className="step step-primary">Template<br></br>structure</div>
                                <div style={{ marginRight: '1rem' }} className="step ">Extras</div>
                            </div>
                            <br /><br />
                            <h3 className="card-title text-dark-blue-500" style={{ display: 'block', margin: '0 auto', marginBottom: '0.5rem' }}>template structure</h3>

                           
                            <div className="button-container" style={{ display: 'flex' }}>
                                <div className="form-control mt-6">
                                    <button style={{ marginLeft: 'auto' }} type="button" onClick={() => {
                                       
                                        navigate('/Register' , {state: {user}})
                                    }
                                    }
                                        className="btn  btn-xs sm:btn-sm btn-outline btn-primary">Back</button>
                                </div>
                                <div style={{ flexGrow: '1' }}></div>
                                <div className="form-control mt-6">
                                    <button style={{ padding: '0.25rem 1rem', marginRight: 'auto' }} type="submit"
                                        className="btn btn-xs sm:btn-sm btn-primary">Continue</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateTemplate2;
