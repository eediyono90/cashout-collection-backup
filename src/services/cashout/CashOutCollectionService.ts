import { InquireCashOutCollectionSpec } from '../../specs/InquireCashOutCollectionSpec';
import { CashOut } from '../../models/CashOut';


export interface CashOutCollectionService
{
    inquireCashOut(spec: InquireCashOutCollectionSpec): Promise<CashOut>;
}