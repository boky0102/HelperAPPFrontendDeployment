import { Grid, Box, Avatar, Typography, makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react"



function Message(props){

      
    const useStyles = makeStyles(
        {
            avatStyle:{
                width: "70px",
                height: "70px"
            }
        }
    )

    const classes = useStyles();
    const [avatarSrc, setAvatarSrc] = useState("");

    useEffect(() => {
        const url="https://helper-app-server-deployment-wvj4p.ondigitalocean.app/avatar/"+props.name;
        axios.get(url)
        .then((response) => {
            setAvatarSrc(response.data);
              
        })
    },[])

    return(
   
                <Grid item container direction="row">
                    <Box display="flex" flexDirection="row" m={2} >
                        <Box  display="flex" flexDirection="column" alignItems="center">
                            <Avatar src={avatarSrc} className={classes.avatStyle}></Avatar>
                            <Typography>{props.fullName}</Typography>
                        </Box>
                        <Box ml={3} alignSelf="center">
                            <Typography>{props.lastMessage}</Typography>
                        </Box>
                    </Box>
                </Grid>
        


    )

   


}


export default Message;