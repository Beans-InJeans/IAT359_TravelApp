export const fetchCoordinates = async (icaoCode) => {
  try {
    const response = await fetch(`https://api.core.openaip.net/api/airports/5ffdc9dbf8c23aae8e0515b7`, {
      method: 'GET',
      headers: {
        'x-openaip-api-key': '5f477d71298f05a197d25a8a9ed9c543'
      }
    });

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(data);
    
    if (data && data.geometry) {
      return {
        latitude: data.geometry.coordinates[1],
        longitude: data.geometry.coordinates[0],
        name: data.name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch airport data:', error);
    return null;
  }
};
