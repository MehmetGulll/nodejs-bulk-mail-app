
const Category = require('../models/Category');

exports.getCategories = async(req,res)=>{
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.log("Error",error);
    }
}

exports.addCategories = async(req,res)=>{
    try {
        const {name} = req.body;
        const newCategory = new Category({name});
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({error:"Kategori eklenirken bir hata oluştu."})
    }
}