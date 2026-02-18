import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 lg:px-8">
                        <SidebarTrigger />
                        {title && (
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold md:text-base">{title}</span>
                                {subtitle && (
                                    <span className="hidden text-xs text-muted-foreground md:inline">
                                        {subtitle}
                                    </span>
                                )}
                            </div>
                        )}
                    </header>
                    <div className="mx-auto max-w-[1200px] p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
