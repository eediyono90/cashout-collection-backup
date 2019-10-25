import { CashOutCollectionService } from '../../services/cashout/CashOutCollectionService';
import { LoggerFactory, Logger } from '../../shared/Logger';
import { InquireCashOutCollectionSpec, InquireCashOutCollectionSpecBuilder } from '../../specs/InquireCashOutCollectionSpec';
import { CashOut, RECIPIENT_ID_TYPE } from '../../models/CashOut';
import * as Express from 'express';
import * as bodyParser from 'body-parser';

export class CashOutCollectionApiV1
{
    private _router: Express.Router;
    private readonly cashoutCollectionService: CashOutCollectionService;
    private readonly logger: Logger;
    constructor(cashoutCollectionService: CashOutCollectionService)
    {
        this._router = Express.Router();
        this._router.use(bodyParser.json());
        this.cashoutCollectionService = cashoutCollectionService;
        this.logger = LoggerFactory.getLogger();
        this.initializeAPI();
    }
    private initializeAPI()
    {
        this._router.post('/cashout/inquire/:id', async (req, res) => {
            const id = Number(req.params.id);
            const recipientIdType = req.body.recipient_id_type;
            const recipientIdNo = req.body.recipient_id_no;
            
            if (typeof id !== 'number' || id < 0) {
                return res.status(400).send({
                    error_code: 'VALIDATION_ERROR',
                    message: 'id must be a positive numeric value'
                });
            }
            if (recipientIdType !== RECIPIENT_ID_TYPE.KTP && recipientIdType !== RECIPIENT_ID_TYPE.SIM) {
                return res.status(400).send({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Recipient id type must be a \'KTP\' or \'SIM\''
                });
            }
             if (typeof recipientIdNo !== 'string' || recipientIdNo.length < 1) {
                return res.status(400).send({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Recipient id no type must be a non empty string'
                });
            }
            const spec: InquireCashOutCollectionSpec= new InquireCashOutCollectionSpecBuilder()
                    .setId(id)
                    .setRecipientIdType(recipientIdType)
                    .setRecipientIdNo(recipientIdNo)
                    .build();
            try {
                const cashOut: CashOut = await this.cashoutCollectionService.inquireCashOut(spec);
                return res.status(200).send(cashOut);
            } catch (err) {
                this.logger.error(err.message);
                if(err.message === 'CASHOUT_NOT_FOUND') {
                    return res.status(400).send({
                        error_code: 'CASHOUT_NOT_FOUND',
                        message: `Could not find cashout with id: ${spec.id}`
                    });
                } else if(err.message === 'CASHOUT_REQUEST_NOT_ALLOWED') {
                    return res.status(400).send({
                        error_code: 'CASHOUT_REQUEST_NOT_ALLOWED',
                        message: `Inquire Cashout is not allowed`
                    });
                } else if(err.message === 'INVALID_IDENTIFICATION_NO') {
                    return res.status(400).send({
                        error_code: 'INVALID_IDENTIFICATION_NO',
                        message: `Invalid Identification No`
                    });
                } else if(err.message === 'CASHOUT_LOCKED') {
                    return res.status(400).send({
                        error_code: 'CASHOUT_LOCKED',
                        message: `Cashout already locked for inquiry`
                    });
                } else {
                    return res.status(500).send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }
            }
        });
    }

    get router(): Express.Router
    {
        return this._router;
    }
}