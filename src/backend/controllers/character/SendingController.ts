import {inject, injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Any, getConnection, getManager} from "typeorm";
import {TYPES} from "../../../types";
import {DateController} from "../world/calendar/DateController";
import {WhereQuery} from "../../../shared/documentation/databases/WhereQuery";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";
import {SendingQuery} from "mnemoshared/dist/src/models/queries/SendingQuery";
import {UserController} from "../user/UserController";

@injectable()
export class SendingController extends AbstractController<Sending> {
    private dateController: DateController;
    private userController: UserController;

    constructor(@inject(TYPES.DateController) dateController: DateController,
                @inject(TYPES.UserController) userController: UserController) {
        super(TableName.SENDING);
        this.dateController = dateController;
        this.userController = userController;
    }

    /**
     * Creates a new sending.
     *
     * @param sending
     */
    public async save(sending: Sending): Promise<Sending> {
        // Now, save the date.
        sending.date = await this.dateController.save(sending.date);

        // Now, save the sending.
        return this.getRepo().save(sending)
            .then((res) => {
                if (res == null) {
                    return null;
                }

                // Get by ID now.
                return this.getById(res.id);
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new sending.");
                console.error(err);
                return null;
            });
    }

    public async getById(id: string): Promise<Sending> {
        return this.getRepo().findOne({where: {id: id}, relations: ["toCharacter", "fromCharacter",
                "sendingReplyFromUser", "sendingMessageFromUser", "date"]})
            .catch((err: Error) => {
                console.error("ERR ::: Could not get sendings.");
                console.error(err);
                return null;
            });
    }

    public async getByIds(ids: string[]): Promise<Sending[]> {
        // Not a valid argument.
        if (ids == null || ids.length < 1) {
            return null;
        }

        return this.getRepo().find({where: {id: Any(ids)}, relations: ["toCharacter", "fromCharacter",
                "sendingReplyFromUser", "sendingMessageFromUser", "date"]})
            .catch((err: Error) => {
                console.error("ERR ::: Could not get sendings.");
                console.error(err);
                return null;
            });
    }

    public async getByParams(params: SendingQuery): Promise<Sending[]> {
        let flag = false, sub;

        let alias = "msg";
        let secondAlias = "to_character";
        let thirdAlias = "from_character";
        let query = getManager()
            .getRepository(Sending)
            .createQueryBuilder(alias)
            .innerJoinAndSelect(TableName.WORLD_TO_CHARACTER, secondAlias,
                `"${alias}"."${ColumnName.TO_CHARACTER_ID}" = "${secondAlias}"."${ColumnName.CHARACTER_ID}"`)
            .innerJoinAndSelect(TableName.WORLD_TO_CHARACTER, thirdAlias,
                `"${alias}"."${ColumnName.TO_CHARACTER_ID}" = "${thirdAlias}"."${ColumnName.CHARACTER_ID}"`);

        if (params.world_id != null) {
            query = query.where(WhereQuery.EQUALS(alias, ColumnName.WORLD_ID, params.world_id));

            // Now with a world query included, we have to check if it's going to/from an NPC.
            let str = `"${secondAlias}"."${ColumnName.IS_NPC}" IS TRUE`;
            query = query.andWhere(str);

            flag = true;
        }

        if (params.to_character_id != null) {
            sub = WhereQuery.EQUALS(alias, ColumnName.TO_CHARACTER_ID, params.to_character_id);
            if (flag) {
                query = query.andWhere(sub);
            } else {
                query = query.where(sub);
            }
            flag = true;
        }

        if (params.from_character_id != null) {
            sub = WhereQuery.EQUALS(alias, ColumnName.FROM_CHARACTER_ID, params.from_character_id);
            if (flag) {
                query = query.andWhere(sub);
            } else {
                query = query.where(sub);
            }
            flag = true;
        }

        // Nothing to see here.
        if (!flag) {
            console.error("No world, character or NPC provided.");
            return null;
        }

        if (params.skip != null) {
            query.skip(params.skip);
        }

        if (params.limit != null) {
            query.take(params.limit);
        }

        // Add final touches.
        query = query
            .andWhere(WhereQuery.IS_FALSE_OR_NULL(alias, ColumnName.IS_REPLIED))
            .addSelect([ColumnName.ID])
            .addOrderBy(`"${alias}"."${ColumnName.CREATED_DATE}"`, "ASC");

        return query
            .getMany().then((messages) => {
                if (!messages || messages.length < 1) {
                    return null;
                }
                let input : string[] = [], i;
                // Put into a map
                for (i = 0; i < messages.length; i++) {
                    input[i] = messages[i].id;
                }

                return this.getByIds(input);
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get any sendings.");
                console.error(err);
                return null;
            });
    }
}