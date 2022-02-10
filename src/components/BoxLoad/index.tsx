import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components/macro'
const LoadingBox = styled.div`
  width: 100%;
  margin-top: 60px;
  text-align: center;
`

const LoadText = styled.p`
  margin: 0;
  height: 51px;
  font-size: 16px;
  line-height: 50px;
  span {
    cursor: pointer;
    text-decoration: underline;
  }
`
export default function BoxLoading() {
  return (
    <LoadingBox>
      <CircularProgress color="inherit" />
      <LoadText>加载中</LoadText>
    </LoadingBox>
  )
}
