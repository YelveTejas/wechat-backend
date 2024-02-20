import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const connectDb = async()=>{
try{
 const connect = await mongoose.connect(process.env.MONGODB,{
    useUnifiedTopology:true,
    useNewUrlParser:true

 })
   console.log(`MongoDb Connected ${connect.connection.host}`)
}catch(err){
 console.log(err.message)
 process.exit()
}
}


export default connectDb