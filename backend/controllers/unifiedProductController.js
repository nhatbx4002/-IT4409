import {
  getAllProductsService,
  searchProductsService as adminSearchProductsService,
} from "../services/admin/productService.js";
import {
  searchProductsService as userSearchProductsService,
} from "../services/user/productService.js";

export class UnifiedProductController {
  constructor(mode = "user") {
    this.mode = mode;
  }

  /**
    Shared listing handler that switches service logic by mode (admin|user).
    - admin: supports optional search via q/search, otherwise returns all.
    - user: forwards full filter/sort pagination parameters.
  */
  list = async (req, res) => {
    try {
      let data;
      if (this.mode === "admin") {
        const searchTerm = req.query.q || req.query.search || "";
        data = searchTerm
          ? await adminSearchProductsService(searchTerm)
          : await getAllProductsService();
      } else {
        const {
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
          sort,
          page,
          pageSize,
        } = req.query;

        data = await userSearchProductsService({
          q: q || undefined,
          name: name || undefined,
          brand: brand || undefined,
          collection,
          categorySlug,
          categorySlugs,
          sizes,
          colors,
          priceMin,
          priceMax,
          brands,
          inStockOnly,
          sort,
          page,
          pageSize,
        });
      }

      return res.status(200).json({
        success: true,
        data,
        message: "Products fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  };

  static forAdmin() {
    return new UnifiedProductController("admin");
  }

  static forUser() {
    return new UnifiedProductController("user");
  }
}
