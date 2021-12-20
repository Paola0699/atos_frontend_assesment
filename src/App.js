import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [countriesData, setCountriesData] = useState([]);
  
  useEffect(()=>{
    fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(
      (result) => {
        setCountriesData(result);
      },
      (error) => {
        console.log(error)
      }
    )
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          {console.log(countriesData)}
        </a>
      </header>
    </div>
  );
}

export default App;
