import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ProductDetail } from "@/types/products";

interface ProductBreadcrumbsProps {
  product: ProductDetail;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const category = product.category;
  const collection = product.collection;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" style={{ color: "#757575", fontSize: "12px" }}>
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {collection && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={`/collections/${collection}`}
                  style={{ color: "#757575", fontSize: "12px", textTransform: "capitalize" }}
                >
                  {collection}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={`/collections/${collection || ""}/${category.slug}`}
                  style={{ color: "#757575", fontSize: "12px" }}
                >
                  {category.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage style={{ color: "#000000", fontSize: "12px", fontWeight: 500 }}>
            {product.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

