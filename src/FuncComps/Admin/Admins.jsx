import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const apiUrl ='https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Users';
const apiUrl ='https://localhost:44326/api/Users';

function Admins() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(apiUrl, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
                console.log(users);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

    const handleDelete = (userEmail) => {
        fetch(`${apiUrl}/${userEmail}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                if (res.ok) {
                    setUsers(users.filter(user => user.email !== userEmail));
                } else {
                    console.error("Error deleting user");
                }
            })
            .catch(error => {
                console.error("Error deleting user:", error);
            });
    };

 

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
            <div className="card w-full max-w-4xl bg-base-100 shadow-xl p-5" style={{ backgroundColor: "#E4E9F2" }}>
                <div className="card-body">
                    <h2 className="card-title text-center text-dark-blue-500" style={{ Color: "#070A40" }}>Admin - Manage Users</h2>
                    <br />
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Language</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.email}>
                                            <td>{user.userName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.langName}</td>
                                            <td>
                                                
                                                <button 
                                                    className="btn btn-xs btn-outline btn-danger" 
                                                    onClick={() => handleDelete(user.email)}
                                                    style={{ color:'red',  backgroundColor: "rgba(255, 255, 255, 0)",borderColor: "red", }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="form-control mt-6">
                        <button 
                            onClick={() => navigate('/')} 
                            className="btn btn-xs sm:btn-sm btn-outline " 
                            style={{ color: "#070A40", backgroundColor: "rgba(255, 255, 255, 0)", borderColor: "#070A40" }}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admins;
