// src/components/Maps/Maps.jsx
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
  marginTop: "10px",
};

const Maps = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // ✅ fixed!
  });

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Maps;
