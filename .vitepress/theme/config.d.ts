export declare namespace DefaultTheme {
    interface Config {
        logo?: string;
        nav?: NavItem[] | false;
        sidebar?: SideBarConfig | MultiSideBarConfig;
        search?: SearchConfig | false;
        editLink?: EditLinkConfig | false;
        lastUpdated?: string | boolean;
        prevLink?: boolean;
        nextLink?: boolean;
    }
    type NavItem = NavItemWithLink | NavItemWithChildren;
    interface NavItemWithLink extends NavItemBase {
        link: string;
    }
    interface NavItemWithChildren extends NavItemBase {
        items: NavItem[];
    }
    interface NavItemBase {
        text: string;
        target?: string;
        rel?: string;
        ariaLabel?: string;
    }
    type SideBarConfig = SideBarItem[] | 'auto' | false;
    interface MultiSideBarConfig {
        [path: string]: SideBarConfig;
    }
    type SideBarItem = SideBarLink | SideBarGroup;
    interface SideBarLink {
        text: string;
        link: string;
    }
    interface SideBarGroup {
        text: string;
        link?: string;
        /**
         * @default false
         */
        collapsable?: boolean;
        children: SideBarItem[];
    }
    interface SearchConfig {
        /**
         * @default 5
         */
        maxSuggestions?: number;
        /**
         * @default ''
         */
        placeholder?: string;
        algolia?: {
            apiKey: string;
            indexName: string;
        };
    }
    interface EditLinkConfig {
        repo: string;
        dir?: string;
        branch?: string;
        text?: string;
    }
}
