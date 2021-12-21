import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import memoize from 'memoize-one';
import parse from 'html-react-parser';

const columns = memoize((seSelectedCountry, modal, seCountryLanguages, modal2) => [
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
    selector: row => <a href="#" onClick={() => { seCountryLanguages(row.languages); modal2(true) }}>View languages</a>,
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
    selector: row => <button onClick={() => { modal(true); seSelectedCountry(row.name.common) }} className="btn btn-warning">View Info</button>
  },
]);

function App() {

  const [countriesData, setCountriesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryLanguages, setSelectedCountryLanguages] = useState("");
  const [countryData, setCountryData] = useState({});
  const [selectedFilterOption, setSelectedFilterOption] = useState("Default");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(
        (result) => {
          setCountriesData(result);
          setFilteredData(result);
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

  const searchValues = (searchText) => {
    if (searchText.length > 2) {
      switch (selectedFilterOption) {
        case 'Official Name':
          const filteredCountriesByName = countriesData.filter(country => { return country.name.official.toLowerCase().includes(searchText.toLowerCase()) })
          setFilteredData(filteredCountriesByName)
          break;
        case 'Capital':
          const result = countriesData.filter(country => country.capital);
          const filteredCountriesByCapital = result.filter(country => { return country.capital.toString().toLowerCase().includes(searchText.toLowerCase()) })
          setFilteredData(filteredCountriesByCapital)
          break;
        case 'Region':
          const filteredCountriesByRegion = countriesData.filter(country => { return country.region.toLowerCase().includes(searchText.toLowerCase()) })
          setFilteredData(filteredCountriesByRegion)
          break;
        case 'Default':
          const res = countriesData.filter(country => country.capital);
          const filteredCountriesByAll = res.filter(country => {
            return country.region.toLowerCase().includes(searchText.toLowerCase()) || country.name.official.toLowerCase().includes(searchText.toLowerCase()) || country.capital.toString().toLowerCase().includes(searchText.toLowerCase())
          })
          setFilteredData(filteredCountriesByAll)
          break;
        default:
          setFilteredData(countriesData);
      }
    }
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
          <div className="row">
            <div className="col"></div>
            <div className="col">
              <input onChange={e => searchValues(e.target.value)} className='form-control' type='text' placeholder="Search..." />
            </div>
            <div className="col">
              <select className='form-control' onChange={e => { setSelectedFilterOption(e.target.value) }}>
                <option defaultValue value="Default">Select an Option</option>
                <option value="Official Name">Official Name</option>
                <option value="Capital">Capital</option>
                <option value="Region">Region</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={columns(selectCountry, setOpen, setSelectedCountryLanguages, setOpenModal)}
            data={filteredData}
            pagination={true}
            paginationComponentOptions={{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'from' }}
          />
          <Modal open={open} onClose={() => { setOpen(false); setSelectedCountry("") }} center>
            <h1>{selectedCountry}</h1>
            {countryData.extract_html ? parse(countryData.extract_html) : null}
          </Modal>
          <Modal open={openModal} onClose={() => { setOpenModal(false);; setSelectedCountryLanguages("") }} center>
            <br />
            <h1>Languages</h1>
            <ul>{selectedCountryLanguages ? Object.values(selectedCountryLanguages).sort().map((language, index) => <li key={index}>{language}</li>) : null}</ul>
          </Modal>
        </div>
      </div>
    </div>
  );
}
export default App;