require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())


const date = new Date()
const time = date.toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })
const month = date.toLocaleDateString("default", { month: "long", day: "numeric" });


const db = "todoLists" // Database Name
const userID = process.env.userID
const password = process.env.password


const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${userID}:${password}@cluster0.y6eehy3.mongodb.net/${db}`).then(() => console.log("connected")).catch((err) => console.log(err)) //Connection

const user = "aditya"

const list = mongoose.Schema({
    name: String,
    desc: String,
    date: Object
})
const Lists = mongoose.model(user, list)


const deleteAllData = async () => { // delete the collection
    const status = await Lists.deleteMany({})
    console.log(status.acknowledged);
}
const getData = async () => { // Get data of the collection
    const data = await Lists.find()
    return data
}



app.get("/", async (req, res) => { // Sending Json data of that collections
    const data = await getData()
    res.json(data)
})


app.post("/", async (req, res) => {
    const data = req.body
    const posted_data = await Lists.insertMany(data)
    res.send(posted_data)
})

app.delete("/",async(req,res)=>{
    const data = req.body
    const deleted_data = await Lists.deleteOne(data)
    res.send(deleted_data).status(200)
})

app.put("/",async(req,res)=>{
    const data = req.body
    const id = {
        _id:data._id
    }
    const toUpdate = {
        name:data.name,
        desc:data.desc,
        date:data.data
    }
    const updated_data = await Lists.updateOne(id,{$set:toUpdate})

    res.send(updated_data).status(200)
})


app.listen(process.env.PORT ||7575, () => console.log("http://localhost:7575"))