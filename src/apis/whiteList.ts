import axios from 'axios'

interface PostWhiteListProps {
  address: string
}
// start:0,limit:10,ort:'volume',desc:true,period:1
export async function postWhiteList(obj: PostWhiteListProps) {
  return await axios.post('http://23.224.182.90:7001/get-wallet-address', obj)
}
