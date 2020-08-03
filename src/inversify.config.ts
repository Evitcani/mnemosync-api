import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {DatabaseService} from "./backend/database/base/DatabaseService";
import {CharacterController} from "./backend/controllers/character/CharacterController";
import {CalendarController} from "./backend/controllers/world/calendar/CalendarController";
import {CalendarEraController} from "./backend/controllers/world/calendar/CalendarEraController";
import {CalendarMonthController} from "./backend/controllers/world/calendar/CalendarMonthController";
import {CalendarMoonController} from "./backend/controllers/world/calendar/CalendarMoonController";
import {CalendarMoonPhaseController} from "./backend/controllers/world/calendar/CalendarMoonPhaseController";
import {CalendarWeekDayController} from "./backend/controllers/world/calendar/CalendarWeekDayController";
import {CurrentDateController} from "./backend/controllers/world/calendar/CurrentDateController";
import {PartyController} from "./backend/controllers/party/PartyController";
import {PartyFundController} from "./backend/controllers/party/PartyFundController";
import {SendingController} from "./backend/controllers/character/SendingController";
import {UserController} from "./backend/controllers/user/UserController";
import {WorldController} from "./backend/controllers/world/WorldController";
import {App} from "./app";
import {Authorization} from "./Authorization";
import {PartyRoute} from "./backend/routing/PartyRoute";
import {UserRoute} from "./backend/routing/UserRoute";

let container = new Container();

container.bind<App>(TYPES.App).to(App).inSingletonScope();
container.bind<Authorization>(TYPES.Authorization).to(Authorization).inSingletonScope();

container.bind<string>(TYPES.ClientID).toConstantValue(process.env.CLIENT_ID);
container.bind<string>(TYPES.CryptKey).toConstantValue(process.env.CRYPT_KEY);
container.bind<string>(TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind<string>(TYPES.Issuer).toConstantValue(process.env.ISSUER);

container.bind<CharacterController>(TYPES.CharacterController).to(CharacterController).inSingletonScope();
container.bind<CalendarController>(TYPES.CalendarController).to(CalendarController).inSingletonScope();
container.bind<CalendarEraController>(TYPES.CalendarEraController).to(CalendarEraController).inSingletonScope();
container.bind<CalendarMonthController>(TYPES.CalendarMonthController).to(CalendarMonthController).inSingletonScope();
container.bind<CalendarMoonController>(TYPES.CalendarMoonController).to(CalendarMoonController).inSingletonScope();
container.bind<CalendarMoonPhaseController>(TYPES.CalendarMoonPhaseController).to(CalendarMoonPhaseController).inSingletonScope();
container.bind<CalendarWeekDayController>(TYPES.CalendarWeekDayController).to(CalendarWeekDayController).inSingletonScope();
container.bind<CurrentDateController>(TYPES.CurrentDateController).to(CurrentDateController).inSingletonScope();
container.bind<PartyController>(TYPES.PartyController).to(PartyController).inSingletonScope();
container.bind<PartyFundController>(TYPES.PartyFundController).to(PartyFundController).inSingletonScope();
container.bind<SendingController>(TYPES.SendingController).to(SendingController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<WorldController>(TYPES.WorldController).to(WorldController).inSingletonScope();

container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

container.bind<PartyRoute>(TYPES.PartyRoute).to(PartyRoute).inSingletonScope();
container.bind<UserRoute>(TYPES.UserRoute).to(UserRoute).inSingletonScope();

export default container;