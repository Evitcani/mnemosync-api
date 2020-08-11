import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

export class WhereQuery {
    /**
     * Used to construct a where query for a simple equal.
     * @param tableName
     * @param columnName
     * @param content
     */
    public static EQUALS (tableName: string, columnName: string, content: string | number | null): string {
        if (content == null) {
            return this.IS_NULL(tableName, columnName, false);
        }

        return `"${tableName}"."${columnName}" = ${this.SANITIZE_INPUT(content, true)}`;
    }

    public static LIKE (tableName: string, columnName: string, content: string | null): string {
        if (content == null) {
            return this.IS_NULL(tableName, columnName, false);
        }

        return `LOWER("${tableName}"."${columnName}") LIKE LOWER('%${this.SANITIZE_INPUT(content, false)}%')`;
    }

    public static IS_FALSE_OR_NULL(tableName: string, columnName: string): string {
        return `(${this.IS_NULL(tableName, columnName, false)} OR ${this.IS_TRUE_FALSE(tableName, columnName, false)})`;
    }

    public static IS_TRUE_FALSE(tableName: string, columnName: string, bool: boolean): string {
        return `"${tableName}"."${columnName}" IS ${bool ? "TRUE" : "FALSE"}`
    }

    public static IS_NULL (tableName: string, columnName: string, not: boolean): string {
        return `"${tableName}"."${columnName}" ${not ? "NOT " : ""}IS NULL`;
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
            let sanitized = this.SANITIZE_INPUT(content, false);
            if (sanitized != null && sanitized != '') {
                sanitizedItems.push(sanitized);
            }
        });

        return `"${tableName}"."${columnName}" ${not ? "NOT " : ""}IN ('${sanitizedItems.join("','")}')`;
    }

    /**
     * Sanitizes the input to protect against SQL injection attacks.
     *
     * @param content
     * @param doQuotes
     */
    protected static SANITIZE_INPUT(content: string | number, doQuotes: boolean): string {
        let sanitizedContent = StringUtility.escapeSQLInput(content);
        if (doQuotes && typeof content != 'number') {
            sanitizedContent = `'${sanitizedContent}'`;
        }

        return sanitizedContent;
    }
}