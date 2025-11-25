import { Op } from "sequelize";
import {
  collectDescendantCategoryIds,
  findCategoryBySlug,
  findCategoryById,
  findCategoryByName,
} from "../../repositories/categoryRepository.js";
import {
  listProductsWithRelations,
  countProductsWithRelations,
  findProductWithRelations,
} from "../../repositories/productRepository.js";
import {
  appendPriceAndStockFilters,
  buildOrderClause,
  buildPagination,
  buildVariantWhereClause,
  normalizeFilterArray,
} from "./product/queryBuilder.js";
import {
  calculateDiscountPercent,
  calculatePriceFromVariants,
} from "./product/priceUtils.js";

const transformVariantDetail = (variant) => {
  const data = variant.toJSON ? variant.toJSON() : variant;
  return {
    id: data.id,
    color: data.color || null,
    size: data.size || null,
    sku: data.sku || null,
    price: parseFloat(data.price_adjustment || 0),
    stockQuantity: data.stock_quantity || 0,
    imageUrl: data.image_url || null,
  };
};

const summarizeProduct = (product) => {
  const data = product.toJSON();
  const images = Array.isArray(data.images) ? data.images : [];
  const tags = Array.isArray(data.tags) ? data.tags : [];

  const variants = data.variants || [];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const price = calculatePriceFromVariants(data.base_price, variants);
  const salePrice = data.sale_price ? parseFloat(data.sale_price) : null;
  const discountPercent = calculateDiscountPercent(price, salePrice);

  const inStock = variants.some((v) => (v.stock_quantity || 0) > 0);

  const category = data.category
    ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
      }
    : null;

  const rating = 0;
  const reviewCount = 0;

  return {
    id: data.id,
    slug: data.slug || null,
    name: data.name,
    brand: data.brand,
    collection: data.collection || null,
    category,
    price,
    salePrice,
    discountPercent,
    images,
    colors,
    sizes,
    rating,
    reviewCount,
    isNew: data.is_new || false,
    inStock,
    tags,
    createdAt: data.created_at ? new Date(data.created_at).toISOString() : null,
    updatedAt: data.updated_at ? new Date(data.updated_at).toISOString() : null,
  };
};

const buildBaseWhereClause = ({ collection, brands }) => {
  const whereClause = {};

  if (collection) {
    whereClause.collection = collection;
  }

  if (brands && brands.length > 0) {
    whereClause.brand = {
      [Op.in]: Array.isArray(brands) ? brands : [brands],
    };
  }

  return whereClause;
};

export const getProductsByCategoryService = async ({
  categoryId,
  categorySlug,
  categoryName,
  includeDescendants = true,
  collection,
  sizes,
  colors,
  priceMin,
  priceMax,
  brands,
  inStockOnly,
  sort = "featured",
  page = 1,
  pageSize = 12,
}) => {
  if (!categoryId && !categorySlug && !categoryName) {
    throw new Error("Category identifier is required");
  }

  let category = null;
  if (categoryId) category = await findCategoryById(categoryId);
  if (!category && categorySlug) category = await findCategoryBySlug(categorySlug);
  if (!category && categoryName) {
    category = await findCategoryByName(categoryName);
  }

  if (!category) {
    throw new Error("Category not found");
  }

  const categoryIds = includeDescendants
    ? await collectDescendantCategoryIds(category.id)
    : [category.id];

  const whereClause = {
    ...buildBaseWhereClause({ collection, brands }),
    category_id: categoryIds,
  };

  const variantWhere = buildVariantWhereClause({ sizes, colors });
  appendPriceAndStockFilters(whereClause, { priceMin, priceMax, inStockOnly });

  const { limit, offset, page: safePage, pageSize: safePageSize } =
    buildPagination(page, pageSize);

  const total = await countProductsWithRelations({
    where: whereClause,
    variantWhere,
  });

  const products = await listProductsWithRelations({
    where: whereClause,
    variantWhere,
    order: buildOrderClause(sort),
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / safePageSize);

  return {
    products: products.map(summarizeProduct),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
};

export const getProductDetailService = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const product = await findProductWithRelations(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const data = product.toJSON();

  const summary = summarizeProduct(product);

  const variants = (data.variants || []).map((variant) => {
    const variantData = variant.toJSON ? variant.toJSON() : variant;
    const basePrice = parseFloat(data.base_price || 0);
    const priceAdjustment = parseFloat(variantData.price_adjustment || 0);

    return {
      id: variantData.id,
      color: variantData.color || null,
      size: variantData.size || null,
      sku: variantData.sku || null,
      price: basePrice + priceAdjustment,
      stockQuantity: variantData.stock_quantity || 0,
      imageUrl: variantData.image_url || null,
    };
  });

  return {
    ...summary,
    description: data.description || null,
    variants,
  };
};

export const searchProductsService = async ({
  q,
  name,
  brand,
  collection,
  categorySlug,
  categorySlugs,
  sizes,
  colors,
  priceMin,
  priceMax,
  brands,
  inStockOnly,
  sort = "featured",
  page = 1,
  pageSize = 12,
}) => {
  const whereClause = buildBaseWhereClause({ collection, brands });

  if (q || name || brand) {
    const searchTerm = q || name || brand;
    whereClause[Op.or] = [
      {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        brand: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    ];
  }

  const normalizedCategorySlugs = Array.from(
    new Set(
      [
        ...normalizeFilterArray(categorySlugs),
        ...normalizeFilterArray(categorySlug),
      ].map((slug) => slug.toString().toLowerCase())
    )
  );

  if (normalizedCategorySlugs.length > 0) {
    const categories = await Promise.all(
      normalizedCategorySlugs.map((slug) => findCategoryBySlug(slug))
    );

    const validCategories = categories.filter(Boolean);

    if (validCategories.length > 0) {
      const categoryIds = (
        await Promise.all(
          validCategories.map((category) =>
            collectDescendantCategoryIds(category.id)
          )
        )
      ).flat();

      if (categoryIds.length > 0) {
        whereClause.category_id = {
          [Op.in]: Array.from(new Set(categoryIds)),
        };
      }
    }
  }

  const variantWhere = buildVariantWhereClause({ sizes, colors });
  appendPriceAndStockFilters(whereClause, { priceMin, priceMax, inStockOnly });

  const { limit, offset, page: safePage, pageSize: safePageSize } =
    buildPagination(page, pageSize);

  const total = await countProductsWithRelations({
    where: whereClause,
    variantWhere,
  });

  const products = await listProductsWithRelations({
    where: whereClause,
    variantWhere,
    order: buildOrderClause(sort),
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / safePageSize);

  return {
    products: products.map(summarizeProduct),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
};
