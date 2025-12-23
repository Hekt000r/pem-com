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


