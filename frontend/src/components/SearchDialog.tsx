import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize search query from URL
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onOpenChange(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <h2>Tìm kiếm sản phẩm</h2>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 pl-12 pr-4 text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="h-14 px-8 bg-[#D4AF37] hover:bg-[#B6911F] text-white font-semibold"
          >
            Tìm kiếm
          </Button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Gợi ý tìm kiếm:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Áo sơ mi", "Quần tây", "Nước hoa", "Ví da", "Thắt lưng"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    handleSearch();
                  }}
                  className="rounded-full border border-gray-300 px-4 py-1 text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
