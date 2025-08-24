import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';

export function typeOrmConfig(databaseUrl: string): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    autoLoadEntities: true,
    entities: [Product],
    synchronize: true, // prefer migrations in real projects
    logging: false,
  };
}
