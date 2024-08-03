--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_and_insert_expense(uuid); Type: FUNCTION; Schema: public; Owner: rental-app_owner
--

CREATE FUNCTION public.update_and_insert_expense(expense_id uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Step 1: Update the existing expense to set is_recurring to false
        UPDATE expenses
        SET
            is_recurring = FALSE
        WHERE
            id = expense_id;

        -- Step 2: Insert a new expense with the same details but with the current date and is_recurring set to true
        INSERT INTO expenses (id, title, amount, date, is_recurring, frequency, user_id)
        SELECT
            gen_random_uuid(),  -- Generate a new UUID for the new expense
            title,
            amount,
            CURRENT_DATE,  -- Set the current date
            TRUE,  -- Set is_recurring to true
            frequency,
            user_id
        FROM
            expenses
        WHERE
            id = expense_id;
    END;
    $$;


ALTER FUNCTION public.update_and_insert_expense(expense_id uuid) OWNER TO "rental-app_owner";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: electricity_tokens; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.electricity_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid,
    token text NOT NULL
);


ALTER TABLE public.electricity_tokens OWNER TO "rental-app_owner";

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    date date NOT NULL,
    is_recurring boolean NOT NULL,
    frequency character varying(10),
    user_id character varying(255) NOT NULL,
    CONSTRAINT expenses_frequency_check CHECK (((frequency)::text = ANY (ARRAY[('daily'::character varying)::text, ('weekly'::character varying)::text, ('monthly'::character varying)::text, ('yearly'::character varying)::text])))
);


ALTER TABLE public.expenses OWNER TO "rental-app_owner";

--
-- Name: houses; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.houses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    address character varying(255)
);


ALTER TABLE public.houses OWNER TO "rental-app_owner";

--
-- Name: payments; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    payment_date timestamp without time zone DEFAULT now(),
    amount numeric(10,2)
);


ALTER TABLE public.payments OWNER TO "rental-app_owner";

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    house_id uuid,
    room_number integer,
    rent_amount numeric(10,2)
);


ALTER TABLE public.rooms OWNER TO "rental-app_owner";

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: rental-app_owner
--

CREATE TABLE public.tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid,
    name character varying(255),
    contact_number character varying(20),
    entered_date date
);


ALTER TABLE public.tenants OWNER TO "rental-app_owner";

--
-- Name: electricity_tokens electricity_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.electricity_tokens
    ADD CONSTRAINT electricity_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: houses houses_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: electricity_tokens electricity_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.electricity_tokens
    ADD CONSTRAINT electricity_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: rooms rooms_house_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_house_id_fkey FOREIGN KEY (house_id) REFERENCES public.houses(id);


--
-- Name: tenants tenants_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rental-app_owner
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

