import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Ratings from './StarRatingComponent';
import TagsComponent from './TagsComponent';
import {Favorite,ExpandMore,MoreVert,Share} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import {Card , CardHeader , CardMedia , CardContent , CardActions , Collapse , Avatar , IconButton , Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:"#a5a89f",
    maxWidth: '29.33%',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    margin:'2% 2%',
  },
  media: {
    color:"white",
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    color:"white",
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  right: {
    color:"white",
    textAlign:'right',
    marginRight:'20px',
    marginTop:'-5',
    fontSize:'100%'
  },
  left: {
    color:"white",
    fontSize:'100%'
  },
  head:{
    color:"white",
    margin:'10px 10px'
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function CardComponent1({handleSlot,data,data1,img,Name,Address,Cost,Distance,OpeningTime,ClosingTime,Rating,Tags,value}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const Slot = (x,y) =>{
    console.log("Yahan  click ho gya");
    console.log(x);
    console.log(y);
    handleSlot(x,y);
  }
  return (
    <Card className={classes.root}  onClick={() => Slot(data,data1)}>
       <Typography variant="body1" color="textPrimary" component="p"className={classes.head}>
         {Name}
         </Typography>
        
      <Typography variant="body2" color="textPrimary" component="p"className={classes.right}>
         <b>Estimated Cost: </b> ₹{Cost}
      </Typography>
      <CardMedia
        className={classes.media}
        image={img}
        title={Name}
      />
      <CardContent>
      <Typography variant="body2" color="textPrimary" component="p"className={classes.left}>
         <b>Approximate Distance: </b>{Distance}km
      </Typography>
        <Typography  style={{color:"white"}} component="p">
          <b>Address: </b>{Address}
        </Typography>
        <Typography  style={{color:"white"}} component="p">
          <b>Open Hours: </b>{OpeningTime} - {ClosingTime}
        </Typography>
        <TagsComponent tags={Tags}/>
      </CardContent>
      <CardActions disableSpacing>
        {/*
        <IconButton aria-label="add to favorites">
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
        */}
        
        <Ratings rating={Rating} />           {/*to check*/}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}