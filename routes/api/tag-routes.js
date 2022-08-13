const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/',async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: Product,
    });
    res.status(200).json(tags)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id',async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: Product
    });
    return tag 
    ? res.status(200).json(tag)
    : res.status(500).json({
        success: false,
        data: "The id typed do not match in the system" 
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/',async (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(500).json({
        success: false,
        data: "Please type a'category_name'" 
      })
    }
    const tag = await Tag.create({
      tag_name: tag_name
    })
    res.status(201).json({
      success: true,
      message: `Tag '${tag_name}' has been added correctly!`,
      data: tag.get({
        plain: true
      })
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id',async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const { id } = req.params;
    const { tag_name } = req.body;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(500).json({
        success: false,
        data: "the provided 'id' doesn't exist" 
      })
    }
    if (!tag_name) {
      return res.status(500).json({
        success: false,
        data: "please provide a 'tag_name' field" 
      })
    }
    await Tag.update(
      {
        tag_name: tag_name
      },
      {
        where: {
          id: id
        }
      }
    );
    res.status(200).json({
      success: true,
      data: `tag id '${id}' has been updated ! Its new category name is ${tag_name}`,
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id',async (req, res) => {
  // delete on tag by its `id` value
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(500).json({
        success: false,
        data: "The id typed do not match in the system" 
      })
    }
    await Tag.destroy({
      where: {
        id: id
      }
    })
    res.status(200).json({
      success: true,
      message: `tag id '${id}' has been deleted!`,
      data: tag.get({
        plain: true
      })
    })
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
