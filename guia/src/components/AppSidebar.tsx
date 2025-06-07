
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Users, 
  Book, 
  Calendar, 
  LogOut,
  ClipboardList,
  FileText,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Link,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: Users,
    url: "#",
  },
  {
    title: "Tarefas",
    icon: ClipboardList,
    url: "#",
  },
  {
    title: "Agenda",
    icon: Calendar,
    url: "#",
  },
  {
    title: "Frequência",
    icon: FileText,
    url: "#",
  },
  {
    title: "Notas",
    icon: BookOpen,
    url: "#",
  },
  {
    title: "Comunicados",
    icon: MessageSquare,
    url: "#",
  },
  {
    title: "Matérias",
    icon: Book,
    url: "#",
  },
  {
    title: "Turmas",
    icon: GraduationCap,
    url: "#",
  },
  {
    title: "Vínculos",
    icon: Link,
    url: "#",
  },
  {
    title: "Usuários",
    icon: UserCog,
    url: "#",
  },
];

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0" style={{ backgroundColor: '#052c65' }}>
      <SidebarHeader className="p-6" style={{ backgroundColor: '#052c65' }}>
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d34ecded-8ca2-43aa-95a9-f3860a41f32d.png" 
              alt="Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent style={{ backgroundColor: '#052c65' }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`text-blue-100 hover:text-white hover:bg-blue-800 ${
                      item.title === currentPage ? 'bg-blue-800 text-white' : ''
                    }`}
                    style={{ 
                      backgroundColor: item.title === currentPage ? 'rgba(59, 130, 246, 0.3)' : 'transparent'
                    }}
                  >
                    <a 
                      href={item.url} 
                      className="flex items-center gap-3 px-4 py-3"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(item.title);
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4" style={{ backgroundColor: '#052c65' }}>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-800"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
