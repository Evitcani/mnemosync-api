import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {PartyFund} from "../../entity/PartyFund";
import {Party} from "../../entity/Party";
import {AbstractController} from "../Base/AbstractController";

@injectable()
export class PartyFundController extends AbstractController<PartyFund> {
    constructor() {
        super(TableName.PARTY_FUND);
    }

    /**
     * Creates a new party fund for the given party and type.
     *
     * @param party The party this fund is for.
     * @param type The type of fund this is.
     */
    public async create(party: Party, type: string): Promise<PartyFund> {
        let fund = new PartyFund();
        fund.type = type;
        fund.party = party;

        return this.getRepo().save(fund).catch((err: Error) => {
            console.error("ERR ::: Could not create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getByPartyAndType(party: Party, type: string): Promise<PartyFund> {
        return this.getRepo().findOne({where: {party: party, type: type}})
            .catch((err: Error) => {
                console.error("ERR ::: Could not find party fund.");
                console.error(err);
                return null;
            });
    }

    public async updateFunds (fund: PartyFund): Promise<PartyFund> {
        return this.getRepo().save(fund).catch((err: Error) => {
            console.error("ERR ::: Could not update party fund.");
            console.error(err);
            return null;
        });
    }
}