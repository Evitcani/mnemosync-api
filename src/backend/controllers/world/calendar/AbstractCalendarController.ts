import {AbstractController} from "../../Base/AbstractController";
import {getManager, SelectQueryBuilder} from "typeorm";
import {ColumnName} from "../../../../shared/documentation/databases/ColumnName";
import {WhereQuery} from "../../../../shared/documentation/databases/WhereQuery";

export abstract class AbstractCalendarController<T extends {id: any}> extends AbstractController<T> {
    protected modifyDeleteQuery(query: SelectQueryBuilder<T>, params: any): SelectQueryBuilder<T> {
        let id: string = params.calendar_id;
        let items: T[] = params.items;
        let ids: string[] = [];
        if (!items) {
            items = [];
        }

        items.forEach((value) => {
            if (value.id != null) {
                ids.push(value.id);
            }
        });

        query.where(WhereQuery.EQUALS(this.tableName, ColumnName.CALENDAR_ID, id));

        if (ids.length > 0) {
            query.andWhere(WhereQuery.NOT_IN_LIST(this.tableName, ColumnName.ID, ids))
        }

        return super.modifyDeleteQuery(query, params);
    }

    public async deleteBulk(calendarId: string, items: T[]): Promise<boolean> {
        let params = {
            calendar_id: calendarId,
            items: items
        };
        return this.doDelete(params);
    }

    protected async saveBulk(items: T[], id: any, key: keyof T): Promise<T[]> {
        if (id != null) {
            this.deleteBulk(id, items);
        }
        if (!items || items.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        items.forEach((item) => {
            item[key] = id;
        });
        return getManager().getRepository(this.tableName).save(items).catch((err) => {
            console.error(`Could not save calendar item.`);
            console.error(err);
            return null;
        });
    }
}