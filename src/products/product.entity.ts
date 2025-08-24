import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: string; // stored as string to keep decimal exactness

  @Column({ type: 'text', nullable: true })
  image!: string | null; // URL to storage object

  @Column({ type: 'varchar', length: 100, nullable: true })
  category!: string | null;

  @Column({ type: 'text', nullable: true, name: 'long_description' })
  longDescription!: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  features!: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  materials!: string[] | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dimensions!: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  care!: string[] | null;
}
