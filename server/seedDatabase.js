import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";
import { Purchase } from "./models/Purchase.js";
import { CourseProgress } from "./models/CourseProgress.js";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Static seed data
const seedData = {
    users: [
        {
            _id: "user_educator_001",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@edemy.com",
            imageUrl: "https://i.pravatar.cc/150?img=1",
            enrolledCourses: []
        },
        {
            _id: "user_educator_002",
            name: "Prof. Michael Chen",
            email: "michael.chen@edemy.com",
            imageUrl: "https://i.pravatar.cc/150?img=2",
            enrolledCourses: []
        },
        {
            _id: "user_educator_003",
            name: "Dr. Emily Rodriguez",
            email: "emily.rodriguez@edemy.com",
            imageUrl: "https://i.pravatar.cc/150?img=3",
            enrolledCourses: []
        },
        {
            _id: "user_student_001",
            name: "Alex Thompson",
            email: "alex.thompson@student.com",
            imageUrl: "https://i.pravatar.cc/150?img=11",
            enrolledCourses: []
        },
        {
            _id: "user_student_002",
            name: "Jessica Martinez",
            email: "jessica.martinez@student.com",
            imageUrl: "https://i.pravatar.cc/150?img=12",
            enrolledCourses: []
        },
        {
            _id: "user_student_003",
            name: "David Kim",
            email: "david.kim@student.com",
            imageUrl: "https://i.pravatar.cc/150?img=13",
            enrolledCourses: []
        },
        {
            _id: "user_student_004",
            name: "Sophia Patel",
            email: "sophia.patel@student.com",
            imageUrl: "https://i.pravatar.cc/150?img=14",
            enrolledCourses: []
        },
        {
            _id: "user_student_005",
            name: "James Wilson",
            email: "james.wilson@student.com",
            imageUrl: "https://i.pravatar.cc/150?img=15",
            enrolledCourses: []
        }
    ],

    courses: [
        {
            courseTitle: "Complete Web Development Bootcamp 2025",
            courseDescription: "Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects and launch your career as a full-stack developer.",
            courseThumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
            coursePrice: 4999,
            isPublished: true,
            discount: 20,
            courseContent: [
                {
                    chapterId: "chapter_001",
                    chapterOrder: 1,
                    chapterTitle: "Getting Started with Web Development",
                    chapterContent: [
                        {
                            lectureId: "lecture_001_001",
                            lectureTitle: "Introduction to Web Development",
                            lectureDuration: 900,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lecture_001_002",
                            lectureTitle: "Setting Up Your Development Environment",
                            lectureDuration: 1200,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                            isPreviewFree: true,
                            lectureOrder: 2
                        },
                        {
                            lectureId: "lecture_001_003",
                            lectureTitle: "HTML Fundamentals",
                            lectureDuration: 1500,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                            isPreviewFree: false,
                            lectureOrder: 3
                        }
                    ]
                },
                {
                    chapterId: "chapter_002",
                    chapterOrder: 2,
                    chapterTitle: "CSS Mastery",
                    chapterContent: [
                        {
                            lectureId: "lecture_002_001",
                            lectureTitle: "CSS Basics and Selectors",
                            lectureDuration: 1800,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                            isPreviewFree: false,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lecture_002_002",
                            lectureTitle: "Flexbox and Grid Layout",
                            lectureDuration: 2100,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                            isPreviewFree: false,
                            lectureOrder: 2
                        }
                    ]
                },
                {
                    chapterId: "chapter_003",
                    chapterOrder: 3,
                    chapterTitle: "JavaScript Programming",
                    chapterContent: [
                        {
                            lectureId: "lecture_003_001",
                            lectureTitle: "JavaScript Fundamentals",
                            lectureDuration: 2400,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                            isPreviewFree: false,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lecture_003_002",
                            lectureTitle: "DOM Manipulation",
                            lectureDuration: 1800,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                            isPreviewFree: false,
                            lectureOrder: 2
                        }
                    ]
                }
            ],
            courseRatings: [
                { userId: "user_student_001", rating: 5 },
                { userId: "user_student_002", rating: 5 },
                { userId: "user_student_003", rating: 4 }
            ],
            educator: "user_educator_001",
            enrolledStudents: ["user_student_001", "user_student_002", "user_student_003"]
        },
        {
            courseTitle: "Python for Data Science & Machine Learning",
            courseDescription: "Learn Python programming from scratch and dive into data science and machine learning. Master NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow.",
            courseThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
            coursePrice: 5999,
            isPublished: true,
            discount: 15,
            courseContent: [
                {
                    chapterId: "chapter_py_001",
                    chapterOrder: 1,
                    chapterTitle: "Python Fundamentals",
                    chapterContent: [
                        {
                            lectureId: "lecture_py_001_001",
                            lectureTitle: "Introduction to Python",
                            lectureDuration: 1200,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lecture_py_001_002",
                            lectureTitle: "Data Types and Variables",
                            lectureDuration: 1500,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                            isPreviewFree: true,
                            lectureOrder: 2
                        }
                    ]
                },
                {
                    chapterId: "chapter_py_002",
                    chapterOrder: 2,
                    chapterTitle: "Data Analysis with Pandas",
                    chapterContent: [
                        {
                            lectureId: "lecture_py_002_001",
                            lectureTitle: "Introduction to Pandas",
                            lectureDuration: 1800,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                            isPreviewFree: false,
                            lectureOrder: 1
                        }
                    ]
                }
            ],
            courseRatings: [
                { userId: "user_student_001", rating: 5 },
                { userId: "user_student_004", rating: 5 }
            ],
            educator: "user_educator_002",
            enrolledStudents: ["user_student_001", "user_student_004"]
        },
        {
            courseTitle: "React.js - The Complete Guide",
            courseDescription: "Dive deep into React.js and build modern, scalable web applications. Learn React Hooks, Context API, Redux, Next.js, and best practices for production apps.",
            courseThumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
            coursePrice: 3999,
            isPublished: true,
            discount: 25,
            courseContent: [
                {
                    chapterId: "chapter_react_001",
                    chapterOrder: 1,
                    chapterTitle: "React Basics",
                    chapterContent: [
                        {
                            lectureId: "lecture_react_001_001",
                            lectureTitle: "What is React?",
                            lectureDuration: 600,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lecture_react_001_002",
                            lectureTitle: "JSX and Components",
                            lectureDuration: 1800,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                            isPreviewFree: false,
                            lectureOrder: 2
                        }
                    ]
                }
            ],
            courseRatings: [
                { userId: "user_student_002", rating: 5 },
                { userId: "user_student_005", rating: 4 }
            ],
            educator: "user_educator_001",
            enrolledStudents: ["user_student_002", "user_student_005"]
        },
        {
            courseTitle: "Digital Marketing Masterclass 2025",
            courseDescription: "Learn SEO, social media marketing, content marketing, email marketing, and paid advertising. Grow your business or start a career in digital marketing.",
            courseThumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            coursePrice: 2999,
            isPublished: true,
            discount: 30,
            courseContent: [
                {
                    chapterId: "chapter_dm_001",
                    chapterOrder: 1,
                    chapterTitle: "Digital Marketing Fundamentals",
                    chapterContent: [
                        {
                            lectureId: "lecture_dm_001_001",
                            lectureTitle: "Introduction to Digital Marketing",
                            lectureDuration: 900,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        }
                    ]
                }
            ],
            courseRatings: [
                { userId: "user_student_003", rating: 4 }
            ],
            educator: "user_educator_003",
            enrolledStudents: ["user_student_003"]
        },
        {
            courseTitle: "Mobile App Development with React Native",
            courseDescription: "Build native iOS and Android apps using React Native. Learn to create beautiful, performant mobile applications with a single codebase.",
            courseThumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
            coursePrice: 4499,
            isPublished: true,
            discount: 10,
            courseContent: [
                {
                    chapterId: "chapter_rn_001",
                    chapterOrder: 1,
                    chapterTitle: "Getting Started with React Native",
                    chapterContent: [
                        {
                            lectureId: "lecture_rn_001_001",
                            lectureTitle: "Introduction to React Native",
                            lectureDuration: 1200,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        }
                    ]
                }
            ],
            courseRatings: [],
            educator: "user_educator_002",
            enrolledStudents: []
        },
        {
            courseTitle: "UI/UX Design Fundamentals",
            courseDescription: "Master the principles of user interface and user experience design. Learn Figma, design thinking, prototyping, and creating stunning user experiences.",
            courseThumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            coursePrice: 3499,
            isPublished: false,
            discount: 0,
            courseContent: [
                {
                    chapterId: "chapter_ui_001",
                    chapterOrder: 1,
                    chapterTitle: "Design Principles",
                    chapterContent: [
                        {
                            lectureId: "lecture_ui_001_001",
                            lectureTitle: "What is UI/UX?",
                            lectureDuration: 800,
                            lectureUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                            isPreviewFree: true,
                            lectureOrder: 1
                        }
                    ]
                }
            ],
            courseRatings: [],
            educator: "user_educator_003",
            enrolledStudents: []
        }
    ]
};

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await Purchase.deleteMany({});
        await CourseProgress.deleteMany({});
        console.log('✅ Existing data cleared!');

        // Insert users
        console.log('\n👥 Seeding users...');
        const insertedUsers = await User.insertMany(seedData.users);
        console.log(`✅ ${insertedUsers.length} users inserted!`);

        // Insert courses
        console.log('\n📚 Seeding courses...');
        const insertedCourses = await Course.insertMany(seedData.courses);
        console.log(`✅ ${insertedCourses.length} courses inserted!`);

        // Update users with enrolled courses
        console.log('\n🔄 Updating user enrollments...');
        const course1 = insertedCourses[0]; // Web Development
        const course2 = insertedCourses[1]; // Python DS
        const course3 = insertedCourses[2]; // React
        const course4 = insertedCourses[3]; // Digital Marketing

        await User.findByIdAndUpdate("user_student_001", {
            $push: { enrolledCourses: { $each: [course1._id, course2._id] } }
        });
        await User.findByIdAndUpdate("user_student_002", {
            $push: { enrolledCourses: { $each: [course1._id, course3._id] } }
        });
        await User.findByIdAndUpdate("user_student_003", {
            $push: { enrolledCourses: { $each: [course1._id, course4._id] } }
        });
        await User.findByIdAndUpdate("user_student_004", {
            $push: { enrolledCourses: course2._id }
        });
        await User.findByIdAndUpdate("user_student_005", {
            $push: { enrolledCourses: course3._id }
        });
        console.log('✅ User enrollments updated!');

        // Insert purchases
        console.log('\n💳 Seeding purchases...');
        const purchases = [
            {
                courseId: course1._id,
                userId: "user_student_001",
                amount: 3999, // 4999 - 20% discount
                status: "completed"
            },
            {
                courseId: course2._id,
                userId: "user_student_001",
                amount: 5099, // 5999 - 15% discount
                status: "completed"
            },
            {
                courseId: course1._id,
                userId: "user_student_002",
                amount: 3999,
                status: "completed"
            },
            {
                courseId: course3._id,
                userId: "user_student_002",
                amount: 2999, // 3999 - 25% discount
                status: "completed"
            },
            {
                courseId: course1._id,
                userId: "user_student_003",
                amount: 3999,
                status: "completed"
            },
            {
                courseId: course4._id,
                userId: "user_student_003",
                amount: 2099, // 2999 - 30% discount
                status: "completed"
            },
            {
                courseId: course2._id,
                userId: "user_student_004",
                amount: 5099,
                status: "completed"
            },
            {
                courseId: course3._id,
                userId: "user_student_005",
                amount: 2999,
                status: "pending"
            }
        ];
        const insertedPurchases = await Purchase.insertMany(purchases);
        console.log(`✅ ${insertedPurchases.length} purchases inserted!`);

        // Insert course progress
        console.log('\n📊 Seeding course progress...');
        const courseProgressData = [
            {
                userId: "user_student_001",
                courseId: course1._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_001_001", "lecture_001_002", "lecture_001_003"]
            },
            {
                userId: "user_student_001",
                courseId: course2._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_py_001_001"]
            },
            {
                userId: "user_student_002",
                courseId: course1._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_001_001", "lecture_001_002"]
            },
            {
                userId: "user_student_002",
                courseId: course3._id.toString(),
                completed: true,
                lectureCompleted: ["lecture_react_001_001", "lecture_react_001_002"]
            },
            {
                userId: "user_student_003",
                courseId: course1._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_001_001"]
            },
            {
                userId: "user_student_003",
                courseId: course4._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_dm_001_001"]
            },
            {
                userId: "user_student_004",
                courseId: course2._id.toString(),
                completed: false,
                lectureCompleted: ["lecture_py_001_001", "lecture_py_001_002"]
            },
            {
                userId: "user_student_005",
                courseId: course3._id.toString(),
                completed: false,
                lectureCompleted: []
            }
        ];
        const insertedProgress = await CourseProgress.insertMany(courseProgressData);
        console.log(`✅ ${insertedProgress.length} course progress records inserted!`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • Users: ${insertedUsers.length}`);
        console.log(`   • Courses: ${insertedCourses.length}`);
        console.log(`   • Purchases: ${insertedPurchases.length}`);
        console.log(`   • Course Progress: ${insertedProgress.length}`);
        console.log('\n✨ Your database is now populated with sample data!\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

// Run the seed function
seedDatabase();
