## Data migration Architecture

### File structure

|
| migrations
| ----| migration_types
| ----| migrationRunner.ts

migration_types contains the different migration types

migrationRunner is the main  script, this is the script used to actually run migrations.


### Migration Types

Each available migration type has it's own file in migration_types

All migration types must be -idempotent-* ^1
Migration types must be identifiable
Filenames for migration types must start with the identifier, number migration types
by order (first --> last) using numbers 01-99

Example:

01_migration_type.ts

### Running a migration

script usage:

``npx ts-node migrationRunner.ts <migration_identifier>``

**NOTE:** Currently in order for this to work you have to set TS_NODE_COMPILER_OPTIONS "module" value to "commonjs"

So an example command would look like this:

``$env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'; npx ts-node migrationRunner.ts 01_company_update_admins_array``

