import React, { ReactNode, useEffect, useState } from 'react'
import './editing.css'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { getDataForNft } from 'apis/CoinGecko'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import TableFooter from '@mui/material/TableFooter'
import { TablePagination } from '@material-ui/core'

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'

function createData(
  name: string,
  string: string,
  fat: string,
  carbs: string,
  protein: string,
  text: string,
  text2: string
) {
  return { name, string, fat, carbs, protein, text, text2 }
}

interface ListDataItem {
  allTime: { marketCap: number; volume: number; sales: number; averagePrice: number }
  assets: number
  blockchain: string
  categories: string[]
  dataSource: string
  floorPrice: number
  floorPriceToken: string
  logo: string
  marketCap: number
  name: string
  netWorth: number
  oneDay: {
    marketCap: number
    volume: number
    volumeChangePercentage: number
    sales: number
    salesChangePercentage: number
  }
  ownerAssetsPercentage: number
  owners: number
  popular: boolean
  rank: number
  sales7d: number
  salesAT: number
  sevenDay: {
    marketCap: number
    volume: number
    volumeChangePercentage: number
    sales: number
    salesChangePercentage: number
  }
  slug: string
  thirtyDay: {
    marketCap: number
    volume: number
    volumeChangePercentage: number
    sales: number
    salesChangePercentage: number
  }
  tradersAT: number
  volume7d: number
  volumeAT: number
  website: string
}
interface NftData {
  start: number
  limit: number
  sort: string
  desc: boolean
  period: number
}
interface ImgTextItem {
  key: string | number
  age: ReactNode
  text: string
}
interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

const rows = [
  createData(`1 `, '25.355.86', '-21.16%', '+14.16%', '14.0  ', '11.2k', '17.7k'),
  createData('2', '25.355.86', '-21.16%', '+14.16%', '14.0  ', '11.2k', '17.7k'),
  createData('3', '25.355.86', '-21.16%', '+14.16%', '14.0  ', '11.2k', '17.7k'),
  createData('4', '25.355.86', '-21.16%', '+14.16%', '14.0  ', '11.2k', '17.7k'),
  createData('5', '25.355.86', '-21.16%', '+14.16%', '14.0  ', '11.2k', '17.7k'),
]
const imgText = [
  {
    key: '1',
    age: <AutoStoriesIcon />,
    text: 'Home Electricity Bill ',
  },
]

export default function Editingtwo() {
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [alignment, setAlignment] = useState(1)
  const [count, setCount] = useState(5)

  const handleAlignment = (event: any, newAlignment: number) => {
    setAlignment(newAlignment)
    getDataForNftApi({ start: 0, limit: rowsPerPage, sort: 'volume', desc: true, period: newAlignment })
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
    getDataForNftApi({
      start: newPage,
      limit: Number(rowsPerPage),
      sort: 'volume',
      desc: true,
      period: alignment,
    })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    getDataForNftApi({ start: 0, limit: Number(event.target.value), sort: 'volume', desc: true, period: alignment })
  }
  const getDataForNftApi = (params: NftData) => {
    getDataForNft(params).then((res) => {
      setListData(res.data.data.collections)
      console.log(res.data.data)

      setCount(Number(res.data.data.count))
    })
  }

  useEffect(() => {
    getDataForNftApi({ start: 0, limit: rowsPerPage, sort: 'volume', desc: true, period: 1 })
  }, [])
  return (
    <div className="editing">
      <div>
        <div className="editHeader">
          <div className="editHeaderLeft">
            <h1>NTF Trendings </h1>
            <p> Monthly Activtise </p>
          </div>
          <ToggleButtonGroup
            sx={{ height: 30, marginBottom: 2 }}
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value={1} aria-label="24h aligned">
              24h
            </ToggleButton>
            <ToggleButton value={2} aria-label="centered">
              7d
            </ToggleButton>
            <ToggleButton value={3} aria-label="right aligned">
              30d
            </ToggleButton>
            <ToggleButton value={4} aria-label="justified">
              AllTime
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>name </TableCell>
              <TableCell align="right"> Volume </TableCell>
              <TableCell align="right"> 24h % </TableCell>
              <TableCell align="right"> 7d % </TableCell>
              <TableCell align="right"> Floor Price </TableCell>
              <TableCell align="right"> Owners </TableCell>
              <TableCell align="right"> assets </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listData.length > 0 &&
              listData.map((row: ListDataItem) => (
                <TableRow key={row.slug} style={{ marginTop: '20px' }}>
                  <TableCell component="th" scope="row" className="Arrtext">
                    <img className="listIteamImg" src={row.logo} alt="" srcSet="" />
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    {row.oneDay.volume.toFixed(2)}
                    {row.floorPriceToken}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={
                      row.oneDay.volumeChangePercentage == 0
                        ? { color: '#000' }
                        : row.oneDay.volumeChangePercentage < 0
                        ? { color: '#22D03E' }
                        : { color: 'red' }
                    }
                  >
                    {row.oneDay.volumeChangePercentage.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    align="right"
                    style={
                      row.sevenDay.volumeChangePercentage == 0
                        ? { color: '#000' }
                        : row.sevenDay.volumeChangePercentage < 0
                        ? { color: '#22D03E' }
                        : { color: 'red' }
                    }
                  >
                    {row.sevenDay.volumeChangePercentage.toFixed(2)}%
                  </TableCell>
                  <TableCell align="right">
                    {row.floorPrice} {row.floorPriceToken}{' '}
                  </TableCell>
                  <TableCell align="right"> {row.owners} </TableCell>
                  <TableCell align="right"> {row.assets} </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: 500 }]}
                colSpan={12}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  )
}
