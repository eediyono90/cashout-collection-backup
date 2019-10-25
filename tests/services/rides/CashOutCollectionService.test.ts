
import { CashOutSqliteRepository } from '../../../src/repositories/CashOutSqliteRepository';
import { CashOutCollectionServiceImpl } from '../../../src/services/cashout/CashOutCollectionServiceImpl';
import { CashOut, CASHOUT_STATUS } from '../../../src/models/CashOut';
import { InquireCashOutCollectionSpec, InquireCashOutCollectionSpecBuilder } from '../../../src/specs/InquireCashOutCollectionSpec';
import { SqliteDBHelper } from '../../helpers/SqliteDBHelper';

import * as chai from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import 'mocha';

const cashOutDB = SqliteDBHelper.createDB();
const cashOutService: CashOutCollectionServiceImpl = new CashOutCollectionServiceImpl(new CashOutSqliteRepository(cashOutDB));
chai.use(chaiAsPromise)

const expect = chai.expect;

describe('CashOutCollectionService tests', () => {

    describe('inquireCashOut', () => {
        it('should throw CASHOUT_NOT_FOUND error', async () => {
            const spec: InquireCashOutCollectionSpec = new InquireCashOutCollectionSpecBuilder()
                .setId(0)
                .build();
            expect(cashOutService.inquireCashOut(spec)).to.be.rejectedWith(new Error('CASHOUT_NOT_FOUND'));
        });
        it('should throw INVALID_IDENTIFICATION_NO error', async () => {
        
            const spec: InquireCashOutCollectionSpec = new InquireCashOutCollectionSpecBuilder()
                .setId(1)
                .setRecipientIdNo("ABC")
                .build();
            expect(cashOutService.inquireCashOut(spec)).to.be.rejectedWith(Error, 'INVALID_IDENTIFICATION_NO');
        });
        it('should throw CASHOUT_LOCKED error', async () => {
            // insert mock cashout data with 1 start_time: current time - 30 minutes and status IN_PROGRESS
            let mockStartDate = new Date();
            mockStartDate.setHours(mockStartDate.getHours() - 1);
            const mockCashOutId: number = await SqliteDBHelper.insertCashOutMockData(cashOutDB, new CashOut(0, 'test', 'test', 'test', 'KTP', '123', '123', 1000, '123', '123', mockStartDate.toISOString(), 0, CASHOUT_STATUS.IN_PROGRESS));
            const spec: InquireCashOutCollectionSpec = new InquireCashOutCollectionSpecBuilder()
                .setId(mockCashOutId)
                .setRecipientIdType('KTP')
                .setRecipientIdNo('123')
                .build();
            expect(cashOutService.inquireCashOut(spec)).to.be.rejectedWith(new Error('CASHOUT_LOCKED'));
        });
    });
});