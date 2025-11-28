import { Op, fn, col, literal } from 'sequelize';
import { User, Product, Cart, CartItem, Order, OrderItem} from '../../models/index.js';

//default 30 ngay gan nhat
const normalizeDate = ({ from, to }) => {
    const now = new Date();

    const toDate = to ? new Date(to) : now;

    const fromDate = from ? new Date(from) : newDate(now.getTime() - 30 * 24 * 60 * 60 * 1000 );

    return { fromDate, toDate };
}

//Doanh thu theo ngay thang
export const getRevenueStats = async ({ from, to, groupBy = 'day'}) => {
    const { fromDate, toDate } = normalizeDate({ from, to});

    //Lay danh sach order trong khoang, chi tinh paid/completed
    const orders = await Order.findAll({
        attributes: ["id", "total_amount", "created_at"],
        where: {
             status: {
                [Op.in]: ["paid", "completed"],
             },
             created_at: {
                [Op.gte]: fromDate,
                [Op.lte]: toDate,
             }
        },
        raw: true,
    });

    //Gom nhom theo ngay thang
    const buckets = {}; 
    for( const order of orders) {
        const d = new Date(order.created_at);
        let key;

        if( groupBy === 'month') {
            const y = d.getFullYear();
            const m = String(d.getMonth()+1).padStart(2, "0");
            key = `${y}-${m}`;
        }else{
            key = d.toISOString().slice(0,10);
        }

        if(!buckets[key]){
            buckets[key] = {
                period: key,
                revenue: 0,
                order_count: 0,
            };
        }
        buckets[key].revenue += Number(order.total_amount || 0);
        buckets[key].order_count += 1;
    }
    //Chuyen ve array & sort tang dan theo period
    const result = Object.values(buckets).sort((a,b) =>
          a.period.localeCompare(b.period)
    );
    return result;
}

//Hien thi top san pham ban chay

export const getTopProducts = async({ from, to , limit = 10}) => {
    const { fromDate, toDate} = normalizeDate({ from, to});
    
    const rows = await OrderItem.findAll({
        attributes: [
            "product_id",
            [fn("SUM", col("quantity")), "total_quantity"],
            //tinh doanh thu tren san pham
            [fn("SUM", literal("quantity * unit_price")), "total_revenue"],
        ],

        include: [
            {
                model: Product,
                attributes: ["id", "name", "slug"],
            },
            {
                model: Order,
                attributes: [],
                where: {
                    status: {
                        [Op.in]: ["paid", "completed"],
                    },
                    created_at: {
                        [Op.gte]: fromDate,
                        [Op.lte]: toDate,
                    },
                },
            },
        ],
        group: ["product_id", "Product.id", "Product.name", "Product.slug"],
        order: [[literal("total_quantity"), "DESC"]],
        limit: Number(limit),
        raw: true,
        nest: true,
    });
    return rows;
}

