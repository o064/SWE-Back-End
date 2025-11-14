/* eslint-disable */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Lecture = require('./models/Lecture');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');
const Discussion = require('./models/Discussion');

// Connect to MongoDB
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD).replace("<USER_NAME>", process.env.DB_USERNAME);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => {
        console.error('✗ MongoDB connection failed:', err);
        process.exit(1);
    });

// Seed function
const seedDB = async () => {
    try {
        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lecture.deleteMany({});
        await Assignment.deleteMany({});
        await Submission.deleteMany({});
        await Quiz.deleteMany({});
        await QuizSubmission.deleteMany({});
        await Discussion.deleteMany({});
        console.log('✓ Data cleared');

        // ==================== CREATE USERS ====================
        console.log('\n👥 Creating users...');

        // Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@university.edu',
            password: 'Admin@123456',
            passwordConfirm: 'Admin@123456',
            role: 'admin'
        });

        // Teachers
        const teacher1 = await User.create({
            name: 'Dr. Jane Smith',
            email: 'jane.smith@university.edu',
            password: 'Teacher@123456',
            passwordConfirm: 'Teacher@123456',
            role: 'instructor'
        });

        const teacher2 = await User.create({
            name: 'Prof. Michael Chen',
            email: 'michael.chen@university.edu',
            password: 'Teacher@123456',
            passwordConfirm: 'Teacher@123456',
            role: 'instructor'
        });

        // Students
        const students = [];
        const studentData = [
            { name: 'John Doe', email: 'john.doe@student.edu' },
            { name: 'Alice Johnson', email: 'alice.johnson@student.edu' },
            { name: 'Bob Wilson', email: 'bob.wilson@student.edu' },
            { name: 'Carol Davis', email: 'carol.davis@student.edu' },
            { name: 'David Brown', email: 'david.brown@student.edu' }
        ];
        for (const data of studentData) {

            const student = await User.create({
                name: data.name,
                email: data.email,
                password: 'Student@123456',
                passwordConfirm: 'Student@123456',
                role: 'student'
            });
            students.push(student);

        }

        console.log(`✓ Created 1 admin, 2 teachers, ${students.length} students`);

        // ==================== CREATE COURSES ====================
        console.log('\n📚 Creating courses...');

        const course1 = await Course.create({
            title: 'Introduction to JavaScript',
            description: 'Learn JavaScript fundamentals including variables, functions, and DOM manipulation',
            category: 'Programming',
            level: 'Beginner',
            instructor: teacher1._id,
            students: [students[0]._id, students[1]._id, students[2]._id],
            maxStudents: 50,
            startDate: new Date('2025-11-13'),
            endDate: new Date('2025-12-31'),
            status: 'published'
        });

        const course2 = await Course.create({
            title: 'Advanced Node.js & Express',
            description: 'Master backend development with Node.js, Express, and MongoDB',
            category: 'Programming',
            level: 'Advanced',
            instructor: teacher2._id,
            students: [students[1]._id, students[3]._id, students[4]._id],
            maxStudents: 30,
            startDate: new Date('2025-11-13'),
            endDate: new Date('2025-12-31'),
            status: 'published'
        });

        const course3 = await Course.create({
            title: 'Web Design Basics',
            description: 'Learn HTML, CSS, and responsive design principles',
            category: 'Design',
            level: 'Beginner',
            instructor: teacher1._id,
            students: [students[0]._id, students[2]._id],
            maxStudents: 40,
            startDate: new Date('2025-11-13'),
            endDate: new Date('2025-12-31'),
            status: 'draft'
        });

        console.log('✓ Created 3 courses');

        // ==================== CREATE LECTURES ====================
        console.log('\n🎥 Creating lectures...');

        const lectures = [];

        // Course 1 Lectures

        for (let i = 1; i <= 3; i++) {

            const lecture = await Lecture.create({
                course: course1._id,
                title: `JavaScript Basics - Part ${i}`,
                description: `Understanding variables, data types, and operators - Part ${i}`,
                videoUrl: `https://youtube.com/watch?v=vid${i}`,
                content: `# JavaScript Lecture ${i}\n\nDetailed content about JavaScript fundamentals.`,
                attachments: [`lecture${i}-notes.pdf`, `lecture${i}-code.js`],
                order: i
            });

            lectures.push(lecture);

        }

        // Course 2 Lectures
        // discable eslint 
        for (let i = 1; i <= 4; i++) {

            const lecture = await Lecture.create({
                course: course2._id,
                title: `Node.js Backend - Module ${i}`,
                description: `Building scalable backend services with Node.js - Module ${i}`,
                videoUrl: `https://youtube.com/watch?v=nodejs${i}`,
                content: `# Node.js Module ${i}\n\nAdvanced backend concepts and best practices.`,
                attachments: [`module${i}-guide.pdf`],
                order: i
            });

            lectures.push(lecture);
        }

        // Update courses with lecture references
        course1.lectures = lectures.slice(0, 3).map(l => l._id);
        course2.lectures = lectures.slice(3, 7).map(l => l._id);
        await course1.save();
        await course2.save();

        console.log('✓ Created 7 lectures');

        // ==================== CREATE ASSIGNMENTS ====================
        console.log('\n📝 Creating assignments...');

        const assignments = [];

        const assign1 = await Assignment.create({
            course: course1._id,
            title: 'Build a Calculator App',
            description: 'Create a simple calculator using JavaScript',
            instructions: '1. Create HTML form\n2. Implement calculator logic\n3. Test all operations',
            dueDate: new Date('2025-12-05T23:59:59Z'),
            totalPoints: 100,
            submissions: []
        });

        const assign2 = await Assignment.create({
            course: course1._id,
            title: 'DOM Manipulation Project',
            description: 'Build an interactive to-do list using DOM methods',
            instructions: 'Create a fully functional to-do application',
            dueDate: new Date('2025-12-12T23:59:59Z'),
            totalPoints: 150,
            submissions: []
        });

        const assign3 = await Assignment.create({
            course: course2._id,
            title: 'Build a RESTful API',
            description: 'Create a complete REST API with CRUD operations',
            instructions: 'Use Express, implement authentication, validation, error handling',
            dueDate: new Date('2025-12-10T23:59:59Z'),
            totalPoints: 200,
            submissions: []
        });

        assignments.push(assign1, assign2, assign3);

        // Update courses with assignment references
        course1.assignments = [assign1._id, assign2._id];
        course2.assignments = [assign3._id];
        await course1.save();
        await course2.save();

        console.log('✓ Created 3 assignments');

        // ==================== CREATE SUBMISSIONS ====================
        console.log('\n✅ Creating submissions...');

        const submission1 = await Submission.create({
            assignment: assign1._id,
            student: students[0]._id,
            content: 'const calculator = { add: (a, b) => a + b, subtract: (a, b) => a - b };',
            attachments: ['calculator.js'],
            submittedAt: new Date('2025-12-04T10:30:00Z'),
            grade: 95,
            feedback: 'Excellent work! Clean code and all operations work correctly.',
            gradedAt: new Date('2025-12-04T15:00:00Z'),
            status: 'graded'
        });

        const submission2 = await Submission.create({
            assignment: assign1._id,
            student: students[1]._id,
            content: 'function calculate(a, b, op) { /* implementation */ }',
            attachments: ['my-calculator.js'],
            submittedAt: new Date('2025-12-03T14:20:00Z'),
            grade: 87,
            feedback: 'Good implementation. Consider adding input validation.',
            gradedAt: new Date('2025-12-04T14:00:00Z'),
            status: 'graded'
        });

        const submission3 = await Submission.create({
            assignment: assign1._id,
            student: students[2]._id,
            content: 'Working on the calculator app...',
            attachments: [],
            submittedAt: new Date('2025-12-05T20:00:00Z'),
            grade: null,
            feedback: null,
            status: 'submitted'
        });

        // Update assignment submissions
        assign1.submissions = [submission1._id, submission2._id, submission3._id];
        await assign1.save();

        console.log('✓ Created 3 submissions');
        // ==================== CREATE QUIZZES ====================
        console.log('\n📋 Creating quizzes...');

        const quiz1 = await Quiz.create({
            course: course1._id,
            title: 'JavaScript Fundamentals Quiz',
            description: 'Test your knowledge of JavaScript basics',
            questions: [
                {
                    question: 'What is the output of typeof null?',
                    type: 'multiple-choice',
                    options: [
                        { text: 'null', isCorrect: false },
                        { text: 'object', isCorrect: true },
                        { text: 'undefined', isCorrect: false },
                        { text: 'number', isCorrect: false }
                    ],
                    correctAnswer: 'object',
                    points: 2,
                    explanation: 'In JavaScript, typeof null returns "object" due to a historical bug'
                },
                {
                    question: 'JavaScript is a typed language.',
                    type: 'true-false',
                    options: [
                        { text: 'true', isCorrect: false },
                        { text: 'false', isCorrect: true }
                    ],
                    correctAnswer: 'false',
                    points: 2,
                    explanation: 'JavaScript is dynamically typed, not statically typed'
                },
                {
                    question: 'Explain the concept of hoisting in JavaScript.',
                    type: 'short-answer',
                    correctAnswer: 'Hoisting moves declarations to the top of their scope',
                    points: 6,
                    explanation: 'Hoisting moves declarations to the top of their scope'
                }
            ],
            dueDate: new Date('2025-12-08T23:59:59Z'),
            totalPoints: 10,
            timeLimit: 30,
            passingScore: 70,
            attempts: 2,
            isPublished: true,
            submissions: []
        });

        const quiz2 = await Quiz.create({
            course: course2._id,
            title: 'Node.js & Express Assessment',
            description: 'Evaluate your Node.js and Express knowledge',
            questions: [
                {
                    question: 'What does middleware in Express do?',
                    type: 'multiple-choice',
                    options: [
                        { text: 'Handles database connections', isCorrect: false },
                        { text: 'Processes requests before reaching route handlers', isCorrect: true },
                        { text: 'Generates HTML templates', isCorrect: false },
                        { text: 'Manages user sessions only', isCorrect: false }
                    ],
                    correctAnswer: 'Processes requests before reaching route handlers',
                    points: 3,
                    explanation: 'Middleware functions process requests in the pipeline'
                },
                {
                    question: 'MongoDB uses SQL queries.',
                    type: 'true-false',
                    options: [
                        { text: 'true', isCorrect: false },
                        { text: 'false', isCorrect: true }
                    ],
                    correctAnswer: 'false',
                    points: 2,
                    explanation: 'MongoDB uses BSON and query operators, not SQL'
                }
            ],
            dueDate: new Date('2025-12-15T23:59:59Z'),
            totalPoints: 5,
            timeLimit: 45,
            passingScore: 60,
            attempts: 3,
            isPublished: true,
            submissions: []
        });

        // Update courses with quiz references
        course1.quizzes = [quiz1._id];
        course2.quizzes = [quiz2._id];
        await course1.save();
        await course2.save();

        console.log('✓ Created 2 quizzes');

        // ==================== CREATE QUIZ SUBMISSIONS ====================
        // ==================== CREATE QUIZ SUBMISSIONS ====================
        console.log('\n📝 Creating quiz submissions...');

        const quizSubmission1 = await QuizSubmission.create({
            quiz: quiz1._id,
            student: students[0]._id,
            answers: [
                {
                    questionId: quiz1.questions[0]._id,
                    studentAnswer: 'object',
                    isCorrect: true,
                    pointsEarned: 2
                },
                {
                    questionId: quiz1.questions[1]._id,
                    studentAnswer: 'false',
                    isCorrect: true,
                    pointsEarned: 2
                },
                {
                    questionId: quiz1.questions[2]._id,
                    studentAnswer: 'Hoisting moves declarations to the top of their scope',
                    isCorrect: true,
                    pointsEarned: 6
                }
            ],
            totalScore: 10,
            percentage: 100,
            passed: true,
            startedAt: new Date('2025-12-04T09:00:00Z'),
            submittedAt: new Date('2025-12-04T09:30:00Z'),
            feedback: 'Excellent! Full score achieved.',
            attemptNumber: 1
        });

        const quizSubmission2 = await QuizSubmission.create({
            quiz: quiz1._id,
            student: students[1]._id,
            answers: [
                {
                    questionId: quiz1.questions[0]._id,
                    studentAnswer: 'null',
                    isCorrect: false,
                    pointsEarned: 0
                },
                {
                    questionId: quiz1.questions[1]._id,
                    studentAnswer: 'true',
                    isCorrect: false,
                    pointsEarned: 0
                },
                {
                    questionId: quiz1.questions[2]._id,
                    studentAnswer: 'Variables are lifted automatically',
                    isCorrect: false,
                    pointsEarned: 2
                }
            ],
            totalScore: 2,
            percentage: 20,
            passed: false,
            startedAt: new Date('2025-12-04T10:00:00Z'),
            submittedAt: new Date('2025-12-04T10:45:00Z'),
            feedback: 'You need to review hoisting and basic JS concepts.',
            attemptNumber: 1
        });

        const quizSubmission3 = await QuizSubmission.create({
            quiz: quiz2._id,
            student: students[2]._id,
            answers: [
                {
                    questionId: quiz2.questions[0]._id,
                    studentAnswer: 'Processes requests before reaching route handlers',
                    isCorrect: true,
                    pointsEarned: 3
                },
                {
                    questionId: quiz2.questions[1]._id,
                    studentAnswer: 'false',
                    isCorrect: true,
                    pointsEarned: 2
                }
            ],
            totalScore: 5,
            percentage: 100,
            passed: true,
            startedAt: new Date('2025-12-05T13:00:00Z'),
            submittedAt: new Date('2025-12-05T13:30:00Z'),
            feedback: 'Great job on Node.js & Express concepts!',
            attemptNumber: 1
        });

        // Update quizzes with submission references
        quiz1.submissions = [quizSubmission1._id, quizSubmission2._id];
        quiz2.submissions = [quizSubmission3._id];
        await quiz1.save();
        await quiz2.save();

        console.log('✓ Created 3 quiz submissions');


        // ==================== CREATE DISCUSSIONS ====================
        console.log('\n💬 Creating discussions...');

        const discuss1 = await Discussion.create({
            course: course1._id,
            author: teacher1._id,
            title: 'Best Practices for JavaScript Code Organization',
            content: 'Let\'s discuss how to structure JavaScript projects effectively. What patterns do you use?',
            isPinned: true,
            isLocked: false,
            replies: [
                {
                    author: students[0]._id,
                    content: 'I use module pattern to organize my code into separate modules.',
                    createdAt: new Date('2025-12-03T10:00:00Z')
                },
                {
                    author: teacher1._id,
                    content: 'Great! Module pattern is an excellent approach. You might also consider ES6 modules.',
                    createdAt: new Date('2025-12-03T14:30:00Z')
                },
                {
                    author: students[1]._id,
                    content: 'Thanks for the tips! I\'ll explore ES6 modules.',
                    createdAt: new Date('2025-12-03T15:00:00Z')
                }
            ]
        });

        const discuss2 = await Discussion.create({
            course: course1._id,
            author: students[2]._id,
            title: 'Confused about Arrow Functions vs Regular Functions',
            content: 'What\'s the difference between arrow functions and regular functions? When should I use each?',
            isPinned: false,
            isLocked: false,
            replies: [
                {
                    author: teacher1._id,
                    content: 'Great question! Arrow functions have different "this" binding. They also have implicit returns.',
                    createdAt: new Date('2025-12-04T09:00:00Z')
                }
            ]
        });

        const discuss3 = await Discussion.create({
            course: course2._id,
            author: teacher2._id,
            title: 'Authentication Strategies in Express.js',
            content: 'Let\'s discuss JWT vs Session-based authentication. What are the pros and cons?',
            isPinned: true,
            isLocked: false,
            replies: [
                {
                    author: students[3]._id,
                    content: 'JWT is stateless and works great for APIs. Sessions require server-side storage.',
                    createdAt: new Date('2025-12-05T11:00:00Z')
                }
            ]
        });

        // Update courses with discussion references
        course1.discussions = [discuss1._id, discuss2._id];
        course2.discussions = [discuss3._id];
        await course1.save();
        await course2.save();

        console.log('✓ Created 3 discussion threads');

        // ==================== PRINT SUMMARY ====================
        console.log('\n' + '='.repeat(50));
        console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\n📊 SUMMARY:\n');
        console.log('Users:');
        console.log('  • 1 Admin');
        console.log('  • 2 Teachers');
        console.log('  • 5 Students\n');
        console.log('Courses: 3');
        console.log('Lectures: 7');
        console.log('Assignments: 3');
        console.log('Submissions: 3');
        console.log('Quizzes: 2');
        console.log('Quiz Submissions: 2');
        console.log('Discussions: 3\n');
        console.log('LOGIN CREDENTIALS:');
        console.log('  Admin: admin@university.edu / Admin@123456');
        console.log('  Teacher: jane.smith@university.edu / Teacher@123456');
        console.log('  Student: john.doe@student.edu / Student@123456\n');
        console.log('='.repeat(50) + '\n');

    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

// Run the seed
seedDB();
