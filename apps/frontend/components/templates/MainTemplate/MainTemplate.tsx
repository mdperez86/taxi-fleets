import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import Head from 'next/head';

export const MainTemplate = (props: MainTemplateProps) => {
  const { title, children } = props;
  return (
    <Box>
      <Head>
        <title>{title}</title>
      </Head>
      <AppBar position="static" component="header">
        <Toolbar>
          <Typography variant="h6" component="span" data-testid="main-template-title">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" component="main" data-testid="main-template-container">
        {children}
      </Container>
    </Box>
  );
};

type MainTemplateProps = {
  title: string;
  children: React.ReactNode;
};
