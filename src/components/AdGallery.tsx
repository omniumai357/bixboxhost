import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdCard from "./AdCard";
import { useToast } from "@/hooks/use-toast";

// Real ad images
import handymanImage from "@/assets/ad-handyman.jpg";
import constructionImage from "@/assets/ad-construction.jpg";
import cleaningImage from "@/assets/ad-cleaning.jpg";
import landscapingImage from "@/assets/ad-landscaping.jpg";
import plumbingImage from "@/assets/ad-plumbing.jpg";
import electricalImage from "@/assets/ad-electrical.jpg";

// Real ad data with professional designs
const mockAds = [
  {
    id: "1",
    title: "Professional Handyman Services",
    image: handymanImage,
    category: "Handyman",
    price: 49,
    views: 1250,
    downloads: 430,
    isPremium: false
  },
  {
    id: "2", 
    title: "Premium Construction Company",
    image: constructionImage,
    category: "Construction",
    price: 97,
    views: 2100,
    downloads: 680,
    isPremium: true
  },
  {
    id: "3",
    title: "House Cleaning Experts",
    image: cleaningImage, 
    category: "Cleaning",
    price: 49,
    views: 890,
    downloads: 340,
    isPremium: false
  },
  {
    id: "4",
    title: "Landscaping & Garden Care",
    image: landscapingImage,
    category: "Landscaping", 
    price: 79,
    views: 1450,
    downloads: 520,
    isPremium: true
  },
  {
    id: "5",
    title: "Plumbing Emergency Services",
    image: plumbingImage,
    category: "Plumbing",
    price: 69,
    views: 1680,
    downloads: 590,
    isPremium: false
  },
  {
    id: "6",
    title: "Electrical Installation Pro",
    image: electricalImage,
    category: "Electrical",
    price: 89,
    views: 1920,
    downloads: 720,
    isPremium: true
  }
];

const categories = ["All", "Handyman", "Construction", "Cleaning", "Landscaping", "Plumbing", "Electrical"];

const AdGallery = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filteredAds, setFilteredAds] = useState(mockAds);

  useEffect(() => {
    let filtered = mockAds;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(ad => favorites.has(ad.id));
    }

    setFilteredAds(filtered);
  }, [searchTerm, selectedCategory, favorites, showFavoritesOnly]);

  const handleFavoriteToggle = (id: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handlePreview = (id: string) => {
    // Track preview interaction
    const ad = mockAds.find(a => a.id === id);
    if (ad) {
      // Store in localStorage for preview page
      localStorage.setItem('previewAd', JSON.stringify(ad));
      toast({
        title: "Preview Loading",
        description: `Opening preview for ${ad.title}...`,
      });
      window.location.href = '/preview';
    }
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Browse Ad Gallery
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover professionally designed advertising cards perfect for your service business
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 rounded-2xl mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "hover:bg-accent"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
              Favorites ({favorites.size})
            </Button>
            
            <div className="flex border rounded-lg p-1 bg-background/50">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAds.length} of {mockAds.length} ads
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {showFavoritesOnly && " (favorites only)"}
        </p>
      </div>

      {/* Ad Grid/List */}
      {filteredAds.length > 0 ? (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animation" 
            : "space-y-4 stagger-animation"
        }>
          {filteredAds.map(ad => (
            <AdCard
              key={ad.id}
              {...ad}
              isFavorite={favorites.has(ad.id)}
              onFavoriteToggle={handleFavoriteToggle}
              onPreview={handlePreview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">No ads found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setShowFavoritesOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdGallery;