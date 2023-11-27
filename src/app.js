const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const {check, validationResult} = require("express-validator")

app.use(express.json())
app.use(express.urlencoded())

app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);  
})

app.get("/restaurants/:id", async (req,res) => {
    const id = await Restaurant.findByPk(req.params.id)
    res.json(id);
})

app.post("/restaurants", [
    check("name").not().isEmpty().trim(),
    check("location").not().isEmpty().trim(),
    check("cuisine").not().isEmpty().trim()
    ], 
    async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({error: errors.array()})
    }else{
        await Restaurant.create(req.body)
        const newRestaurants = await Restaurant.findAll({})
        res.json(newRestaurants);
    }
    
})

app.put("/restaurants/:id", async (req, res) => {
const updatedRestaurant = await Restaurant.update(req.body, {where: {id: req.params.id}});
res.json(updatedRestaurant);
})
app.delete("/restaurants/:id", async (req,res) => {
    const destroyRestaurant = await Restaurant.destroy({ where: {id: req.params.id}})
    res.json(destroyRestaurant);
})

module.exports = app;