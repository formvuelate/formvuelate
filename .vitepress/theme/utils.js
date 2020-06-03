import { useSiteData } from 'vitepress';
export function withBase(path) {
    return (useSiteData().value.base + path).replace(/\/+/g, '/');
}
