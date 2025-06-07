
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, Share2 } from "lucide-react";

interface FrequencyReportsActionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

const FrequencyReportsActions = ({
  onExportPDF,
  onExportExcel,
  onPrint,
}: FrequencyReportsActionsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={onExportPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={onExportExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button onClick={onPrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyReportsActions;
