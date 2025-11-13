import { Op } from "sequelize";
import { Product, ProductVariant, Category } from "../../models/index.js";

const collectDescendantCategoryIds = async (rootCategoryId) => {
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

const summarizeProduct = (product) => {
    const data = product.toJSON();
    const images = Array.isArray(data.images) ? data.images : [];

    return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        base_price: data.base_price,
        image: images.length > 0 ? images[0] : null,
        images,
    };
};

export const getProductsByCategoryService = async ({
    categoryId,
    categorySlug,
    categoryName,
    includeDescendants = true,
}) => {
    if (!categoryId && !categorySlug && !categoryName) {
        throw new Error("Category identifier is required");
    }

    const category = await Category.findOne({
        where: {
            [Op.or]: [
                categoryId ? { id: categoryId } : null,
                categorySlug ? { slug: categorySlug } : null,
                categoryName ? { name: categoryName } : null,
            ].filter(Boolean),
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const categoryIds = includeDescendants
        ? await collectDescendantCategoryIds(category.id)
        : [category.id];

    const products = await Product.findAll({
        where: { category_id: categoryIds },
        include: [
            {
                model: ProductVariant,
                as: "variants",
            },
            {
                model: Category,
                attributes: ["id", "name", "slug", "parent_id"],
            },
        ],
        order: [
            ["created_at", "DESC"],
            [{ model: ProductVariant, as: "variants" }, "price_adjustment", "ASC"],
        ],
    });

    return {
        category: category.toJSON(),
        categoryIds,
        products: products.map(summarizeProduct),
    };
};

export const getProductDetailService = async (productId) => {
    if (!productId) {
        throw new Error("Product ID is required");
    }

    const product = await Product.findOne({
        where: { id: productId },
        include: [
            {
                model: ProductVariant,
                as: "variants",
            },
            {
                model: Category,
                attributes: ["id", "name", "slug", "parent_id"],
            },
        ],
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const data = product.toJSON();
    if (data.categoryId) {
        delete data.categoryId;
    }

    return data;
};

//Tim kiem san pham theo ten hoac brand
export const searchProductsService = async ({ name, brand }) => {
    const whereClause = {};

    if (name && brand) {
        whereClause[Op.and] = [
            {
                name: {
                    [Op.iLike]: `%${name}%`,
                },
            },
            {
                brand: {
                    [Op.iLike]: `%${brand}%`,
                },
            },
        ];
    } else if (name) {
        whereClause.name = {
            [Op.iLike]: `%${name}%`,
        };
    } else if (brand) {
        whereClause.brand = {
            [Op.iLike]: `%${brand}%`,
        };
    } else {
        return [];
    }

    const products = await Product.findAll({
        where: whereClause,
        include: [
            {
                model: ProductVariant,
                as: "variants",
            },
            {
                model: Category,
                attributes: ["id", "name", "slug", "parent_id"],
            },
        ],
        order: [
            ["created_at", "DESC"],
            [{ model: ProductVariant, as: "variants" }, "price_adjustment", "ASC"],
        ],
    });

    return products.map(summarizeProduct);
};
