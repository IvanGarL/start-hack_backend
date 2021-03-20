import { Chance } from 'chance';
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Index({ unique: true })
    @Column({ length: 50, unique: true })
    email: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ length: 100 })
    password: string;

    @Column({ nullable: true })
    address?: string;

    @CreateDateColumn()
    createdAt: Date;

    constructor(
        name: string,
        email: string,
        password: string,
        phone?: string,
        fcmToken?: string,
        isFlutter?: boolean,
        job_type?: string,
        address?: string,
    ) {
        this.id = new Chance().guid();
        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;
        this.address = address;
        return this;
    }
}
