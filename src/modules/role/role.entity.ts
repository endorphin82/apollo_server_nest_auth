import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {User} from '../user/user.entity';
import { IsNotEmpty } from 'class-validator';
import {Permission} from '../permission/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar'})
  @IsNotEmpty()
  title: string;

  @Column({type: 'varchar'})
  @IsNotEmpty()
  alias: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany( type => Permission, permission => permission.roles)
  public permissions: Promise<Permission[]>;

  @ManyToMany( type => User, (user) => user.roles)
  @JoinTable()
  users: Promise<User[]>;
}
