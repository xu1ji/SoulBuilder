import sqlite3
import os

db_path = "/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        log_id TEXT,
        timestamp TEXT,
        user_text TEXT,
        ai_text TEXT,
        status TEXT,
        pops TEXT -- Comma separated JSON document IDs
    )
    ''')
    
    # Some SQLite versions don't support AUTO_INCREMENT as a separate keyword, use AUTOINCREMENT
    cursor.execute('DROP TABLE IF EXISTS logs')
    cursor.execute('''
    CREATE TABLE logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        log_id TEXT,
        timestamp TEXT,
        user_text TEXT,
        ai_text TEXT,
        status TEXT,
        pops TEXT
    )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {db_path}")

if __name__ == "__main__":
    init_db()
