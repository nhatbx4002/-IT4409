import { Category } from "../models/index.js";
import { buildSlugWithFallback } from "../utils/slug.js";

export const findCategoryById = (id, options = {}) =>
  Category.findByPk(id, options);

export const findCategoryBySlug = (slug, options = {}) =>
  Category.findOne({ where: { slug }, ...options });

export const findCategoryByName = (name, options = {}) =>
  Category.findOne({ where: { name }, ...options });

export const createCategory = async (
  { name, slug, parentId },
  transaction
) => {
  return Category.create(
    {
      name,
      slug: slug || buildSlugWithFallback(name),
      parent_id: parentId ?? null,
    },
    { transaction }
  );
};

export const ensureCategory = async (
  { categoryId, name, slug, parentId, fallbackName },
  transaction
) => {
  if (categoryId) {
    const existing = await findCategoryById(categoryId, { transaction });
    if (!existing) {
      throw new Error("Category not found");
    }
    return existing.id;
  }

  const categoryName = name || fallbackName || "Uncategorized";
  const created = await createCategory(
    {
      name: categoryName,
      slug: slug || buildSlugWithFallback(categoryName),
      parentId: parentId ?? null,
    },
    transaction
  );

  return created.id;
};

export const collectDescendantCategoryIds = async (rootCategoryId) => {
  const discovered = new Set([rootCategoryId]);
  const queue = [rootCategoryId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await Category.findAll({
      where: { parent_id: currentId },
      attributes: ["id"],
    });

    for (const child of children) {
      if (!discovered.has(child.id)) {
        discovered.add(child.id);
        queue.push(child.id);
      }
    }
  }

  return Array.from(discovered);
};
