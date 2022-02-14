/* eslint-disable prettier/prettier */
import React from 'react'
import "./home_page.css"
import Herder_page from "../herade/Herder-page"
import Doby from "./Doby"
export default function Home_page() {
    return (
        <div className="home-page">
            <Herder_page/>
             <Doby/>
        </div>
    )
}


