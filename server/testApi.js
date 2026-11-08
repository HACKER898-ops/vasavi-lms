import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import Course from './models/Course.js';

const testDatabase = async () => {
    try {
        await connectDB();
        
        const courses = await Course.find({ isPublished: true });
        console.log(`\n✅ Found ${courses.length} published courses in database\n`);
        
        if (courses.length > 0) {
            console.log('Sample course:');
            console.log({
                title: courses[0].courseTitle,
                price: courses[0].coursePrice,
                educator: courses[0].educator,
                isPublished: courses[0].isPublished
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testDatabase();
