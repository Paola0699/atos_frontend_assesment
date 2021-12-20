import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: 'Official name',
    selector: row => row.name.official,
    sortable: true,
  },
  {
    name: 'Capital',
    selector: row => row.capital,
  },
  {
    name: 'Region',
    selector: row => row.region,
  },
  {
    name: 'Languages',
    selector: row => <ul>{row.languages ? Object.values(row.languages).map((language, index) => <li key={index}>{language}</li>) : null}</ul>,
  },
  {
    name: 'Population',
    selector: row => row.population,
  },
  {
    name: 'Flag',
    selector: row => <img style={{ width: '50%' }} src={row.flags.png} />,
  },
];

function App() {

  const [countriesData, setCountriesData] = useState([]);

  useEffect(() => {
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
  }, [])
  return (
    <div id="app">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">COUNTRIES</a>
        </div>
      </nav>  
      <br/>
      <div className="container">
        <div className="row">
          <h1>Countries List</h1>
          <DataTable
            columns={columns}
            data={countriesData}
            pagination={true}
            paginationComponentOptions={{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'from' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;