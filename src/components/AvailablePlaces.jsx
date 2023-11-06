import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:3000/places').then(
  //     (response) => {
  //       return response.json();
  //     }
  //   ).then(
  //     (data) => {
  //       setAvailablePlaces(data.places);
  //     }
  //   )
  // }, []);

  useEffect(() => {

    async function fetchData() {
      try {
        setIsLoading(true);
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsLoading(false);
        });
      } catch(error) {
        setError({message: error.message || 'Could not fetch places, please try again later...'});
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if(error) {
    return <Error title="An error occured" message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Places loading..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
