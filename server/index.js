// Creating a server
const express = require('express'); // Import the Express library to create a web server
const cors = require('cors'); // Import the CORS library to handle Cross-Origin Resource Sharing
const mongoose = require('mongoose'); // Import Mongoose to interact with MongoDB

const app = express(); // Create an instance of an Express application
app.use(cors()); // Use the CORS middleware to allow cross-origin requests
app.use(express.json())

const PORT = process.env.PORT || 8080; // Define the port number, default to 8080 if not specified

// Schema definition
const schemaData = new mongoose.Schema({ // Fixed: Added 'new' before 'mongoose.Schema'
    name: String,
    email: String,
    mobile: String,
}, {
    timestamps: true
});

// Create a model based on the schema
const userModel = mongoose.model("user", schemaData);

// Read data from the database
//http://localhost:8080/

app.get("/", async (req, res) => { // Define a route for the root URL ("/")
    const data = await userModel.find({}); // Fetch all documents from the 'user' collection
    res.json({ success: true, data: data }); // Send a JSON response with the data
});

// Create data || Save data in MongoDB
//http://localhost:8080/create
/*
{
    name,
    email,
    mobile
}
*/
app.post("/create",async (req, res) => { // Define a route for POST requests to "/create"
    console.log(req.body); // Log the request body
    const data = new userModel(req.body)
    await data.save()
    res.send({success : true, message : "data save successfully", data : data})
});

//update data
//http://localhost:8080/update
/*
{
    id : "",
    name : "",
    email : "",
    mobile : ""
}
*/
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { _id,...rest} = req.body

    console.log(rest)
    
    const data = await userModel.updateOne({_id : _id},rest)
    res.send({success : true, message : "data updated successfully", data :data})
})

//delete api
//http://localhost:8080/update/delete/id
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data deleted successfully", data :data})
})
// Database and server setup
mongoose.connect("mongodb://localhost:27017/crudoperation") // Connect to MongoDB
    .then(() => {
        console.log("Connected to DB"); // Log a success message when connected to the database

        app.listen(PORT, () => { // Start the server and listen on the specified port
            console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
        });
    })
    .catch((err) => console.log(err)); // Handle database connection errors
