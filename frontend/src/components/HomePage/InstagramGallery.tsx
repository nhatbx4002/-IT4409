import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Heart } from "lucide-react";
import { useState } from "react";

export function InstagramGallery() {
  const instagramPosts = [
    {
      image: "https://images.unsplash.com/photo-1760264558913-81340fda5fba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc2MTMyNzExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 2847
    },
    {
      image: "https://images.unsplash.com/photo-1557039834-2f2208c6973c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN1aXR8ZW58MXx8fHwxNzYxNDEwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 1923
    },
    {
      image: "https://images.unsplash.com/photo-1661268095505-cbfb42ef6f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBsdXh1cnklMjBmYXNoaW9uJTIwZHJlc3N8ZW58MXx8fHwxNzYxNDEwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 3102
    },
    {
      image: "https://images.unsplash.com/photo-1554301840-913d3250f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhY2Nlc3NvcmllcyUyMHdhdGNoJTIwamV3ZWxyeXxlbnwxfHx8fDE3NjE0MTA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 4521
    },
    {
      image: "https://images.unsplash.com/photo-1759793499903-bfdba8350627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMHNob2VzfGVufDF8fHx8MTc2MTQxMTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 2156
    },
    {
      image: "https://images.unsplash.com/photo-1668453284543-8df7367074eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBmYXNoaW9uJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjE0MTA5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 2897
    }
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 
            className="mb-4"
            style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Follow @aristino_official
          </h2>
          <p 
            className="text-[#666666]"
            style={{ fontSize: '16px', lineHeight: 1.5 }}
          >
            Join our community and get inspired
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <a
              key={index}
              href="#"
              className="relative aspect-square overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImageWithFallback
                src={post.image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div 
                className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5" fill="white" />
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>
                    {post.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
