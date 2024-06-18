export const GetElectricityToken = (room_id: string) =>
  `
    WITH selected_token AS (
        SELECT id, token
        FROM public.electricity_tokens
        WHERE room_id = '${room_id}'
        ORDER BY id
        LIMIT 1
    )
    DELETE FROM public.electricity_tokens
    WHERE id IN (SELECT id FROM selected_token)
    RETURNING token;
    `;
