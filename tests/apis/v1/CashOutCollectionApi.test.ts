import * as request from 'supertest';
import { App } from '../../../src/app';
import { CashOutRepository } from '../../../src/repositories/CashOutRepository';
import { CashOutSqliteRepository } from '../../../src/repositories/CashOutSqliteRepository';
import { CashOutCollectionService } from '../../../src/services/cashout/CashOutCollectionService';
import { CashOutCollectionServiceImpl } from '../../../src/services/cashout/CashOutCollectionServiceImpl';
import { SqliteDBHelper } from '../../helpers/SqliteDBHelper';
import { expect } from 'chai'; 
import 'mocha';
import { InquireCashOutCollectionSpec, InquireCashOutCollectionSpecBuilder } from '../../../src/specs/InquireCashOutCollectionSpec';
import { RECIPIENT_ID_TYPE, CASHOUT_STATUS, CashOut } from '../../../src/models/CashOut';

let cashOutDB = SqliteDBHelper.createDB();
const cashOutRepository: CashOutRepository = new CashOutSqliteRepository(cashOutDB);
const cashOutCollectionService: CashOutCollectionService = new CashOutCollectionServiceImpl(cashOutRepository);

const app = new App(cashOutCollectionService).app;

describe('API tests', () => {

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('POST /v1/cashout/inquire/{id}', () => {
        it('should return invalid id VALIDATION_ERROR', (done) => {
            const id = -1;
            request(app)
                .post('/v1/cashout/inquire/' + id)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, resp) => {
                    expect(resp.statusCode).to.equal(400);
                    expect(resp.body.error_code).to.equal('VALIDATION_ERROR');
                    expect(resp.body.message).to.equal('id must be a positive numeric value');
                    done();
                });
        });

        it('should return CASHOUT_NOT_FOUND', (done) => {
            const id = 99;
            const req = {
                "recipient_id_type" : RECIPIENT_ID_TYPE.KTP,
                "recipient_id_no" : "123"
            }
            request(app)
                .post('/v1/cashout/inquire/' + id)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(req)
                .expect('Content-Type', /json/)
                .end((err, resp) => {
                    expect(resp.statusCode).to.equal(400);
                    expect(resp.body.error_code).to.equal('CASHOUT_NOT_FOUND');
                    expect(resp.body.message).to.equal(`Could not find cashout with id: ${id}`);
                    done();
                });
        });

        it('should return invalid recipient id type VALIDATION_ERROR', (done) => {
            const id = 1;
            request(app)
                .post('/v1/cashout/inquire/' + id)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, resp) => {
                    expect(resp.statusCode).to.equal(400);
                    expect(resp.body.error_code).to.equal('VALIDATION_ERROR');
                    expect(resp.body.message).to.equal('Recipient id type must be a \'KTP\' or \'SIM\'');
                    done();
                });
        });

        it('should return invalid recipient id no VALIDATION_ERROR', (done) => {
            const id = 1;
            const req = {
                "recipient_id_type": RECIPIENT_ID_TYPE.KTP
            }
            request(app)
                .post('/v1/cashout/inquire/' + id)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .send(req)
                .end((err, resp) => {
                    expect(resp.statusCode).to.equal(400);
                    expect(resp.body.error_code).to.equal('VALIDATION_ERROR');
                    expect(resp.body.message).to.equal('Recipient id no type must be a non empty string');
                    done();
                });
        });

        it('should return CashOut object with updated status', async () => {
            const mockCashOut = new CashOut(0, 'test', 'test', 'test', 'KTP', '123', '123', 1000, '123', '123', new Date().toISOString(), 0, CASHOUT_STATUS.PENDING);
            const mockCashOutId: number = await SqliteDBHelper.insertCashOutMockData(cashOutDB, mockCashOut);
            const req = {
                "recipient_id_type": mockCashOut.recipient_id_type,
                "recipient_id_no": mockCashOut.recipient_id_no
            }
            request(app)
                .post('/v1/cashout/inquire/' + mockCashOutId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(req)
                .expect('Content-Type', /json/)
                .end((err, resp) => {
                    expect(resp.statusCode).to.equal(200);
                    expect(resp.body.id).to.equal(mockCashOutId);
                    expect(resp.body.sender_name).to.equal(mockCashOut.sender_name);
                    expect(resp.body.sender_address).to.equal(mockCashOut.sender_address);
                    expect(resp.body.recipient_name).to.equal(mockCashOut.recipient_name);
                    expect(resp.body.recipient_id_type).to.equal(mockCashOut.recipient_id_type);
                    expect(resp.body.recipient_id_no).to.equal(mockCashOut.recipient_id_no);
                    expect(resp.body.recipient_phone_no).to.equal(mockCashOut.recipient_phone_no);
                    expect(resp.body.cash_amount).to.equal(mockCashOut.cash_amount);
                    expect(resp.body.agent_id).to.equal(mockCashOut.agent_id);
                    expect(resp.body.agent_name).to.equal(mockCashOut.agent_name);
                    expect(resp.body.otp_attempt).to.equal(mockCashOut.otp_attempt);
                    expect(resp.body.status).to.equal(CASHOUT_STATUS.IN_PROGRESS);
                });
        });
    });
});