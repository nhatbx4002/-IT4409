export const calculatePriceFromVariants = (basePrice = 0, variants = []) => {
  const numericBase = parseFloat(basePrice || 0);
  if (!variants.length) return numericBase;
  const minPrice = Math.min(...variants.map((v) => parseFloat(v.price || 0)));
  return Number.isFinite(minPrice) ? minPrice : numericBase;
};

export const calculateDiscountPercent = (price, salePrice) => {
  if (!salePrice || !price) return null;
  return Math.round(((price - salePrice) / price) * 100);
};
