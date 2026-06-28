import { getDataSource } from "@/db/data-source";
import { Menu } from "@/db/entities/Menu";
import { Role } from "@/db/entities/Role";
import { Repository, In, DeepPartial, FindOptionsWhere } from "typeorm";
import { RoleService } from "@/services/roleService";

export class MenuService {
  private repoPromise: Promise<Repository<Menu>>;

  constructor() {
    this.repoPromise = getDataSource().then(ds => ds.getRepository(Menu));
  }

  private async repo() {
    return this.repoPromise;
  }

  async create(data: {
    name: string;
    path: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
    parent?: string | null;
    roles?: string[];
  }) {
    const repo = await this.repo();

    let parent: Menu | null = null;
    if (data.parent) {
      parent = await repo.findOne({ where: { id: data.parent } });
    }

    let roleEntities: Role[] = [];
    if (data.roles?.length) {
      const roleService = new RoleService();
      const foundRoles = await roleService.findById({ id: In(data.roles) });
      roleEntities = Array.isArray(foundRoles)
        ? foundRoles
        : foundRoles
        ? [foundRoles]
        : [];
    }

    const menu = repo.create({
      name: data.name,
      path: data.path,
      icon: data.icon,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      parent: parent,  // <-- pakai null kalau tidak ada parent
      roles: roleEntities,
    } as DeepPartial<Menu>);

    return repo.save(menu);
  }

  async update(id: string, data: Partial<{
    name: string;
    path: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
    parent?: string | null; 
    roles?: string[];
  }>) {
    const repo = await this.repo();
    const menu = await repo.findOne({ where: { id }, relations: ["roles", "parent"] });
    if (!menu) throw new Error("Menu not found");

    menu.name = data.name ?? menu.name;
    menu.path = data.path ?? menu.path;
    menu.icon = data.icon ?? menu.icon;
    menu.sortOrder = data.sortOrder ?? menu.sortOrder;
    menu.isActive = data.isActive ?? menu.isActive;

    if (data.parent !== undefined) {
      if (data.parent === null) {
        menu.parent = null;
      } else {
        const parent = await repo.findOne({ where: { id: data.parent } });
        menu.parent = parent ?? null;
      }
    }

    if (data.roles) {
      const roleService = new RoleService();
      const foundRoles = await roleService.findById({ id: In(data.roles) });
      menu.roles = Array.isArray(foundRoles)
        ? foundRoles
        : foundRoles
        ? [foundRoles]
        : [];
    }

    return repo.save(menu);
  }


  async findById(id: string) {
    const repo = await this.repo();
    return repo.findOne({
      where: { id },
      relations: ["roles", "parent", "children"],
    });
  }

  async delete(id: string) {
    const repo = await this.repo();
    return repo.delete(id);
  }

  async findAll() {
    const repo = await this.repo();
    return repo.find({ relations: ["roles", "parent", "children"] });
  }

  async findAndCount(where: FindOptionsWhere<Menu>, page: number, pageSize: number) {
    const repo = await this.repo();
    const [items, total] = await repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { sortOrder: "ASC", createdAt: "DESC" },
      relations: ["roles", "parent", "children"],
    });
    return { items, total };
  }
}