import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import ErrorMessage from '../FCErrorMessage';

const apiUrl = 'https://localhost:7224/api/Users';

function RegistrationPage3(props) {
    const navigate = useNavigate();
    const { state } = useLocation();
    let userObj = state;
    const sigCanvas = useRef(null);

    const [user, setUsers] = useState({
        UserName: userObj.user.UserName,
        Email: userObj.user.Email,
        Password: userObj.user.Password,
        ConfirmPassword: userObj.user.ConfirmPassword,
        Phone: userObj.user.Phone,
        Transcription: userObj.user.Transcription,
        ParcticeArea: userObj.user.ParcticeArea,
        Job: userObj.user.Job,
        Employee: userObj.user.Employee,
        Signature: '',
    });
    const [emailExists, setEmailExists] = useState(false); // סטייט למעקב אם האימייל כבר קיים

    const handleEnd = () => {
        if (sigCanvas.current) {
            setUsers(prevUser => ({
                ...prevUser,
                Signature: sigCanvas.current.toDataURL()
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.sendtoParent(user);

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            }
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", 'Signed up successfully');
                    console.log(result.UserName);
                    navigate('/');
                },
                (error) => {
                    console.log("err post=", 'the email already exists');
                    console.log(error);
                    setEmailExists(true); // עדכון הסטייט לאמת אם האימייל כבר קיים
                    setTimeout(() => {
                        navigate('/Register', { state: { user } });
                    }, 5000); // עיכוב במילי שניות (כאן 3000 מייצג 3 שניות)
                }
            );
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
                <div className="card w-full max-w-md bg-base-100 shadow-xl p-5" style={{ backgroundColor: "#E4E9F2" }}>
                    <div className="card-body flex items-center justify-center">
                        <h2 style={{ fontFamily: "" }} className="card-title text-center text-dark-blue-500">Register</h2>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <label className="btn btn-circle swap swap-rotate" style={{ position: 'absolute', top: '30px', right: '20px' }}>
                                <input type="checkbox" />
                                <svg className="swap-off fill-current" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                    <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                                </svg>
                                <svg className="swap-on fill-current" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                                </svg>
                            </label>
                            <div className="steps">
                                <div style={{ marginRight: '1rem' }} data-content="✓" className="step step-primary">General</div>
                                <div style={{ marginRight: '1rem' }} data-content="✓" className="step  step-primary">More<br />details</div>
                                <div style={{ marginRight: '1rem' }} className="step step-primary">Signature</div>
                            </div>
                            {emailExists && <ErrorMessage message="The email already exists. Please use a different email." />} {/* תצוגת הודעת השגיאה */}
                        
                            <br /><br />
                            <b><h1 style={{ fontSize: '15px' }}>Set a signature</h1></b>
                            <span style={{ fontSize: '12px' }}>set your signature in the rectangle below</span>
                            <br /><br />
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor='black'
                                canvasProps={{ width: 300, height: 150, className: 'signature-canvas', style: { border: '1px solid black', borderRadius: '10px' } }}
                                onEnd={handleEnd}
                            />
                            <br />
                            <br />
                            <div className="button-container" style={{ display: 'flex' }}>
                                <div className="form-control mt-6">
                                    <button style={{ marginLeft: 'auto' }} type="button" onClick={() => {
                                        navigate('/Register2', { state: { user } })
                                    }
                                    }
                                        className="btn btn-xs sm:btn-sm  btn-outline btn-primary">Back</button>
                                </div>

                                <div style={{ flexGrow: '1' }}></div>
                                <div className="form-control mt-6">
                                    <button style={{ padding: '0.25rem 1rem', marginRight: 'auto' }} type="submit"
                                        className="btn btn-xs sm:btn-sm  btn-primary">Save</button>

                                </div>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegistrationPage3;