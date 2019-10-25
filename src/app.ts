import * as express from 'express';
import * as helmet from 'helmet';
import { CashOutCollectionApiV1 } from './apis/v1/CashOutCollectionApi';
import { CashOutCollectionService } from './services/cashout/CashOutCollectionService';

export class App {
    public app: express.Application;

    constructor(cashoutCollectionService: CashOutCollectionService) {
        this.app = express();
        this.app.use(helmet());
        this.app.get('/health', (req, res) => res.send('Healthy'));
        this.app.use('/v1', new CashOutCollectionApiV1(cashoutCollectionService).router);
    }
}
