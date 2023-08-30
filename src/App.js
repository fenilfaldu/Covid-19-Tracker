/* eslint-disable no-lone-blocks */

import {MenuItem, FormControl, Select, Card,CardContent } from "@material-ui/core";
import  React,{ useState,useEffect } from "react";
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData,preetyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";




   {/*Header */}
   {/*title + select input deopdown field */}


function App() {
   const [countries,setCountries]= useState([]);
   const [country,setCountry] = useState('worldwide');
   const [countryInfo,setCountryInfo]=useState({});
   const [tableData,setTableData]=useState([]);
   const [mapcenter, setMapCenter] = useState({lat:20 , lng:77});
   const [mapZoom, setMapZoom] = useState(4.5);
   const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");

//USESTATE =how to write a varible in REACT;
useEffect(()=>{
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response=>response.json())
  .then(data=>{
    setCountryInfo(data);
  })
},[])

//USEEFFECT=runs a piece of code based on given condition
useEffect(() => {
//async-> send a request,wait for it,do something with info
   const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data) => {
        const countries= data.map((country)=>({
            name:country.country,//UNITED STATES,UNITED KINGDOM
            value:country.countryInfo.iso2//UK,USA,FR
          }));

          let sortedData=sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
   };
   getCountriesData();

}, [])//if we leave "[]" empty then code inside useffect will run once
//when the component loads not again

const onCountryChange=async(event)=>{
  const countryCode=event.target.value;
  const url=countryCode==='worldwide' 
  ?"https://disease.sh/v3/covid-19/all"
  :`https://disease.sh/v3/covid-19/countries/${countryCode}`

//https://disease.sh/v3/covid-19/all
//https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

await fetch(url)
.then(response=>response.json())
.then(data=>{
  setCountry(countryCode)
  setCountryInfo(data);
  setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
  setMapZoom(4);
  })
  setMapCenter();
};
console.log("xxxxx",mapcenter);
console.log("yooooo",countryInfo)

  return (
    <div className="app">
      <div className="app__left">
  <div className="app__header">
  <h1>COVID-19 TRACKER</h1>
  <FormControl className="app__dropdown">
  <Select variant="outlined" value={country} onChange={onCountryChange}>
    {/*Loop through all the countries and show a drop down list of the options*/}
   <MenuItem value="worldwide"> worldwide</MenuItem>
     {countries.map((country)=>(
        <MenuItem value={country.value}>{country.name}</MenuItem>
      ))} 
    </Select>
  </FormControl>
  </div>

   <div className="app__stats">
     <InfoBox 
      active={casesType==="cases"}
     onClick={(e)=>setCasesType("cases")}
     title="Coronavirus Cases" isRed
     cases={preetyPrintStat(countryInfo.active)}  total={preetyPrintStat(countryInfo.cases)}/>
     {/*Infoboxs  title="coronovirus cases*/}
     
     <InfoBox
    
     active={casesType==="recovered"}
      onClick={(e)=>setCasesType("recovered")}
      title="Recovered" 
      cases={preetyPrintStat(countryInfo.critical)} total={preetyPrintStat(countryInfo.recovered)}/>
   {/*Infoboxs  title="coronavirus recoveries"*/}
  
   <InfoBox
    active={casesType==="deaths"} 
    onClick={(e)=>setCasesType("deaths")}
   title="Deaths" isRed
   cases={preetyPrintStat(countryInfo.todayDeaths)}  
   total={preetyPrintStat(countryInfo.deaths)}/>
   {/*Infoboxs title="coronavirus deaths" */}
  
   </div>
   {/*Map */}
  <Map 
  casesType={casesType}
  countries={mapCountries} 
  center={mapcenter}
   zoom={mapZoom}/>

  </div>
   
   <Card className="app__right">
     <CardContent >
      {/*Table */}
      <h3>Live Cases by country</h3>
      <Table countries={tableData} />
  
        {/*Graph */}
        <h3 className="app__graphTitle">  Worldwide new {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType}/>
            </CardContent>
    </Card>
  </div>
  );
}

export default App;