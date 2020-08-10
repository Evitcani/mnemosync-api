import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

export class WhereQuery {
    /**
     * Used to construct a where query for a simple equal.
     * @param tableName
     * @param columnName
     * @param content
     */
    public static EQUALS (tableName: string, columnName: string, content: string | number | null): string {
        if (content == null) {
            return `"${tableName}"."${columnName}" IS NULL`;
        }

        return `"${tableName}"."${columnName}" = ${this.SANITIZE_INPUT(content)}`;
    }

    public static IN_LIST (tableName: string, columnName: string, items: string[]): string {
        return this.IN_LIST_BASE(tableName, columnName, items, false);
    }

    public static NOT_IN_LIST (tableName: string, columnName: string, items: string[]): string {
        return this.IN_LIST_BASE(tableName, columnName, items, true);
    }

    protected static IN_LIST_BASE (tableName: string, columnName: string, items: string[] | number[], not: boolean): string {
        let sanitizedItems: string[] = [];
        items.forEach((content) => {
            sanitizedItems.push(this.SANITIZE_INPUT(content));
        });

        return `"${tableName}"."${columnName}" ${not ? "NOT " : ""}IN ('${sanitizedItems.join("','")}')`;
    }

    /**
     * Sanitizes the input to protect against SQL injection attacks.
     *
     * @param content
     */
    protected static SANITIZE_INPUT(content: string | number): string {
        let sanitizedContent = StringUtility.escapeSQLInput(content);
        if (typeof content != 'number') {
            sanitizedContent = `'${sanitizedContent}'`;
        }

        return sanitizedContent;
    }
}