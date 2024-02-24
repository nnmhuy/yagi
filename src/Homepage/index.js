/*global gapi*/

import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import GoogleIcon from '@mui/icons-material/Google';
import { styled } from '@mui/material/styles';

const LoginButton = (props) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      size='large'
      tabIndex={-1}
      startIcon={<GoogleIcon />}
      {...props}
    >
      Đăng nhập bằng Google
    </Button>
  );
}

const Container = styled(Box)({
  width: "100vw",
  height: "100vh",
})

const Background = styled(Box)({
  position: "fixed",
  zIndex: -1,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url("https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/359835501_294613576291168_233522295257806940_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeE1DkBdw1_3rDW2tYI9J1luzsBErn-cABTOwESuf5wAFJ4Edw_429MErl05851zmdp2AdWR0qmAZTOr6kGLQ052&_nc_ohc=urjRrVnb-bIAX9d9YAS&_nc_oc=AQnIXT7ghOXyw5t0T_JtyqbFkZjdDPCVxAYsh5pC4m6jHM_g3Dy8GukcXnoNBWZCmXE&_nc_ht=scontent.fhan3-5.fna&oh=00_AfBAJ7TjHiXgyLKmFTpLmFfmU5BkG3LAGpG9jDzKG_qF2A&oe=65DF1F6F")`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  opacity: 0.2
})

const Homepage = () => {
  const handleAuthClick = () => {
    window.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      localStorage.setItem("token", JSON.stringify(gapi.client.getToken()))
      window.location = "/input"
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      window.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: "column" }}>
      <Background />
      <Typography variant="h6" sx={{ color: "brown", marginTop: 10 }}>
        Chiến dịch Mùa Chay 2024
      </Typography>
      <Typography variant="h5" sx={{ m: 1, color: "purple" }}>
        HOÁN ĐỔI VÀ CANH TÂN
      </Typography>
      <LoginButton sx={{ m: 2 }} onClick={handleAuthClick} />
    </Container>
  )
}

export default Homepage