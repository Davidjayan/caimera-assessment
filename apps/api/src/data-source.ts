/**
 * TypeORM CLI Data Source
 *
 * Used by the TypeORM CLI for generating and running migrations.
 * Run from the monorepo root with:
 *   pnpm migration:generate <MigrationName>
 *   pnpm migration:run
 *   pnpm migration:revert
 */
import { AppDataSource } from './app/database';

export default AppDataSource;
