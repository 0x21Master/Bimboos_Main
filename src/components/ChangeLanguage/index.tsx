import { Button, Menu, MenuItem } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { LOCALE_LABEL } from '../../constants/locales'
import { useActiveLocale } from '../../hooks/useActiveLocale'
import { useLocationLinkProps } from '../../hooks/useLocationLinkProps'

const LangOptions = ['zh-CN', 'en-US'] as const
type SupportedLocale = typeof LangOptions[number]

const Language = styled.div`
  height: 30px;
  display: block;
  min-width: 120px;

  @media screen and (max-width: 1160px) {
    height: auto;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px 12px;
    cursor: auto;
  }
`
const LanguageLinkMenuItem = styled(MenuItem)`
  font-size: 14px;
  color: #666;
`
const LanguageLink = styled(Link)`
  text-decoration: none;
`
const LanguageMenu = styled(Menu)`
  z-index: 999;
`

export default function ChangeLanguage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const activeLocale = useActiveLocale()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Language>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={open ? <KeyboardArrowDownIcon sx={{ transform: `rotate(180deg)` }} /> : <KeyboardArrowDownIcon />}
      >
        {LOCALE_LABEL[activeLocale]}
      </Button>
      <LanguageMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {LangOptions.map((locale) => {
          return <LanguageMenuItem locale={locale} key={locale} click={handleClose} active={activeLocale === locale} />
        })}
      </LanguageMenu>
    </Language>
  )
}
function LanguageMenuItem({ locale, click, active }: { locale: SupportedLocale; active: boolean; click: () => void }) {
  const { to } = useLocationLinkProps(locale)
  if (!to) return null
  return (
    <LanguageLink to={to} onClick={click}>
      <LanguageLinkMenuItem>
        {LOCALE_LABEL[locale]} {active && <CheckIcon />}
      </LanguageLinkMenuItem>
    </LanguageLink>
  )
}
