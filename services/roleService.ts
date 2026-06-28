import { getDataSource } from "@/db/data-source";
import { Role } from "@/db/entities/Role";
import { Menu } from "@/db/entities/Menu";
import { Repository, FindOptionsWhere, In } from "typeorm";

export class RoleService {
  private repoPromise: Promise<Repository<Role>>;

  constructor() {
    this.repoPromise = getDataSource().then((ds) => ds.getRepository(Role));
  }

  private async repo() {
    return this.repoPromise;
  }

  async create(data: { name: string; description?: string; menus?: string[] }) {
    const repo = await this.repo();
    const ds = await getDataSource();
    const menuRepo = ds.getRepository(Menu);

    // cek duplikat
    if (await repo.findOne({ where: { name: data.name } })) {
      throw new Error("Role name already exists");
    }

    // resolve menus
    let menus: Menu[] = [];
    if (data.menus && data.menus.length > 0) {
      menus = await menuRepo.find({
        where: { id: In(data.menus) },
      });
    }

    const role = repo.create({
      name: data.name,
      description: data.description,
      menus,
    });

    return repo.save(role);
  }

  async update(
    id: string,
    data: { name?: string; description?: string; menus?: string[] }
  ) {
    const repo = await this.repo();
    const ds = await getDataSource();
    const menuRepo = ds.getRepository(Menu);

    const role = await repo.findOne({ where: { id }, relations: ["menus"] });
    if (!role) throw new Error("Role not found");

    if (data.name !== undefined) role.name = data.name;
    if (data.description !== undefined) role.description = data.description;

    if (data.menus) {
      const menus = await menuRepo.find({
        where: { id: In(data.menus) },
      });
      role.menus = menus;
    }

    role.updatedAt = new Date();

    return repo.save(role);
  }

  async findById(id: string | FindOptionsWhere<Role>) {
    const repo = await this.repo();
    if (typeof id === "string") {
      return repo.findOne({ where: { id }, relations: ["menus"] });
    } else {
      return repo.find({ where: id, relations: ["menus"] });
    }
  }

  async delete(id: string) {
    const repo = await this.repo();
    return repo.delete(id);
  }

  async findAll() {
    const repo = await this.repo();
    return repo.find({ order: { name: "ASC" } });
  }

  async findAndCount(
    where: FindOptionsWhere<Role>,
    page: number,
    pageSize: number
  ) {
    const repo = await this.repo();
    const [items, total] = await repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: "DESC" },
    });
    return { items, total };
  }
}