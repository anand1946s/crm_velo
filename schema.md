+----------------+
|   Contact      |
+----------------+
| id (PK)        |
| name           |
| type           |
| batch          |
| subsystem      |
| phone          |
| email          |
| notes          |
| visibility     |
| discord_id     |
+----------------+
        |
        | 1
        |
        |        +----------------------+
        |        |   ContactProject     |
        |--------|----------------------|
        |   M    | id (PK)              |
        |        | contact_id (FK)      |
        |        | project_id (FK)      |
        |        | role                 |
        |        | notes                |
        |        +----------------------+
        |                     |
        |                     | M
        |                     |
        |                     | 1
        |             +----------------+
        |             |   Project      |
        |             +----------------+
        |             | id (PK)        |
        |             | name           |
        |             | year           |
        |             | description    |
        |             | status         |
        |             +----------------+


+----------------+
|     Log        |
+----------------+
| id (PK)        |
| action         |
| performed_by   |
| contact_id     |
| timestamp      |
| details        |
+----------------+