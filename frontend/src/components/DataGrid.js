import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { LinearProgress } from '@mui/material'

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'userId',
    headerName: 'User ID',
    width: 70,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
  },
  {
    field: 'body',
    headerName: 'Body',
    flex: 1,
  },
]

export default function ServerSideDataGrid() {
  const [pageState, setPageState] = React.useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15],
    query: '',
  })

  async function getData() {
    try {
      const myInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
      }

      setPageState((old) => ({ ...old, isLoading: true }))

      const encode = encodeURI(pageState.query)
      console.log('encode', encode)

      const url = `http://localhost:5000/?query=${pageState.query}&page=${
        pageState.page + 1
      }&limit=${pageState.pageSize}`

      const res = await fetch(url, myInit)

      if (!res.ok) {
        throw new Error('Something happened when retrieving data')
      }

      const json = await res.json()

      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: json.data,
        total: json.total,
      }))
    } catch (err) {
      console.log('err', err)
    }
  }

  console.log('pageState', pageState)

  React.useEffect(() => {
    getData()
  }, [pageState.page, pageState.pageSize, pageState.query])

  return (
    <Box sx={{ height: 400, maxWidth: 1000 }}>
      <DataGrid
        initialState={initialState}
        pageSizeOptions={pageState.pageSizeOptions}
        checkboxSelection
        disableRowSelectionOnClick
        // ------
        onStateChange={(s) => {
          const searchStringArray = s.filter.filterModel.quickFilterValues
          console.log('searchStringArray', searchStringArray)

          // const encode = pageState.query.concat()
          // console.log('encode', encode)

          if (searchStringArray.length === 0) {
            setPageState({
              ...pageState,
              query: '',
            })
          } else {
            setPageState({
              ...pageState,
              query: searchStringArray[0],
            })
          }
        }}
        slots={slots}
        slotProps={slotProps}
        pagination
        page={pageState.page - 1}
        pageSize={pageState.pageSize}
        paginationMode="server"
        rows={pageState.data}
        columns={columns}
        autoHeight
        rowCount={pageState.total}
        loading={pageState.isLoading}
        onPaginationModelChange={(s) => {
          setPageState({
            ...pageState,
            isLoading: true,
            page: s.page,
            pageSize: s.pageSize,
            total: pageState.total,
          })
        }}
        // ------
      />
    </Box>
  )
}

const initialState = {
  pagination: {
    paginationModel: {
      page: 0,
      pageSize: 10,
    },
  },
}

const slots = {
  toolbar: GridToolbar,
  loadingOverlay: LinearProgress,
}

const slotProps = {
  toolbar: {
    showQuickFilter: true,
    csvOptions: { disableToolbarButton: true },
    printOptions: { disableToolbarButton: true },
    quickFilterProps: { debounceMs: 500 },
    sx: {
      '& .MuiButton-root': {
        color: '#4071bb',
        fontSize: 12,
      },
    },
  },
}
