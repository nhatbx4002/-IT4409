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
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        {/* Mô tả */}
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
            Mô tả sản phẩm
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
                <p>Chưa có mô tả cho sản phẩm này.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Chất liệu & Bảo quản */}
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
            Chất liệu & Bảo quản
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
                <strong className="text-black">Chất liệu:</strong> Vải cao cấp
              </div>
              <div>
                <strong className="text-black">Hướng dẫn bảo quản:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Giặt máy với nước lạnh cùng màu</li>
                  <li>Không dùng chất tẩy</li>
                  <li>Sấy khô ở nhiệt độ thấp</li>
                  <li>Là/ủi ở nhiệt độ thấp nếu cần</li>
                  <li>Không giặt khô</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Kích cỡ & Phom dáng */}
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
            Kích cỡ & Phom dáng
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
                <strong className="text-black">Kích cỡ có sẵn:</strong> {product.sizes.join(", ")}
              </div>
              <div>
                <strong className="text-black">Phom dáng:</strong> Phom regular, đúng với kích cỡ thông thường
              </div>
              <div>
                <strong className="text-black">Số đo người mẫu:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Chiều cao: 1m78</li>
                  <li>Vòng ngực: 96cm</li>
                  <li>Vòng eo: 81cm</li>
                  <li>Mặc size: M</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Giao hàng & Đổi trả */}
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
            Giao hàng & Đổi trả
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
                <strong className="text-black">Vận chuyển:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Miễn phí vận chuyển cho đơn hàng trên 2.500.000đ</li>
                  <li>Giao hàng tiêu chuẩn: 5-7 ngày làm việc</li>
                  <li>Giao hàng nhanh: 2-3 ngày làm việc (có phụ phí)</li>
                  <li>Hỗ trợ giao hàng quốc tế</li>
                </ul>
              </div>
              <div>
                <strong className="text-black">Đổi trả:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Chính sách đổi trả trong 30 ngày</li>
                  <li>Sản phẩm phải còn mới, chưa qua sử dụng và còn nguyên tem mác</li>
                  <li>Miễn phí đổi trả cho đơn hàng trên 2.500.000đ</li>
                  <li>Đính kèm phiếu gửi hàng khi đổi trả</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

