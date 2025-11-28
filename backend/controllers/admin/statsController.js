import { getRevenueStats, getTopProducts } from "../../services/admin/statsService.js"

//hien thi thong ke doanh thu theo ngay, thang
export const getRevenueStatsController = async (req, res) => {
    try{
        const { from, to, groupBy } = req.query;

        const data = await getRevenueStats({ from, to, groupBy});
        res.status(200).json({
            success: true,
            message: "Lấy thống kê doanh thu thành công",
            data,
        })
        }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getTopProductsController = async (req,res) => {
    try{
        const { from, to, limit } = req.query;

        const data = await getTopProducts({ from, to, limit: Number(limit) || 10});

        res.status(200).json({
            success: true,
            message: "Lấy top sản phẩm bán chạy thành công",
            data,
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

