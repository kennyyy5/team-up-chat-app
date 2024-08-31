import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            
            
            
        })

        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
    } catch(err){
        console.log(`Error: ${err.message}`.red.bold)
        process.exit()
    }
}
