import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn
} from "typeorm";
import { Role } from "./Role";

@Entity("menus")
export class Menu {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  path: string;

  @Column({ length: 100, nullable: true })
  icon?: string;

  @Column({ name: "sort_order", type: "int", default: 0 })  // ✅ pakai snake_case
  sortOrder: number;

  @Column({ name: "is_active", default: true })              // ✅ konsisten snake_case
  isActive: boolean;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "parent_id" })   // 👈 penting
  parent: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];


  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];
}
