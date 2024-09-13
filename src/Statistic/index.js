import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Layout from '../components/Layout';


const Container = styled(Box)({
  width: "100vw",
  height: "100vh",
})


const Statistic = () => {
  return (
    <Layout>
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: "column" }}>
        <Paper sx={{ height: 400, width: '100%' }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            width={500}
            height={300}
          />
        </Paper>
        <Paper sx={{ height: 400, width: '100%' }}>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Paper>
        <Paper sx={{ height: 400, width: '100%' }}>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={500}
            height={300}
          />
        </Paper>
      </Container>
    </Layout>
  )
}

export default Statistic