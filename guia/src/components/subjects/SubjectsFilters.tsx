
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface SubjectsFiltersProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SubjectsFilters = ({
  selectedCategory,
  onCategoryChange,
  onClearFilters,
}: SubjectsFiltersProps) => {
  const categories = ["Exatas", "Humanas", "Linguagens"];

  const hasFilters = selectedCategory;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      )}
    </div>
  );
};
