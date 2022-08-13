const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async  (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: Product,
    });
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: Product
    });
    return category 
    ? res.status(200).json(category)
    : res.status(500).json({
        success: false,
        data: "the provided 'id' doesn't exist" 
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/',async  (req, res) => {
  // create a new category
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(500).json({
        success: false,
        data: "please type a 'category_name' " 
      })
    }
    const category = await Category.create({
      category_name: category_name
    })
    res.status(201).json({
      success: true,
      message: `category '${category_name}' added correctly!`,
      data: category.get({
        plain: true
      })
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(500).json({
        success: false,
        data: "The id typed do not match in the system" 
      })
    }
    if (!category_name) {
      return res.status(500).json({
        success: false,
        data: "please type a 'category_name' " 
      })
    }
    await Category.update(
      {
        category_name: category_name
      },
      {
        where: {
          id: id
        }
      }
    );
    res.status(200).json({
      success: true,
      data: `The following ID '${id}' has been added correctly! Its new category name is ${category_name}`,
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(500).json({
        success: false,
        data: "The id typed do not match in the system" 
      })
    }
    await Category.destroy({
      where: {
        id: id
      }
    })
    res.status(200).json({
      success: true,
      message: `category id '${id}' has been deleted!`,
      data: category.get({
        plain: true
      })
    })
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
