import { Op, fn, col, literal } from 'sequelize';
import { User, Product, Cart, CartItem, Order, OrderItem} from '../../models/index.js';

//default 30 ngay gan nhat
const normalizeDate = ({ from, to }) => {
    const now = new Date();

    const toDate = to ? new Date(to) : now;

    const fromDate = from ? new Date(from) : newDate(now.getTime() - 30 * 24 * 60 * 60 * 1000 );
}