import { FunctionalComponent } from 'vue';
declare const _default: {
    components: {
        SideBarItem: FunctionalComponent<{
            item: ResolvedSidebarItem;
        }, Record<string, any>>;
    };
    setup(): {
        items: ResolvedSidebar | import("vue").ComputedRef<ResolvedSidebar | undefined> | undefined;
    };
};
export default _default;
declare type ResolvedSidebar = ResolvedSidebarItem[];
interface ResolvedSidebarItem {
    text: string;
    link?: string;
    isGroup?: boolean;
    children?: ResolvedSidebarItem[];
}
