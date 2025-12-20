import {
  createCategoryEntry,
  deleteCategoryEntry,
  fetchCategoryTree,
  fetchCategoryWithChildren,
  updateCategoryEntry,
} from "../services/categoryService.js";
import { sendError, sendSuccess } from "./controllerUtils.js";

export const getCategories = async (req, res) => {
  try {
    const data = await fetchCategoryTree();
    return sendSuccess(res, { data });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await fetchCategoryWithChildren(slug);

    if (!category) {
      return sendError(res, "Category not found", 404);
    }

    return sendSuccess(res, { data: category });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const payload = req.body;
    const created = await createCategoryEntry(payload);
    return sendSuccess(res, { status: 201, data: created });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCategoryEntry(id, req.body);

    if (!updated) {
      return sendError(res, "Category not found", 404);
    }

    return sendSuccess(res, { data: updated });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCategoryEntry(id);

    if (!deleted) {
      return sendError(res, "Category not found", 404);
    }

    return sendSuccess(res, { data: true });
  } catch (error) {
    return sendError(res, error);
  }
};
