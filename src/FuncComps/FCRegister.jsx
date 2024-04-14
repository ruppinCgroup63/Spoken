import React, { useState  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



function RegistrationPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    let userObj = state;
    
    console.log(userObj);
    console.log('check:' + userObj);

    const [user, setUsers] = useState({
        username: userObj ? userObj.user.username : '',
        email: userObj ? userObj.user.email : '',
        password: userObj ? userObj.user.password : '',
        confirmPassword: userObj ? userObj.user.confirmPassword : '',
        phone: userObj ? userObj.user.phone : '',
        transcription: userObj ? userObj.user.transcription : '',
     
    });

    //בדיקת שגיאות
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        transcription: '',
    }); 

   
    
   

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
        handleValidation('username', isValid, 'Invalid input! Only English letters');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                username: text
            }));
        }
    };

    //ולידציה למייל
    const validateEmail = (e) => {
        const text = e.target.value;
        const regexEmail = /^[^\s@]+@[^\s@]+\.(?:com)$/;
        const isValid = regexEmail.test(text);
        handleValidation('email', isValid, 'follow the format abc@gmail.com abc@yahoo.com');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                email: text
            }));
        }
    };

    //ולידציה לסיסמא
    const validatePassword = (e) => {
        const text = e.target.value;
        const regexPassworde = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>\/?]{7,12}$/;
        const isValid = regexPassworde.test(text);
        handleValidation('password', isValid, 'Invalid password! Password must contain between 7 and 12 characters, at least one special character, one uppercase letter, and one number.');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                password: text
            }));
        }
    };

    //ולידציה לאימות הסיסמא
    const validateConfirmPassword = (e) => {
        const text = e.target.value;
        if (text == user.password) {
            handleValidation('confirmPassword', true, '');
            setUsers(prevUser => ({
                ...prevUser,
                confirmPassword: text
            }));
        }
        else {
            handleValidation('confirmPassword', false, 'Passwords arent the same. currecet your password');
        }
    };

    //ולידציה למספר פלאפון
    const validatePhone = (e) => {
        const text = e.target.value;
        const regexPhone = /^05\d{1}-?\d{3}-?\d{4}$/;
        const isValid = regexPhone.test(text);
        handleValidation('phone', isValid, 'Incorrect format! Please write in the format 05X-XX-XXXXX');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                phone: text
            }));
        }
    };


    
    const validateLanguage = (e) => {
        const selectedLanguage = e.target.value;
        const isValid = selectedLanguage !== '';
        handleValidation('transcription', isValid, 'Please select a transcription language');
        if (isValid) {
            setUsers(prevUser => ({
                ...prevUser,
                transcription: selectedLanguage
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
          
            clearAllFileds();                   
            navigate('/register2', {
                state: {
                  user: {
                    ...user,
                    job: userObj ? userObj.user.job : '',
                    parcticeArea: userObj ? userObj.user.parcticeArea : '',
                    employee: userObj ? userObj.user.employee : false
                  }
                }
              });
    }};


    const clearAllFileds = () => {
        setUsers({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            transcription: '',
        });
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5">
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
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }} className="steps">
                                <div style={{ marginRight: '1rem' }} className="step step-primary">General</div>
                                <div style={{ marginRight: '1rem' }} className="step ">More<br></br>details</div>
                                <div style={{ marginRight: '1rem' }} className="step ">Signature</div>
                            </div>
                            <br /><br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.username ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={`grow ${errors.username ? 'input-error' : ''}`}
                                        placeholder="Username"
                                        onBlur={validateUserName}
                                        aria-describedby={errors.username ? 'username-error' : ''}
                                        value={user.username}
                                        onChange={(e) => setUsers({ ...user, username: e.target.value })}
                                        style={{ borderColor: errors.username ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.username && (
                                    <p id="username-error" className="text-red-500 mt-2">{errors.username}</p>
                                )}



                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.email ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={`grow ${errors.email ? 'input-error' : ''}`}
                                        placeholder="Email"
                                        onBlur={validateEmail}
                                        aria-describedby={errors.email ? 'email-error' : ''}
                                        value={user.email}
                                        onChange={(e) => setUsers({ ...user, email: e.target.value })}
                                        style={{ borderColor: errors.email ? '#e53e3e' : '' }}

                                    />
                                </label>
                                {errors.email && (
                                    <p id="email-error" className="text-red-500 mt-2">{errors.email}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label className={`input input-bordered flex items-center gap-2 relative ${errors.password ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="password"
                                        className={`grow ${errors.password ? 'input-error' : ''}`}
                                        placeholder='Password'
                                        onBlur={validatePassword}
                                        aria-describedby={errors.password ? 'password-error' : ''}
                                        value={user.password}
                                        onChange={(e) => setUsers({ ...user, password: e.target.value })}
                                        style={{ borderColor: errors.password ? '#e53e3e' : '' }}

                                    />
                                </label>
                                {errors.password && (
                                    <p id="password-error" className="text-red-500 mt-2">{errors.password}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label  className={`input input-bordered flex items-center gap-2 relative ${errors.confirmPassword ? 'input-error' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="password"
                                        className={`grow ${errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder='Confirm Password'
                                        onBlur={validateConfirmPassword}
                                        aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : ''}
                                        value={user.confirmPassword}
                                        onChange={(e) => setUsers({ ...user, confirmPassword: e.target.value })}
                                        style={{ borderColor: errors.confirmPassword ? '#e53e3e' : '' }}
                                    />
                                </label>
                                {errors.confirmPassword && (
                                    <p id="confirmPassword-error" className="text-red-500 mt-2">{errors.confirmPassword}</p>
                                )}
                            </div>
                            <br />
                            <div className="form-control">
                                <label htmlFor="phone" className={`input input-bordered flex items-center gap-2 relative ${errors.phone ? 'input-error' : ''}`}>
                                    Phone:
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                                        placeholder="05X-XX-XXXXX"
                                        onBlur={validatePhone}
                                        aria-describedby={errors.phone ? 'phone-error' : ''}
                                        value={user.phone}
                                        onChange={(e) => setUsers({ ...user, phone: e.target.value })}
                                        style={{ borderColor: errors.phone ? '#e53e3e' : '' }}
                                        id="phone"
                                    />
                                </label>
                                {errors.phone && (
                                    <p id="phone-error" className="text-red-500 mt-2">{errors.phone}</p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="transcription">
                                </label>
                                <select className={`select select-bordered w-full ${errors.transcription ? 'input-error' : ''}`}
                                onChange={validateLanguage}
                                value={user.transcription}
                                aria-describedby={errors.transcription ? 'transcription-error' : ''}
                                >
                                    <option disabled value="">Choose a language</option>
                                    <option value="hebrew">Hebrew</option>
                                    <option value="english">English</option>
                                </select>
                                {errors.transcription && (
                                 <p id="transcription-error" className="text-red-500 mt-2">{errors.transcription}</p>
                                )}
                            </div>
                            <div className="button-container" style={{ display: 'flex' }}>
                            <div style={{ marginLeft: 'auto' }} className="form-control mt-6">
                                <button 
                            onClick={() => navigate('/')  } type="button" 
                                className="btn  btn-xs sm:btn-sm btn-outline btn-primary">Back</button>
                            </div>
                            <div style={{ flexGrow: '1' }}></div> 
                            <div className="form-control mt-6">
                                <button  style={{ padding: '0.25rem 1rem',marginRight: 'auto'}} type="submit" 
                                className="btn btn-xs sm:btn-sm  btn-primary">Continue</button>
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
