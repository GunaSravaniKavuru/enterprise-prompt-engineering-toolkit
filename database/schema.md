# Database Schema

## Database

- Database: PostgreSQL
- Provider: Supabase
- ORM: SQLAlchemy

---

## users

Stores registered user accounts.

| Column | Type | Description |
|---------|------|-------------|
| id | Integer | Primary Key |
| name | String | User's full name |
| email | String | Unique email address |
| password_hash | String | Encrypted password |
| org | String | Organization/College |
| role | String | User role |
| avatar_initials | String | User avatar initials |
| created_at | DateTime | Account creation timestamp |

Relationship:
- One user can own multiple prompts.
- One user can create evaluations, optimizations, playground runs, comparison runs, versions and activity logs.

---

## prompts

Stores prompts created using the Prompt Builder.

| Column | Type | Description |
|---------|------|-------------|
| id | Integer | Primary Key |
| user_id | Integer | Owner (FK → users.id) |
| title | String | Prompt title |
| category | String | Prompt category |
| tags | JSONB | Prompt tags |
| content | Text | Generated prompt |
| technique | String | Prompt engineering technique |
| output_format | String | Expected output format |
| form_data | JSONB | Complete Prompt Builder form |
| favorite | Boolean | Favorite status |
| score | Integer | Prompt score |
| created_at | DateTime | Creation time |
| updated_at | DateTime | Last updated |

Relationship:
- Belongs to one user.
- Has multiple prompt versions.
- Can have evaluations.
- Can have optimizations.
- Can have playground runs.
- Can have comparison runs.
- Can have activity log entries.

---

## prompt_versions

Maintains version history for prompts.

| Column | Type |
|---------|------|
| id | Integer |
| prompt_id | Integer |
| version_number | Integer |
| title | String |
| commit_message | String |
| changes | JSONB |
| status | String |
| quality_score | Integer |
| evaluation_score | Integer |
| average_user_rating | Float |
| model_used | String |
| system_prompt | Text |
| user_prompt | Text |
| variables | JSONB |
| tags | JSONB |
| prompt_settings | JSONB |
| notes | Text |
| created_by | Integer |
| created_at | DateTime |

Relationship:
- Belongs to one prompt.
- Created by one user.

---

## evaluations

Stores prompt evaluation results.

| Column | Type |
|---------|------|
| id | Integer |
| prompt_id | Integer |
| overall_score | Integer |
| metrics | JSONB |
| suggestions | JSONB |
| created_by | Integer |
| created_at | DateTime |

Relationship:
- Belongs to a prompt.
- Created by one user.

---

## optimizations

Stores optimized prompt versions.

| Column | Type |
|---------|------|
| id | Integer |
| prompt_id | Integer |
| original_content | Text |
| optimized_content | Text |
| summary | JSONB |
| score_before | Integer |
| score_after | Integer |
| created_by | Integer |
| created_at | DateTime |

Relationship:
- Belongs to a prompt.
- Created by one user.

---

## comparison_runs

Stores multi-model comparison results.

| Column | Type |
|---------|------|
| id | Integer |
| prompt_id | Integer |
| models_used | JSONB |
| results | JSONB |
| created_by | Integer |
| created_at | DateTime |

Relationship:
- Belongs to a prompt.
- Created by one user.

---

## playground_runs

Stores prompt execution history.

| Column | Type |
|---------|------|
| id | Integer |
| prompt_id | Integer |
| model_used | String |
| input_text | Text |
| output_text | Text |
| latency_ms | Integer |
| tokens | Integer |
| created_by | Integer |
| created_at | DateTime |

Relationship:
- Belongs to a prompt.
- Created by one user.

---

## activity_log

Stores user activity history.

| Column | Type |
|---------|------|
| id | Integer |
| user_id | Integer |
| action | String |
| target_prompt_id | Integer |
| target_title | String |
| created_at | DateTime |

Relationship:
- Belongs to one user.
- References the related prompt (if available).

---

# Entity Relationship Overview

Users (1)
│
├── Prompts (N)
│      ├── Prompt Versions
│      ├── Evaluations
│      ├── Optimizations
│      ├── Playground Runs
│      ├── Comparison Runs
│      └── Activity Logs
│
└── User Activity