import React from 'react'
import {Outlet} from "react-router-dom"
import { Navbar } from '../NavBar/Navbar'

export const Home = () => {
    return (
        <div>
            <Navbar/>
            <Outlet />
        </div>
    )
}
