export type MenuEntity = {
  id: string;
  name: string;
  path: string;
  icon?: string | null;
  sortOrder: number;
  parent?: { id: string } | null;
};

export type InternalRoute = {
  id: string;
  parentId?: string | null;
  path: string;
  name: string;
  icon?: string | null;
  sortOrder: number;
  children: InternalRoute[];
};

export type SafeRoute = {
  path: string;
  name: string;
  icon?: string | null;
  children?: SafeRoute[];
};

export function buildMenuTree(flatMenus: MenuEntity[]): InternalRoute[] {
  const menuMap: Record<string, InternalRoute> = {};

  flatMenus.forEach((menu) => {
    menuMap[menu.id] = {
      id: menu.id,
      parentId: menu.parent?.id ?? null,
      path: menu.path,
      name: menu.name,
      icon: menu.icon,
      sortOrder: menu.sortOrder,
      children: [],
    };
  });

  const roots: InternalRoute[] = [];

  Object.values(menuMap).forEach((menu) => {
    if (menu.parentId && menuMap[menu.parentId]) {
      menuMap[menu.parentId].children.push(menu);
    } else {
      roots.push(menu);
    }
  });

  function sortTree(nodes: InternalRoute[]) {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach((n) => sortTree(n.children));
  }
  sortTree(roots);

  return roots;
}

export function buildSafeRoutes(tree: InternalRoute[]): SafeRoute[] {
  return tree.map((node) => ({
    path: node.path,
    name: node.name,
    icon: node.icon,
    children: node.children.length ? buildSafeRoutes(node.children) : undefined,
  }));
}
