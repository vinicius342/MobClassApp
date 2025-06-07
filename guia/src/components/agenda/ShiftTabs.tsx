
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Sunset, Moon } from "lucide-react";
import { Class } from "@/components/AgendaPage";
import { ShiftGrid } from "./ShiftGrid";

interface ShiftTabsProps {
  classes: Class[];
  onEditClass: (classItem: Class) => void;
  onAddClass: () => void;
  collapsedDays: Set<string>;
  onToggleDayCollapse: (day: string) => void;
}

export const ShiftTabs = ({
  classes,
  onEditClass,
  onAddClass,
  collapsedDays,
  onToggleDayCollapse,
}: ShiftTabsProps) => {
  return (
    <Tabs defaultValue="Manhã" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Manhã" className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Manhã
        </TabsTrigger>
        <TabsTrigger value="Tarde" className="flex items-center gap-2">
          <Sunset className="w-4 h-4" />
          Tarde
        </TabsTrigger>
        <TabsTrigger value="Noite" className="flex items-center gap-2">
          <Moon className="w-4 h-4" />
          Noite
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Manhã" className="mt-6">
        <ShiftGrid
          shift="Manhã"
          classes={classes}
          onEditClass={onEditClass}
          onAddClass={onAddClass}
          collapsedDays={collapsedDays}
          onToggleDayCollapse={onToggleDayCollapse}
        />
      </TabsContent>

      <TabsContent value="Tarde" className="mt-6">
        <ShiftGrid
          shift="Tarde"
          classes={classes}
          onEditClass={onEditClass}
          onAddClass={onAddClass}
          collapsedDays={collapsedDays}
          onToggleDayCollapse={onToggleDayCollapse}
        />
      </TabsContent>

      <TabsContent value="Noite" className="mt-6">
        <ShiftGrid
          shift="Noite"
          classes={classes}
          onEditClass={onEditClass}
          onAddClass={onAddClass}
          collapsedDays={collapsedDays}
          onToggleDayCollapse={onToggleDayCollapse}
        />
      </TabsContent>
    </Tabs>
  );
};
