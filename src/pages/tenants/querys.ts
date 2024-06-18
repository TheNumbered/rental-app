
export type Tenant = {
    id: string;
    name: string;
    rent_amount: number;
    outstanding_balance: number;
    room_id: string;
    last_payment_amount: number;
    house_id: string;
}

export const TenantQueryString = (user_id:string) => `
SELECT
    tenants.id,
    tenants.name,
    rooms.rent_amount,
    tenants.room_id,
    houses.id AS house_id,
    COALESCE(
        rooms.rent_amount * 
        ((DATE_PART('year', CURRENT_DATE) - DATE_PART('year', tenants.entered_date)) * 12 + 
        (DATE_PART('month', CURRENT_DATE) - DATE_PART('month', tenants.entered_date))+1), 
        0
    ) - COALESCE(SUM(payments.amount), 0) AS outstanding_balance,
    last_payment.amount AS last_payment_amount
FROM
    tenants
JOIN
    rooms ON tenants.room_id = rooms.id
JOIN
    houses ON rooms.house_id = houses.id
LEFT JOIN
    payments ON tenants.id = payments.tenant_id
LEFT JOIN (
    SELECT
        tenant_id,
        amount
    FROM
        payments
    WHERE
        (tenant_id, payment_date) IN (
            SELECT
                tenant_id,
                MAX(payment_date)
            FROM
                payments
            GROUP BY
                tenant_id
        )
) AS last_payment ON tenants.id = last_payment.tenant_id
WHERE
    houses.user_id = '${user_id}'
GROUP BY
    tenants.id, tenants.name, rooms.rent_amount, tenants.room_id, houses.id, tenants.entered_date, last_payment.amount;
`

export const AvailableRoomsQuery = (user_id:string)=>`
SELECT
    rooms.id,
    rooms.house_id,
    rooms.room_number,
    rooms.rent_amount
FROM
    rooms
LEFT JOIN
    tenants ON rooms.id = tenants.room_id
JOIN
    houses ON rooms.house_id = houses.id
WHERE
    tenants.room_id IS NULL
    AND houses.user_id = '${user_id}';
`