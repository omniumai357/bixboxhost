import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, Download, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  price?: number;
  isFavorite?: boolean;
  views?: number;
  downloads?: number;
  isPremium?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onPreview?: (id: string) => void;
}

const AdCard = ({
  id,
  title,
  image,
  category,
  price,
  isFavorite = false,
  views = 0,
  downloads = 0,
  isPremium = false,
  onFavoriteToggle,
  onPreview
}: AdCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  const handlePreviewClick = () => {
    onPreview?.(id);
  };

  return (
    <Card 
      className={cn(
        "group glass-card border-card-border overflow-hidden cursor-pointer transition-all duration-300",
        isHovered && "transform scale-105 shadow-elegant"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePreviewClick}
    >
      <CardContent className="p-0 relative">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"></div>
          )}
          
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              isHovered && "scale-110"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-semibold">
              <Zap className="w-3 h-3" />
              PRO
            </div>
          )}

          {/* Favorite Heart */}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
              "bg-white/20 backdrop-blur-sm hover:bg-white/30",
              isFavorite && "text-red-500 heartbeat"
            )}
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isFavorite && "fill-current"
              )} 
            />
          </button>

          {/* Overlay Actions */}
          <div className={cn(
            "absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 flex items-center justify-center",
            isHovered && "opacity-100"
          )}>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="glass text-white border-white/30 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewClick();
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4 mr-2" />
                Get Now
              </Button>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2">{title}</h3>
              <span className="text-sm text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
                {category}
              </span>
            </div>
            {price && (
              <div className="text-right">
                <div className="text-lg font-bold text-success">${price}</div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {downloads.toLocaleString()}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-auto text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCard;