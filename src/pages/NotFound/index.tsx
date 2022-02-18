import notFoundIcon from '../../assets/HomePage_imgs/sasse/notFoundIcon.png'
import notFound from '../../assets/HomePage_imgs/sasse/notFound.png'
import './index.css'
export default function Home() {
  return (
    <div className="notWrap">
      <div className="notFoundBg"></div>
      <img className="notFoundIcon" src={notFoundIcon} alt="" />
    </div>
  )
}
