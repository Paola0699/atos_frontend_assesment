import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import memoize from 'memoize-one';
import parse from 'html-react-parser';

const columns = memoize((seSelectedCountry, modal) => [
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
  {
    name: 'Wikipedia Info',
    selector: row => <button onClick={() => { modal(true); seSelectedCountry(row.name.common)}} className="btn btn-warning">View Info</button>
  },
]);

function App() {

  const [countriesData, setCountriesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryData, setCountryData] = useState({});


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


  const selectCountry = country => {
    setSelectedCountry(country)
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${country}`)
    .then(res => res.json())
    .then(
      (result) => {
        setCountryData(result);
      },
      (error) => {
        console.log(error)
      }
    )
    
  }

  return (
    <div id="app">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">COUNTRIES</a>
        </div>
      </nav>
      <br />
      <div className="container">
        <div className="row">
          <h1>Countries List</h1>
          <DataTable
            columns={columns(selectCountry, setOpen)}
            data={countriesData}
            pagination={true}
            paginationComponentOptions={{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'from' }}
          />
          <Modal open={open} onClose={() => setOpen(false)} center>
            <h2>{selectedCountry}</h2>
            {countryData.extract_html ? parse(countryData.extract_html) : null}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default App;