# Club CRM - API Endpoints Reference

## Base URL
- Local: `http://localhost:8000`
- Production: TBD (Render)

---

## Persons

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/persons` | Add a new person (member / alumni / mentor) |
| GET | `/persons` | List all persons. Supports filter: `?type=MEMBER` |
| GET | `/persons/{id}` | Get full details of a specific person |
| PUT | `/persons/{id}` | Update a person's details |
| DELETE | `/persons/{id}` | Remove a person |

### Notes
- When creating a `MEMBER`, include `doj` in the request body. A membership row is auto-created.
- When creating an `ALUMNI`, include both `doj` and `dol`.
- `MENTOR` requires no membership fields.

---

## Membership

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/persons/{id}/passout` | Mark a member as alumni. Sets `dol` to today and flips type to `ALUMNI`. |

---

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create a new project |
| GET | `/projects` | List all projects. Supports filter: `?status=IN_PROGRESS` |
| GET | `/projects/{id}` | Get a project with its full member list |
| PUT | `/projects/{id}` | Update project details |
| DELETE | `/projects/{id}` | Remove a project |

---

## Project Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects/{id}/members` | Add a person to a project |
| DELETE | `/projects/{id}/members/{person_id}` | Remove a person from a project |

---

## Discord Bot Commands (Planned)
These are the user-facing commands. Internally they call the above endpoints.

| Command | Maps To | Description |
|---------|---------|-------------|
| `/addmember` | `POST /persons` | Add a new club member |
| `/addmentor` | `POST /persons` | Add an external mentor |
| `/passout` | `PUT /persons/{id}/passout` | Mark a member as alumni |
| `/addproject` | `POST /projects` | Create a new project |
| `/assignproject` | `POST /projects/{id}/members` | Assign a person to a project |
| `/getperson` | `GET /persons/{id}` | Look up a person's details |
| `/getproject` | `GET /projects/{id}` | Look up a project and its members |

---

## Enums

**PersonType**
- `MEMBER` — active club member
- `ALUMNI` — passed out member
- `MENTOR` — external industry contact

**ProjectStatus**
- `IN_PROGRESS`
- `COMPLETED`
- `ABORTED`