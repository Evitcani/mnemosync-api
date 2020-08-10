import {inject, injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Any, getConnection} from "typeorm";
import {TYPES} from "../../../types";
import {DateController} from "../world/calendar/DateController";
import {WhereQuery} from "../../../shared/documentation/databases/WhereQuery";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";
import {SendingQuery} from "@evitcani/mnemoshared/dist/src/models/queries/SendingQuery";

@injectable()
export class SendingController extends AbstractController<Sending> {
    public static SENDING_LIMIT = 10;
    private dateController: DateController;

    constructor(@inject(TYPES.DateController) dateController: DateController) {
        super(TableName.SENDING);
        this.dateController = dateController;
    }

    /**
     * Creates a new sending.
     *
     * @param sending
     */
    public async save(sending: Sending): Promise<Sending> {
        sending.date = await this.dateController.save(sending.date);

        return this.getRepo().save(sending)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new sending.");
                console.error(err);
                return null;
            });
    }

    public async getById(id: string): Promise<Sending> {
        return this.getRepo().findOne({where: {id: id}, relations: ["toCharacter", "fromCharacter",
                "sendingReplyFromUser", "sendingMessageFromUser"]})
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
                "sendingReplyFromUser", "sendingMessageFromUser"]})
            .catch((err: Error) => {
                console.error("ERR ::: Could not get sendings.");
                console.error(err);
                return null;
            });
    }

    public async getByParams(params: SendingQuery): Promise<Sending[]> {
        let flag = false, sub;

        let alias = "msg";
        let query = getConnection().createQueryBuilder(Sending, alias);

        if (params.world_id != null) {
            query = query.where(WhereQuery.EQUALS(alias, ColumnName.WORLD_ID, params.world_id));
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