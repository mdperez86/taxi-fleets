import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { Avatar, Box, Chip, ListItemAvatar, ListItemButton, ListItemText, Skeleton } from '@material-ui/core';
import { LocalTaxi } from '@material-ui/icons';

import { RidePrice } from '../../atoms/RidePrice';

export const Ride = (props: RideProps) => {
  const { id, distance, onClick } = props;
  const [price, setPrice] = useState(null);
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();

  const handleRideClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick(id);
    setClicked(true);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3333/api/v0/rides/${id}/price`)
      .then(({ data }) => {
        const { price } = data;
        setPrice(price);
      }).catch(() => {
        setPrice(null);
      });
  }, [id]);

  return (
    <ListItemButton
      component="li"
      data-testid="ride"
      sx={{
        backgroundColor: theme.palette
          .error[distance > 2 ? 'light' : 'default']
      }}
      onClick={handleRideClick}
    >
      <ListItemAvatar>
        <Avatar>
          <LocalTaxi />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box>
            <Box component="span" data-testid="ride-info" mr={2} py={1}>
              ID #{id}
            </Box>
            {clicked && (
              <Chip
                component="span"
                size="small"
                label="Clicked"
                color="primary"
                data-testid="ride-clicked"
              />
            )}
          </Box>
        }
        secondary={
          price ? <RidePrice price={price} /> : 
            <Skeleton data-testid="ride-price-skeleton" width={80} height={23.27} />
        }
      />
    </ListItemButton>
  );
};

type RideProps = {
  id: number;
  distance: number;
  onClick?: (id: number) => void;
};
