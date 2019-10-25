import { CashOutCollectionService } from './CashOutCollectionService';
import { InquireCashOutCollectionSpec } from '../../specs/InquireCashOutCollectionSpec';
import { CashOut, CASHOUT_STATUS } from '../../models/CashOut';
import { CashOutRepository } from '../../repositories/CashOutRepository';

export class CashOutCollectionServiceImpl implements CashOutCollectionService
{
    private readonly cashoutRepository: CashOutRepository;
    private readonly MAX_PROCESS_TIME = 3600;
    constructor(cashoutRepository: CashOutRepository)
    {
        this.cashoutRepository = cashoutRepository;
    }
    public async inquireCashOut(spec: InquireCashOutCollectionSpec): Promise<CashOut> {
        let cashout: CashOut = await this.cashoutRepository.getCashOutById(spec.id);
        if(cashout === undefined || cashout === null) {
            throw new Error("CASHOUT_NOT_FOUND");
        }
        if(cashout.status === CASHOUT_STATUS.CANCELLED || cashout.status === CASHOUT_STATUS.COLLECTED) {
            throw new Error("CASHOUT_REQUEST_NOT_ALLOWED");
        }
        if(cashout.recipient_id_type !== spec.recipientIdType || cashout.recipient_id_no !== spec.recipientIdNo) {
            throw new Error("INVALID_IDENTIFICATION_NO");
        }
        if(cashout.status === CASHOUT_STATUS.IN_PROGRESS) {
            if(new Date(cashout.start_time).getTime() / 1000 - new Date().getTime() / 1000 < this.MAX_PROCESS_TIME) {
                throw new Error("CASHOUT_LOCKED");
            }
        }
        if(cashout.status === CASHOUT_STATUS.PENDING) {
            cashout.status = CASHOUT_STATUS.IN_PROGRESS;
            cashout.start_time = new Date().toISOString();
            cashout = await this.cashoutRepository.updateCashOut(cashout);
        }
        return cashout;
    }
}