import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 right-0 h-full w-16 flex flex-col bg-white shadow-lg">
      {/* Navigation items */}
      <a href="/" className="navbar-item">Home</a>
      <a href="/settings" className="navbar-item">Settings</a>
      {/* Add more navigation items as needed */}
    </nav>
  );
}

export default Navbar;
