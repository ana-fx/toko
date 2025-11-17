--
-- PostgreSQL database dump
--

\restrict rGBkw2UqmDEI8n2DDXC3VrK3RlZhwsWaFTUic8f9IVYbH6VBycBeTgctxgJf6JE

-- Dumped from database version 18.1 (Homebrew)
-- Dumped by pg_dump version 18.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_tokens (
    id integer NOT NULL,
    user_id integer,
    refresh_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: auth_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_tokens_id_seq OWNED BY public.auth_tokens.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer,
    name character varying(150) NOT NULL,
    price numeric(12,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    total_price numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'cashier'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: auth_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_tokens ALTER COLUMN id SET DEFAULT nextval('public.auth_tokens_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: auth_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_tokens (id, user_id, refresh_token, expires_at, created_at) FROM stdin;
1	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2MzM5MzE1MSwiZXhwIjoxNzYzOTk3OTUxfQ.LWwT7e2OqHzlb0nNQ7oy1MSamDD40ku_foNc6kDDTAg	2025-11-24 22:25:51.351	2025-11-17 22:25:51.351517
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, created_at) FROM stdin;
6	Pakaian Pria	Pakaian untuk pria dewasa	2025-11-17 21:48:41.462267
7	Pakaian Wanita	Pakaian untuk wanita dewasa	2025-11-17 21:48:41.462784
8	Pakaian Anak	Pakaian untuk anak-anak	2025-11-17 21:48:41.463101
9	Aksesoris Pakaian	Aksesoris dan perlengkapan pakaian	2025-11-17 21:48:41.463428
10	Sepatu & Sandal	Sepatu dan sandal untuk semua usia	2025-11-17 21:48:41.463737
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, category_id, name, price, stock, created_at) FROM stdin;
26	6	Kemeja Pria Formal Putih	250000.00	30	2025-11-17 21:48:41.464203
27	6	Kemeja Pria Casual	200000.00	35	2025-11-17 21:48:41.464756
28	6	Celana Jeans Pria	350000.00	25	2025-11-17 21:48:41.465124
29	6	Celana Chino Pria	300000.00	28	2025-11-17 21:48:41.465535
30	6	Kaos Pria Polos	80000.00	50	2025-11-17 21:48:41.465925
31	6	Kaos Pria Kemeja	120000.00	40	2025-11-17 21:48:41.466363
32	6	Jaket Pria Denim	450000.00	20	2025-11-17 21:48:41.466654
33	6	Jaket Pria Hoodie	400000.00	22	2025-11-17 21:48:41.46692
34	6	Celana Training Pria	180000.00	30	2025-11-17 21:48:41.467175
35	6	Kemeja Batik Pria	350000.00	25	2025-11-17 21:48:41.467446
36	7	Dress Wanita Casual	450000.00	20	2025-11-17 21:48:41.467691
37	7	Dress Wanita Formal	550000.00	15	2025-11-17 21:48:41.468048
38	7	Blouse Wanita	250000.00	30	2025-11-17 21:48:41.468285
39	7	Rok Wanita	200000.00	35	2025-11-17 21:48:41.46854
40	7	Celana Jeans Wanita	350000.00	25	2025-11-17 21:48:41.468794
41	7	Kaos Wanita	100000.00	45	2025-11-17 21:48:41.469119
42	7	Kemeja Wanita	280000.00	28	2025-11-17 21:48:41.469442
43	7	Jaket Wanita	380000.00	20	2025-11-17 21:48:41.469825
44	7	Legging Wanita	150000.00	40	2025-11-17 21:48:41.470066
45	7	Kebaya Modern	650000.00	12	2025-11-17 21:48:41.47031
46	8	Baju Anak Laki-laki	120000.00	40	2025-11-17 21:48:41.470612
47	8	Baju Anak Perempuan	130000.00	38	2025-11-17 21:48:41.470896
48	8	Celana Anak	100000.00	45	2025-11-17 21:48:41.471128
49	8	Rok Anak	90000.00	42	2025-11-17 21:48:41.471359
50	8	Kaos Anak	60000.00	50	2025-11-17 21:48:41.471603
51	9	Tas Ransel	200000.00	25	2025-11-17 21:48:41.471831
52	9	Tas Tote	150000.00	30	2025-11-17 21:48:41.472057
53	9	Topi Cap	80000.00	40	2025-11-17 21:48:41.472286
54	9	Belt Kulit	120000.00	35	2025-11-17 21:48:41.472529
55	9	Dompet Kulit	150000.00	30	2025-11-17 21:48:41.472759
56	10	Sepatu Sneakers Pria	600000.00	18	2025-11-17 21:48:41.472991
57	10	Sepatu Formal Pria	800000.00	15	2025-11-17 21:48:41.473221
58	10	Sepatu Wanita Heels	500000.00	20	2025-11-17 21:48:41.473465
59	10	Sepatu Wanita Flat	400000.00	22	2025-11-17 21:48:41.473699
60	10	Sandal Pria	150000.00	35	2025-11-17 21:48:41.473933
61	10	Sandal Wanita	120000.00	38	2025-11-17 21:48:41.474163
62	10	Sepatu Anak	200000.00	30	2025-11-17 21:48:41.474403
63	10	Sandal Anak	80000.00	45	2025-11-17 21:48:41.474869
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, user_id, total_price, created_at) FROM stdin;
16	4	450000.00	2025-11-17 21:48:41.475168
17	5	650000.00	2025-11-17 21:48:41.475619
18	5	350000.00	2025-11-17 21:48:41.475894
19	6	800000.00	2025-11-17 21:48:41.476172
20	4	280000.00	2025-11-17 21:48:41.476468
21	5	550000.00	2025-11-17 21:48:41.476833
22	6	420000.00	2025-11-17 21:48:41.477188
23	4	380000.00	2025-11-17 21:48:41.477528
24	5	720000.00	2025-11-17 21:48:41.477825
25	6	250000.00	2025-11-17 21:48:41.478115
26	4	680000.00	2025-11-17 21:48:41.478426
27	5	480000.00	2025-11-17 21:48:41.47872
28	6	320000.00	2025-11-17 21:48:41.47902
29	4	590000.00	2025-11-17 21:48:41.479319
30	5	410000.00	2025-11-17 21:48:41.479599
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, is_active, created_at) FROM stdin;
4	Admin Toko	admin@toko.com	$2b$10$MZEQjZQSKkHXr1ohgq5.2urLJpEDnXNEGJ1/MQvVlCaMj5YoG5il2	admin	t	2025-11-17 21:48:41.459269
5	Kasir Satu	kasir1@toko.com	$2b$10$bOXyGFvSLmR7sO.KIlvl6OtldeWr.J5S0dZDHBksVZPaKeSK8JiI2	cashier	t	2025-11-17 21:48:41.461049
6	Kasir Dua	kasir2@toko.com	$2b$10$bOXyGFvSLmR7sO.KIlvl6OtldeWr.J5S0dZDHBksVZPaKeSK8JiI2	cashier	t	2025-11-17 21:48:41.461565
\.


--
-- Name: auth_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_tokens_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 63, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: auth_tokens auth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: auth_tokens auth_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict rGBkw2UqmDEI8n2DDXC3VrK3RlZhwsWaFTUic8f9IVYbH6VBycBeTgctxgJf6JE

