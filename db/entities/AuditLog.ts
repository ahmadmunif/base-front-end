import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne
} from "typeorm";

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column({ length: 200 })
  action!: string;

  @Column({ length: 200, nullable: true })
  resource?: string;

  @Column({ name: "ip_address", length: 50, nullable: true })
  ipAddress?: string;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
