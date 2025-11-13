# SWE Back-End API - Requirements Specification & Documentation

**Project:** Learning Management System (LMS) Back-End API  
**Version:** 1.0.0  
**Date:** November 13, 2025  
**Environment:** Node.js + Express + MongoDB

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication & Authorization](#authentication--authorization)
4. [Detailed Scenarios & Workflows](#detailed-scenarios--workflows)

---

## System Overview

### Purpose

A comprehensive Learning Management System (LMS) backend API that manages:

- User authentication and role-based access control
- Course creation, enrollment, and management
- Lecture content delivery
- Assignment creation and submission tracking
- Quiz creation, submission, and auto-grading
- Discussion forums for peer interaction
- Student progress tracking

### Key Features

- **Role-Based Access Control (RBAC):** Admin, Teacher, Student roles
- **Real-time Tracking:** Student progress, grades, submissions
- **Auto-Grading:** Multiple-choice and true-false quiz questions
- **Enrollment Management:** Course enrollment with limits
- **Discussion Forums:** Peer-to-peer collaboration
- **Security:** JWT authentication, rate limiting, data sanitization

---

## User Roles & Permissions

### 1. **ADMIN**

**Permissions:**

- Full system access
- User management (create, update, delete, deactivate users)
- Course approval and management
- View all submissions and grades
- System configuration

**Restrictions:** None

### 2. **TEACHER / INSTRUCTOR**

**Permissions:**

- Create and manage courses
- Create lectures, assignments, quizzes
- Create and moderate discussions
- View student submissions and grade them
- View student progress and performance
- Publish/unpublish course content
- Manage course enrollment (accept/reject students)

**Restrictions:**

- Cannot delete students from the system
- Cannot access other instructors' courses (unless admin)
- Cannot create or modify other users

### 3. **STUDENT**

**Permissions:**

- Enroll in courses (if available)
- View enrolled course content (lectures, assignments, quizzes)
- Submit assignments
- Attempt quizzes
- View quiz results
- Participate in discussions
- View personal progress and grades

**Restrictions:**

- Cannot create courses, lectures, or assignments
- Cannot modify course content
- Cannot access other students' submissions
- Cannot view other students' grades
- Cannot create discussions (can only reply)

---

## Authentication & Authorization

### Authentication Flow

#### Scenario 1: User Registration (Student/Teacher)

```
1. User submits email, password, name, role preference
2. System validates input (email format, password strength)
3. System checks if email already exists
4. System hashes password (bcrypt)
5. System creates user document in database
6. System returns success message with user details (no token yet)
7. User must log in to get JWT token
```

#### Scenario 2: User Login

```
1. User submits email and password
2. System validates input (email and password required)
3. System retrieves user by email
4. If user not found → return 401 Unauthorized
5. System compares provided password with stored hash
6. If password incorrect → return 401 Unauthorized
7. System generates JWT token (expires in 90 days)
8. System returns token and user data
9. User stores token in client (localStorage/sessionStorage)
```

#### Scenario 3: JWT Verification (Protected Routes)

```
1. User sends request with token in Authorization header
2. System extracts token from "Authorization: Bearer <token>"
3. System verifies token signature and expiration
4. If token invalid/expired → return 401 Unauthorized
5. System decodes token and extracts user ID
6. System retrieves user from database
7. If user not found or deactivated → return 401 Unauthorized
8. Request proceeds with user context
```

#### Scenario 4: Password Reset

```
1. User clicks "Forgot Password" → submits email
2. System validates email exists in database
3. System generates reset token (expires in 10 minutes)
4. System stores hashed reset token in user document
5. System sends reset link via email (includes reset token)
6. User clicks link and submits new password
7. System verifies reset token not expired
8. System hashes new password and updates user
9. System clears reset token
10. System returns success message
```

#### Scenario 5: Logout

```
1. User requests logout endpoint
2. System invalidates token on client side (client removes from storage)
3. System returns success message
Note: Backend is stateless; token becomes invalid when expired
```

---

## Detailed Scenarios & Workflows

### Scenario 1: Complete Student Journey

**Phase 1: Registration & Authentication**

```
1. Student signs up via /api/v1/users/signup
   - Submits: name, email, password, role=student
   - System: validates, hashes password, creates user doc
   - Response: User created (no token)

2. Student logs in via /api/v1/users/login
   - Submits: email, password
   - System: validates credentials, generates JWT token
   - Response: JWT token + user data
   - Client: Stores token in localStorage

3. Student makes subsequent requests
   - Client: Includes "Authorization: Bearer <token>" header
   - System: Verifies token validity
   - Request proceeds with user context
```

**Phase 2: Course Enrollment**

```
1. Student browses available courses via GET /api/v1/courses
   - System: Returns all published courses with pagination
   - Client: Displays list of courses

2. Student views course details via GET /api/v1/courses/:courseId
   - System: Returns full course info (lectures, assignments, quizzes count)

3. Student enrolls in course via POST /api/v1/courses/:courseId/enroll
   - System:
     * Checks if course is full
     * Checks if student already enrolled
     * Creates enrollment record
     * Updates course enrolledStudents count
   - Response: Enrollment success
   - Client: Course appears in "My Courses"

4. Student can now access course content
   - GET /api/v1/lectures/course/:courseId
   - GET /api/v1/assignments/course/:courseId
   - GET /api/v1/quizzes/course/:courseId
```

**Phase 3: Learning Activities**

```
A. Attending Lectures
   1. Student views lectures via GET /api/v1/lectures/course/:courseId
   2. Student opens lecture via GET /api/v1/lectures/:lectureId
   3. System: Increments view count
   4. Student marks lecture complete via POST /api/v1/lectures/:lectureId/view
   5. System: Tracks progress

B. Submitting Assignment
   1. Student views assignments via GET /api/v1/assignments/course/:courseId
   2. Student opens assignment details
   3. Student submits work via POST /api/v1/assignments/:assignmentId/submit
      - Submits: code/text + file URLs + github link
      - System: Stores submission, calculates if late
      - Response: Submission saved with timestamp
   4. Student can view submission via GET /api/v1/assignments/:assignmentId/submissions
      - System: Returns student's submission with optional grade/feedback
   5. Teacher grades submission via PATCH /api/v1/assignments/submissions/:submissionId/grade
      - Teacher submits: score, feedback
      - System: Stores grade, marks as graded
   6. Student views graded submission and feedback

C. Attempting Quiz
   1. Student views quizzes via GET /api/v1/quizzes/course/:courseId
   2. Student opens quiz via GET /api/v1/quizzes/:quizId
      - System: Returns questions WITHOUT correct answers
      - System: Starts timer based on timeLimit
   3. Student answers questions (multiple-choice, true-false, short-answer)
   4. Student submits quiz via POST /api/v1/quizzes/:quizId/submit
      - Submits: answers array, timeSpent
      - System: Auto-grades objective questions
      - System: Calculates score and percentage
      - System: Determines pass/fail based on passingScore
      - Response: Score, percentage, passed status, feedback
   5. Student views quiz results via GET /api/v1/quizzes/:quizId/results
      - System: Shows all attempt history, best score, average

D. Participating in Discussions
   1. Student views discussion threads via GET /api/v1/discussions/course/:courseId
   2. Student opens thread via GET /api/v1/discussions/:discussionId
   3. Student reads replies
   4. Student adds reply via POST /api/v1/discussions/:discussionId/replies
      - Submits: content
      - System: Creates reply with author info and timestamp
      - Response: Reply created
   5. Student likes helpful replies via POST /api/v1/discussions/replies/:replyId/like
      - System: Increments like count
```

**Phase 4: Progress Tracking**

```
1. Student can view personal progress
   - GET /api/v1/users/me/courses
   - System returns: all enrolled courses with progress percentage

2. System calculates progress based on:
   - Lectures viewed / total lectures
   - Assignments submitted / total assignments
   - Quizzes attempted / total quizzes
   - Discussion participation

3. Student can view performance
   - Assignment grades
   - Quiz scores and attempt history
   - Discussion participation count
```

**Phase 5: Unenrollment**

```
1. Student decides to leave course via DELETE /api/v1/courses/:courseId/enroll
   - System: Removes enrollment record
   - System: Removes from course enrolledStudents
   - Response: Unenrolled successfully
```

---

### Scenario 2: Teacher Course Management Workflow

**Phase 1: Course Creation & Setup**

```
1. Teacher creates course via POST /api/v1/courses
   - Submits: title, description, category, level, maxStudents, dates
   - System: Creates course with status=draft, role=teacher as instructor
   - Response: Course created (not visible to students yet)

2. Teacher creates lectures via POST /api/v1/lectures
   - For each lecture:
     * Submits: title, description, videoUrl, content, resources
     * System: Creates lecture with order sequencing
     * Response: Lecture added to course

3. Teacher creates assignments via POST /api/v1/assignments
   - For each assignment:
     * Submits: title, instructions, dueDate, maxScore, late policy
     * System: Creates assignment with status=published
     * Response: Assignment added

4. Teacher creates quizzes via POST /api/v1/quizzes
   - For each quiz:
     * Submits: title, questions (with types and answers), settings
     * System: Creates quiz with status=unpublished
     * Response: Quiz created (not visible yet)

5. Teacher publishes quiz via PATCH /api/v1/quizzes/:quizId/publish
   - System: Makes quiz available to students

6. Teacher creates discussion thread via POST /api/v1/discussions
   - Submits: title, description, isPinned
   - System: Creates thread as starter/pinned
```

**Phase 2: Course Publishing**

```
1. Teacher reviews all content
2. Teacher publishes course via PATCH /api/v1/courses/:courseId/publish
   - System: Changes status to "published"
   - Course now appears in student course listings
   - Students can enroll
```

**Phase 3: Student Management**

```
1. Teacher views enrolled students
   - GET /api/v1/courses/:courseId
   - System: Returns enrolledStudents count

2. Teacher monitors student progress
   - GET /api/v1/courses/:courseId/stats
   - System: Returns class statistics (average progress, grades, etc.)
```

**Phase 4: Grading**

```
A. Assignment Grading
   1. Teacher views submissions via GET /api/v1/assignments/:assignmentId/submissions
      - System: Lists all student submissions with submission timestamps

   2. Teacher opens submission details

   3. Teacher grades submission via PATCH /api/v1/assignments/submissions/:submissionId/grade
      - Submits: score, feedback
      - System: Updates submission, marks as graded

   4. Student receives notification and can view feedback

B. Quiz Grading
   1. Teacher views quiz statistics via GET /api/v1/quizzes/:quizId/stats
      - System: Shows aggregate performance data

   2. Teacher views submissions via GET /api/v1/quizzes/:quizId/submissions
      - System: Lists all submissions

   3. For short-answer questions needing manual grading:
      * Teacher grades via PATCH /api/v1/quizzes/submissions/:submissionId/grade
      * System: Updates submission score and passed status
```

**Phase 5: Discussion Moderation**

```
1. Teacher pins important discussions via PATCH /api/v1/discussions/:id/pin
2. Teacher locks discussion if needed via PATCH /api/v1/discussions/:id/lock
3. Teacher can delete inappropriate replies via DELETE /api/v1/discussions/replies/:replyId
```

---

### Scenario 3: Admin User Management

**Phase 1: User Approval & Management**

```
1. Admin views all users via GET /api/v1/users
   - Query params: role=teacher, page, limit
   - System: Returns paginated list of users

2. Admin can view user details

3. Admin can deactivate user (soft delete)

4. Admin can delete user permanently via DELETE /api/v1/users/:userId
```

**Phase 2: System Monitoring**

```
1. Admin can view course statistics
2. Admin can access all submissions (teacher-level access to all courses)
3. Admin can oversee quiz performance
4. Admin can moderate discussions across all courses
```

---

### Scenario 4: Assessment & Grading Workflow

**Automatic Grading Flow (Quizzes)**

``

1. Student submits quiz with answers
2. System processes each answer:

   For Multiple-Choice Question:
   - Compare selectedAnswer with correctAnswer
   - If match: Award question points
   - Else: Award 0 points

   For True-False Question:
   - Compare selectedAnswer with correctAnswer
   - If match: Award question points
   - Else: Award 0 points

   For Short-Answer Question:
   - Mark status as "pending"
   - Award 0 points (pending teacher review)
     \

3. System calculates:
   - Total Score = Sum of all question points
   - Percentage = (Score / Total Points) × 100
   - Passed = Percentage >= Passing Score
   - Status = "graded" (if all objective) or "pending" (if has short-answer)

4. System returns results to student immediately
5. Pending questions remain ungraded until teacher grades them

```

**Manual Grading Flow (Assignments & Short-Answer Quiz Questions)**

```

1. Teacher views pending submissions/questions
2. Teacher opens submission/question
3. Teacher reviews work/answer
4. Teacher decides points to award
5. Teacher submits grade via PATCH endpoint
6. System updates submission with:
   - Points earned
   - New total score (if quiz)
   - New percentage (if quiz)
   - New passed status (if quiz changed score)
   - Feedback/comments
7. System marks as "graded"
8. Student can view grade and feedback

```



```
