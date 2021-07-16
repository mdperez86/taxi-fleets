import { Typography } from '@material-ui/core';

export const RidePrice = (props: RidePriceProps) => {
  const { price, currency, locale } = props;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  return (
    <Typography component="span" data-testid="ride-price">
      {formatter.format(price)}
    </Typography>
  );
};

RidePrice.defaultProps = {
  currency: 'EUR',
  locale: 'en',
};

type RidePriceProps = {
  price: number;
  currency?: string;
  locale?: string;
};
