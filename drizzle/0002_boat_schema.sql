CREATE TABLE IF NOT EXISTS boats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    length REAL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS boat_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    boat_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    item TEXT NOT NULL,
    cost REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boat_id) REFERENCES boats(id) ON DELETE CASCADE
);