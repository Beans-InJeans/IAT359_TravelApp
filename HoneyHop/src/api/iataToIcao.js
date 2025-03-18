// This file is for converting IATA map codes to ICAO

const iataToIcao = {
  YVR: 'CYVR',   // Vancouver International Airport
  PEK: 'ZBAA',   // Beijing Capital International Airport
  JFK: 'KJFK',   // John F. Kennedy International Airport
  LAX: 'KLAX'    // Los Angeles International Airport
};

export const convertIataToIcao = (iata) => iataToIcao[iata] || null;
