import express from "express"
import 'dotenv/config'
import mongoose from "mongoose"
import signupModel from "./signupSchema.js"
import cors from 'cors'
const  app = express()
const DBURI = process.env.DB_URI


mongoose.connect(DBURI)
mongoose.connection.on('connected',()=>console.log('MongoDb connected...'));
mongoose.connection.on('error',(err)=>console.log('MongoDb error...',err));

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get('/',(req,res)=>{
    res.send('server started')
})


// Signup Get
app.get('/signup',(req,res)=>{
    res.send('signup server...')
    console.log(req.body);
    
})


//Signup with MongoDB

app.post('/signup', async(req,res)=>{
    const {name,email,password} = req.body

    if(!name || !email || !password){
        res.send('Please fill all the fields')
        return
    }

    const userData = {
        name,
        email,
        password
    }

    await signupModel.create(userData).then((response)=>{
        if(response){
         res.send('Account created')    
        }  
        
    }).catch((err)=>{
        res.send('Error sending data in db',err)
    })

    
})

app.put('/signup', async(req,res)=>{
    const {name,email,password,postId} = req.body;
    const updatedPost = await signupModel.findByIdAndUpdate(postId,{name,email,password})
    res.json({
        message:"post updated",
        data:updatedPost
    })
})

app.delete('/signup', async(req,res)=>{
    const {name,email,password,postId} = req.body;
    const deletedPost = await signupModel.findByIdAndDelete(postId,{name,email,password})
    res.json({
        message:"post deleted",
        data:deletedPost
    })
})



//Login with MongoDB

app.post('/login', (req,res)=>{
    const {email,password} = req.body

     signupModel.findOne({email:email,password : password}).then((response)=>{       
        if(response){            
            res.send('Account exists')
        }else{
            res.send('Account does not exists');
            
        }
    })
})



// PORT 
const PORT = process.env.PORT
// Server 
app.listen(PORT,()=>{
    console.log('server started');
})