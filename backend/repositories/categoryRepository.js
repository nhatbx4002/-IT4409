import { Category, sequelize } from "../models/index.js";

export const getAllCategories = async () => {
  const categories = await Category.findAll({
    order: [
      ["level", "ASC"],
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  });
  return categories.map((category) => category.get({ plain: true }));
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ where: { slug } });
  return category ? category.get({ plain: true }) : null;
};

export const createCategory = async (payload) => {
  const created = await Category.create(payload);
  return created.get({ plain: true });
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  const updated = await category.update(payload);
  return updated.get({ plain: true });
};

export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return false;
  await category.destroy();
  return true;
};

export const ensureCategory = async (
  { categoryId, name, slug, parentId, fallbackName },
  transaction
) => {
  // If category ID is provided, return it directly
  if (categoryId) {
    return categoryId;
  }

  // Try to find existing category by slug or name
  if (slug || name) {
    const existing = await Category.findOne({
      where: slug ? { slug } : { name },
      transaction,
    });
    if (existing) {
      return existing.id;
    }
  }

  // Create new category if name is provided
  const categoryName = name || fallbackName;
  if (categoryName) {
    const newCategory = await Category.create(
      {
        name: categoryName,
        slug: slug || categoryName.toLowerCase().replace(/\s+/g, "-"),
        parent_id: parentId || null,
      },
      { transaction }
    );
    return newCategory.id;
  }

  // Return null if no category information provided
  return null;
};

export const findCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  return category ? category.get({ plain: true }) : null;
};

export const findCategoryBySlug = async (slug) => {
  return getCategoryBySlug(slug);
};

export const findCategoryByName = async (name) => {
  const category = await Category.findOne({ where: { name } });
  return category ? category.get({ plain: true }) : null;
};

export const collectDescendantCategoryIds = async (categoryId) => {
  const [rows] = await sequelize.query(
    `
    WITH RECURSIVE category_tree AS (
      SELECT id, parent_id FROM categories WHERE id = :categoryId
      UNION ALL
      SELECT c.id, c.parent_id
      FROM categories c
      INNER JOIN category_tree ct ON ct.id = c.parent_id
    )
    SELECT id FROM category_tree;
    `,
    { replacements: { categoryId } }
  );

  return rows.map((row) => row.id);
};
