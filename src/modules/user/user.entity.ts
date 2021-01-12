import {Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {Length} from 'class-validator';
import {Role} from '../role/role.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn({type: 'int'})
  id: number;

  @Column({type: 'varchar'})
  @Length(4, 100)
  email: string;

  @Column({type: 'varchar', default: ''})
  firstName: string;

  @Column({type: 'varchar', default: ''})
  lastName: string;

  @Column({type: 'varchar', default: ''})
  initials: string;

  @Column({type: 'varchar', nullable: true})
  skype: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany( type => Role, role => role.users)
  public roles: Promise<Role[]>;
  //
  // @ManyToMany( type => Project, project => project.employees)
  // public projects: Promise<Project[]>;
  //
  // @OneToMany( type => TimeTrack, timeTrack => timeTrack.user )
  // public timeTracks: Promise<TimeTrack[]>;
}
