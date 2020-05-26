import React from 'react';
import './App.css';
import Routes from './Routes';
import Header from './components/Header'
import Footer from './components/Footer'
function App() {
  return (
    <div className="App page-container">
      <Header />
      <Routes />
      <Footer />
    </div>
  );
}

export default App;
