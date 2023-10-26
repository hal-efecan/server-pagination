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
  })

  async function getData() {
    const myInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'default',
    }

    setPageState((old) => ({ ...old, isLoading: true }))
    const url = `http://localhost:5000?page=${pageState.page + 1}&limit=${
      pageState.pageSize
    }`
    const res = await fetch(url, myInit)

    if (!res.ok) {
      throw new Error('Something happened when retrieving stock data')
    }

    const json = await res.json()
    console.log('json', json)

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: json.data,
      total: json.total,
    }))
  }

  console.log('pageState', pageState)

  React.useEffect(() => {
    try {
      getData()
    } catch (err) {
      console.log('err', err)
    }
  }, [pageState.page, pageState.pageSize])

  return (
    <Box sx={{ height: 400, maxWidth: 1000 }}>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={pageState.pageSizeOptions}
        checkboxSelection
        disableRowSelectionOnClick
        // ------
        slots={{ toolbar: GridToolbar, loadingOverlay: LinearProgress }}
        slotProps={{
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
        }}
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
