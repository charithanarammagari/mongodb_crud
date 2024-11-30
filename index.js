const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const Brand=require('./models/Brand');

const app=express();
const port=3000;
//MongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb')
.then(()=> console.log('connected to MongoDB'))
.catch(err =>console.error('Error connecting to MongoDB',err));
//middle ware
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.set('view engine', 'ejs')

//Routers
//Home page -Show all brands and the form for adding a new brand
app.get ('/',async(req,res)=>{
    try{
        const brands=await Brand.find();
        res.render('index',{brands});
    } catch (err){
        console.log(err);
        res.status(500).send ('Server error');
    }

});

//add new brand
app.post('/add',async (req,res)=>{
    try{
        const newBrand=new Brand({
            name:req.body.name,
            description:req.body.description

        });
        await newBrand.save();
        res.redirect('/');
    }catch (err){
        console.log(err);
        res.status(500).send('Error adding brand');
        }
});
//Edit brand page --prepopurlate the form with the existing data
app.get('/edit/:id',async (req,res)=>{
    try{
        const brand =await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('Brand not found')
            res.render('edit',{brand})
    }catch{
        console.log(err);
        res.status(500).send('Server error')
    }
    
})
//Update brand
app.post('/edit/:id', async (req,res) =>{
    try{
        await Brand.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch(err){
        console.log(err);
        res.status(500).send('Error updating brand');
    }
});
//delete brand
app.post('/delete/:id',async (req,res) =>{
    try{
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('Error deleting brand');
    }
});

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
});