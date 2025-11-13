---

## API Modules

### Module 1: USER MANAGEMENT

#### 1.1 User Registration (Public)

**Endpoint:** `POST /api/v1/users/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!",
  "role": "student" // or "teacher"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2025-11-13T10:00:00Z"
  }
}
```

**Error Responses:**

- `400` - Missing required fields, invalid email format, password too weak, passwords don't match
- `409` - Email already exists

#### 1.2 User Login (Public)

**Endpoint:** `POST /api/v1/users/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid email or password

#### 1.3 Get Current User Profile (Protected)

**Endpoint:** `GET /api/v1/users/me`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar": "avatar_url",
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Response:**

- `401` - Not authenticated

#### 1.4 Update User Profile (Protected)

**Endpoint:** `PATCH /api/v1/users/updateMe`

**Request Body:**

```json
{
  "name": "Jane Doe",
  "avatar": "new_avatar_url"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user123",
      "name": "Jane Doe",
      "email": "john@example.com",
      "avatar": "new_avatar_url"
    }
  }
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Not authenticated
- `404` - User not found

#### 1.5 Change Password (Protected)

**Endpoint:** `PATCH /api/v1/users/updatePassword`

**Request Body:**

```json
{
  "passwordCurrent": "SecurePass123!",
  "password": "NewSecurePass456!",
  "passwordConfirm": "NewSecurePass456!"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Password updated successfully",
  "token": "new_jwt_token_here"
}
```

**Error Responses:**

- `400` - Missing fields, passwords don't match, new password too weak
- `401` - Current password incorrect, not authenticated

#### 1.6 Forgot Password (Public)

**Endpoint:** `POST /api/v1/users/forgotPassword`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Reset link sent to your email. Valid for 10 minutes."
}
```

#### 1.7 Reset Password (Public)

**Endpoint:** `PATCH /api/v1/users/resetPassword/:token`

**Request Body:**

```json
{
  "password": "NewSecurePass456!",
  "passwordConfirm": "NewSecurePass456!"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Password reset successfully",
  "token": "new_jwt_token_here"
}
```

**Error Responses:**

- `400` - Invalid token, token expired, passwords don't match
- `404` - User not found

#### 1.8 Get All Users (Admin Only)

**Endpoint:** `GET /api/v1/users`

**Query Parameters:**

- `role` - Filter by role (student, teacher, admin)
- `page` - Pagination page (default: 1)
- `limit` - Items per page (default: 10)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 50,
  "data": {
    "users": [
      {
        "id": "user123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student"
      }
    ]
  }
}
```

**Error Response:**

- `403` - Not authorized (not admin)

#### 1.9 Delete User (Admin Only)

**Endpoint:** `DELETE /api/v1/users/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

**Error Responses:**

- `403` - Not authorized
- `404` - User not found

---

### Module 2: COURSES

#### 2.1 Create Course (Teacher/Admin)

**Endpoint:** `POST /api/v1/courses`

**Request Body:**

```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript basics",
  "category": "Programming",
  "level": "Beginner",
  "maxStudents": 50,
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": "course123",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript basics",
      "category": "Programming",
      "level": "Beginner",
      "instructor": "teacher123",
      "maxStudents": 50,
      "enrolledStudents": 0,
      "status": "draft",
      "startDate": "2025-12-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z",
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Missing required fields, invalid data
- `401` - Not authenticated
- `403` - Not authorized (not teacher/admin)

#### 2.2 Get All Courses (Public)

**Endpoint:** `GET /api/v1/courses`

**Query Parameters:**

- `category` - Filter by category
- `level` - Filter by level (Beginner, Intermediate, Advanced)
- `status` - Filter by status (draft, published, completed)
- `page` - Pagination
- `limit` - Items per page
- `search` - Search by title/description

**Success Response (200):**

```json
{
  "status": "success",
  "results": 25,
  "data": {
    "courses": [
      {
        "id": "course123",
        "title": "Introduction to JavaScript",
        "description": "Learn JavaScript basics",
        "category": "Programming",
        "level": "Beginner",
        "instructor": {
          "id": "teacher123",
          "name": "Jane Smith"
        },
        "enrolledStudents": 30,
        "maxStudents": 50,
        "status": "published",
        "startDate": "2025-12-01T00:00:00Z",
        "endDate": "2025-12-31T23:59:59Z"
      }
    ]
  }
}
```

#### 2.3 Get Course by ID (Public)

**Endpoint:** `GET /api/v1/courses/:id`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "course": {
      "id": "course123",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript basics",
      "category": "Programming",
      "level": "Beginner",
      "instructor": {
        "id": "teacher123",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "enrolledStudents": 30,
      "maxStudents": 50,
      "status": "published",
      "startDate": "2025-12-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z",
      "lectures": ["lecture1", "lecture2"],
      "assignments": ["assign1", "assign2"],
      "quizzes": ["quiz1", "quiz2"],
      "createdAt": "2025-11-13T10:00:00Z",
      "updatedAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Response:**

- `404` - Course not found

#### 2.4 Update Course (Teacher/Admin - Course Owner)

**Endpoint:** `PATCH /api/v1/courses/:id`

**Request Body:**

```json
{
  "title": "Advanced JavaScript",
  "description": "Learn advanced JavaScript concepts",
  "level": "Advanced",
  "maxStudents": 30
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Course updated successfully",
  "data": {
    "course": {
      "id": "course123",
      "title": "Advanced JavaScript",
      "description": "Learn advanced JavaScript concepts",
      "level": "Advanced",
      "maxStudents": 30
    }
  }
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Not authenticated
- `403` - Not authorized (not course owner/admin)
- `404` - Course not found

#### 2.5 Delete Course (Teacher/Admin - Course Owner)

**Endpoint:** `DELETE /api/v1/courses/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Course deleted successfully"
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Not authorized
- `404` - Course not found

#### 2.6 Publish/Unpublish Course (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/courses/:id/publish`

**Request Body:**

```json
{
  "isPublished": true
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Course published successfully",
  "data": {
    "course": {
      "id": "course123",
      "status": "published"
    }
  }
}
```

#### 2.7 Enroll in Course (Student - Protected)

**Endpoint:** `POST /api/v1/courses/:id/enroll`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Enrolled in course successfully",
  "data": {
    "enrollment": {
      "studentId": "student123",
      "courseId": "course123",
      "enrolledAt": "2025-11-13T10:00:00Z",
      "progress": 0
    }
  }
}
```

**Error Responses:**

- `400` - Already enrolled, course full
- `401` - Not authenticated
- `404` - Course not found

#### 2.8 Unenroll from Course (Student)

**Endpoint:** `DELETE /api/v1/courses/:id/enroll`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Unenrolled from course successfully"
}
```

**Error Responses:**

- `400` - Not enrolled
- `401` - Not authenticated
- `404` - Course not found

#### 2.9 Get Enrolled Courses (Student - Protected)

**Endpoint:** `GET /api/v1/users/me/courses`

**Success Response (200):**

```json
{
  "status": "success",
  "results": 3,
  "data": {
    "courses": [
      {
        "id": "course123",
        "title": "Introduction to JavaScript",
        "progress": 45,
        "grade": null,
        "status": "in-progress"
      }
    ]
  }
}
```

#### 2.10 Get Course Statistics (Teacher/Admin)

**Endpoint:** `GET /api/v1/courses/:id/stats`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalEnrolled": 30,
      "activeStudents": 28,
      "averageProgress": 65,
      "averageGrade": 82,
      "completionRate": 60,
      "submissions": {
        "assignments": 45,
        "quizzes": 30
      }
    }
  }
}
```

---

### Module 3: LECTURES

#### 3.1 Create Lecture (Teacher/Admin)

**Endpoint:** `POST /api/v1/lectures`

**Request Body:**

```json
{
  "courseId": "course123",
  "title": "Variables and Data Types",
  "description": "Understanding JavaScript variables",
  "videoUrl": "https://youtube.com/watch?v=...",
  "duration": 45,
  "order": 1,
  "content": "Detailed lecture content in markdown",
  "resources": ["resource_url_1", "resource_url_2"]
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Lecture created successfully",
  "data": {
    "lecture": {
      "id": "lecture123",
      "courseId": "course123",
      "title": "Variables and Data Types",
      "description": "Understanding JavaScript variables",
      "videoUrl": "https://youtube.com/watch?v=...",
      "duration": 45,
      "order": 1,
      "status": "draft",
      "views": 0,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Missing required fields
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Course not found

#### 3.2 Get Lectures by Course (Public)

**Endpoint:** `GET /api/v1/lectures/course/:courseId`

**Query Parameters:**

- `page` - Pagination
- `limit` - Items per page
- `sort` - Sort by order (asc/desc)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "lectures": [
      {
        "id": "lecture123",
        "courseId": "course123",
        "title": "Variables and Data Types",
        "description": "Understanding JavaScript variables",
        "videoUrl": "https://youtube.com/watch?v=...",
        "duration": 45,
        "order": 1,
        "views": 150
      }
    ]
  }
}
```

#### 3.3 Get Lecture by ID (Public)

**Endpoint:** `GET /api/v1/lectures/:id`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "lecture": {
      "id": "lecture123",
      "courseId": "course123",
      "title": "Variables and Data Types",
      "description": "Understanding JavaScript variables",
      "videoUrl": "https://youtube.com/watch?v=...",
      "duration": 45,
      "order": 1,
      "content": "Detailed lecture content",
      "resources": ["resource_url_1"],
      "views": 150,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

#### 3.4 Update Lecture (Teacher/Admin - Course Owner)

**Endpoint:** `PATCH /api/v1/lectures/:id`

**Request Body:**

```json
{
  "title": "Variables, Data Types, and Operators",
  "videoUrl": "https://new-video-url",
  "order": 2
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lecture updated successfully",
  "data": {
    "lecture": {
      "id": "lecture123",
      "title": "Variables, Data Types, and Operators",
      "videoUrl": "https://new-video-url",
      "order": 2
    }
  }
}
```

#### 3.5 Delete Lecture (Teacher/Admin)

**Endpoint:** `DELETE /api/v1/lectures/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Lecture deleted successfully"
}
```

#### 3.6 Mark Lecture as Viewed (Student - Protected)

**Endpoint:** `POST /api/v1/lectures/:id/view`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lecture marked as viewed",
  "data": {
    "lecture": {
      "id": "lecture123",
      "viewCount": 151
    }
  }
}
```

---

### Module 4: ASSIGNMENTS

#### 4.1 Create Assignment (Teacher/Admin)

**Endpoint:** `POST /api/v1/assignments`

**Request Body:**

```json
{
  "courseId": "course123",
  "title": "Build a To-Do App",
  "description": "Create a functional to-do application using HTML, CSS, and JavaScript",
  "instructions": "1. Create HTML structure\n2. Style with CSS\n3. Add JavaScript functionality",
  "dueDate": "2025-12-15T23:59:59Z",
  "maxScore": 100,
  "allowLateSubmission": true,
  "latePenaltyPercent": 10
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Assignment created successfully",
  "data": {
    "assignment": {
      "id": "assign123",
      "courseId": "course123",
      "title": "Build a To-Do App",
      "description": "Create a functional to-do application",
      "instructions": "1. Create HTML...",
      "dueDate": "2025-12-15T23:59:59Z",
      "maxScore": 100,
      "allowLateSubmission": true,
      "latePenaltyPercent": 10,
      "status": "published",
      "submissionCount": 0,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Missing required fields, invalid date
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Course not found

#### 4.2 Get Assignments by Course (Public)

**Endpoint:** `GET /api/v1/assignments/course/:courseId`

**Query Parameters:**

- `status` - Filter by status (draft, published, closed)
- `page` - Pagination
- `limit` - Items per page

**Success Response (200):**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "assignments": [
      {
        "id": "assign123",
        "courseId": "course123",
        "title": "Build a To-Do App",
        "description": "Create a functional to-do application",
        "dueDate": "2025-12-15T23:59:59Z",
        "maxScore": 100,
        "status": "published",
        "submissionCount": 28
      }
    ]
  }
}
```

#### 4.3 Get Assignment by ID (Public)

**Endpoint:** `GET /api/v1/assignments/:id`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "assignment": {
      "id": "assign123",
      "courseId": "course123",
      "title": "Build a To-Do App",
      "description": "Create a functional to-do application",
      "instructions": "1. Create HTML...",
      "dueDate": "2025-12-15T23:59:59Z",
      "maxScore": 100,
      "allowLateSubmission": true,
      "latePenaltyPercent": 10,
      "status": "published"
    }
  }
}
```

#### 4.4 Update Assignment (Teacher/Admin - Course Owner)

**Endpoint:** `PATCH /api/v1/assignments/:id`

**Request Body:**

```json
{
  "title": "Build an Advanced To-Do App",
  "dueDate": "2025-12-20T23:59:59Z",
  "maxScore": 150
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Assignment updated successfully"
}
```

#### 4.5 Delete Assignment (Teacher/Admin)

**Endpoint:** `DELETE /api/v1/assignments/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Assignment deleted successfully"
}
```

#### 4.6 Submit Assignment (Student - Protected)

**Endpoint:** `POST /api/v1/assignments/:id/submit`

**Request Body:**

```json
{
  "submissionText": "Here's my solution...",
  "submissionFiles": ["file_url_1", "file_url_2"],
  "submissionLink": "https://github.com/user/project"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Assignment submitted successfully",
  "data": {
    "submission": {
      "id": "submit123",
      "assignmentId": "assign123",
      "studentId": "student123",
      "submissionText": "Here's my solution...",
      "submissionFiles": ["file_url_1", "file_url_2"],
      "submissionLink": "https://github.com/user/project",
      "status": "submitted",
      "submittedAt": "2025-12-10T10:00:00Z",
      "isLate": false,
      "score": null
    }
  }
}
```

**Error Responses:**

- `400` - Already submitted, assignment closed, empty submission
- `401` - Not authenticated
- `404` - Assignment not found

#### 4.7 Get Submissions (Student - Own / Teacher - All)

**Endpoint:** `GET /api/v1/assignments/:id/submissions`

**For Students:** Returns only their submission
**For Teachers:** Returns all student submissions for that assignment

**Query Parameters:**

- `page` - Pagination
- `limit` - Items per page
- `status` - Filter by status (submitted, graded, pending)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 28,
  "data": {
    "submissions": [
      {
        "id": "submit123",
        "studentId": "student123",
        "studentName": "John Doe",
        "submittedAt": "2025-12-10T10:00:00Z",
        "isLate": false,
        "status": "graded",
        "score": 85
      }
    ]
  }
}
```

#### 4.8 Grade Assignment Submission (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/assignments/submissions/:submissionId/grade`

**Request Body:**

```json
{
  "score": 85,
  "feedback": "Great work! Your code is clean and well-organized. Consider adding more error handling.",
  "comments": "Excellent implementation"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Submission graded successfully",
  "data": {
    "submission": {
      "id": "submit123",
      "assignmentId": "assign123",
      "score": 85,
      "feedback": "Great work!...",
      "status": "graded",
      "gradedAt": "2025-12-12T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Invalid score (exceeds maxScore)
- `401` - Not authenticated
- `403` - Not authorized (not teacher)
- `404` - Submission not found

#### 4.9 Get Assignment Statistics (Teacher/Admin)

**Endpoint:** `GET /api/v1/assignments/:id/stats`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalSubmissions": 28,
      "submittedOn Time": 26,
      "submittedLate": 2,
      "pendingGrading": 5,
      "averageScore": 78.5,
      "highestScore": 100,
      "lowestScore": 45,
      "submissionRate": 85
    }
  }
}
```

---

### Module 5: QUIZZES

#### 5.1 Create Quiz (Teacher/Admin)

**Endpoint:** `POST /api/v1/quizzes`

**Request Body:**

```json
{
  "courseId": "course123",
  "title": "JavaScript Basics Quiz",
  "description": "Test your knowledge of JavaScript fundamentals",
  "questions": [
    {
      "questionText": "What is the output of: console.log(typeof [])?",
      "type": "multiple-choice",
      "options": ["array", "object", "list", "undefined"],
      "correctAnswer": 1,
      "points": 2
    },
    {
      "questionText": "JavaScript is a typed language.",
      "type": "true-false",
      "correctAnswer": false,
      "points": 1
    },
    {
      "questionText": "Explain the concept of hoisting in JavaScript.",
      "type": "short-answer",
      "points": 5
    }
  ],
  "dueDate": "2025-12-15T23:59:59Z",
  "timeLimit": 60,
  "passingScore": 70,
  "maxAttempts": 3,
  "isPublished": false
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Quiz created successfully",
  "data": {
    "quiz": {
      "id": "quiz123",
      "courseId": "course123",
      "title": "JavaScript Basics Quiz",
      "description": "Test your knowledge of JavaScript fundamentals",
      "questionCount": 3,
      "totalPoints": 8,
      "dueDate": "2025-12-15T23:59:59Z",
      "timeLimit": 60,
      "passingScore": 70,
      "maxAttempts": 3,
      "isPublished": false,
      "submissionCount": 0,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Missing required fields, invalid question format, invalid time limit
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Course not found

#### 5.2 Get Quizzes by Course (Public)

**Endpoint:** `GET /api/v1/quizzes/course/:courseId`

**Query Parameters:**

- `page` - Pagination
- `limit` - Items per page

**Success Response (200):**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "quizzes": [
      {
        "id": "quiz123",
        "courseId": "course123",
        "title": "JavaScript Basics Quiz",
        "description": "Test your knowledge",
        "questionCount": 3,
        "totalPoints": 8,
        "dueDate": "2025-12-15T23:59:59Z",
        "timeLimit": 60,
        "passingScore": 70,
        "isPublished": true
      }
    ]
  }
}
```

#### 5.3 Get Quiz by ID (Protected for Students / Public for Instructors)

**Endpoint:** `GET /api/v1/quizzes/:id`

**For Students:**

- Only receives published quizzes
- Questions do not include correct answers
- Used for quiz-taking

**For Teachers:**

- Receives full quiz including answers
- Used for quiz management

**Success Response (200) - Student View:**

```json
{
  "status": "success",
  "data": {
    "quiz": {
      "id": "quiz123",
      "courseId": "course123",
      "title": "JavaScript Basics Quiz",
      "description": "Test your knowledge",
      "timeLimit": 60,
      "questions": [
        {
          "id": "q1",
          "questionText": "What is the output of: console.log(typeof [])?",
          "type": "multiple-choice",
          "options": ["array", "object", "list", "undefined"],
          "points": 2
        }
      ]
    }
  }
}
```

**Success Response (200) - Teacher View:**

```json
{
  "status": "success",
  "data": {
    "quiz": {
      "id": "quiz123",
      "courseId": "course123",
      "title": "JavaScript Basics Quiz",
      "questions": [
        {
          "id": "q1",
          "questionText": "What is the output of: console.log(typeof [])?",
          "type": "multiple-choice",
          "options": ["array", "object", "list", "undefined"],
          "correctAnswer": 1,
          "points": 2
        }
      ]
    }
  }
}
```

#### 5.4 Update Quiz (Teacher/Admin - Course Owner)

**Endpoint:** `PATCH /api/v1/quizzes/:id`

**Request Body:**

```json
{
  "title": "Advanced JavaScript Quiz",
  "timeLimit": 90,
  "maxAttempts": 5
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Quiz updated successfully"
}
```

**Restrictions:**

- Cannot update quiz if students have already submitted

#### 5.5 Delete Quiz (Teacher/Admin)

**Endpoint:** `DELETE /api/v1/quizzes/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Quiz deleted successfully"
}
```

#### 5.6 Publish Quiz (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/quizzes/:id/publish`

**Request Body:**

```json
{
  "isPublished": true
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Quiz published successfully"
}
```

#### 5.7 Submit Quiz (Student - Protected)

**Endpoint:** `POST /api/v1/quizzes/:id/submit`

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": 1,
      "answerText": null
    },
    {
      "questionId": "q2",
      "selectedAnswer": null,
      "answerText": false
    },
    {
      "questionId": "q3",
      "selectedAnswer": null,
      "answerText": "Hoisting is JavaScript's behavior of moving declarations to the top..."
    }
  ],
  "timeSpent": 45
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Quiz submitted successfully",
  "data": {
    "submission": {
      "id": "quizSub123",
      "quizId": "quiz123",
      "studentId": "student123",
      "attemptNumber": 1,
      "submittedAt": "2025-12-10T10:00:00Z",
      "timeSpent": 45,
      "score": 6,
      "totalPoints": 8,
      "percentage": 75,
      "passed": true,
      "status": "graded",
      "feedback": "Good job! You passed the quiz."
    }
  }
}
```

**Auto-Grading Logic:**

```
For Multiple-Choice & True-False:
  - If selectedAnswer matches correctAnswer → points awarded
  - Otherwise → 0 points

For Short-Answer:
  - Status: "pending" (requires manual grading)
  - Placeholder score: 0 until graded

Total Score = Sum of all question scores
Percentage = (Score / Total Points) × 100
Passed = Percentage >= Passing Score
```

**Error Responses:**

- `400` - Quiz not published, time limit exceeded, already submitted (max attempts reached)
- `401` - Not authenticated
- `404` - Quiz not found

#### 5.8 Get Quiz Submissions (Student - Own / Teacher - All)

**Endpoint:** `GET /api/v1/quizzes/:id/submissions`

**For Students:** Returns only their submissions

**For Teachers:** Returns all student submissions

**Query Parameters:**

- `page` - Pagination
- `limit` - Items per page
- `status` - Filter (graded, pending, submitted)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 28,
  "data": {
    "submissions": [
      {
        "id": "quizSub123",
        "studentId": "student123",
        "studentName": "John Doe",
        "attemptNumber": 1,
        "submittedAt": "2025-12-10T10:00:00Z",
        "score": 6,
        "percentage": 75,
        "passed": true,
        "status": "graded"
      }
    ]
  }
}
```

#### 5.9 Get Student Quiz Results (Student - Protected)

**Endpoint:** `GET /api/v1/quizzes/:id/results`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "results": {
      "quizId": "quiz123",
      "quizTitle": "JavaScript Basics Quiz",
      "attempts": [
        {
          "attemptNumber": 1,
          "submittedAt": "2025-12-10T10:00:00Z",
          "score": 6,
          "percentage": 75,
          "passed": true,
          "timeSpent": 45
        }
      ],
      "bestScore": 75,
      "averageScore": 75,
      "attemptCount": 1,
      "maxAttempts": 3
    }
  }
}
```

#### 5.10 Grade Short-Answer Questions (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/quizzes/submissions/:submissionId/grade`

**Request Body:**

```json
{
  "questionId": "q3",
  "points": 4,
  "feedback": "Good explanation, but you missed the temporal dead zone concept."
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Question graded successfully",
  "data": {
    "submission": {
      "id": "quizSub123",
      "newScore": 7,
      "newPercentage": 87.5,
      "passed": true
    }
  }
}
```

#### 5.11 Get Quiz Statistics (Teacher/Admin)

**Endpoint:** `GET /api/v1/quizzes/:id/stats`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalAttempts": 28,
      "totalStudents": 25,
      "averageScore": 72.5,
      "highestScore": 100,
      "lowestScore": 30,
      "passRate": 72,
      "averageTimeSpent": 52,
      "questionAnalysis": [
        {
          "questionId": "q1",
          "questionText": "What is the output...",
          "correctAnswerRate": 85,
          "avgPointsEarned": 1.7
        }
      ]
    }
  }
}
```

---

### Module 6: DISCUSSIONS

#### 6.1 Create Discussion Thread (Teacher/Admin)

**Endpoint:** `POST /api/v1/discussions`

**Request Body:**

```json
{
  "courseId": "course123",
  "title": "Best Practices for Error Handling",
  "description": "Let's discuss best practices for handling errors in JavaScript applications",
  "isPinned": false,
  "isLocked": false
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Discussion thread created successfully",
  "data": {
    "discussion": {
      "id": "discuss123",
      "courseId": "course123",
      "title": "Best Practices for Error Handling",
      "description": "Let's discuss best practices...",
      "author": {
        "id": "teacher123",
        "name": "Jane Smith",
        "role": "teacher"
      },
      "isPinned": false,
      "isLocked": false,
      "replyCount": 0,
      "viewCount": 0,
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Missing required fields
- `401` - Not authenticated
- `403` - Not authorized (not teacher/admin)
- `404` - Course not found

#### 6.2 Get Discussion Threads by Course (Public)

**Endpoint:** `GET /api/v1/discussions/course/:courseId`

**Query Parameters:**

- `page` - Pagination
- `limit` - Items per page
- `sort` - Sort by: newest, oldest, mostReplies, recent (default: newest)
- `pinned` - Filter pinned discussions (true/false)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 15,
  "data": {
    "discussions": [
      {
        "id": "discuss123",
        "courseId": "course123",
        "title": "Best Practices for Error Handling",
        "description": "Let's discuss best practices...",
        "author": {
          "id": "teacher123",
          "name": "Jane Smith",
          "role": "teacher"
        },
        "isPinned": true,
        "isLocked": false,
        "replyCount": 12,
        "viewCount": 145,
        "lastReply": "2025-11-13T09:30:00Z"
      }
    ]
  }
}
```

#### 6.3 Get Discussion Thread by ID (Public)

**Endpoint:** `GET /api/v1/discussions/:id`

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "discussion": {
      "id": "discuss123",
      "courseId": "course123",
      "title": "Best Practices for Error Handling",
      "description": "Let's discuss best practices...",
      "author": {
        "id": "teacher123",
        "name": "Jane Smith",
        "role": "teacher"
      },
      "isPinned": true,
      "isLocked": false,
      "viewCount": 145,
      "replies": [
        {
          "id": "reply123",
          "author": {
            "id": "student123",
            "name": "John Doe",
            "role": "student"
          },
          "content": "I think try-catch is the best approach...",
          "likes": 5,
          "createdAt": "2025-11-13T08:00:00Z",
          "updatedAt": "2025-11-13T08:00:00Z"
        }
      ],
      "createdAt": "2025-11-13T10:00:00Z"
    }
  }
}
```

#### 6.4 Update Discussion Thread (Teacher/Admin - Author)

**Endpoint:** `PATCH /api/v1/discussions/:id`

**Request Body:**

```json
{
  "title": "Best Practices for Error Handling in Modern JavaScript",
  "description": "Updated description..."
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Discussion updated successfully"
}
```

#### 6.5 Delete Discussion Thread (Teacher/Admin - Author/Admin)

**Endpoint:** `DELETE /api/v1/discussions/:id`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Discussion thread deleted successfully"
}
```

#### 6.6 Pin/Unpin Discussion (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/discussions/:id/pin`

**Request Body:**

```json
{
  "isPinned": true
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Discussion pinned successfully"
}
```

#### 6.7 Lock/Unlock Discussion (Teacher/Admin)

**Endpoint:** `PATCH /api/v1/discussions/:id/lock`

**Request Body:**

```json
{
  "isLocked": true
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Discussion locked successfully"
}
```

#### 6.8 Add Reply to Discussion (Student/Teacher/Admin - Protected)

**Endpoint:** `POST /api/v1/discussions/:id/replies`

**Request Body:**

```json
{
  "content": "I think try-catch is the best approach because it's clear and explicit...",
  "replyToId": null
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Reply added successfully",
  "data": {
    "reply": {
      "id": "reply123",
      "discussionId": "discuss123",
      "author": {
        "id": "student123",
        "name": "John Doe",
        "role": "student"
      },
      "content": "I think try-catch is the best approach...",
      "likes": 0,
      "createdAt": "2025-11-13T08:00:00Z"
    }
  }
}
```

**Error Responses:**

- `400` - Empty reply content, discussion locked
- `401` - Not authenticated
- `404` - Discussion not found

#### 6.9 Update Reply (Author Only)

**Endpoint:** `PATCH /api/v1/discussions/replies/:replyId`

**Request Body:**

```json
{
  "content": "Updated reply content..."
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Reply updated successfully"
}
```

#### 6.10 Delete Reply (Author/Admin)

**Endpoint:** `DELETE /api/v1/discussions/replies/:replyId`

**Success Response (204):**

```json
{
  "status": "success",
  "message": "Reply deleted successfully"
}
```

#### 6.11 Like Reply (Student/Teacher/Admin - Protected)

**Endpoint:** `POST /api/v1/discussions/replies/:replyId/like`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Reply liked successfully",
  "data": {
    "reply": {
      "id": "reply123",
      "likes": 6
    }
  }
}
```

#### 6.12 Unlike Reply (Student/Teacher/Admin - Protected)

**Endpoint:** `DELETE /api/v1/discussions/replies/:replyId/like`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Like removed successfully",
  "data": {
    "reply": {
      "id": "reply123",
      "likes": 5
    }
  }
}
```
