# Development progress

Over the past two weeks, the sprint focused on consolidating the MVP, increasing integration across frontend, backend, and authentication to mitigate technical risk and enable faster iteration. Architectural robustness—spanning guards, API contracts, and data models—was advanced in parallel with user-facing capabilities such as sign-up, sign-in, reviews, lists, and profile. Critical flows were standardized, including user identity, token-based authorization, and transactional consistency, to ensure security and predictability. Delivery was guided by business value and test readiness, favoring end-to-end increments over isolated prototypes. As a result, the product now exhibits greater stability and measurability and is better positioned for user validation while maintaining cadence toward upcoming roadmap milestones.

## Focus of the sprint

The work centered on hardening the MVP and advancing end-to-end functionality. Priority was given to secure authentication, consistent data modeling, and cohesive APIs, while integrating the most visible user flows—sign-up/sign-in, reviews, lists, favorites, and profile—into a stable, testable product. The result is a more reliable foundation that supports iterative feature growth and user validation. In that context, it mainly covered the followed aspects of the application:

- Fully integrated Authentication: Firebase was integrated to the platform and is responsible for both Sign in and Sign Up processes, which optimized development and minimize responsability from the application side. Besides, all endpoints are now secured and protected by a guard that verifies user authentication.

- Login flow now allows users to register, create a profile and retrieve your own personal data when it comes to visited places, level, lists and username.

- Users can now create a complete review and see it in the profile page.

## Authentication

**Overview**. Authentication relies on Firebase Auth on the client and a global NestJS guard on the server. Every API call carries a Firebase ID token in the `Authorization: Bearer <token>` header; the server verifies this token and resolves the application user before any business logic executes.

### Client flow

1. The app signs up/signs in with Firebase Auth.

2. The current user’s ID token is obtained, then attached to requests (via Axios Interceptior) as `Authorization: Bearer <ID_TOKEN>`.

3. On sign-up, the chosen username is persisted via PATCH.

### Server flow

1. A global FirebaseAuthGuard intercepts all routes.

2. The guard verifies the ID token using Firebase Admin; if valid, it performs a get-or-create in Postgres (by firebaseUid) through service.

3. The resolved DB user is attached to the request so downstream layers operate with a trusted identity.

### Controller usage

- Controllers access the authenticated user ID via a decorator, avoiding manual header parsing and ensuring type safety.

### Errors & enforcement.

- Missing/invalid token → 401 Unauthorized.

- Username uniqueness violations → 400 Bad Request with a clear message.

- By default, all routes are protected; if a public endpoint is ever required, it must be explicitly marked (e.g., @Public()), which is currently not used in the MVP.

@# New endpoints and integrated features

- **Review creation**  
  Adds user-linked reviews with rating, comment, and price. Includes basic content validation, decimal handling for price, and a success notification in the app. Reviews feed “recently visited” and profile statistics.

- **Consolidated profile**  
  Unified response with username, level, total reviews, count of unique places visited, latest visits (up to ten distinct places ordered by most recent), and the user’s first three lists with item counts and a small preview.

- **Places**  
  General listing, category filtering, text search with parameter validation, and an aggregate of “visited by user” derived from reviews. The app side includes debounced search and clear error messaging.

- **User lists**  
  Full set of operations: create, read, update, delete; add/remove places; and item reordering. Prevents duplicates and returns item counts per list to support fast UI rendering.

- **Favorites (up to four)**  
  Feature to pin up to four favorite places, including add, remove, bulk replace, and position reordering (1–4) with consistency guarantees.

- **App integrations (frontend)**  
  Multi-step sign-up (email → username → password → confirm), sign-in that blocks navigation on failure, place search with horizontal scrolling, review form with validation and success toast, and a profile screen that consumes consolidated data with pull-to-refresh.

- **Error handling and robustness**  
  Standardized responses for invalid input and unauthorized access, plus backend safeguards to avoid operations with missing or inconsistent identifiers—ensuring predictable behavior across MVP tests.

## Next steps

The immediate next steps are to complete all end-to-end integrations and feature gaps across profile, lists, favorites, search, and review flows—polishing empty and error states, aligning authentication headers, and standardizing API error messages—while hardening the backend with basic tests, request validation, indexes, and structured logging. In parallel, the stack should be containerized: produce Dockerfiles for backend (NestJS) and supporting services (Postgres), add a docker-compose setup with environment templates, automated Prisma migrations and seed data, and wire this into CI for build, test, and image publishing to simplify local and pipeline execution. With the product stable, initiate usability testing on key journeys (sign-up, search, add review, manage lists/favorites), running short moderated sessions with target users to capture task success, time on task, and common friction points; synthesize findings into a prioritized set of UX refinements. Finally, prepare for a beta release by freezing API contracts, documenting setup and a one-command run path, and establishing a feedback channel and feature flags to de-risk iterative changes.
