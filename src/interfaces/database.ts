export type ElectricityTokens = {
    id: string;
    room_id?: string;
    token: string;
}

export type ElectricityTokensInput = {
    id?: string;
    room_id?: string;
    token: string;
}

export type Expenses = {
    id: string;
    title: any;
    amount: number;
    date: Date | string;
    is_recurring: boolean;
    frequency?: any;
    user_id: any;
}

export type ExpensesInput = {
    id?: string;
    title: any;
    amount: number;
    date: Date | string;
    is_recurring: boolean;
    frequency?: any;
    user_id: any;
}

export type Houses = {
    id: string;
    user_id: any;
    address?: any;
}

export type HousesInput = {
    id?: string;
    user_id: any;
    address?: any;
}

export type Payments = {
    id: string;
    tenant_id?: string;
    payment_date?: any;
    amount?: number;
}

export type PaymentsInput = {
    id?: string;
    tenant_id?: string;
    payment_date?: any;
    amount?: number;
}

export type Rooms = {
    id: string;
    house_id?: string;
    room_number?: any;
    rent_amount?: number;
}

export type RoomsInput = {
    id?: string;
    house_id?: string;
    room_number?: any;
    rent_amount?: number;
}

export type Tenants = {
    id: string;
    room_id?: string;
    name?: any;
    contact_number?: any;
    entered_date?: Date | string;
}

export type TenantsInput = {
    id?: string;
    room_id?: string;
    name?: any;
    contact_number?: any;
    entered_date?: Date | string;
}

