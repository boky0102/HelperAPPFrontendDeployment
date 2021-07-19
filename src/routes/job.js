import React, { useEffect, useState } from "react";
import {Avatar, Box, Button, CircularProgress, GridList, IconButton, makeStyles, TextField, Typography} from "@material-ui/core";
import {Grid} from "@material-ui/core";
import Category from "../components/category";
import picture from "../static/picture.jpg";
import Review from "../components/review";
import { Redirect, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import SendIcon from '@material-ui/icons/Send';
import Cookies from 'universal-cookie';
import Alert from "@material-ui/lab/Alert";
import noreviews from "../static/no_review.svg"
import Apply from "./apply";
import Rating from "../components/rating";




function Job(props){




    const useStyles = makeStyles(
      {
        root2 : {
          display: "flex",
          flexGrow: 1,
          minHeight: "100%"
        },

        avatStyle: {
          width: "200px",
          height: "200px"
  
        },

        messBox: {
          width: "100%",
          position: "relative"
          
        },

        sendBtn:{
          position: "absoulte"
          
        },
        sideBox: {
          overflowY: "scroll",
          overflowX: "hidden"
        }
      }
    )

    const classes = useStyles();

    const [imgHeight, setImgHeight] = useState(0);
    const [reviews, setReviews] = useState([]);
    
    
    const [jobData, setJobData] = useState({});
    const [name, setName] = useState("");
    const [sideBox, setSideBox] = useState("reviews");
    const [message, setMessage] = useState("");
    const [mess, messageSent] = useState();
    const [avatarSrc, setAvatarSrc] = useState("");
  

    function handleImgHeight(event){
      setImgHeight(event.target.offsetHeight);
    }

    

    let  { id }  = useParams();

    useEffect(() => {
        const url = "https://helper-app-server-deployment-wvj4p.ondigitalocean.app/job/" + id;
          
        axios.get(url)
        .then((response) => {
            setReviews(response.data.userData.reviews);
            setJobData(response.data.jobData);
            setName(response.data.userData.name);
            setAvatarSrc("https://helper-app-server-deployment-wvj4p.ondigitalocean.app/" + response.data.userData.avatarSrc);
            
        })
        .catch((err) => {
              
        })

    }, []);

      


    function handleMessageChange(event){
      setMessage(event.target.value);
    }

    const cookies = new Cookies();

    function handleMessageSubmit(event){
      messageSent(false);
      event.preventDefault();
      const jwt = cookies.get('token');
      const url = "https://helper-app-server-deployment-wvj4p.ondigitalocean.app/message";
      const data = {
        reciever: jobData.username,
        message: message
      };

      axios.post(url, data, {headers: {'authorization': `Bearer ${jwt}`}})
      .then((response) => {
        if(response.status === 200){
          messageSent(true);
        }
      })
      .catch((err) => {
          
      })
    }


    function sideBoxSwitch(sideBox){
      if(sideBox === "reviews"){
        if(reviews !== undefined && reviews.length > 0){
          return(
            reviews.map( (review) => 
                    <Review description={review.note} rating={review.rating} name={review.reviewer}/>)
          )
        }
        else{
          return(
            <Box display="flex" justifyContent="center">
              <img src={noreviews} alt="no review" alignSelf="center"></img>
            </Box>
          )
        }
      }
      else if(sideBox === "message"){
        return(
          <div>
            
              <Box  display="flex" m={4} flexDirection="column"  >
                    <Box >
                      <form onSubmit={handleMessageSubmit}>
                        <TextField  className={classes.messBox} required fullWidth rows="7" multiline variant="outlined" color="secondary" label="Message" size="large" onChange={handleMessageChange} 
                        InputProps={{endAdornment:
                        <IconButton className={classes.sendBtn} type="submit" disabled={mess}>
                          <SendIcon></SendIcon>
                        </IconButton>}}></TextField>
                      </form>
                    </Box>
                      {mess === true && <Alert >Message Sent Succesfully</Alert>}
                      {mess === false && <CircularProgress></CircularProgress>}
                           
              </Box>
            
            <Box>
              <Typography></Typography>
            </Box>
          </div>
          
        )
      }
      else if(sideBox === "apply"){
        
        return(
          <Apply id={id}></Apply>
        )
      }
    }

    const history = useHistory();

    useEffect(() => {
        
      
      if(mess === true){

        setTimeout(() => history.push("/home/find"), 3000)
      }

      return clearInterval();
          
    }, [mess]);


    function calculateAverageRating(reviews){
      let ratingSum = 0;
      if(reviews !== undefined){
          reviews.forEach((review) => {
              ratingSum += review.rating
          })
      }
      

      if(ratingSum > 0){
          return ratingSum/reviews.length;
      }
      else{
          return 0;
      }
  }
    
    
    

    return(
      <div className={classes.root2}>
        <Box border={1} mt={0} borderColor={"grey.300"} >

          <Grid container>

          
          <Grid container item direction="row" xs={12}>
            <Grid item xs={12} sm={12} lg={8} >
              <Box border={1} borderColor="grey.300">
                <img
                  width={"100%"}
                  height={"inherit"}
                  
                  src={"https://helper-app-server-deployment-wvj4p.ondigitalocean.app/"+ jobData.imgSrc}
                  alt="description of job"
                  onLoad={handleImgHeight}
                />
              </Box>
            </Grid>
        
            <Grid item container direction="column"  xs={12} sm={12} lg={4} >

              <Box >
              
                <Grid item>
                  
                    <Box m={2} ><Typography>{jobData.title}</Typography></Box>
                  

                </Grid>

                <Grid item container direction="column" justify={"space-between"}>
                    <Box borderTop={1} borderColor="grey.300">
                      <Grid item>
                        <Box m={2} >
                          <Typography>{jobData.description}</Typography>
                          

                        </Box>

                      </Grid>

                    </Box>

                </Grid>
              
              </Box>
                
            </Grid>

            
            
          </Grid>

          <Grid container>
            <Box border={1} p={1} borderColor="grey.300" display="flex" width="inherit" justifyContent="space-around">
              <Category category={jobData.category}/>
              <Typography>Deadline: {jobData.deadline}</Typography>
              <Typography>Budget: {jobData.budget + "€"}</Typography>
              
              

            </Box>





          </Grid>

          <Grid container direction="row">

            <Grid item container xs={12} md={4}>
              <Box display="flex" flexDirection="column" width="inherit">
                <Box alignSelf="center" mt={1}>
                  <Typography>
                    {name} <Rating rating={reviews !== undefined && calculateAverageRating(reviews)}></Rating>
                  </Typography>
                </Box>
                <Box m={1} alignSelf="center">
                  <Avatar src={avatarSrc} className={classes.avatStyle}></Avatar>
                </Box>
                <Box>
                  <Button fullWidth onClick={(e) => setSideBox("message")}>MESSAGE</Button>
                </Box>
                <Box>
                  <Button fullWidth onClick={(e) => setSideBox("apply")}>APPLY FOR JOB</Button>
                </Box>

              </Box>

            </Grid>

            <Grid item container xs={12} md={8}>
              <Box borderLeft={1} height="321px" className={classes.sideBox}  width="inherit" >
                  

                  {sideBoxSwitch(sideBox)}
                  
                  
              </Box>

            </Grid>


          </Grid>

          </Grid>
        </Box>
      </div>
    )
}

export default Job;