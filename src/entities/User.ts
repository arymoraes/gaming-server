import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    USER = "user"
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    NONBINARY = "non-binary",
}

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
    })
    resetPassword: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    isActive: boolean;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @Column({
        type: "enum",
        enum: Gender,
        nullable: true,
        default: null
    })
    gender: Gender

}