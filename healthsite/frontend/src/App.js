import React from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from './Routes';
import Header from './components/Header'
import Footer from './components/Footer'
function App() {
  return (
    <div className="App">
      <Header />
      <Routes />
      <Footer />
    </div>
  );
}

export default App;
