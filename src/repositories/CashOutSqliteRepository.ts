import { CashOutRepository } from './CashOutRepository';
import { Database } from 'sqlite3';
import { CashOut } from '../models/CashOut';

export class CashOutSqliteRepository implements CashOutRepository
{
    private readonly db: Database;
    constructor(db: Database)
    {
        this.db = db;
    }
    async getCashOutById(id: number): Promise<CashOut>
    {
        return new Promise((resolve, reject) => {
            this.db.prepare('SELECT * FROM CashOut WHERE id = ?', [id])
                .get(function(err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        if (row !== undefined) {
                            resolve(
                                new CashOut(
                                    row.id,
                                    row.sender_name, 
                                    row.sender_address,
                                    row.recipient_name,
                                    row.recipient_id_type, 
                                    row.recipient_id_no,
                                    row.recipient_phone_no, 
                                    row.cash_amount, 
                                    row.agent_id,
                                    row.agent_name,
                                    row.start_time,
                                    row.otp_attempt, 
                                    row.status
                                )
                            );
                        } else {
                            resolve();
                        }
                    }
                })
        });
    }

    async updateCashOut(cashout: CashOut): Promise<CashOut>
    {
        return new Promise((resolve, reject) => {
            this.db.prepare(`
                UPDATE CashOut SET
                    sender_name = ?,
                    sender_address = ?,
                    recipient_name = ?,
                    recipient_id_type = ?,
                    recipient_id_no = ?,
                    recipient_phone_no = ?,
                    cash_amount = ?,
                    agent_id = ?,
                    agent_name = ?,
                    start_time = ?,
                    otp_attempt = ?,
                    status = ?
                WHERE id = ?
            `, 
            [
                cashout.sender_name, 
                cashout.sender_address, 
                cashout.recipient_name, 
                cashout.recipient_id_type, 
                cashout.recipient_id_no,
                cashout.recipient_phone_no,
                cashout.cash_amount,
                cashout.agent_id,
                cashout.agent_name,
                cashout.start_time,
                cashout.otp_attempt,
                cashout.status,
                cashout.id])
                .run(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cashout);
                    }
                })
        });
    }
}