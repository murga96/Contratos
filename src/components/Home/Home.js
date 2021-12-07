import React from 'react'
import {Switch, Route} from "react-router-dom"
import { ContractTypes } from '../ContractTypes/ContractTypes'
import { Navbar } from '../NavBar/Navbar'

export const Home = () => {
    return (
        <div>
            <Navbar/>
            <Switch>
            <Route exact path="/">
                <div></div>
            </Route>
            <Route path="/TiposContratos">
                <ContractTypes/>
            </Route>
            </Switch>
        </div>
    )
}
