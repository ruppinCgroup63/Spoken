import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


//const apiUrl = 'https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Domains';
const apiUrl = 'https://localhost:7224/api/Domains';

function RegistrationPage2() {
    const navigate = useNavigate();
    const { state } = useLocation();
    let userObj = state;
    console.log(userObj);


    const [user, setUsers] = useState({
        UserName: userObj.user.UserName,
        Email: userObj.user.Email,
        Password: userObj.user.Password,
        ConfirmPassword: userObj.user.ConfirmPassword,
        Phone: userObj.user.Phone,
        LangName: userObj.user.LangName,
        DomainName: userObj ? userObj.user.DomainName : '',
        Job: userObj ? userObj.user.Job : '',
        Employee: userObj ? userObj.user.Employee : false,
    });

    //console.log(user);

    const [errors, setErrors] = useState({
        DomainName: '',
        Job: '',
    });


    console.log(user);


    // פונקציה זו תעדכן את state של ה־user בערך החדש של תיבת הסימון
    const handleEmployeeChange = (e) => {
        const isChecked = e.target.checked; // האם התיבה סומנה או לא
        setUsers(prevUser => ({
            ...prevUser,
            Employee: isChecked
        }));
    };

    //בחירת מקצוע domain name
    const [domainName, setDomain] = useState([]);

    useEffect(() => {
        getAllDomain();
    }, []); // רק כאשר הדף נטען , הפעלת getAllLang


    const getAllDomain = () => {

        fetch(apiUrl, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                if (!res.ok) { // Check if response status is not OK
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                setDomain(data); // שמירת  מהשרת בסטייט

            })
            .catch(error => {
                console.log("Domain error:", error);
            });

    }



    // ניהול הולידציות
    const handleValidation = (name, isValid, errorMessage) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: isValid ? '' : errorMessage,
        }));
    };

    const validateDomainName = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('DomainName', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                DomainName: text
            }));
        }
    };


    const validateJob = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('Job', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                Job: text
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

            navigate('/register3', { state: { user } });
            // clearAllFileds();   
        }

    };
    return (
        <>

            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5"  
                style={{ backgroundColor: "#E4E9F2" }}>
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
                                <label className="label" htmlFor="DomainName">
                                </label>
                                <select className={`select select-bordered w-full ${errors.DomainName ? 'input-error' : ''}`}
                                    onChange={validateDomainName}
                                    value={user.DomainName}
                                    aria-describedby={errors.DomainName ? 'DomainName-error' : ''}
                                >
                                    <option disabled value="">Choose Domain</option>
                                    {domainName.map((Domain, index) => (
                                        <option key={index} value={Domain.domainName}>{Domain.domainName}</option>
                                    ))}
                                </select>
                                {errors.DomainName && (
                                    <p id="DomainName-error" className="text-red-500 mt-2">{errors.DomainName}</p>
                                )}
                            </div>





                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.Job ? 'input-error' : ''}`} >
                                    <input
                                        type="text"
                                        className={`grow ${errors.Job ? 'input-error' : ''}`}
                                        placeholder="Job"
                                        onBlur={validateJob}
                                        aria-describedby={errors.Job ? 'Job-error' : ''}
                                        value={user.Job}
                                        onChange={(e) => setUsers({ ...user, Job: e.target.value })}
                                        style={{ borderColor: errors.Job ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.Job && (
                                    <p id="Job-error" className="text-red-500 mt-2">{errors.Job}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className="label cursor-pointer" >
                                    <span className="label-text">Employee</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={user.Employee} // קישור ערך תיבת הסימון לstate של ה־user
                                        onChange={handleEmployeeChange} // הוספת הפונקציה המתעדכנת בערך של תיבת הסימון
                                        style={{color: "#070A40",
                                        backgroundColor: "rgba(255, 255, 255, 0)",
                                        borderColor: "#070A40",
                                        }}  
                                    />
                                </label>
                            </div>
                            <br />
                            <div className="button-container" style={{ display: 'flex' }}>
                                <div className="form-control mt-6">
                                    <button style={{
                                        marginLeft: 'auto', color: "#070A40",
                                        backgroundColor: "rgba(255, 255, 255, 0)",
                                        borderColor: "#070A40"
                                    }} type="button" onClick={() => {

                                        navigate('/Register', { state: { user } })
                                    }
                                    }
                                        className="btn  btn-xs sm:btn-sm btn-outline btn-primary">Back</button>
                                </div>
                                <div style={{ flexGrow: '1' }}></div>
                                <div className="form-control mt-6">
                                    <button style={{ padding: '0.25rem 1rem', marginRight: 'auto' }} type="submit"
                                        className="btn btn-xs sm:btn-sm btn-primary continue">Continue</button>
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
