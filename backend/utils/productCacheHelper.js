import { Product, Review, OrderItem } from '../models/index.js';

/**
 * Update cached fields cho Product
 */
export async function updateProductCache(productId) {
    try {
        // Get review stats
        const reviews = await Review.findAll({
            where: {
                product_id: productId,
                is_approved: true
            },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
            ],
            raw: true
        });

        // Get sold count from order items
        const orders = await OrderItem.findAll({
            where: { product_id: productId },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_sold']
            ],
            raw: true
        });

        // Update product
        await Product.update({
            review_count: reviews[0].count || 0,
            average_rating: parseFloat(reviews[0].avg_rating || 0).toFixed(2),
            sold_count: orders[0].total_sold || 0
        }, {
            where: { id: productId }
        });

        return true;
    } catch (error) {
        console.error('Error updating product cache:', error);
        return false;
    }
}

/**
 * Increment view count
 */
export async function incrementViewCount(productId) {
    try {
        await Product.increment('view_count', {
            by: 1,
            where: { id: productId }
        });
        return true;
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return false;
    }
}