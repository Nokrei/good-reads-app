import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import AppContext from './AppContext'
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const AuthorScreen = ()=>{
    const [globalState, setGlobalState] = useContext(AppContext)
    return(
        <div >
            <Typography variant='h6'>Author: {globalState.author}</Typography>
        </div>
    )
}

export default AuthorScreen