const Category = require("../models/Category");
const asyncHandler = require("../middlewares/asyncHandler");
exports.getCategories = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ error: "No authentication information found" });
  }

  const userId = req.user._id;
  const categories = await Category.find({ userId: userId });
  res.json(categories);
});

exports.addCategories = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ error: "No authentication information found" });
  }

  const { name } = req.body;
  const userId = req.user._id;

  const newCategory = new Category({
    name,
    userId,
  });

  await newCategory.save();
  res.status(201).json(newCategory);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user._id;

  const category = await Category.findOne({ _id: categoryId, userId: userId });
  if (!category) {
    return res
      .status(404)
      .json({ error: "Category not found or not authorized to delete" });
  }

  const deleteCategory = await Category.findByIdAndDelete(categoryId);
  if (!deleteCategory) {
    return res.status(404).json({ error: "Failed to delete the category" });
  }

  res.status(200).json({ message: "Category deleted successfully!" });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user._id;
  const { name } = req.body;

  const category = await Category.findOne({ _id: categoryId, userId: userId });
  if (!category) {
    return res
      .status(404)
      .json({ error: "Category not found or not authorized to update" });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({ error: "Failed to update category" });
  }

  res.status(200).json(updatedCategory);
});
