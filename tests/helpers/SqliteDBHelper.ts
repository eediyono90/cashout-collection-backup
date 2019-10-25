import { buildSchemas, refreshSchema } from '../../src/Schemas';
import { CashOut } from '../../src/models/CashOut';
import * as sqlite3 from 'sqlite3';

export class SqliteDBHelper {
    public static refreshDB(db, callback?)
    {
        db.serialize(() => { 
            refreshSchema(db);
            callback();
        });
    }

    public static async insertCashOutMockData(db, cashout: CashOut): Promise<number>
    {
        return new Promise((resolve, reject) => {
            const insertMockData = `
                INSERT INTO CashOut(
                    sender_name, 
                    sender_address, 
                    recipient_name, 
                    recipient_id_type, 
                    recipient_id_no, 
                    recipient_phone_no,
                    agent_id,
                    agent_name,
                    cash_amount, 
                    start_time, 
                    status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.prepare(insertMockData, [
                cashout.sender_name, 
                cashout.sender_address, 
                cashout.recipient_name,
                cashout.recipient_id_type, 
                cashout.recipient_id_no, 
                cashout.recipient_phone_no, 
                cashout.agent_id,
                cashout.agent_name,
                cashout.cash_amount, 
                cashout.start_time, 
                cashout.status]
            ).run(function(err) {
                if(err) {
                    reject(err)
                }
                resolve(this.lastID);
            });
        });
    }

    public static createDB()
    {
        const sqlite = sqlite3.verbose();
        const db = new sqlite.Database(':memory:');
        db.serialize(() => {
            buildSchemas(db);
        });
        return db;
    }
}