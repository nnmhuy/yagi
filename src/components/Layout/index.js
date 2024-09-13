import * as React from 'react';
import AppBar from './AppBar';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

export default function Layout({ children }) {
  return (
    <Box>
      <AppBar position="static" />
      <Container sx={{ paddingLeft: 0, paddingRight: 0, paddingTop: 10 }} maxWidth={false}>
        {children}
      </Container>
    </Box>
  );
}
