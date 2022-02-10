/* eslint-disable prettier/prettier */
import React, { ReactNode } from 'react'
import './index.css'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
interface AddLe {
  key: string | number
  icon: ReactNode
}
const menuList = [
  {
    key: '/home',
    icon: <DarkModeOutlinedIcon />,
  },
  {
    key: '/home',
    icon: <AccountBalanceIcon />,
  },
  {
    key: '/home',
    icon: <AccountBalanceIcon />,
  },
  {
    key: '/home',
    icon: <AccountBalanceIcon />,
  },
  {
    key: '/home',
    icon: <AccountBalanceIcon />,
  },
  {
    key: '/home',
    icon: <Brightness5Icon />,
  },
  {
    key: '/home',
    icon: <IosShareOutlinedIcon />,
    children: [],
  },
]

export default function LeftMenu() {
  const rederMenu = (menuList: AddLe[]) => {
    return menuList.map((itme) => {
      return (
        <span key={itme.key}>
          <span>{itme.icon}</span>
        </span>
      )
    })
  }
  return (
    <div className="letf-But">
      <div> {rederMenu(menuList)}</div>{' '}
    </div>
  )
}
