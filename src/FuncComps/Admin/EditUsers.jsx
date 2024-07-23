import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// const apiUrl ='https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Users';
const apiUrl ='https://localhost:44326/api/Users';
//const apiUrl = "https://localhost:7224/api/Users";

function EditUser() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userToEdit = state.user;

  const [user, setUser] = useState({
    UserName: userToEdit.UserName,
    Email: userToEdit.Email,
    Phone: userToEdit.Phone,
    LangName: userToEdit.LangName,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${apiUrl}/${userToEdit.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        navigate("/admin"); // Replace with the correct path to the admin page
      })
      .catch((error) => {
        setError("Failed to update user.");
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#E0F7FA",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#E4E9F2",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <div>
          <h2
            style={{
              textAlign: "center",
              color: "#007BFF",
            }}
          >
            Edit User
          </h2>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#007BFF",
                }}
              >
                Username
              </label>
              <input
                type="text"
                name="UserName"
                value={user.UserName}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#007BFF",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={user.Email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#007BFF",
                }}
              >
                Phone
              </label>
              <input
                type="text"
                name="Phone"
                value={user.Phone}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#007BFF",
                }}
              >
                Language
              </label>
              <input
                type="text"
                name="LangName"
                value={user.LangName}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/admin")} // Replace with the correct path to the admin page
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "center",
                  color: "#007BFF",
                  backgroundColor: "transparent",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "center",
                  color: "#fff",
                  backgroundColor: "#007BFF",
                }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
