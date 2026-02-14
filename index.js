const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://scanpassuser:ScanPass123@cluster0.etntv3q.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));