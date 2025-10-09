# User Stories

## Introduction

In agile software development, **user stories** represent one of the most effective ways to translate user needs into functionalities that deliver real value to the product. They are designed to facilitate communication among various project stakeholders — especially clients, product owners, and development teams — allowing everyone to share a clear and objective understanding of what needs to be built.

Unlike traditional requirements, which tend to be lengthy and technical, user stories follow a lightweight structure focused on the user. They emphasize **the problem the user wants to solve**, rather than directly addressing how the solution should be implemented. As a result, they promote dialogue, continuous collaboration, and adaptability to change.

Throughout the project, user stories become essential elements for iterative planning. They are prioritized, refined, and broken down into smaller tasks so they can be delivered frequently, ensuring short feedback and validation cycles.

---

## User Story Format

To be effective, user stories must follow certain principles of clarity, value, and testability. Below are the main guidelines used to ensure the quality of the stories described in this project.

### The 3Ws Model

The most common and widely used structure for a user story is known as the **3Ws**:

> **As a [persona]**  
> **I want [functionality]**  
> **So that [expected benefit]**

This format ensures that the story is centered on who will use the feature, what will be done, and why it matters.

---

### The INVEST Method

Each user story should follow the criteria defined by the **INVEST** acronym, introduced by Bill Wake:

- **I – Independent**: should be developed independently of other stories.
- **N – Negotiable**: serves as an invitation for conversation, not a fixed contract.
- **V – Valuable**: must provide clear value to the user or business.
- **E – Estimable**: should be understood well enough to estimate the effort required.
- **S – Small**: must be small enough to be implemented in a short period.
- **T – Testable**: must include acceptance criteria that allow validation of completeness.

---

### Acceptance Criteria

**Acceptance criteria** are specific conditions that determine whether a story has been correctly implemented. They act as objective checkpoints and help ensure the team is aligned with the delivery expectations.

Each story in this document is accompanied by its respective acceptance criteria, contributing to greater clarity and functional validation.

---

## User Stories — Platform Users

### 1. Account Registration

> **As a platform user**  
> **I want to create an account**  
> **So that I can access the features and save my favorite experiences**

**Acceptance Criteria:**
- The system must allow registration via email, Google, and social media.
- The user must receive a confirmation email.
- After registration, the user must be redirected to their homepage.

---

### 2. Creating Lists of Places

> **As a platform user**  
> **I want to create lists of places I want to visit**  
> **So that I can organize and plan future outings**

**Acceptance Criteria:**
- The user can create lists with a name and description.
- The list can include multiple places.
- The user can add or remove places at any time.

---

### 3. Place Rating

> **As a platform user**  
> **I want to rate the places I’ve visited**  
> **So that I can share my opinions with other users**

**Acceptance Criteria:**
- The system allows users to rate from 1 to 5 stars.
- Users can optionally write a comment.
- Ratings are publicly visible on the place’s profile.

---

### 4. Following Other Users

> **As a platform user**  
> **I want to follow friends and influencers**  
> **So that I can discover places based on their experiences**

**Acceptance Criteria:**
- The system allows users to follow and unfollow others.
- The user’s feed displays activity from followed users.
- Profiles show who the user follows and who follows them.

---

### 5. Search and Filters

> **As a platform user**  
> **I want to search and filter establishments**  
> **So that I can find places that meet my personal preferences**

**Acceptance Criteria:**
- The search bar accepts names and keywords.
- Filters for location, place type, and rating are available.
- Results update in real time as filters are applied.

---

### 6. Personalized Lists

> **As a platform user**  
> **I want to create personalized lists with specific criteria**  
> **So that I can group places that make sense for me**

**Acceptance Criteria:**
- Users can add tags and descriptions to the list.
- Lists can be marked as public or private.
- Personalized lists are displayed on the user’s profile.

---

### 7. Profile-Based Recommendations

> **As a platform user**  
> **I want to receive recommendations based on my profile**  
> **So that I can discover new places more relevant to me**

**Acceptance Criteria:**
- The system must consider ratings, lists, and liked places.
- Recommendations must update according to user behavior.
- Suggestions should appear in a dedicated section.

---

## User Stories — Partner Establishments

### 1. Business Profile Creation and Customization

> **As a partner establishment**  
> **I want to create and edit my business profile**  
> **So that I can present my brand and attract customers**

**Acceptance Criteria:**
- The business can include name, description, photos, and location.
- It can add operating hours, price range, and menu.
- Changes are saved and immediately reflected on the profile.

---

### 2. Access to Metrics

> **As a partner establishment**  
> **I want to access view and engagement metrics**  
> **So that I can understand user behavior regarding my profile**

**Acceptance Criteria:**
- The dashboard displays number of visits, clicks, and received ratings.
- Data is updated periodically.
- Metrics can be filtered by time period (last week, month, etc.).

---

### 3. Personalized Campaigns

> **As a partner establishment**  
> **I want to create personalized campaigns based on audience filters**  
> **So that I can increase visibility and reach potential customers more precisely**

**Acceptance Criteria:**
- The system allows targeting by location, age, and preferences.
- The campaign can have a defined duration and budget.
- Reports show real-time performance of the campaign.

## References

- Caroli, Paulo. Writing User Stories and building successful products. Caroli.org, 2022. Available at: https://caroli.org/en/user-story/. Accessed on: May 1, 2025