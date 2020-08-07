/**
 * Abstract converter.
 */
export abstract class AbstractConverter<T extends object, U extends object> {
    public convertVoToDto(vo: T): U | null {
        return this.convertExistingVoToDto(vo, this.getNewDTO());
    }

    public convertDtoToVo (dto: U): T | null {
        console.debug("Converting new...");
        return this.convertExistingDtoToVo(this.getNewVO(), dto);
    }

    public abstract convertExistingVoToDto(vo: T, dto: U): U | null;
    public abstract convertExistingDtoToVo(vo: T, dto: U): T | null;

    protected abstract getNewDTO(): U;
    protected abstract getNewVO(): T;

    protected checkNumber(item: any): number | null {
        if (item == null) {
            return null;
        }

        if (typeof item == "number") {
            return item;
        }

        let temp = Number(item);
        if (isNaN(temp)) {
            return null;
        }

        return temp;
    }
}