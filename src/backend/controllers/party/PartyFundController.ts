import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {PartyFund} from "../../entity/PartyFund";
import {AbstractController} from "../Base/AbstractController";

@injectable()
export class PartyFundController extends AbstractController<PartyFund> {
    constructor() {
        super(TableName.PARTY_FUND);
    }

    /**
     * Creates a new party fund for the given party and type.
     *
     * @param partyId The party this fund is for.
     * @param type The type of fund this is.
     */
    public async create(partyId: number, type: string): Promise<PartyFund> {
        // First, we must check if this already exists.
        let partyFund = await this.getByPartyAndType(partyId, type);
        if (partyFund != null) {
            return Promise.resolve(partyFund);
        }

        // No party like this, so create.
        let fund = new PartyFund();
        fund.type = type.toUpperCase();
        fund.partyId = partyId;
        fund.amount = 0;

        return this.getRepo().save(fund).catch((err: Error) => {
            console.error("ERR ::: Could not create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getById(id: number): Promise<PartyFund> {
        return this.getRepo().findOne({where: {id: id}})
            .catch((err: Error) => {
                console.error("ERR ::: Could not find party fund.");
                console.error(err);
                return null;
            });
    }

    public async getByPartyAndType(partyId: number, type: string): Promise<PartyFund> {
        return this.getRepo().findOne({where: {partyId: partyId, type: type.toUpperCase()}})
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