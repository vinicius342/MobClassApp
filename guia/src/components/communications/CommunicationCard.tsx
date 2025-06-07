
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Communication } from "@/types/communication";

interface CommunicationCardProps {
  communication: Communication;
  onDelete: (id: string) => void;
}

export function CommunicationCard({ communication, onDelete }: CommunicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado';
      case 'scheduled':
        return 'Agendado';
      case 'draft':
        return 'Rascunho';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncatedMessage = communication.message.length > 150 
    ? communication.message.substring(0, 150) + "..."
    : communication.message;

  const shouldShowReadMore = communication.message.length > 150;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {communication.subject}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(communication.status)} flex items-center gap-1`}
              >
                {getStatusIcon(communication.status)}
                {getStatusText(communication.status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="font-medium">Turma: {communication.class}</span>
              <span>{communication.date}, {communication.time}</span>
            </div>

            {communication.status === 'sent' && communication.readPercentage > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${communication.readPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-green-600 font-medium">
                    {communication.readPercentage}% leram
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir comunicado</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o comunicado "{communication.subject}"? 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(communication.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="text-gray-700">
          <p className="leading-relaxed">
            {isExpanded ? communication.message : truncatedMessage}
          </p>
          
          {shouldShowReadMore && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Ler menos
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Ler mais
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
