import { ImageWithFallback } from "../figma/ImageWithFallback";

interface FeaturedCategory {
  title: string;
  subtitle: string;
  image: string;
  productCount: number;
}

export function FeaturedCollections() {
  const categories: FeaturedCategory[] = [
    {
      title: "Tailored Suits",
      subtitle: "Refined Elegance",
      image: "https://images.unsplash.com/photo-1557039834-2f2208c6973c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN1aXR8ZW58MXx8fHwxNzYxNDEwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productCount: 156,
    },
    {
      title: "Designer Shirts",
      subtitle: "Timeless Classics",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhtZW5zJTIwZHJlc3MlMjBzaGlydCUyMGx1eHVyeXxlbnwxfHx8fDE3NjE0MTA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productCount: 243,
    },
    {
      title: "Premium Accessories",
      subtitle: "Complete Your Look",
      image: "https://images.unsplash.com/photo-1554301840-913d3250f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhY2Nlc3NvcmllcyUyMHdhdGNoJTIwamV3ZWxyeXxlbnwxfHx8fDE3NjE0MTA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      productCount: 89,
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-full mx-auto px-30">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="mb-4"
            style={{ fontSize: '42px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Bộ Sưu Tập Nổi Bật
          </h2>
          <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((collection, index) => (
            <div 
              key={index} 
              className="group cursor-pointer relative overflow-hidden aspect-3/4"
            >
              <ImageWithFallback
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
              
              {/* Gold border glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: 'inset 0 0 0 3px #D4AF37'
                }}
              ></div>
              
              {/* Overlay Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p 
                  className="text-sm tracking-[0.3em] uppercase mb-2"
                  style={{ color: '#D4AF37' }}
                >
                  {collection.subtitle}
                </p>
                <h3 
                  className="text-white text-center uppercase tracking-[0.2em] px-4"
                  style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                >
                  {collection.title}
                </h3>
                {collection.productCount !== undefined && (
                  <p className="text-xs text-gray-300 mt-2">
                    {collection.productCount} sản phẩm
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
