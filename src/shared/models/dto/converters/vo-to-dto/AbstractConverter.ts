export abstract class AbstractConverter<T, U> {
    public convertVoToDto(vo: T): U {
        return this.convertExistingVoToDto(vo, this.getNewDTO());
    }

    public convertDtoToVo (dto: U): T {
        return this.convertExistingDtoToVo(this.getNewVO(), dto);
    }

    public abstract convertExistingVoToDto(vo: T, dto: U): U;
    public abstract convertExistingDtoToVo(vo: T, dto: U): T;

    protected abstract getNewDTO(): U;
    protected abstract getNewVO(): T;
}