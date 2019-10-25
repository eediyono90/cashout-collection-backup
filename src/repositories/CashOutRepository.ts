import { CashOut } from '../models/CashOut';

export interface CashOutRepository
{
    getCashOutById(id: number): Promise<CashOut>;
    updateCashOut(cashout: CashOut): Promise<CashOut>;
}