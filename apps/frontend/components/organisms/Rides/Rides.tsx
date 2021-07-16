import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, List, Skeleton } from '@material-ui/core';

import { Ride } from '../../molecules/Ride';

export const Rides = (props: RidesProps) => {
  const [rides, setRides] = useState(Array(4).fill(null));

  const formatter = new Intl.DateTimeFormat('es-CL', {
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  });

  const handleRideClick = (id: number) => {
    axios
      .get(`http://localhost:3333/api/v0/rides/${id}`)
      .then(({ data }) => {
        const { duration, endTime } = data;
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setMilliseconds(0);
        date.setSeconds(duration);
        alert(`${formatter.format(date)} - ${endTime}`);
      })
      .catch(console.log);
  };

  useEffect(() => {
    axios
      .get('http://localhost:3333/api/v0/rides')
      .then(({ data }) => {
        setRides(data);
      }).catch(() => {
        setRides([]);
      });
  }, []);

  return (
    <List data-testid="rides">
      {rides.map((ride, index) => (
        ride ? <Ride
          key={ride.id}
          {...ride}
          onClick={handleRideClick}
        /> : (
          <Box data-testid="ride-skeleton" component="li" key={index} py={1} px={2} height={74.55} display="flex" alignItems="center">
            <Box height={40} width={56}>
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Box>
              <Skeleton variant="text" width={70} height={24} />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          </Box>
        )
      ))}
    </List>
  );
}

type RidesProps = {

};
