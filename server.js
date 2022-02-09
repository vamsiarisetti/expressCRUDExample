const express = require('express');
const mongoose = require('mongoose');
const BrandName = require('./model')
const app = express();

app.use(express.json());
mongoose.connect('mongodb+srv://vamsiarisetti:India%40123@cluster0.4glgr.mongodb.net/brands?retryWrites=true&w=majority', 
{
    useUnifiedTopology: true,
    useNewURLParser: true
})
.then(() => console.log('DB Connected..'))
.catch(err => console.error(err));

app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});

app.post('/addBrands', async (req, res) => {
    const {brandname} = req.body;
    try {
        const newData = new BrandName({brandname});
        await newData.save();
        return res.json(await BrandName.find());
    } catch (error) {
        console.log("Caught while adding brands : ", error.message);
    }
});

app.get('/getallbrands', async(req, res) => {
    try {
        const allBrands = await BrandName.find();
        return res.json(allBrands);
    } catch (error) {
        console.log('caught in getting all brands : ', error.message);
    }
});

app.get('/getallbrands/:id', async(req, res) => {
    try {
        const filteredBrands = await BrandName.findById(req.params.id);
        return res.json(filteredBrands);
    } catch (error) {
        console.log('caught in getting brands by id : ', error.message);
    }
});

app.delete('/deletebrand/:id', async(req, res) => {
    try {
        await BrandName.findByIdAndDelete(req.params.id);
        return res.json(await BrandName.find());
    } catch (error) {
        console.log('caught in deleting brands by id : ', error.message);
    }
});

app.listen(5000, () => console.log('Server is running..'));