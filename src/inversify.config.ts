import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {DatabaseService} from "./backend/database/base/DatabaseService";

let container = new Container();

container.bind<string>(TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind<string>(TYPES.CryptKey).toConstantValue(process.env.CRYPT_KEY);

container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

export default container;