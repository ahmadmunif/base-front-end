import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable
} from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";
import { Menu } from "./Menu";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  // Relations
  @ManyToMany(() => User, user => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions!: Permission[];

 @ManyToMany(() => Menu, (menu) => menu.roles, { cascade: true })
  @JoinTable({
    name: "role_menus",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "menu_id", referencedColumnName: "id" },
  })
  menus: Menu[];
}
