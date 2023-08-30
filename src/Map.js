
import React from "react";
import { MapContainer as LeafletMap} from "react-leaflet";
import {TileLayer} from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "./util"

function Map({ countries,center,zoom,casesType}) {
    return (
      <div className="map">  
      <LeafletMap  className="map" center={center} zoom={zoom} >
          <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           />
         {/*loop through and draw circles on the map */}  
         {showDataOnMap(countries,casesType)}
      </LeafletMap>
      </div>
    )
}

export default Map
 