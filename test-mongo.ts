import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const uri = "mongodb://nabilachmad715_db_user:4u7oe4BA1qsLcsB0@ac-z5gihjv-shard-00-00.4epaldo.mongodb.net:27017,ac-z5gihjv-shard-00-01.4epaldo.mongodb.net:27017,ac-z5gihjv-shard-00-02.4epaldo.mongodb.net:27017/nazarel_logs?ssl=true&authSource=admin&retryWrites=true&w=majority";
    console.log('Connecting to:', uri);
    try {
        await mongoose.connect(uri as string);
        console.log('Successfully connected to MongoDB!');
        
        const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', new mongoose.Schema({
            action: String
        }));
        
        const count = await ActivityLog.countDocuments();
        console.log('Total logs in DB:', count);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Connection error:', err);
    }
}
run();
