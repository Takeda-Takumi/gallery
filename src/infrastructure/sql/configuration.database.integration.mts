import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js';

type Entity = string | EntityClassOrSchema;

export const createTestConfigurationForSQLite = (
  entities: Entity[],
): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: 'db/test.splite3',
  entities,
  synchronize: true,
  logging: 'all',
  logger: 'file',
});

export const createTestConfigurationForMySQL = (
  entities: Entity[],
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities,
  synchronize: true,
  logging: 'all',
  logger: 'file',
});
