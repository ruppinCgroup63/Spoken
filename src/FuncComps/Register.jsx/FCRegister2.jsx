import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function RegistrationPage2() {
    const navigate = useNavigate();
    const { state } = useLocation();
    let userObj = state;
    console.log(userObj);


    const [user, setUsers] = useState({
        username: userObj.user.username ,
        email: userObj.user.email,
        password: userObj.user.password,
        confirmPassword: userObj.user.confirmPassword,
        phone: userObj.user.phone,
        transcription: userObj.user.transcription ,
        parcticeArea: userObj ? userObj.user.parcticeArea : '',
        job:  userObj ? userObj.user.job: '',
        employee:  userObj ? userObj.user.employee: false,
    });

    //console.log(user);

    const [errors, setErrors] = useState({
        parcticeArea: '',
        job: '',
    });


    console.log(user);


    // פונקציה זו תעדכן את state של ה־user בערך החדש של תיבת הסימון
    const handleEmployeeChange = (e) => {
        const isChecked = e.target.checked; // האם התיבה סומנה או לא
        setUsers(prevUser => ({
            ...prevUser,
            employee: isChecked
        }));
    };
    // ניהול הולידציות
    const handleValidation = (name, isValid, errorMessage) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: isValid ? '' : errorMessage,
        }));
    };

    const validateParcticeArea = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('parcticeArea', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                parcticeArea: text
            }));
        }
    };


    const validateJob = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('job', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                job: text
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        let validations = Object.values(errors);
        let userFields = Object.values(user);
        if (validations.some((value) => value !== '')) {
            console.log('Entering an invalid value in one of the fields');
        } else if (userFields.some((value) => value === '')) {
            console.log('You need to fill in all the fields ');
        } else {         
                          
            navigate('/register3',{state: {user}} );
           // clearAllFileds();   
        }

    };
    return (
        <>

            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5"  >
                    <div className="card-body flex items-center justify-center">
                        <h2 style={{ fontFamily: "" }} className="card-title text-center text-dark-blue-500">Register</h2>
                        <br />
                        <form onSubmit={handleSubmit}  >
                            <label className="btn btn-circle swap swap-rotate" style={{ position: 'absolute', top: '30px', right: '20px' }}>

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
                                <div style={{ marginRight: '1rem' }} className="step  step-primary">More<br></br>details</div>
                                <div style={{ marginRight: '1rem' }} className="step" >Signature</div>
                            </div>
                            <br /><br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.parcticeArea ? 'input-error' : ''}`} >
                                    <input
                                        type="text"
                                        className={`grow ${errors.parcticeArea ? 'input-error' : ''}`}
                                        placeholder="Parctice Area"
                                        onBlur={validateParcticeArea}
                                        aria-describedby={errors.parcticeArea ? 'parcticeArea-error' : ''}
                                        value={user.parcticeArea}
                                        onChange={(e) => setUsers({ ...user, parcticeArea: e.target.value })}
                                        style={{ borderColor: errors.parcticeArea ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.parcticeArea && (
                                    <p id="parcticeArea-error" className="text-red-500 mt-2">{errors.parcticeArea}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.job ? 'input-error' : ''}`} >
                                    <input
                                        type="text"
                                        className={`grow ${errors.job ? 'input-error' : ''}`}
                                        placeholder="Job"
                                        onBlur={validateJob}
                                        aria-describedby={errors.job ? 'job-error' : ''}
                                        value={user.job}
                                        onChange={(e) => setUsers({ ...user, job: e.target.value })}
                                        style={{ borderColor: errors.job ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.job && (
                                    <p id="job-error" className="text-red-500 mt-2">{errors.job}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className="label cursor-pointer" >
                                    <span className="label-text">Employee</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={user.employee} // קישור ערך תיבת הסימון לstate של ה־user
                                        onChange={handleEmployeeChange} // הוספת הפונקציה המתעדכנת בערך של תיבת הסימון

                                    />
                                </label>
                            </div>
                            <br />
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

export default RegistrationPage2;
