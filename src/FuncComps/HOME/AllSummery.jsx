import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../CreateTemplate/style.css";
import CardSummary from "./FCCardSummary";

function AllSummery() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [filteredSummaries, setFilteredSummaries] = useState([]);

  const apiUrlSummaries = "https://localhost:44326/api/Summary/getByUserEmail";
  const apiUrlCustomers = "https://localhost:44326/api/Customers";
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  // fetch all summary
  useEffect(() => {
    const fetchAllSummaries = async () => {
      try {
        const response = await fetch(apiUrlSummaries, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify(user.email),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from API:", errorText);
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setSummaries(data);
        setFilteredSummaries(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching summaries:", error);
        setError("Failed to fetch summaries. Please try again.");
      }
    };
    fetchAllSummaries();
  }, [user.email]);

  // fetch all customers
  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const response = await fetch(apiUrlCustomers, {
          method: "GET",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from API:", errorText);
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Failed to fetch customers. Please try again.");
      }
    };

    fetchAllCustomers();
  }, [user.email]);

  const handleSummaryClick = (summary) => {
    navigate("/SummaryPreview", {
      state: { summary, user },
    });
  };

  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);
    if (customerId === "") {
      setFilteredSummaries(summaries);
    } else {
      const filtered = summaries.filter(
        (summary) => summary.customerId === customerId
      );
      setFilteredSummaries(filtered);
    }
  };

  const handleButtonClick = () => {
    navigate("/HomePage");
  };

  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div
        className="card w-full max-w-md bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body flex flex-col items-start justify-center">
          <header className="flex justify-between items-start w-full align-self-start mb-4">
            <label
              className="btn btn-circle swap swap-rotate"
              style={{
                position: "absolute",
                top: "30px",
                left: "20px",
                backgroundColor: "#E4E9F2",
                borderColor: "#E4E9F2",
              }}
              onClick={handleButtonClick} //חזרה למסך הבית
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
            <div style={{ marginTop: "5px" }}>
              <h3
                className="text-sm"
                style={{ color: "#070A40", cursor: "pointer" }}
              ></h3>
            </div>
            <label
              className="btn btn-circle swap swap-rotate self-start"
              style={{
                backgroundColor: "#E4E9F2",
                alignSelf: "start",
                borderColor: "#E4E9F2",
                marginTop: "-18px",
                marginRight: "-15px",
              }}
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </header>
          <h1 style={{ margin: "0 auto" }}>
            <b>Summaries</b>
          </h1>
          <div
            className="flex items-center"
            style={{ marginBottom: "2rem", marginTop: "2rem", width: "100%" }}
          >
            <select
              className="form-select w-auto"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              style={{
                color: "#070A40",
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderColor: "#070A40",
                marginRight: "auto",
              }}
            >
              <option value="">All Customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>

          <main
            className="grid grid-cols-2 gap-2"
            style={{ marginTop: "2rem" }}
          >
            {filteredSummaries.map((summary) => (
              <div key={summary.summaryNo} className="cursor-pointer">
                <CardSummary
                  title={summary.summaryName}
                  description={summary.description}
                  tags={summary.tags || []}
                  onCardClick={() => handleSummaryClick(summary)}
                  onPreviewClick={() => handleSummaryClick(summary)}
                />
              </div>
            ))}
            {filteredSummaries.length === 0 && (
              <div className="w-full text-center">
                <p>No summary found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AllSummery;
