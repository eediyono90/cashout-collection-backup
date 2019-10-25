export class CashOut
{
    public id: number
    public sender_name: string;
    public sender_address: string;
    public recipient_name: string;
    public recipient_id_type: string;
    public recipient_id_no: string;
    public recipient_phone_no: string;
    public cash_amount: number;
    public agent_id: string;
    public agent_name: string;
    public start_time: string;
    public otp_attempt: number;
    public status: string;

    constructor(id: number, 
        sender_name: string, 
        sender_address: string, 
        recipient_name: string,
        recipient_id_type: string, 
        recipient_id_no: string,
        recipient_phone_no: string, 
        cash_amount: number, 
        agent_id: string,
        agent_name: string,
        start_time: string,
        otp_attempt: number, 
        status: string)
    {
        this.id = id;
        this.sender_name = sender_name;
        this.sender_address = sender_address
        this.recipient_name = recipient_name;
        this.recipient_id_type = recipient_id_type;
        this.recipient_id_no = recipient_id_no;
        this.recipient_phone_no = recipient_phone_no
        this.cash_amount = cash_amount;
        this.agent_id = agent_id;
        this.agent_name = agent_name;
        this.start_time = start_time;
        this.otp_attempt = otp_attempt;
        this.status = status;
    }
}

export enum CASHOUT_STATUS {
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COLLECTED = 'COLLECTED'
}

export enum RECIPIENT_ID_TYPE {
    KTP = 'KTP',
    SIM = 'SIM'
}