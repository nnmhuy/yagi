import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Layout from '../components/Layout';
import moment from 'moment'
import { backendURL } from '../constants/constants'
import { useSearchParams } from "react-router-dom";


const Container = styled(Box)({
  width: "100vw",
  height: "100vh",
})


const columns = [
  {
    field: 'tx_id', headerName: 'ID', minWidth: 100,
    width: 100,
    flex: 1,
  },
  {
    field: 'date', headerName: 'Ngày', minWidth: 100,
    width: 100,
    flex: 1,
  },
  {
    field: 'amount', headerName: 'Số tiền', type: 'number', minWidth: 100,
    width: 100,
    flex: 1,
  },
  // {
  //   field: 'sender',
  //   headerName: 'Người gửi',
  //   width: 200,
  // },
  {
    field: 'raw_message',
    headerName: 'Nội dung',
    minWidth: 300,
    width: 300,
    flex: 6,
  },
];



const fetchData = async (filter) => {
  // const res = await fetch(`${backendURL}/?searchStr=${filter}`)
  const res = await fetch(`${backendURL}/?searchStr=viet nam`)
  const json = await res.json()
  const data = json.data ? json.data : []
  const formattedData = data.map(d => ({
    ...d,
    date: moment(d.Date).format('DD/MM/YYYY'),
  }))
  return formattedData
};

const Homepage = () => {
  const [searchString, setSearchString] = useState('')
  const [rows, setRows] = useState([])

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams)
    console.log("filter", searchParams.get("filter"))
    console.log("sort", searchParams.get("sort"))
  }, [searchParams])

  useEffect(() => {
    (async () => {
      const data = await fetchData(searchString)
      setRows(data)
    }
    )()
  }, [searchString])

  const [filterModel, setFilterModel] = React.useState({
    items: [
      // {
      //   field: 'amount',
      //   operator: '>',
      //   value: 100000,
      // },
    ],
    quickFilterValues: []
  });

  const handleFilterChange = (filterModel) => {
    setSearchParams(params => {
      params.set("filter", JSON.stringify(filterModel))
      return params
    })
    setFilterModel(filterModel);
  };

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'date',
      sort: 'asc',
    },
  ]);

  const handleSortChange = (sortModel) => {
    setSearchParams(params => {
      params.set("sort", JSON.stringify(sortModel))
      return params
    })
    setSortModel(sortModel);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 50,
    page: 0,
  })

  const handlePaginationChange = (paginationModel) => {
    setSearchParams(params => {
      params.set("pagination", JSON.stringify(paginationModel))
      return params
    })
    setPaginationModel(paginationModel);
  };

  useEffect(() => {
    (async () => {
      const data = await fetchData(filterModel, sortModel, paginationModel)
      setRows(data)
    }
    )()
  }, [filterModel, sortModel, paginationModel])


  return (
    <Layout>
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: "column", width: '100%' }}>
        <Paper sx={{ height: '80%', width: '100%' }}>
          {/* <AutocompleteSearch onChange={setSearchString} /> */}
          <DataGrid
            initialState={{
              filter: {
                filterModel: JSON.parse(searchParams.get("filter")),
              },
              sort: {
                paginationModel: JSON.parse(searchParams.get("sort")),
              },
              pagination: { page: 0, pageSize: 50 }
            }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[50, 100, 200]}
            checkboxSelection
            sx={{ border: 0 }}
            getRowHeight={() => "auto"}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  placeholder: 'Tìm kiếm',
                  sx: {
                    width: 500
                  },
                }
              },
            }}
            filterModel={filterModel}
            onFilterModelChange={handleFilterChange}
            sortModel={sortModel}
            onSortModelChange={handleSortChange}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
          />
        </Paper>
      </Container>
    </Layout>

  )
}

export default Homepage