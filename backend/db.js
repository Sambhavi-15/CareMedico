const mongoose = require('mongoose');
const uri = 'mongodb+srv://sambhavik0502:NWc2ShfduS55ZCqO@cluster0.pvtkpn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo connected'); 
       


    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit with an error code
    }
};

module.exports = connectDB;











































