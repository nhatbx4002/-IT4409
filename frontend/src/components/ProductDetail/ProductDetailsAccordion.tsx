import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductDetail } from "@/types/products";

interface ProductDetailsAccordionProps {
  product: ProductDetail;
}

export function ProductDetailsAccordion({ product }: ProductDetailsAccordionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        {/* Description */}
        <AccordionItem value="description" className="border-b border-[#EEEEEE]">
          <AccordionTrigger
            className="text-left"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              color: "#000000",
            }}
          >
            Description
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-[#757575] leading-relaxed"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              {product.description || (
                <p>No description available for this product.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fabric & Care */}
        <AccordionItem value="fabric-care" className="border-b border-[#EEEEEE]">
          <AccordionTrigger
            className="text-left"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              color: "#000000",
            }}
          >
            Fabric & Care
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-[#757575] leading-relaxed space-y-3"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <div>
                <strong className="text-black">Material:</strong> Premium quality fabric
              </div>
              <div>
                <strong className="text-black">Care Instructions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not dry clean</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size & Fit */}
        <AccordionItem value="size-fit" className="border-b border-[#EEEEEE]">
          <AccordionTrigger
            className="text-left"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              color: "#000000",
            }}
          >
            Size & Fit
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-[#757575] leading-relaxed space-y-4"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <div>
                <strong className="text-black">Available Sizes:</strong> {product.sizes.join(", ")}
              </div>
              <div>
                <strong className="text-black">Fit:</strong> Regular fit, true to size
              </div>
              <div>
                <strong className="text-black">Model Measurements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Height: 5'10"</li>
                  <li>Chest: 38"</li>
                  <li>Waist: 32"</li>
                  <li>Wearing size: Medium</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Delivery & Returns */}
        <AccordionItem value="delivery-returns" className="border-b border-[#EEEEEE]">
          <AccordionTrigger
            className="text-left"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              color: "#000000",
            }}
          >
            Delivery & Returns
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-[#757575] leading-relaxed space-y-4"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              <div>
                <strong className="text-black">Shipping:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Free shipping on orders over $100</li>
                  <li>Standard shipping: 5-7 business days</li>
                  <li>Express shipping: 2-3 business days (additional fee)</li>
                  <li>International shipping available</li>
                </ul>
              </div>
              <div>
                <strong className="text-black">Returns:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>30-day return policy</li>
                  <li>Items must be unworn, unwashed, and with tags attached</li>
                  <li>Free returns for orders over $100</li>
                  <li>Return shipping label included</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

