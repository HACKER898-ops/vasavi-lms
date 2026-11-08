import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import User from './models/User.js';

const checkUsers = async () => {
    try {
        await connectDB();
        
        const users = await User.find();
        console.log(`\n📊 Total users in database: ${users.length}\n`);
        
        if (users.length > 0) {
            console.log('👥 Users:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email})`);
            });
        } else {
            console.log('No users found. They will be created automatically on first login.');
        }
        
        console.log('\n✨ Users will be automatically synced from Clerk on login!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkUsers();
