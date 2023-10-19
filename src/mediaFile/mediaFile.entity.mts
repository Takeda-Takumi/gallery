import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['md5'])
export class MediaFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  md5: string;

  @Column()
  extension: string;
}
