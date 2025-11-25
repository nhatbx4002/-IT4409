export const calculatePriceFromVariants = (basePrice = 0, variants = []) => {
  const numericBase = parseFloat(basePrice || 0);
  const minAdjustment =
    variants.length > 0
      ? Math.min(...variants.map((v) => parseFloat(v.price_adjustment || 0)))
      : 0;

  return numericBase + minAdjustment;
};

export const calculateDiscountPercent = (price, salePrice) => {
  if (!salePrice || !price) return null;
  return Math.round(((price - salePrice) / price) * 100);
};
