-- fill.sql: insert data to DB

-- destinations
INSERT INTO destinations (id, name) VALUES ('455e2be5-3e95-4186-8f89-ba2920b8f208', 'Варчас');
INSERT INTO destinations (id, name) VALUES ('af112348-c99a-48bc-96cc-9f9d2ac64336', 'Мангровый колледж');
INSERT INTO destinations (id, name) VALUES ('4b25bb0c-17df-4b22-968a-9a15ca5e8516', 'Эстиваль');
INSERT INTO destinations (id, name) VALUES ('af78fbee-a3ab-4bd6-aeac-0e2730122f43', 'Кодекс');
INSERT INTO destinations (id, name) VALUES ('06094917-22a6-4ebf-9323-1dee900247a1', 'Полюс Ганта');

-- ferries
INSERT INTO ferries (id, name, hold, autopark) VALUES ('5cee51a6-fb2a-4918-ac11-8b1a6627d42e', 'Стимфалис', 5, 0);
INSERT INTO ferries (id, name, hold, autopark) VALUES ('64cc2c5a-a624-4de1-b775-96f9cd004c5c', 'Лигейя', 40, 10);
INSERT INTO ferries (id, name, hold, autopark) VALUES ('2d46ca7b-6385-403d-bb50-316744e4f208', 'Форсид', 40, 15);
INSERT INTO ferries (id, name, hold, autopark) VALUES ('bf3ae730-17dc-4424-8297-32e12ef4abfa', 'Калиго', 120, 30);
INSERT INTO ferries (id, name, hold, autopark) VALUES ('6e34bc0a-ca58-4a7f-8aa9-f82544c4256c', 'Эсхатолог', 100, 40);

-- voyages
INSERT INTO voyages (id, destination_id, ferry_id) VALUES ('e99d5a48-9b56-4afb-a02f-a2f8375edad2', '06094917-22a6-4ebf-9323-1dee900247a1', '5cee51a6-fb2a-4918-ac11-8b1a6627d42e');
INSERT INTO voyages (id, destination_id, ferry_id) VALUES ('02329fb1-9238-4da8-a5f5-219730ac28d9', 'af78fbee-a3ab-4bd6-aeac-0e2730122f43', '2d46ca7b-6385-403d-bb50-316744e4f208');
INSERT INTO voyages (id, destination_id, ferry_id) VALUES ('93c2bfac-d7f3-4f5c-9690-560ad0df2a31', '4b25bb0c-17df-4b22-968a-9a15ca5e8516', '6e34bc0a-ca58-4a7f-8aa9-f82544c4256c');

-- passengers
-- auto
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('1f679ff9-a040-4571-bbb9-1e37fa4af38e', 'Парсиваль', 'auto', 1, '02329fb1-9238-4da8-a5f5-219730ac28d9');
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('4dce9014-991d-4ae6-83ae-bc65680a065c', 'Альтани', 'auto', 2, '02329fb1-9238-4da8-a5f5-219730ac28d9');
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('efe21a83-82db-4731-8096-2e7bd0c1b6f4', 'Молох', 'auto', 3, '93c2bfac-d7f3-4f5c-9690-560ad0df2a31');
-- cargo
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('ef4feabd-50dc-49d9-a484-53457b70960d', 'Шкатулка сапфиров', 'cargo', 5, 'e99d5a48-9b56-4afb-a02f-a2f8375edad2');
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('98121f8e-ad55-4830-95bb-9e7308dfe3d2', 'Гробо-колонисты', 'cargo', 20, '02329fb1-9238-4da8-a5f5-219730ac28d9');
INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ('8d445760-1882-4cc7-8fc4-0c53f723f7b1', 'Зеркальные ловушки', 'cargo', 10, '93c2bfac-d7f3-4f5c-9690-560ad0df2a31');
