import {
    LayoutDashboard,
    FileText,
    BookOpen,
    BarChart3,
    TrendingUp,
    Calendar,
    Settings,
    Brain,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarSeparator,
} from "@/components/ui/sidebar";

const mainItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Novo Simulado", url: "/simulado", icon: FileText },
    { title: "Flashcards", url: "/flashcards", icon: BookOpen },
    { title: "Plano de Estudos", url: "/plano", icon: Calendar },
];

const analyticsItems = [
    { title: "Estatísticas", url: "/estatisticas", icon: BarChart3 },
    { title: "Tendências", url: "/tendencias", icon: TrendingUp },
];

export function AppSidebar() {
    const location = useLocation();
    const isActive = (path: string) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <Sidebar>
            <SidebarHeader className="p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <Brain className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-sidebar-accent-foreground">
                            PsiqTítulo
                        </span>
                        <span className="text-xs text-sidebar-foreground">
                            Prova de Título ABP
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
                        Principal
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <NavLink to={item.url} end={item.url === "/"}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
                        Análise
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analyticsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <NavLink to={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-2 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/configuracoes")}>
                            <NavLink to="/configuracoes">
                                <Settings className="h-4 w-4" />
                                <span>Configurações</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
