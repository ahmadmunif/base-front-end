import { getDataSource } from "@/db/data-source";
import { User } from "@/db/entities/User";
import { Role } from "@/db/entities/Role";
import bcrypt from "bcryptjs";
import { CreateUserInput, UpdateUserInput } from "@/types/user";
import { Repository, FindOptionsWhere, In, DeepPartial } from "typeorm";
import { RoleService } from "@/services/roleService";

export class UserService {
  private repoPromise: Promise<Repository<User>>;

  constructor() {
    this.repoPromise = getDataSource().then(ds => ds.getRepository(User));
  }

  private async repo() {
    return this.repoPromise;
  }

  async create(data: CreateUserInput) {
    const repo = await this.repo();

    if (await repo.findOne({ where: { username: data.username } })) {
      throw new Error("Username already exists");
    }

    const roleService = new RoleService();
    const foundRoles = await roleService.findById({ id: In(data.roles) });

   const roleEntities: Role[] = Array.isArray(foundRoles)
    ? foundRoles
    : foundRoles
    ? [foundRoles]
    : [];

    const hashed = await bcrypt.hash(data.password, 12);

    const user = repo.create({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      isActive: data.isActive ?? true,
      passwordHash: hashed,
      roles: roleEntities ?? [], 
    } as DeepPartial<User>); 

    return repo.save(user);
  }


  async update(id: string, data: UpdateUserInput) {
    const repo = await this.repo();
    const user = await repo.findOne({ where: { id }, relations: ["roles"] });
    if (!user) throw new Error("User not found");

    user.email = data.email ?? user.email;
    user.fullName = data.fullName ?? user.fullName;
    user.isActive = data.isActive ?? user.isActive;

    if (data.roles) {
      const roleService = new RoleService();
      const foundRoles = await roleService.findById({ id: In(data.roles) });
      user.roles = Array.isArray(foundRoles)
        ? foundRoles
        : foundRoles
        ? [foundRoles]
        : [];
    }

    return repo.save(user);
  }


  async checkPassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }

  async findById(id: string) {
    const repo = await this.repo();
    return repo.findOne({
      where: { id },
      relations: ["roles"],
    });
  }

  async delete(id: string) {
    const repo = await this.repo();
    return repo.delete(id);
  }

  async findAll() {
    const repo = await this.repo();
    return repo.find({ relations: ["roles"] });
  }

  async findByUsername(username: string) {
    const repo = await this.repo();
    return repo.findOne({ where: { username },
                          relations: ["roles", "roles.menus","roles.menus.parent","roles.menus.children",], });
  }

  async findAndCount(where: FindOptionsWhere<User>, page: number, pageSize: number) {    
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
