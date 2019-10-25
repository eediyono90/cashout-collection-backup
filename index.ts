import { Database } from 'sqlite3'
import { App } from './src/app';
import { Logger, LoggerFactory } from './src/shared/Logger';
import { CashOutRepository } from './src/repositories/CashOutRepository';
import { CashOutSqliteRepository } from './src/repositories/CashOutSqliteRepository';
import { CashOutCollectionService } from './src/services/cashout/CashOutCollectionService';
import { CashOutCollectionServiceImpl } from './src/services/cashout/CashOutCollectionServiceImpl';
import { buildSchemas } from './src/schemas';

const port = 8010;
const errorLogPath = 'logs/app.error.log';
const cashOutDB:Database = new Database(':memory:');
const cashOutRepository: CashOutRepository = new CashOutSqliteRepository(cashOutDB);
const cashOutService: CashOutCollectionService = new CashOutCollectionServiceImpl(cashOutRepository);

const swaggerUI = require('swagger-ui-express');
const logger: Logger = LoggerFactory.addFileLogger(errorLogPath, 'error');
const app = new App(cashOutService).app;

cashOutDB.serialize(() => {
    buildSchemas(cashOutDB);
    app.listen(port, () => logger.info(`App started and listening on port ${port}`));
});