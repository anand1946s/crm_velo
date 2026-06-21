# VeloWiKi Database Schema

This document visualizes and describes the relational database schema used by **VeloWiKi**.

## Entity Relationship Diagram

```text
                  +--------------------+
                  |      persons       |
                  +--------------------+
                  | id (PK)            | <----------+
                  | name               |            |
                  | email (UQ)         |            |
                  | phone (UQ)         |            |
                  | dob                |            |
                  | type (Enum)        |            |
                  +--------------------+            |
                    /                \              |
                   / 1                \ 1           |
                  /                    \            |
                 /                      \           |
+--------------------+            +------------------------+
|    memberships     |            |    project_members     |
+--------------------+            +------------------------+
| id (PK)            |            | person_id (PK, FK) ----+
| person_id (UQ, FK) |            | project_id (PK, FK) -------+
| doj                |            +------------------------+   |
| dol                |                                         |
+--------------------+                                         |
                                                               |
                                                               |
                                  +--------------------+       |
                                  |      projects      |       |
                                  +--------------------+       |
                                  | id (PK) <------------------+
                                  | name               |
                                  | description        |
                                  | status (Enum)      |
                                  | start_date         |
                                  | end_date           |
                                  +--------------------+

                  +--------------------+
                  |       users        |
                  +--------------------+
                  | id (PK)            |
                  | email (UQ)         |
                  | role               |
                  +--------------------+
```

## Table Specifications

### 1. `persons`
Represents club members, external mentors, or alumni.
- **`id`** (`Integer`, Primary Key): Auto-incrementing unique identifier.
- **`name`** (`String`, Not Null): Full name of the person.
- **`email`** (`String`, Not Null, Unique): Email address.
- **`phone`** (`String`, Not Null, Unique): Contact phone number.
- **`dob`** (`Date`, Nullable): Date of birth.
- **`type`** (`Enum(PersonType)`, Not Null): Category of the person. Possible values:
  - `MEMBER`: Active club members.
  - `ALUMNI`: Graduated members.
  - `MENTOR`: External mentors/advisors.

### 2. `memberships`
Stores joining/leaving timeline for people. Has a **1-to-1** relationship with the `persons` table.
- **`id`** (`Integer`, Primary Key): Auto-incrementing unique identifier.
- **`person_id`** (`Integer`, Foreign Key -> `persons.id`, Not Null, Unique): Link to the person.
- **`doj`** (`Date`, Nullable): Date of Joining.
- **`dol`** (`Date`, Nullable): Date of Leaving (null indicates currently active).

### 3. `projects`
Represents development or organizational projects undertaken by the club.
- **`id`** (`Integer`, Primary Key): Auto-incrementing unique identifier.
- **`name`** (`String`, Not Null): Project title.
- **`description`** (`Text`, Nullable): Detailed information about the project.
- **`status`** (`Enum(ProjectStatus)`, Not Null, Default: `IN_PROGRESS`): Project phase. Possible values:
  - `IN_PROGRESS`
  - `COMPLETED`
  - `ABORTED`
- **`start_date`** (`Date`, Not Null): Date project commenced.
- **`end_date`** (`Date`, Nullable): Date project concluded (null if ongoing).

### 4. `project_members`
A join table facilitating a **Many-to-Many** relationship between `persons` and `projects`.
- **`person_id`** (`Integer`, Primary Key, Foreign Key -> `persons.id`): Associated person.
- **`project_id`** (`Integer`, Primary Key, Foreign Key -> `projects.id`): Associated project.

### 5. `users`
Accounts authorized to sign in to the administrative web dashboard via Google OAuth.
- **`id`** (`Integer`, Primary Key): Unique identifier.
- **`email`** (`String`, Not Null, Unique): OAuth authorized email address.
- **`role`** (`String`, Not Null, Default: `viewer`): Access role (e.g., `admin`, `viewer`).