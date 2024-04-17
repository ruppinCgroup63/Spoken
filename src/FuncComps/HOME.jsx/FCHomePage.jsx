import React from 'react';
import Card from './FCCard';
//import Navbar from './FCNavbar';


function HomePage() {

  const userName = 'User'; //test

  return (
<div className="bg-gray-100 min-h-screen" style={{ backgroundColor: "#E4E9F2" }}>
  <header className="flex justify-between items-center p-5 bg-white">
    <h1 className="text-xl">Hello! <a href="/profile" className="text-blue-500">{userName}</a></h1>
    <label className="btn btn-circle swap swap-rotate" style={{ position: 'static', top: '30px', right: '20px', backgroundColor: 'white' }}>
      <input type="checkbox" />
      <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
      <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
    </label>
  </header>
  <div>
    <div className="flex justify-start items-center p-5">
      <button className="flex items-center" style={{ borderColor: 'none' }} >
        <span className="mr-2"><button className="btn btn-primary flex items-center" style={{ backgroundColor: "#04D9B2", borderColor: "rgb(4, 217, 178)", color:'white' }}>+</button></span>New Template
      </button>
      
    </div>

    <div className="flex justify-between items-center p-5">
      <h1 className="text-xl" style={{ color: '#070A40' }}>Recent</h1> 
      <button className="btn btn-primary flex items-center" style={{ backgroundColor: "#E4E9F2", color: '#22d4ba6' }}> 
        <span className="mr-2">All templates</span>
      </button>
    </div>
  </div>
  <main className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {/* templates */}
    <Card title="Invoice" favorite={true} />
    <Card title="Invoice" favorite={true} />
    <Card title="Invoice" favorite={true} />
  </main>
</div>
  );
}

export default HomePage;
