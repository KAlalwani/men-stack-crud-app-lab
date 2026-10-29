const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const app = express()
const Planet = require('./models/planet.js')

//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(morgan('dev'))


// connect to database

async function conntectToDB(){ //connection to the database
    try{
        await mongoose.connect(process.env.DATABASE_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error Occured",error)
    }
}


conntectToDB()

//routes
app.get('/', (req, res)=>{
    res.render('homepage.ejs')
})


// CRUD

// CREATE
app.get('/planets/new',(req,res)=>{
    res.render('create-planet.ejs')
})


app.post('/planets', async (req,res)=>{
    req.body.inSolarSystem = req.body.inSolarSystem === 'on' // converts the inSolarSystem to a Boolean
    console.log(req.body)

// This creates a new planet in the database with the information from the request body
    const createdPlanet = await Planet.create({ 
        name: req.body.name,
        inSolarSystem: req.body.inSolarSystem
    })

    res.redirect('/') // Redirect the user to homepage after planet is created
})


// READ
app.get('/planets', async (req,res)=>{
    const allPlanets = await Planet.find()
    console.log(allPlanets)
    res.render('planet-list.ejs', {planets: allPlanets})
})
  

app.get('/planets/:planetId', async (req,res)=>{
    const foundPlanet = await Planet.findById(req.params.planetId) // Gets the one planet by its id
    res.render('planet-details.ejs',{planet: foundPlanet})
})


app.delete('/planets/:planetId/', async (req,res)=>{
    await Planet.findByIdAndDelete(req.params.planetId)
    res.redirect('/planets')
})

app.get('/planets/:planetId/edit', async (req, res) => {
  const planet = await Planet.findById(req.params.planetId);
  res.render('edit-planet.ejs', { planet });
});
app.put('/planets/:planetId', async (req, res) => {
  req.body.inSolarSystem = req.body.inSolarSystem === 'on';

  await Planet.findByIdAndUpdate(req.params.planetId, req.body);

  res.redirect('/planets');
});

app.listen(3002, ()=>{
    console.log('Listening on port 3002')
})