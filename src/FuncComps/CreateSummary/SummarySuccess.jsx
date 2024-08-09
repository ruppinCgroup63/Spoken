import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';

export default function SummerySuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { blocks } = location.state || { blocks: [] }; // מקבל את הנתונים מהדף הקודם

  // שליפת המייל מה-`sessionStorage`
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userEmail = user ? user.email : '';

  const handleEmailClick = () => {
    // יצירת PDF באמצעות jsPDF
  };

  const handleWhatsAppClick = () => {
    // Implement WhatsApp sharing functionality
  };

  const handleBackHomeClick = () => {
    // Implement back home functionality
    navigate("/HomePage");
  };

  const handlePreviewClick = () => {
    navigate("/SummaryPreview", {
      state: { user },
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ffffff' // רקע כללי של כל המסך
    }}>
      <div style={{
        backgroundColor: '#E4E9F2',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '300px'
      }}>
        <h2 style={{ fontSize: '18px', color: '#070A40', marginBottom: '60px', marginTop: '10px' }}><b>Successfully Produced!</b></h2>
        <p style={{ fontSize: '14px', color: '#070A40', marginBottom: '20px' }}></p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <img src="public/summarySuc/summarySucc.svg" alt="Success" style={{ width: '200px', height: '200px',marginBottom:'2rem' }} /> {/* כאן יש להוסיף את התמונה */}
        </div>  
        <button
              className="btn btn-xs sm:btn-sm  btn-outline btn-primary"
              style={{
                color: "#070A40",
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderColor: "#070A40",
              }}
              onClick={handlePreviewClick}
            >
              Preview
            </button>
        <button
          style={{
            width: '200px', // רוחב קבוע של 200 פיקסלים
            padding: '10px 0', // שומר על הגובה של הכפתור
            backgroundColor: '#070A40',
            color: '#E4E9F2',
            borderColor: '#070A40'
          }}
          className="btn btn-xs sm:btn-sm btn-outline btn-primary"
          onClick={handleBackHomeClick}
        >
          Back Home 
        </button>
      </div>
    </div>
  );
}
