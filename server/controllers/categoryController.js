const Category = require('../models/Category');
const asyncHandler = require('../middlewares/asyncHandler')

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

exports.addCategories = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
});
exports.deleteCategory = asyncHandler(async(req,res)=>{
    const categoryId = req.params.id;
    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if(!deleteCategory){
        return res.status(404).json({error:"Category not found"});
    }
    res.status(200).json({message:"Category deleted succesfuly!"});
})
exports.updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body; 
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
    
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
  
    res.status(200).json(updatedCategory);
  });
  