import { fn, col, Op } from "sequelize";
import { Product, ProductVariant, Category } from "../models/index.js";

const findCategoryBySlug = async (categorySlug) => {
  if (!categorySlug) return null;
  return Category.findOne({ where: { slug: categorySlug }, raw: true });
};

export const getDistinctBrands = async (collection, categorySlug) => {
  try {
    const productWhere = { status: "active" };
    if (collection) {
      productWhere.collection = collection;
    }

    if (categorySlug) {
      const category = await findCategoryBySlug(categorySlug);
      if (!category) return [];
      productWhere.category_id = category.id;
    }

    const rows = await Product.findAll({
      attributes: [
        ["brand", "name"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        ...productWhere,
        brand: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
      },
      group: ["brand"],
      raw: true,
    });

    return rows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    }));
  } catch (error) {
    console.error("Error fetching distinct brands:", error);
    throw error;
  }
};

export const getDistinctColors = async (collection, categorySlug) => {
  try {
    const productWhere = { status: "active" };
    if (collection) {
      productWhere.collection = collection;
    }

    if (categorySlug) {
      const category = await findCategoryBySlug(categorySlug);
      if (!category) return [];
      productWhere.category_id = category.id;
    }

    const rows = await ProductVariant.findAll({
      attributes: [
        ["color", "name"],
        [fn("COUNT", col("product_variants.id")), "count"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [],
          where: productWhere,
        },
      ],
      where: {
        color: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
        stock_quantity: { [Op.gt]: 0 },
      },
      group: ["product_variants.color"],
      raw: true,
    });

    return rows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    }));
  } catch (error) {
    console.error("Error fetching distinct colors:", error);
    throw error;
  }
};

export const getDistinctSizes = async (collection, categorySlug) => {
  try {
    const productWhere = { status: "active" };
    if (collection) {
      productWhere.collection = collection;
    }

    if (categorySlug) {
      const category = await findCategoryBySlug(categorySlug);
      if (!category) return [];
      productWhere.category_id = category.id;
    }

    const rows = await ProductVariant.findAll({
      attributes: [
        ["size", "name"],
        [fn("COUNT", col("product_variants.id")), "count"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [],
          where: productWhere,
        },
      ],
      where: {
        size: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }] },
        stock_quantity: { [Op.gt]: 0 },
      },
      group: ["product_variants.size"],
      raw: true,
    });

    return rows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    }));
  } catch (error) {
    console.error("Error fetching distinct sizes:", error);
    throw error;
  }
};

export const getCategories = async (collection) => {
  try {
    const productWhere = {
      status: "active",
      category_id: { [Op.ne]: null },
    };
    if (collection) {
      productWhere.collection = collection;
    }

    const categoryCounts = await Product.findAll({
      attributes: [
        ["category_id", "category_id"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: productWhere,
      group: ["category_id"],
      raw: true,
    });

    const categoryIds = categoryCounts.map((row) => row.category_id);
    if (categoryIds.length === 0) return [];

    const categories = await Category.findAll({
      where: { id: { [Op.in]: categoryIds } },
      raw: true,
    });
    const categoryMap = new Map(
      categories.map((cat) => [cat.id, { name: cat.name, slug: cat.slug }])
    );

    return categoryCounts
      .filter((row) => categoryMap.has(row.category_id))
      .map((row) => {
        const cat = categoryMap.get(row.category_id);
        return {
          label: cat.name,
          slug: cat.slug,
          count: Number(row.count),
        };
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getFilterOptions = async (collection, categorySlug) => {
  const [brands, colors, sizes, categories] = await Promise.all([
    getDistinctBrands(collection, categorySlug),
    getDistinctColors(collection, categorySlug),
    getDistinctSizes(collection, categorySlug),
    getCategories(collection),
  ]);

  return { brands, colors, sizes, categories };
};
