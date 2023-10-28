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
  const initialState = {
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15],
    query: '',
    sortFields: columns.map((item) => {
      return {
        field: item.field,
        sort: null,
      }
    }),
  }
  const [pageState, setPageState] = React.useState(initialState)

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

      const url = new URL(`http://localhost:5000`)

      url.searchParams.set('query', pageState.query)
      url.searchParams.set('page', pageState.page + 1)
      url.searchParams.set('limit', pageState.pageSize)

      const id = pageState.sortFields.find((item) => item.field === 'id')
      const body = pageState.sortFields.find((item) => item.field === 'body')
      const title = pageState.sortFields.find((item) => item.field === 'title')

      url.searchParams.set('id', id.sort)
      url.searchParams.set('body', body.sort)
      url.searchParams.set('title', title.sort)

      const res = await fetch(url, myInit)

      if (!res.ok) {
        throw new Error('Something happened while retrieving your data')
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
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.query,
    pageState.sortFields[0].sort, // id
    pageState.sortFields[2].sort, // title
    pageState.sortFields[3].sort, // Body
  ])

  return (
    <Box sx={{ height: 400, maxWidth: 1000 }}>
      <DataGrid
        initialState={gridInitialState}
        pageSizeOptions={pageState.pageSizeOptions}
        checkboxSelection
        disableRowSelectionOnClick
        // ------
        onStateChange={(s) => {
          console.log('s', s)
          const searchStringArray = s.filter.filterModel.quickFilterValues

          const sortField = s.sorting.sortModel[0]?.field
          const sortValue = s.sorting.sortModel[0]?.sort

          const searchQuery = encodeURIComponent(searchStringArray.join(' '))

          console.log('searchStringArray', searchStringArray)
          console.log('sorting', sortField, sortValue)
          console.log('searchQuery', searchQuery)

          if (searchStringArray.length === 0) {
            setPageState({
              ...pageState,
              query: '',
              sortFields: pageState.sortFields.map((item) => {
                if (item.field === sortField) {
                  return {
                    field: sortField,
                    sort: sortValue,
                  }
                } else {
                  return {
                    field: item.field,
                    sort: null,
                  }
                }
              }),
            })
          } else {
            setPageState({
              ...pageState,
              query: searchQuery,
              sortFields: pageState.sortFields.map((item) => {
                if (item.field === sortField) {
                  return {
                    field: sortField,
                    sort: sortValue,
                  }
                } else {
                  return {
                    field: item.field,
                    sort: null,
                  }
                }
              }),
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

const gridInitialState = {
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
