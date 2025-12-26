import { ImageWithFallback } from "../figma/ImageWithFallback";

export function EditorialSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-full mx-auto px-30">
        <div className="text-center mb-16">
          <h2 
            className="mb-4"
            style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Cẩm nang phong cách
          </h2>
          <p 
            className="text-[#666666] max-w-2xl mx-auto"
            style={{ fontSize: '18px', lineHeight: 1.6 }}
          >
            Bí quyết và cảm hứng thời trang cho tủ đồ của bạn
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative aspect-4/5 overflow-hidden rounded-sm">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1652281846260-14c1bdd5e9a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MTQxMTA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fashion Editorial"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-1" 
                  style={{ backgroundColor: '#D4AF37' }}
                ></div>
                <span 
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: '#D4AF37' }}
                >
                  Thu 2025
                </span>
              </div>
              <h3 
                className="mb-4"
                style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                Cẩm nang quý ông hiện đại
              </h3>
              <p 
                className="text-[#666666] mb-6"
                style={{ fontSize: '16px', lineHeight: 1.5 }}
              >
                Nắm vững bí quyết xây dựng tủ đồ đa năng. Khám phá cách chọn lựa các món đồ cao cấp kết hợp giữa sự thanh lịch vượt thời gian và phong cách hiện đại, phù hợp cho quý ông ngày nay.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 hover:gap-4 transition-all"
                style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 600 }}
              >
                XEM THÊM
                <span>→</span>
              </a>
            </div>

            <div className="h-px bg-black/10"></div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-1" 
                  style={{ backgroundColor: '#D4AF37' }}
                ></div>
                <span 
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: '#D4AF37' }}
                >
                  Mẹo phối đồ
                </span>
              </div>
              <h3 
                className="mb-4"
                style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                Bí quyết phối đồ lịch lãm
              </h3>
              <p 
                className="text-[#666666] mb-6"
                style={{ fontSize: '16px', lineHeight: 1.5 }}
              >
                Từ công sở đến sự kiện tối, khám phá những món đồ không thể thiếu cho quý ông. Tìm hiểu cách phụ kiện cao cấp nâng tầm phong cách và tạo dấu ấn trong mọi dịp quan trọng.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 hover:gap-4 transition-all"
                style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 600 }}
              >
                XEM THÊM
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
