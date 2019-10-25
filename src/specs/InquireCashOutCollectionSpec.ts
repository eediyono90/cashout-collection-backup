export class InquireCashOutCollectionSpec {
    private _id: number;
    private _recipientIdType: string;
    private _recipientIdNo: string;

    public get id(): number {
        return this._id;
    }
    public set id(_id: number) {
        this._id = _id;
    }
    public get recipientIdType(): string {
        return this._recipientIdType;
    }
    public set recipientIdType(value: string) {
        this._recipientIdType = value;
    }
    public get recipientIdNo(): string {
        return this._recipientIdNo;
    }
    public set recipientIdNo(value: string) {
        this._recipientIdNo = value;
    }

    constructor() {
        this._id = 0;
        this._recipientIdType = '';
        this._recipientIdNo = '';
    }
}

export class InquireCashOutCollectionSpecBuilder {
    private spec: InquireCashOutCollectionSpec;
    constructor() {
        this.spec = new InquireCashOutCollectionSpec();
    }
    setId(id: number): InquireCashOutCollectionSpecBuilder {
        this.spec.id = id;
        return this;
    }
    setRecipientIdType(recipientIdType: string): InquireCashOutCollectionSpecBuilder {
        this.spec.recipientIdType = recipientIdType;
        return this;
    }
    setRecipientIdNo(recipientIdNo: string): InquireCashOutCollectionSpecBuilder {
        this.spec.recipientIdNo = recipientIdNo;
        return this;
    }
    build(): InquireCashOutCollectionSpec {
        return this.spec;
    }
}
