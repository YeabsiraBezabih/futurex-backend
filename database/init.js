const { Pool } = require('pg');
require('dotenv').config();

const initializeDatabase = async () => {
    // First connect to postgres database
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'yeab0704',
        database: 'postgres'
    });

    try {
        // Try to create the database, ignore if it already exists
        try {
            await pool.query('CREATE DATABASE futurex');
            console.log('Database created successfully');
        } catch (err) {
            if (err.code === '42P04') { // Database already exists error code
                console.log('Database already exists, continuing with table creation');
            } else {
                throw err;
            }
        }

        // Close the connection to postgres database
        await pool.end();

        // Connect to the futurex database
        const dbPool = new Pool({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'yeab0704',
            database: 'futurex'
        });

        // Create tables
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Languages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(10) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS StudyPlans (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES Users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                focus_duration INTEGER DEFAULT 1500, -- 25 minutes in seconds
                break_duration INTEGER DEFAULT 300,  -- 5 minutes in seconds
                sessions_completed INTEGER DEFAULT 0,
                total_focus_time INTEGER DEFAULT 0,  -- total seconds spent focusing
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Quiz (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                language_id INTEGER REFERENCES Languages(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS QuizQuestions (
                id SERIAL PRIMARY KEY,
                quiz_id INTEGER REFERENCES Quiz(id),
                question TEXT NOT NULL,
                options JSONB NOT NULL,
                correct_answer INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS QuizResults (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES Users(id),
                quiz_id INTEGER REFERENCES Quiz(id),
                score INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES Users(id),
                receiver_id INTEGER REFERENCES Users(id),
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES Users(id),
                type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS UserSettings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES Users(id),
                theme VARCHAR(50) DEFAULT 'light',
                language VARCHAR(10) DEFAULT 'en',
                notifications_enabled BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Hobbies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS StudySessions (
                id SERIAL PRIMARY KEY,
                study_plan_id INTEGER REFERENCES StudyPlans(id) ON DELETE CASCADE,
                duration INTEGER NOT NULL,  -- duration in seconds
                session_type VARCHAR(20) NOT NULL,  -- 'focus' or 'break'
                completed BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tables created successfully');
        await dbPool.end();
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

initializeDatabase(); 