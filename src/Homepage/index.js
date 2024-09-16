import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles';
import { DataGrid, GridToolbar, getGridNumericOperators, getGridDateOperators } from '@mui/x-data-grid';
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
    filterOperators: getGridDateOperators().filter(
      (operator) => operator.value === 'is' || operator.value === 'onOrAfter' || operator.value === 'onOrBefore',
    )
  },
  {
    field: 'amount', headerName: 'Số tiền', type: 'number', minWidth: 100,
    width: 100,
    flex: 1,
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '=' || operator.value === '>=' || operator.value === '<=',
    )
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
    filterable: false,
  },
];



const fetchData = async (filterModel, sortModel, paginationModel) => {
  try {
    let searchUrl = `${backendURL}/?`
    if (filterModel) {
      if (filterModel.quickFilterValues) {
        searchUrl += `&searchStr=${filterModel.quickFilterValues.join(' ')}`
      }
      filterModel.items.forEach((item, index) => {
        if (item.field === 'amount') {
          if (item.operator === '=') {
            searchUrl += `&minAmount=${item.value}&maxAmount=${item.value}`
          } else if (item.operator === '>=') {
            searchUrl += `&minAmount=${item.value}`
          } else if (item.operator === '<=') {
            searchUrl += `&maxAmount=${item.value}`
          }
        }

        if (item.field === 'date') {
          if (item.operator === '=') {
            searchUrl += `&minDate=${item.value}&maxDate=${item.value}`
          } else if (item.operator === '>') {
            searchUrl += `&minDate=${item.value}`
          } else if (item.operator === '<') {
            searchUrl += `&maxDate=${item.value}`
          }
        }
      })
    }

    if (sortModel) {
      sortModel.forEach((item, index) => {
        if (item.field === 'date') {
          searchUrl += `&sortDate=${item.sort === 'asc' ? 1 : -1}`
        }

        if (item.field === 'amount') {
          searchUrl += `&sortAmount=${item.sort === 'asc' ? 1 : -1}`
        }
      })
    }

    if (paginationModel) {
      searchUrl += `&offset=${paginationModel.page * paginationModel.pageSize}&limit=${paginationModel.pageSize}`
    }


    const res = await fetch(searchUrl, {
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    const json = await res.json()
    const data = json.data ? json.data : []
    const formattedData = data.map(d => ({
      ...d,
      date: moment(d.Date).format('DD/MM/YYYY'),
    }))
    return formattedData
  } catch (error) {
    return []
  }
};

const Homepage = () => {
  const [rows, setRows] = useState([])

  let [searchParams, setSearchParams] = useSearchParams();



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
            pageSizeOptions={[25, 50, 100]}
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
            disableColumnSelector
          />
        </Paper>
      </Container>
    </Layout>

  )
}

export default Homepage