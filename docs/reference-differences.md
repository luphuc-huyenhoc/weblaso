# Reference Site Differences & Defects Log

Documenting known defects, incomplete implementations, or design flaws on https://nguhanh.net/ and how our independent implementation solves them.

| Area / Feature | Reference Behavior | Our Implementation | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Placeholder Routes** | Returns `<p>Hệ thống đang phát triển, vui lòng quay lại sau!!!</p>` on 8+ routes | Complete functional implementations with domain calculation and UI | A production product must not ship dummy placeholders. |
| **Search Functionality** | `/?s=query` produces no results and redirects to homepage | Full-text PostgreSQL database search across articles, remedies, and guides | Directive 22: Search box must never do nothing. |
| **Chart Data Serialization** | Server renders HTML string markup in JSON (`response.data`) | Structured JSON calculation fact + interpretation result rendered client/server via React | Separates domain calculation from presentation, enables native JSONB storage, API consumption, and versioned migrations. |
| **Hexagram Saving** | Endpoint was left empty (`SAVE_QUEDICH_LUCHAO_PAGE_URL = ''`) | Full database persistence for user hexagram readings with notes and favorites | Enables user history and saved divination readings. |
| **Mobile Layout** | Chart table wrapper uses fixed `w-1140px` forcing severe horizontal scroll on mobile | Responsive responsive wrapper with sticky headers, horizontal scroll hints, and adaptive font sizing | Directive 25: Mobile is a first-class experience with zero clipping or awkward overflow. |
| **Chart Versioning** | No metadata tracking engine version or calculation policy | Immutable envelope containing `engineVersion`, `methodologyVersion`, `calendarVersion`, and `timezonePolicy` | Allows algorithm evolution over time without invalidating or corrupting historic charts. |
| **Authentication Security** | Plain session cookies with standard tokens | Hashed tokens (`tokenHash`), expiration dates, separate token tables, and opaque server sessions | Protection against credential theft, token leaks, and session hijacking. |
| **Database Architecture** | Mixed legacy ASP.NET tables | Clean PostgreSQL schema with strict typing, foreign keys, cascade deletes, and migrations | Eliminates data drift and ensures scalable transactional integrity. |
