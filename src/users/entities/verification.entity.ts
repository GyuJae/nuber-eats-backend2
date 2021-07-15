import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Verification extends CommonEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
