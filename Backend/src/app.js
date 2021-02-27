const express=require('express');
 
require('./db/mongoose');

const bodyParser=require('body-parser');

const app=express();
const port=process.env.PORT || 5000;

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.json());

app.get('/',(req,res)=>{
      res.send("Hello,Atleast this is working1");
})

app.listen(port,()=>{
      console.log('Server is running on port:',port);
})

