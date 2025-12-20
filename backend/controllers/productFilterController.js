import { getFilterOptions as getFilterOptionsService } from "../services/productFilterService.js";

const ALLOWED_COLLECTIONS = new Set(["men", "women", "accessories"]);

export const getFilterOptions = async (req, res, next) => {
  try {
    const { collection, category } = req.query;

    if (collection && !ALLOWED_COLLECTIONS.has(collection)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid collection value",
      });
    }

    const data = await getFilterOptionsService(collection, category);

    return res.status(200).json({
      success: true,
      data,
      message: "Fetched product filters successfully",
    });
  } catch (error) {
    console.error("Failed to fetch product filters:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch product filters",
    });
  }
};
