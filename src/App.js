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
   <div id="app">
     {countriesData.map((country, index) => 
       //console.log(country.name.nativeName)
       //console.log(country.capital)
       //console.log(country.region)
       //console.log(country.languages)
       //console.log(country.population)  
       <img key={index} src={country.flags.png}/>
     )}
   </div>
  );
}

export default App;
