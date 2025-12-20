import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
} from "../repositories/categoryRepository.js";

const buildCategoryTree = (categories) => {
  const map = new Map();
  const roots = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const fetchCategoryTree = async () => {
  const categories = await getAllCategories();
  return buildCategoryTree(categories);
};

export const fetchCategoryWithChildren = async (slug) => {
  const categories = await getAllCategories();
  const tree = buildCategoryTree(categories);

  const findBySlug = (nodes) => {
    for (const node of nodes) {
      if (node.slug === slug) return node;
      const child = findBySlug(node.children || []);
      if (child) return child;
    }
    return null;
  };

  return findBySlug(tree);
};

export const createCategoryEntry = async (payload) => {
  return createCategory(payload);
};

export const updateCategoryEntry = async (id, payload) => {
  return updateCategory(id, payload);
};

export const deleteCategoryEntry = async (id) => {
  return deleteCategory(id);
};
