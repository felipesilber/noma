# Tests

## Introduction

During this sprint, the primary focus was placed on the creation and consolidation of testing strategies within the platform. Two main categories of tests were implemented and documented: **backend unit tests** and **usability tests**.

The backend unit tests were designed to validate the correctness, stability, and reliability of the application’s core services. By covering critical functionalities such as data handling, service logic, and error management, these tests ensure that the backend operates as intended, even when exposed to edge cases or unexpected inputs. This contributes directly to the robustness of the system, facilitates the detection of regressions in future development cycles, and enhances the overall maintainability of the codebase.

Complementing the technical layer, usability tests were carried out to evaluate the platform from the user’s perspective. These sessions aimed to verify how effectively participants could navigate through key flows, including onboarding, exploring categories, and managing favorites. Beyond measuring task completion rates and time efficiency, the usability tests provided valuable qualitative insights into the clarity of the interface, the intuitiveness of the interactions, and the overall satisfaction of the users.

Together, these two testing approaches form a comprehensive quality assurance process. While the unit tests safeguard the internal consistency of the platform, the usability tests validate its external experience, ensuring that the product is not only technically sound but also accessible, efficient, and enjoyable for its users. Establishing this dual perspective reinforces the importance of testing as a fundamental pillar of sustainable development, reducing risks, and guiding continuous improvement.

## Unit tests

This section consolidates the strategy and outcomes of the backend unit testing effort. Tests were designed to rigorously validate business logic, error handling, and contract fidelity across controllers and services. Following best practices, units were isolated by mocking external boundaries (e.g., Prisma client, cache, and third-party gateways), dependencies were injected via the testing module, and both happy paths and failure modes were asserted (including BadRequestException, ForbiddenException, and NotFoundException). Emphasis was placed on deterministic data, clear given/when/then structures, and exhaustive branch coverage for authorization checks, input validation, and edge cases (empty datasets, invalid IDs, duplicate states). Beyond correctness, these tests serve as living documentation, reduce regression risk, and provide fast feedback in CI by gating merges on minimum coverage thresholds. Collectively, they improve maintainability, enable safer refactors, and accelerate feature delivery by surfacing defects at the earliest possible moment.

### Scope of Entities Tested

- Authentication
- Category
- Follow
- List
- Place
- Profile
- Review
- Saved Places
- User

### Coverage Summary

| Entity         | Layer      | Statements | Branches | Functions |
| -------------- | ---------- | ---------- | -------- | --------- |
| Authentication | Controller | 100%       | 100%     | 100%      |
| Authentication | Service    | 100%       | 100%     | 100%      |
| Category       | Controller | 100%       | 100%     | 100%      |
| Category       | Service    | 100%       | 100%     | 100%      |
| Follow         | Controller | 100%       | 100%     | 100%      |
| Follow         | Service    | 100%       | 100%     | 100%      |
| List           | Controller | 100%       | 100%     | 100%      |
| List           | Service    | 100%       | 100%     | 100%      |
| Place          | Controller | 100%       | 100%     | 100%      |
| Place          | Service    | 100%       | 100%     | 100%      |
| Profile        | Controller | 100%       | 100%     | 100%      |
| Profile        | Service    | 100%       | 100%     | 100%      |
| Review         | Controller | 100%       | 100%     | 100%      |
| Review         | Service    | 100%       | 100%     | 100%      |
| Saved Places   | Controller | 100%       | 100%     | 100%      |
| Saved Places   | Service    | 100%       | 100%     | 100%      |
| User           | Controller | 100%       | 100%     | 100%      |
| User           | Service    | 100%       | 100%     | 100%      |

## Usability tests

Usability testing serves as a key mechanism for validating how intuitive, efficient, and enjoyable a digital product is when placed in the hands of real users. Beyond identifying functional issues, these tests uncover gaps in clarity, navigation, and user expectations that may not surface through technical validation alone. Their benefits include improving task completion rates, reducing cognitive effort, and strengthening overall user satisfaction, while also guiding design decisions with direct evidence from real-world interaction. A crucial aspect of usability testing is the inclusion of participants with diverse backgrounds—whether in age, professional experience, or familiarity with digital platforms—as this diversity ensures that the product remains accessible and inclusive to a wide audience.

For this testing cycle, three participants were involved: Eduardo, 59 years old, with a professional background in technology, bringing an experienced and analytical perspective; Kelly, 55 years old, with no direct involvement in technology, providing insights closer to those of less digitally oriented users; and João Pedro, 21 years old, highly accustomed to current social media platforms, offering a view aligned with younger, digitally native audiences. This varied group enabled the identification of usability strengths and weaknesses across different user profiles, strengthening the reliability of the results.

### Test Flows

#### 1. Onboarding and Login

- **Objective:** Evaluate the clarity and simplicity of the account creation and authentication process.
- **Expected Steps:** User creates an account or logs in without external assistance.
- **Success Criteria:** Task completed within 1 minute, with no more than one failed attempt.

#### 2. Explore Categories and Search for Places

- **Objective:** Validate the ease of navigation and discoverability of establishments.
- **Expected Steps:** User selects a category or performs a search and reaches the intended list of places.
- **Success Criteria:** At least 80% of participants complete the task without guidance.

#### 3. Add to Favorites / Save Places

- **Objective:** Assess the intuitiveness of the save/favorite feature and the clarity of feedback provided.
- **Expected Steps:** User identifies the correct icon or button and successfully saves a place.
- **Success Criteria:** Task completed in under 1 minute with clear confirmation from the interface.

#### 4. Create and Manage Lists

- **Objective:** Test the usability of advanced features such as creating, editing, and managing lists.
- **Expected Steps:** User creates a new list, adds a place, and edits the list details.
- **Success Criteria:** All actions performed without confusion or critical errors.

#### 5. Publish or Consult Reviews

- **Objective:** Verify the simplicity of writing and posting a review, as well as the readability of existing ones.
- **Expected Steps:** User writes a short review and successfully posts it, or navigates to read reviews of a place.
- **Success Criteria:** Reviews are posted or accessed successfully, with a perceived sense of trust and clarity.

### Results

## Usability Test Results

| Flow                        | Eduardo (59, tech)                              | Kelly (55, non-tech)                                     | João Pedro (21, social media)                   |
| --------------------------- | ----------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Onboarding & Login          | Completed quickly, minor hesitation with UI     | Completed successfully, no major issues                  | Completed easily and very fast                  |
| Explore Categories & Search | Clear navigation, used search more than browse  | Took longer to locate categories, required clarification | Very intuitive, switched between filters easily |
| Add to Favorites            | Understood icon, expected stronger feedback     | Recognized icon after short hesitation, completed task   | Completed instantly, found interaction obvious  |
| Create & Manage Lists       | Managed to create/edit, noted need for guidance | Completed with some effort, required extra attention     | Completed with ease, suggested shortcuts        |
| Publish / Consult Reviews   | Posted successfully, commented on text box size | Completed task but found the process slightly confusing  | Completed easily, suggested emoji integration   |

## Conclusion

The combined results of the unit and usability tests highlight that the platform is progressing toward a high standard of quality, both from a technical and experiential perspective. The unit tests confirmed that all core entities and their respective services and controllers are functioning reliably, with full coverage ensuring stability and reducing the risk of regressions. Complementing this, the usability tests demonstrated that the platform is accessible and functional across diverse user profiles, while also revealing areas that could benefit from refinement.

Specifically, the tests indicated that exploring categories required additional clarity for less tech-savvy participants, suggesting the need for improved visual hierarchy or labeling. The favorites feature, while generally understood, would benefit from more explicit feedback to confirm successful actions. In addition, the process of consulting and publishing reviews was identified as an area where minor confusion persisted, particularly around the clarity of text entry and publishing confirmation. Addressing these usability aspects will further enhance inclusiveness, reduce friction in navigation, and ensure that the platform delivers a consistent and intuitive experience across all user profiles.
