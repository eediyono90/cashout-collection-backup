import { Database } from 'sqlite3';

export function buildSchemas(db: Database): Database {
    const createCashOutTableSchema = `
        CREATE TABLE CashOut
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_name TEXT NOT NULL,
            sender_address TEXT NOT NULL,
            recipient_name TEXT NOT NULL,
            recipient_id_type TEXT NOT NULL,
            recipient_id_no TEXT NOT NULL,
            recipient_phone_no TEXT NOT NULL,
            cash_amount DECIMAL NOT NULL,
            agent_id TEXT DEFAULT NULL,
            agent_name TEXT DEFAULT NULL,
            start_time DATETIME default NULL,
            otp_attempt INTEGER default 0,
            status TEXT DEFAULT 'PENDING'
        )
    `;
    const prepareMockData = `
        INSERT INTO CashOut(sender_name, sender_address, recipient_name, recipient_id_type, recipient_id_no, recipient_phone_no, cash_amount) VALUES 
            ('Customer 1', 'Customer Address 1', 'Recipient 1', 'KTP', '1234567891', '08123456781', 100000),
            ('Customer 2', 'Customer Address 2', 'Recipient 2', 'KTP', '1234567892', '08123456782', 200000),
            ('Customer 3', 'Customer Address 3', 'Recipient 3', 'KTP', '1234567893', '08123456783', 300000),
            ('Customer 4', 'Customer Address 4', 'Recipient 4', 'KTP', '1234567894', '08123456784', 400000),
            ('Customer 5', 'Customer Address 5', 'Recipient 5', 'KTP', '1234567895', '08123456785', 500000),
            ('Customer 6', 'Customer Address 6', 'Recipient 6', 'KTP', '1234567896', '08123456786', 600000),
            ('Customer 7', 'Customer Address 7', 'Recipient 7', 'KTP', '1234567897', '08123456787', 700000),
            ('Customer 8', 'Customer Address 8', 'Recipient 8', 'KTP', '1234567898', '08123456788', 800000),
            ('Customer 9', 'Customer Address 9', 'Recipient 9', 'KTP', '1234567899', '08123456789', 900000),
            ('Customer 10', 'Customer Address 10', 'Recipient 10', 'KTP', '1234567890', '08123456790', 1000000),
            ('Customer 11', 'Customer Address 11', 'Recipient 11', 'KTP', '1234567801', '08123456791', 1100000),
            ('Customer 12', 'Customer Address 12', 'Recipient 12', 'KTP', '1234567802', '08123456792', 1200000)
    `;
    db.run(createCashOutTableSchema);
    db.run(prepareMockData);
    return db;
};

export function refreshSchema(db: Database): Database {
    const clearCashOutTable = 
    `
            DELETE FROM CashOut;
    `;
    db.run(clearCashOutTable);
    return db;
}
