import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (email && password) {
            const existing = await User.findOne({ email });

            if (!existing) {
                const passwordHash = await bcrypt.hash(password, 12);

                await User.create({
                    name: process.env.ADMIN_NAME || 'System Admin',
                    email,
                    passwordHash,
                    role: 'admin',
                    status: 'active'
                });

                console.log(`Initial admin created: ${email}`);
            }
        }

        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`LMS API running on port ${PORT}`);
        });

        server.on('error', (error) => {
            console.error('Server error:', error);
        });

    } catch (error) {
        console.error('Startup failed:', error);
        process.exit(1);
    }
}

bootstrap();