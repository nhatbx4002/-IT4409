import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { getCollections, getCollectionProducts } from "@/lib/api";
import type { Collection } from "@/types/collections";

export function FeaturedCollections() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productCounts, setProductCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getCollections();
        // Limit to first 3 collections for homepage
        const featuredCollections = collectionsData.slice(0, 3);
        setCollections(featuredCollections);

        // Fetch product counts for each collection
        const counts: Record<number, number> = {};
        await Promise.all(
          featuredCollections.map(async (collection) => {
            try {
              const response = await getCollectionProducts(collection.slug, {
                page: 1,
                limit: 1,
              });
              counts[collection.id] = response.total || 0;
            } catch (err) {
              console.error(`Error fetching count for collection ${collection.slug}:`, err);
              counts[collection.id] = 0;
            }
          })
        );
        setProductCounts(counts);
      } catch (err) {
        console.error("Error fetching collections:", err);
        // Fallback to empty array on error
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-full mx-auto px-30">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="mb-4"
            style={{ fontSize: '42px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Featured Collections
          </h2>
          <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-3/4 bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có collections nào</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                onClick={() => navigate(`/collections/${collection.slug}`)}
                className="group cursor-pointer relative overflow-hidden aspect-3/4"
              >
                <ImageWithFallback
                  src={collection.banner_image || "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1800&q=80"}
                  alt={collection.name}
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
                  {collection.description && (
                    <p 
                      className="text-sm tracking-[0.3em] uppercase mb-2 text-center px-4"
                      style={{ color: '#D4AF37' }}
                    >
                      {collection.description.length > 50 
                        ? collection.description.substring(0, 50) + '...' 
                        : collection.description}
                    </p>
                  )}
                  <h3 
                    className="text-white text-center uppercase tracking-[0.2em] px-4"
                    style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                  >
                    {collection.name}
                  </h3>
                  {productCounts[collection.id] !== undefined && (
                    <p className="text-xs text-gray-300 mt-2">
                      {productCounts[collection.id]} sản phẩm
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
