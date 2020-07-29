import {AbstractController} from "./AbstractController";
import {getManager, Repository, SelectQueryBuilder} from "typeorm";
import {NameValuePair} from "./NameValuePair";
import {injectable, unmanaged} from "inversify";

@injectable()
export abstract class AbstractSecondaryController<T, E> extends AbstractController<T> {
    protected secondaryTableName: string;

    protected constructor(@unmanaged() primaryTableName: string,
                          @unmanaged() secondaryTableName: string) {
        super(primaryTableName);
        this.secondaryTableName = secondaryTableName;
    }

    /**
     * Gets the repo.
     */
    protected getSecondaryRepo(): Repository<E> {
        return getManager().getRepository(this.secondaryTableName);
    }

    /**
     * Processes like arguments which can be tricky.
     *
     * @param whereArgs
     * @param likeArgs
     */
    protected getSecondaryLikeArgs(whereArgs: NameValuePair[], likeArgs: NameValuePair[]): Promise<E[]> {
        let query: SelectQueryBuilder<E> = this.getSecondaryRepo().createQueryBuilder(this.secondaryTableName);
        query = this.createLikeQuery(whereArgs, likeArgs, query, this.secondaryTableName);

        return query.getMany()
            .then((objs) => {
                if (objs == null || objs.length < 1) {
                    return null;
                }

                return objs;
            });
    }
}