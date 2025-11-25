import { literal } from "sequelize";
import { Category, Product, ProductVariant } from "../models/index.js";
import { buildSlugWithFallback, slugify } from "../utils/slug.js";

const generateUniqueSlug = async (name, transaction) => {
  const base = buildSlugWithFallback(name, "product");
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Product.findOne({ where: { slug }, transaction });
    if (!existing) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
};

const resolveSlug = async ({ name, slug }, transaction) => {
  if (slug) return slugify(slug);
  if (name) return generateUniqueSlug(name, transaction);
  return undefined;
};

export const createProductRecord = async (data, transaction) => {
  const slug = await resolveSlug(data, transaction);
  return Product.create(
    { ...data, slug },
    {
      transaction,
    }
  );
};

export const updateProductRecord = async (product, data, transaction) => {
  const nextSlug = await resolveSlug(
    {
      name: data.name ?? product.name,
      slug: data.slug,
    },
    transaction
  );

  const updates = { ...data };
  if (nextSlug) {
    updates.slug = nextSlug;
  }

  return product.update(updates, { transaction });
};

export const findProductWithRelations = async (productId, transaction) =>
  Product.findByPk(productId, {
    include: [
      { model: ProductVariant, as: "variants" },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug", "parent_id"],
      },
    ],
    transaction,
  });

export const deleteProductRecord = async (product, transaction) =>
  product.destroy({ transaction });

export const listProductsWithRelations = async ({
  where,
  variantWhere,
  order,
  limit,
  offset,
}) => {
  return Product.findAll({
    where,
    include: [
      {
        model: ProductVariant,
        as: "variants",
        where: variantWhere,
        required: Boolean(variantWhere),
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug", "parent_id"],
      },
    ],
    order,
    limit,
    offset,
    distinct: true,
  });
};

export const countProductsWithRelations = async ({ where, variantWhere }) =>
  Product.count({
    where,
    include: [
      {
        model: ProductVariant,
        as: "variants",
        where: variantWhere,
        required: Boolean(variantWhere),
      },
    ],
    distinct: true,
  });

export const buildBasePriceSubquery = () =>
  literal(
    "(base_price + COALESCE((SELECT MIN(price_adjustment) FROM product_variants WHERE product_id = products.id), 0))"
  );

export const defaultProductOrder = [["created_at", "DESC"]];
