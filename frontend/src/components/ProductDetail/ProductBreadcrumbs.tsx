import { Link } from "react-router-dom";
import type { ProductDetail } from "@/types/products";

interface ProductBreadcrumbsProps {
  product: ProductDetail;
}

const breadcrumbTextClasses = "text-[13px] text-[#6B7280] font-medium tracking-tight";

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const segments = [
    { label: "Home", to: "/" },
    product.collection
      ? { label: product.collection === "men" ? "Men" : product.collection === "women" ? "Women" : "Accessories", to: `/collections/${product.collection}` }
      : { label: "Men", to: "/collections/men" },
    product.category
      ? { label: product.category.name, to: `/collections/${product.collection || "men"}/${product.category.slug}` }
      : { label: "Suits", to: "/collections/men/suits" },
  ];

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-2">
        {segments.map((segment, index) => (
          <li key={`${segment.label}-${index}`} className="flex items-center gap-2">
            <Link to={segment.to} className={`${breadcrumbTextClasses} hover:text-[#D4AF37] transition-colors`}>
              {segment.label}
            </Link>
            <span className="text-[13px] text-[#9CA3AF]">{">"}</span>
          </li>
        ))}
        <li className="flex items-center">
          <span className="text-[13px] font-semibold text-[#1A1A1A]">{product.name}</span>
        </li>
      </ol>
    </nav>
  );
}

