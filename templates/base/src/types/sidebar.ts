export interface SidebarMenuItem {
    id: string;
    labelKey: string;
    icon?: React.ReactNode;
    path?: string;
    children?: SidebarMenuItem[];
    allowedRoles: number[]; // Role IDs that can see this menu item (e.g., [1] for Admin, [2] for User)
}