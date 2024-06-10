import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//const apiUrl ='https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Langs';
const apiUrl ='https://localhost:44326/api/Langs';

function RegistrationPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    let userObj = state;
    

    console.log(userObj);
    console.log('check:' + userObj);

    const [user, setUsers] = useState({
        UserName: userObj ? userObj.user.UserName : '',
        Email: userObj ? userObj.user.Email : '',
        Password: userObj ? userObj.user.Password : '',
        ConfirmPassword: userObj ? userObj.user.ConfirmPassword : '',
        Phone: userObj ? userObj.user.Phone : '',
        LangName: userObj ? userObj.user.LangName : '',

    });

    //בדיקת שגיאות
    const [errors, setErrors] = useState({
        UserName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Phone: '',
        LangName: '',
    });

    const [language, setLang] = useState([]);

    useEffect(() => {
        getAllLang();
    }, []); // רק כאשר הדף נטען , הפעלת getAllLang


    const getAllLang = () => {

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
                setLang(data); // שמירת השפות שמתקבלות מהשרת בסטייט

            })
            .catch(error => {
                console.log("language error:", error);
            });



    }

    // ניהול הולידציות
    const handleValidation = (name, isValid, errorMessage) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: isValid ? '' : errorMessage,
        }));
    };


    //ולידציה לשם משתמש
    const validateUserName = (e) => {
        const text = e.target.value;
        const regexUserName = /^[a-zA-Z\s]{1,60}$/;
        const isValid = regexUserName.test(text);
        handleValidation('UserName', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                UserName: text
            }));
        }
    };

    //ולידציה למייל
    const validateEmail = (e) => {
        const text = e.target.value;
        const regexEmail = /^[^\s@]+@[^\s@]+\.(?:com)$/;
        const isValid = regexEmail.test(text);
        handleValidation('Email', isValid, 'follow the format abc@gmail.com abc@yahoo.com');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                Email: text
            }));
        }
    };

    //ולידציה לסיסמא
    const validatePassword = (e) => {
        const text = e.target.value;
        const regexPassworde = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>\/?]{7,12}$/;
        const isValid = regexPassworde.test(text);
        handleValidation('Password', isValid, 'Invalid Password! Password must contain between 7 and 12 characters, at least one special character, one uppercase letter, and one number.');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                Password: text
            }));
        }
    };

    //ולידציה לאימות הסיסמא
    const validateConfirmPassword = (e) => {
        const text = e.target.value;
        if (text == user.Password) {
            handleValidation('ConfirmPassword', true, '');
            setUsers(prevUser => ({
                ...prevUser,
                ConfirmPassword: text
            }));
        }
        else {
            handleValidation('ConfirmPassword', false, 'Passwords arent the same. currecet your Password');
        }
    };

    //ולידציה למספר פלאפון
    const validatePhone = (e) => {
        const text = e.target.value;
        const regexPhone = /^05\d{1}-?\d{3}-?\d{4}$/;
        const isValid = regexPhone.test(text);
        handleValidation('Phone', isValid, 'Incorrect format! Please write in the format 05X-XX-XXXXX');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                Phone: text
            }));
        }
    };


    //ולידציה לבחירת שפת תמלול
    const validateLanguage = (e) => {
        const selectedLanguage = e.target.value;
        const isValid = selectedLanguage !== '';
        handleValidation('LangName', isValid, 'Please select a LangName language');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                LangName: selectedLanguage
            }));
        }
    };
    // console.log(user);
    // console.log(errors);

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

        //    clearAllFileds();
            navigate('/register2', {
                state: {
                    user: {
                        ...user,
                        Job: userObj ? userObj.user.Job : '',
                        DomainName: userObj ? userObj.user.DomainName : '',
                        Employee: userObj ? userObj.user.Employee : false
                    }
                }
            });
        }
    };


    const clearAllFileds = () => {
        setUsers({
            UserName: '',
            Email: '',
            Password: '',
            ConfirmPassword: '',
            Phone: '',
            LangName: '',
        });
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5" style={{ backgroundColor: "#E4E9F2" }}>
                    <div className="card-body flex items-center justify-center">
                        <h2 className="card-title text-center text-dark-blue-500">Register</h2>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <label className="btn btn-circle swap swap-rotate" style={{ position: 'absolute', top: '30px', right: '20px' }}>

                                {/* this hidden checkbox controls the state */}
                                <input type="checkbox" />

                                {/* hamburger icon */}
                                <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>

                                {/* close icon */}
                                <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>

                            </label>
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className="steps">
                                <div style={{ marginRight: '1rem' }} className="step step-primary">General</div>
                                <div style={{ marginRight: '1rem' }} className="step ">More<br></br>details</div>
                                <div style={{ marginRight: '1rem' }} className="step ">Signature</div>
                            </div>
                            <br /><br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.UserName ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={`grow ${errors.UserName ? 'input-error' : ''}`}
                                        placeholder="UserName"
                                        onBlur={validateUserName}
                                        aria-describedby={errors.UserName ? 'UserName-error' : ''}
                                        value={user.UserName}
                                        onChange={(e) => setUsers({ ...user, UserName: e.target.value })}
                                        style={{ borderColor: errors.UserName ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.UserName && (
                                    <p id="UserName-error" className="text-red-500 mt-2">{errors.UserName}</p>
                                )}



                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.Email ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={`grow ${errors.Email ? 'input-error' : ''}`}
                                        placeholder="Email"
                                        onBlur={validateEmail}
                                        aria-describedby={errors.Email ? 'Email-error' : ''}
                                        value={user.Email}
                                        onChange={(e) => setUsers({ ...user, Email: e.target.value })}
                                        style={{ borderColor: errors.Email ? '#e53e3e' : '' }}

                                    />
                                </label>
                                {errors.Email && (
                                    <p id="Email-error" className="text-red-500 mt-2">{errors.Email}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.Password ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="Password"
                                        className={`grow ${errors.Password ? 'input-error' : ''}`}
                                        placeholder='Password'
                                        onBlur={validatePassword}
                                        aria-describedby={errors.Password ? 'Password-error' : ''}
                                        value={user.Password}
                                        onChange={(e) => setUsers({ ...user, Password: e.target.value })}
                                        style={{ borderColor: errors.Password ? '#e53e3e' : '' }}

                                    />
                                </label>
                                {errors.Password && (
                                    <p id="Password-error" className="text-red-500 mt-2">{errors.Password}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.ConfirmPassword ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="Password"
                                        className={`grow ${errors.ConfirmPassword ? 'input-error' : ''}`}
                                        placeholder='Confirm Password'
                                        onBlur={validateConfirmPassword}
                                        aria-describedby={errors.ConfirmPassword ? 'ConfirmPassword-error' : ''}
                                        value={user.ConfirmPassword}
                                        onChange={(e) => setUsers({ ...user, ConfirmPassword: e.target.value })}
                                        style={{ borderColor: errors.ConfirmPassword ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.ConfirmPassword && (
                                    <p id="ConfirmPassword-error" className="text-red-500 mt-2">{errors.ConfirmPassword}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label htmlFor="Phone" className={`input input-bordered flex items-center gap-2 relative ${errors.Phone ? 'input-error' : ''}`}>
                                    Phone:
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full ${errors.Phone ? 'input-error' : ''}`}
                                        placeholder="05X-XX-XXXXX"
                                        onBlur={validatePhone}
                                        aria-describedby={errors.Phone ? 'Phone-error' : ''}
                                        value={user.Phone}
                                        onChange={(e) => setUsers({ ...user, Phone: e.target.value })}
                                        style={{ borderColor: errors.Phone ? '#e53e3e' : '' }}
                                        id="Phone"
                                    />
                                </label>
                                {errors.Phone && (
                                    <p id="Phone-error" className="text-red-500 mt-2">{errors.Phone}</p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="LangName">
                                </label>
                                <select className={`select select-bordered w-full ${errors.LangName ? 'input-error' : ''}`}
                                    onChange={validateLanguage}
                                    value={user.LangName}
                                    aria-describedby={errors.LangName ? 'LangName-error' : ''}
                                >
                                    <option disabled value="">Choose a language</option>
                                    {language.map((lang, index) => (
                                        <option key={index} value={lang.language}>{lang.language}</option>
                                    ))}
                                </select>
                                {errors.LangName && (
                                    <p id="LangName-error" className="text-red-500 mt-2">{errors.LangName}</p>
                                )}
                            </div>
                            <div className="button-container" style={{ display: 'flex' }}>
                                <div style={{ marginLeft: 'auto' }} className="form-control mt-6">
                                    <button
                                        onClick={() => navigate('/')} type="button"
                                        className="btn  btn-xs sm:btn-sm btn-outline btn-primary" 
                                        style={{ color: "#070A40",
                                        backgroundColor: "rgba(255, 255, 255, 0)",
                                        borderColor: "#070A40"  }}>Back</button>
                                </div>
                                <div style={{ flexGrow: '1' }}></div>
                                <div className="form-control mt-6">
                                    <button style={{ padding: '0.25rem 1rem', marginRight: 'auto'  }} type="submit"
                                        className="btn btn-xs sm:btn-sm  btn-primary continue">Continue</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegistrationPage;
