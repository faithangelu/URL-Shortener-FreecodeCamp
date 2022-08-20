const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true }
  ).then(() => console.log("Database connected!"))
   .catch(err => console.log(err));



const urlSchema = new mongoose.Schema({
    url: String, 
    short_url: String  
})


module.exports = mongoose.model("Url", urlSchema);