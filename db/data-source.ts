import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Permission } from "./entities/Permission";
import { Menu } from "./entities/Menu";
import { AuditLog } from "./entities/AuditLog";

let dataSource: DataSource | null = null;

export async function getDataSource() {
  if (dataSource && dataSource.isInitialized) return dataSource;

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL, 
    synchronize: false, 
    logging: false,
    entities: [User, Role, Permission, Menu, AuditLog],
  });

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   url: process.env.DATABASE_URL,
//   synchronize: false, 
//   logging: true,
//   entities: [User, Role, Permission, Menu, AuditLog],
// });

// let _ds: DataSource | null = null;

// export async function getDataSource() {
//   if (_ds?.isInitialized) return _ds;
//   if (!(global as any).AppDataSource) {
//     (global as any).AppDataSource = AppDataSource.initialize();
//   }
//   _ds = await (global as any).AppDataSource;
//   return _ds;
// }
