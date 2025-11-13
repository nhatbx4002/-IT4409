import { Product, ProductVariant, Category, sequelize } from "../../models/index.js";
import { Op } from "sequelize";
import cloudinary from "../../config/cloundinary.config.js";

export const createProductService = async( data, files) => {
    try{
        const imageUrls = [];
        if(files && files.length > 0){
            for(const file of files){
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                imageUrls.push(result.secure_url);
            }
        }
        
        // Xử lý category: tự động tạo nếu chưa tồn tại
        let categoryId = data.category_id;
        
        // Nếu có category_id, kiểm tra xem có tồn tại không
        if(categoryId){
            const existingCategory = await Category.findByPk(categoryId);
            if(!existingCategory){
                // Nếu category_id không tồn tại, tự động tạo category mới
                const categoryName = data.category_name || data.brand || "Uncategorized";
                const categorySlug = data.category_slug || categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                
                const newCategory = await Category.create({
                    name: categoryName,
                    slug: categorySlug,
                    parent_id: data.category_parent_id || null,
                });
                categoryId = newCategory.id;
            }
        } else if(data.category_name){
            // Nếu không có category_id nhưng có category_name, tạo category mới
            const newCategory = await Category.create({
                name: data.category_name,
                slug: data.category_slug || data.category_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                parent_id: data.category_parent_id || null,
            });
            categoryId = newCategory.id;
        } else {
            // Nếu không có cả category_id và category_name, tạo category mặc định
            const categoryName = data.brand || "Uncategorized";
            const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            
            const newCategory = await Category.create({
                name: categoryName,
                slug: categorySlug,
                parent_id: null,
            });
            categoryId = newCategory.id;
        }
        
        const product = await Product.create({
            name: data.name,
            description: data.description,
            brand: data.brand,
            base_price: data.base_price,
            category_id: categoryId,
            status: data.status || "active",
            images: imageUrls,
        });

        // Chuyển đổi sang plain object và loại bỏ categoryId (field tự động từ association)
        const productData = product.toJSON();
        delete productData.categoryId; // Xóa field categoryId không cần thiết

        return productData;
    }catch(error){
        throw error;
    }
}

export const createVariantService = async (productId, variants, files) => {
    try {
        const createdVariants = [];

        for(let i = 0; i < variants.length; i++){
            const variant = variants[i];
            let imageUrl = null;

            //Neu co anh gui kem thi day len cloudinary
            if(files && files[i]){
                const result = await cloudinary.uploader.upload(files[i].path, {
                    folder: "product-variants",
                });

                imageUrl = result.secure_url;
            }

            const newVariant = await ProductVariant.create({
                product_id: productId,
                color: variant.color,
                size: variant.size,
                sku: variant.sku,
                price_adjustment: variant.price_adjustment || 0,
                stock_quantity: variant.stock_quantity || 0,
                image_url: imageUrl,
            });

            createdVariants.push(newVariant);
        }

        return createdVariants;
    } catch(error) {
        throw error;
    }
}

//Xoa sản phẩm
export const deleteProductService = async (productId) => {
    try {
        // Validate productId
        if (!productId) {
            throw new Error("Product ID is required");
        }

        // Chuyển đổi productId sang số nếu là string
        const id = parseInt(productId, 10);
        if (isNaN(id) || id <= 0) {
            throw new Error("Invalid product ID");
        }

        // Kiểm tra product có tồn tại không
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error("Product not found");
        }

        // Lưu thông tin product trước khi xóa (để trả về)
        const productData = product.toJSON();

        // Sử dụng transaction để đảm bảo atomicity với hooks
        const transaction = await sequelize.transaction();
        
        try {
            // Xóa product (hooks sẽ tự động xóa product_variants, reviews)
            await product.destroy({ transaction });

            // Commit transaction
            await transaction.commit();

            return {
                id: productData.id,
                name: productData.name,
                message: "Product deleted successfully"
            };
        } catch (error) {
            // Rollback nếu có lỗi
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        throw error;
    }
}

//update san pham (có thể update cả product, variants, và category)
export const updateProductService = async (productId, data, files) => {
    try {
        // Validate và set default cho data
        data = data || {};

        // Validate productId
        if (!productId) {
            throw new Error("Product ID is required");
        }

        // Chuyển đổi productId sang số nếu là string
        const id = parseInt(productId, 10);
        if (isNaN(id) || id <= 0) {
            throw new Error("Invalid product ID");
        }

        // Kiểm tra product có tồn tại không
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error("Product not found");
        }

        // Sử dụng transaction để đảm bảo atomicity
        const transaction = await sequelize.transaction();
        
        try {
            // ============================================
            // 1. XỬ LÝ CATEGORY
            // ============================================
            let categoryId = product.category_id;
            
            // Nếu có category object để update
            if (data.category && typeof data.category === 'object') {
                if (data.category.id) {
                    // Update category hiện có
                    const existingCategory = await Category.findByPk(data.category.id, { transaction });
                    if (existingCategory) {
                        await existingCategory.update({
                            name: data.category.name !== undefined ? data.category.name : existingCategory.name,
                            slug: data.category.slug !== undefined ? data.category.slug : existingCategory.slug,
                            parent_id: data.category.parent_id !== undefined ? data.category.parent_id : existingCategory.parent_id,
                        }, { transaction });
                        categoryId = existingCategory.id;
                    } else {
                        throw new Error("Category not found");
                    }
                } else if (data.category.name) {
                    // Tạo category mới
                    const newCategory = await Category.create({
                        name: data.category.name,
                        slug: data.category.slug || data.category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        parent_id: data.category.parent_id || null,
                    }, { transaction });
                    categoryId = newCategory.id;
                }
            }
            // Nếu có category_id (backward compatibility)
            else if (data.category_id) {
                const existingCategory = await Category.findByPk(data.category_id, { transaction });
                if (!existingCategory) {
                    // Nếu category_id không tồn tại, tự động tạo category mới
                    const categoryName = data.category_name || data.brand || product.brand || "Uncategorized";
                    const categorySlug = data.category_slug || categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    
                    const newCategory = await Category.create({
                        name: categoryName,
                        slug: categorySlug,
                        parent_id: data.category_parent_id || null,
                    }, { transaction });
                    categoryId = newCategory.id;
                } else {
                    categoryId = data.category_id;
                }
            } else if (data.category_name) {
                // Nếu không có category_id nhưng có category_name, tạo category mới
                const newCategory = await Category.create({
                    name: data.category_name,
                    slug: data.category_slug || data.category_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    parent_id: data.category_parent_id || null,
                }, { transaction });
                categoryId = newCategory.id;
            }

            // ============================================
            // 2. XỬ LÝ IMAGES
            // ============================================
            let imageUrls = product.images || [];
            if (files && files.length > 0) {
                const newImageUrls = [];
                for(const file of files){
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                    });
                    newImageUrls.push(result.secure_url);
                }
                // Merge: giữ images cũ + thêm images mới
                imageUrls = [...imageUrls, ...newImageUrls];
            }

            // ============================================
            // 3. XỬ LÝ PRODUCT
            // ============================================
            const updateData = {};
            
            if (data.name !== undefined) updateData.name = data.name;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.brand !== undefined) updateData.brand = data.brand;
            if (data.base_price !== undefined) updateData.base_price = data.base_price;
            if (data.status !== undefined) updateData.status = data.status;
            if (categoryId !== undefined) updateData.category_id = categoryId;
            if (imageUrls.length > 0) updateData.images = imageUrls;
            
            // Nếu có images trong data (để replace hoàn toàn)
            if (data.images !== undefined) {
                updateData.images = Array.isArray(data.images) ? data.images : [];
            }

            // Update product
            if (Object.keys(updateData).length > 0) {
                await product.update(updateData, { transaction });
            }

            // ============================================
            // 4. XỬ LÝ VARIANTS
            // ============================================
            if (data.variants && Array.isArray(data.variants)) {
                const variantFiles = files || [];
                const variantImageIndex = files ? files.length : 0; // Index bắt đầu cho variant images
                
                for (let i = 0; i < data.variants.length; i++) {
                    const variant = data.variants[i];
                    let variantImageUrl = null;

                    // Xử lý image cho variant (nếu có)
                    const variantFileIndex = variantImageIndex + i;
                    if (variantFiles && variantFiles[variantFileIndex]) {
                        const result = await cloudinary.uploader.upload(variantFiles[variantFileIndex].path, {
                            folder: "product-variants",
                        });
                        variantImageUrl = result.secure_url;
                    } else if (variant.image_url) {
                        variantImageUrl = variant.image_url;
                    }

                    let existingVariant = null;

                    // Tìm variant theo id (ưu tiên)
                    if (variant.id) {
                        existingVariant = await ProductVariant.findOne({
                            where: {
                                id: variant.id,
                                product_id: id
                            },
                            transaction
                        });
                        if (!existingVariant) {
                            throw new Error(`Variant with id ${variant.id} not found or does not belong to this product`);
                        }
                    }
                    // Nếu không có id, tìm theo size và color
                    else if (variant.size) {
                        // Nếu có color, tìm theo cả size và color
                        if (variant.color) {
                            existingVariant = await ProductVariant.findOne({
                                where: {
                                    product_id: id,
                                    size: variant.size,
                                    color: variant.color
                                },
                                transaction
                            });
                        } 
                        // Nếu chỉ có size, kiểm tra xem có nhiều variant với size đó không
                        else {
                            const variantsWithSameSize = await ProductVariant.findAll({
                                where: {
                                    product_id: id,
                                    size: variant.size
                                },
                                transaction
                            });

                            // Nếu có nhiều hơn 1 variant với size đó → yêu cầu cung cấp color
                            if (variantsWithSameSize.length > 1) {
                                const colors = variantsWithSameSize.map(v => v.color).filter(c => c).join(', ');
                                throw new Error(
                                    `Multiple variants found with size "${variant.size}". ` +
                                    `Please specify color. Available colors: ${colors}`
                                );
                            }
                            // Nếu chỉ có 1 variant → dùng variant đó
                            else if (variantsWithSameSize.length === 1) {
                                existingVariant = variantsWithSameSize[0];
                            }
                            // Nếu không có variant nào → sẽ tạo mới
                        }
                    }

                    // Nếu tìm thấy variant → Update
                    if (existingVariant) {
                        await existingVariant.update({
                            color: variant.color !== undefined ? variant.color : existingVariant.color,
                            size: variant.size !== undefined ? variant.size : existingVariant.size,
                            sku: variant.sku !== undefined ? variant.sku : existingVariant.sku,
                            price_adjustment: variant.price_adjustment !== undefined ? variant.price_adjustment : existingVariant.price_adjustment,
                            stock_quantity: variant.stock_quantity !== undefined ? variant.stock_quantity : existingVariant.stock_quantity,
                            image_url: variantImageUrl !== null ? variantImageUrl : existingVariant.image_url,
                        }, { transaction });
                    } 
                    // Nếu không tìm thấy → Tạo variant mới
                    else {
                        await ProductVariant.create({
                            product_id: id,
                            color: variant.color || null,
                            size: variant.size || null,
                            sku: variant.sku || null,
                            price_adjustment: variant.price_adjustment || 0,
                            stock_quantity: variant.stock_quantity || 0,
                            image_url: variantImageUrl,
                        }, { transaction });
                    }
                }
            }

            // Reload để lấy dữ liệu mới nhất
            await product.reload({ 
                transaction,
                include: [{
                    model: ProductVariant,
                    as: 'variants'
                }]
            });

            // Commit transaction
            await transaction.commit();

            // Chuyển đổi sang plain object và loại bỏ categoryId
            const productData = product.toJSON();
            delete productData.categoryId;

            return productData;
        } catch (error) {
            // Rollback nếu có lỗi
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        throw error;
    }
}

//Hien thi tat ca san pham
export const getAllProductsService = async () => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: ProductVariant,
                    as: 'variants'
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug', 'parent_id']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return products.map(product => {
            const productData = product.toJSON();
            // Xóa categoryId nếu có (field tự động từ association)
            if (productData.categoryId) {
                delete productData.categoryId;
            }
            return productData;
        });
    } catch (error) {
        throw error;
    }
}

//Tim kiem san pham
export const searchProductsService = async (searchTerm) => {
    try {
        const whereClause = {};

        // Nếu có searchTerm, tìm kiếm theo name và brand
        if (searchTerm) {
            whereClause[Op.or] = [
                {
                    name: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                },
                {
                    brand: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                }
            ];
        }

        const products = await Product.findAll({
            where: whereClause,
            include: [
                {
                    model: ProductVariant,
                    as: 'variants'
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug', 'parent_id']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return products.map(product => {
            const productData = product.toJSON();
            if (productData.categoryId) {
                delete productData.categoryId;
            }
            return productData;
        });
    } catch (error) {
        throw error;
    }
}

