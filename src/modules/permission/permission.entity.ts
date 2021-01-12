import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import {Role} from '../role/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar'})
  @IsNotEmpty()
  title: string;

  @Column({type: 'varchar'})
  @IsNotEmpty()
  alias: string;

  @Column({type: 'json', nullable: true})
  conditions: any;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany( type => Role, (role) => role.permissions)
  @JoinTable()
  roles: Promise<Role[]>;
}
