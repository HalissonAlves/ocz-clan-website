begin;

insert into public.competitions (
  legacy_id,
  name,
  slug,
  category,
  target_type,
  target_slug,
  target_label,
  objective,
  allowed_weapons,
  special_conditions,
  trophy_image_url,
  active
)
values
  ('flecha-fantasma', 'Flecha Fantasma', 'flecha-fantasma', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 50 metros', array['Arco Primitivo']::text[], array['O animal precisa passar na verificação de abate', 'Proibído o uso de miras ópticas']::text[], '/assets/flecha_fantasma.webp', true),
  ('besta-impossivel', 'Besta Impossível', 'besta-impossivel', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 70 metros', array['Bestas']::text[], array['O animal precisa passar na verificação de abate.', 'Proibído o uso de miras ópticas']::text[], '/assets/besta_impossivel.webp', true),
  ('chumbo-selvagem', 'Chumbo Selvagem', 'chumbo-selvagem', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 40 metros', array['Espingardas']::text[], array['O animal precisa passar na verificação de abate.', 'Proibído o uso de miras ópticas', 'Munição de chumbo é obrigatória (buckshot)']::text[], '/assets/chumbo_selvagem.webp', true),
  ('olho-de-aguia', 'Olho de Águia', 'olho-de-aguia', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 100 metros', array['Espingardas']::text[], array['O animal precisa passar na verificação de abate.', 'Proibído o uso de miras ópticas', 'Munição slug é obrigatória para espingardas']::text[], '/assets/olho_de_aguia.webp', true),
  ('pistoleiro-do-oeste', 'Pistoleiro do Oeste', 'pistoleiro-do-oeste', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 100 metros', array['Revólveres']::text[], array['O animal precisa passar na verificação de abate.', 'Proibído o uso de miras ópticas']::text[], '/assets/pistoleiro_do_oeste.webp', true),
  ('atirador-de-elite', 'Atirador de Elite', 'atirador-de-elite', 'standard', 'general', 'geral', 'Geral', 'Abater o animal a uma distância mínima de 300 metros acertando o coração', array['Rifles de Precisão']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/atirador_de_elite.webp', true),
  ('monarca-das-galhadas', 'Monarca das Galhadas', 'monarca-das-galhadas', 'diamond', null, null, null, 'Abater um Alce Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/monarca_das_galhadas.webp', true),
  ('tita-de-gelo', 'Titã de Gelo', 'tita-de-gelo', 'diamond', null, null, null, 'Abater um Urso Pardo Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/tita_de_gelo.webp', true),
  ('fantasma-branco', 'Fantasma Branco', 'fantasma-branco', 'diamond', null, null, null, 'Abater um Veado de Cauda Branca Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/fantasma_branco.webp', true),
  ('sombra-pintada', 'Sombra Pintada', 'sombra-pintada', 'diamond', null, null, null, 'Abater uma Jaguatirica Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/sombra_pintada.webp', true),
  ('rei-escarlate', 'Rei Escarlate', 'rei-escarlate', 'diamond', null, null, null, 'Abater um Leão Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/rei_escarlate.webp', true),
  ('muralha-da-savana', 'Muralha da Savana', 'muralha-da-savana', 'diamond', null, null, null, 'Abater um Búfalo Africano Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/muralha_da_savana.webp', true),
  ('lâminas-do-deserto', 'Lâminas do Deserto', 'lâminas-do-deserto', 'diamond', null, null, null, 'Abater um Órix do Cabo Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/laminas_do_deserto.webp', true),
  ('trovao-da-savana', 'Trovão da Savana', 'trovao-da-savana', 'diamond', null, null, null, 'Abater um Gnu de Cauda Preta Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/trovao_da_savana.webp', true),
  ('presas-de-guerra', 'Presas de Guerra', 'presas-de-guerra', 'diamond', null, null, null, 'Abater um Javali Africano Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/presas_de_guerra.webp', true),
  ('espirais-do-destino', 'Espirais do Destino', 'espirais-do-destino', 'diamond', null, null, null, 'Abater um Cudo Menor Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/espirais_do_destino.webp', true),
  ('danca-dos-ventos', 'Dança dos Ventos', 'danca-dos-ventos', 'diamond', null, null, null, 'Abater uma Cabra de Leque Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/danca_dos_ventos.webp', true),
  ('uivo-da-savana', 'Uivo da Savana', 'uivo-da-savana', 'diamond', null, null, null, 'Abater um Chacal Listrado Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/uivo_da_savana.webp', true),
  ('asas-do-amanhecer', 'Asas do Amanhecer', 'asas-do-amanhecer', 'diamond', null, null, null, 'Abater uma Piadeira Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/asas_do_amanhecer.webp', true),
  ('chama-da-campina', 'Chama da Campina', 'chama-da-campina', 'diamond', null, null, null, 'Abater uma Lebre da Nuca Dourada Diamante com qualquer arma ética', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.']::text[], '/assets/chama_da_campina.webp', true),
  ('a-sombra', 'A Sombra', 'a-sombra', 'standard', 'general', 'geral', 'Geral', 'Abater um animal a menos de 25 metros com um arco ou besta', array['Arco', 'Besta']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na menor distância do abate.', 'Se o animal bugar e ficar parado em um local, o abate não será válido.']::text[], '/assets/a_sombra.webp', true),
  ('o-destemido', 'O Destemido', 'o-destemido', 'standard', 'group', 'predadores', 'Predadores', 'Abater um predador a menos de 25 metros com uma espingarda', array['Espingarda']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na menor distância do abate.', 'Alguns predadores não são permitidos, como: Jacaré-Açu e Crocodilo', 'Se o animal bugar e ficar parado em um local, o abate não será válido.']::text[], '/assets/o_destemido.webp', true),
  ('sangue-de-ouro', 'Sangue de Ouro', 'sangue-de-ouro', 'standard', 'general', 'geral', 'Geral', 'Abater um animal a pelo menos 100 metros de distância com um rifle sem mira', array['Rifles de Precisão']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na maior distância do abate.', 'O animal precisa ser Ouro']::text[], '/assets/sangue_de_ouro.webp', true),
  ('destruidor-de-cranios', 'Destruidor de Crânios', 'destruidor-de-cranios', 'standard', 'general', 'geral', 'Geral', 'Abater um animal a pelo menos 50 metros de distância com um rifle sem mira', array['Rifles de Precisão']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na maior distância do abate.', 'O tiro precisa acertar o cérebro do animal']::text[], '/assets/destruidor_de_cranios.webp', true),
  ('em-pleno-voo', 'Em Pleno Voo', 'em-pleno-voo', 'standard', 'group', 'aves', 'Aves', 'Abater uma ave em pleno voo a pelo menos 30 metros de distância com uma espingarda', array['Espingarda']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na maior distância do abate.']::text[], '/assets/em_pleno_voo.webp', true),
  ('whitetail-king', 'Whitetail King', 'whitetail-king', 'standard', 'species', 'veado-de-cauda-branca', 'Veado de Cauda Branca', 'Abater um Veado de Cauda Branca com a maior pontuação', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na maior pontuação do animal.']::text[], '/assets/whitetail_king.webp', true),
  ('rei-da-savana', 'Rei da Savana', 'rei-da-savana', 'standard', 'species', 'leao', 'Leão', 'Abater o leão com a maior pontuação', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na maior pontuação do animal.']::text[], '/assets/rei_da_savana.webp', true),
  ('triplice-triunfo', 'Triplice Triunfo', 'triplice-triunfo', 'standard', 'group', 'lebre', 'Lebre', 'Abater as três lebres de nuca dourada mais pesadas', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.', 'O critério de desempate é baseado na soma do peso das maiores lebres.']::text[], '/assets/triplice_triunfo.webp', true),
  ('jantar-na-mesa', 'Jantar na Mesa', 'jantar-na-mesa', 'standard', 'species', 'javali', 'Javali', 'Abater o Javali mais pesado com um arco', array['Arco']::text[], array['O animal precisa passar na verificação de abate.', 'É permitido o uso de miras ópticas.']::text[], '/assets/jantar_na_mesa.webp', true),
  ('pluma-imperial', 'Pluma Imperial', 'pluma-imperial', 'standard', 'group', 'aves', 'Aves', 'Abater o Faisão de maior pontuação', array['Qualquer arma ética']::text[], array['O animal precisa passar na verificação de abate.', 'É permitido o uso de miras ópticas.']::text[], '/assets/pluma_imperial.webp', true)
on conflict (legacy_id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  category = excluded.category,
  target_type = excluded.target_type,
  target_slug = excluded.target_slug,
  target_label = excluded.target_label,
  objective = excluded.objective,
  allowed_weapons = excluded.allowed_weapons,
  special_conditions = excluded.special_conditions,
  trophy_image_url = excluded.trophy_image_url,
  active = excluded.active;

insert into public.trophies (
  legacy_id,
  competition_id,
  winner_player_id,
  edition,
  trophy_date,
  weapon,
  reserve,
  details
)
select
  'flecha-fantasma-1-black-apple',
  competitions.id,
  players.id,
  1,
  '2026-06-23'::date,
  'Arco Longo Alexander Rústico',
  'Sundarpatan',
  'Quase no fim da competição, o arqueiro Black Apple conseguiu abater um Carneiro Azul a 68,92 metros, garantindo a vitória. A flecha perfurou o pulmão e vértebras do animal, mantendo todos os bônus de colheita.'
from public.competitions
cross join public.players
where competitions.legacy_id = 'flecha-fantasma'
  and players.legacy_id = 'black-apple'
on conflict (legacy_id) do update
set
  competition_id = excluded.competition_id,
  winner_player_id = excluded.winner_player_id,
  edition = excluded.edition,
  trophy_date = excluded.trophy_date,
  weapon = excluded.weapon,
  reserve = excluded.reserve,
  details = excluded.details;

insert into public.trophies (
  legacy_id,
  competition_id,
  winner_player_id,
  edition,
  trophy_date,
  weapon,
  reserve,
  details
)
select
  'olho-de-aguia-1-bode',
  competitions.id,
  players.id,
  1,
  '2026-06-23'::date,
  'Strandberg 10 SA Executive',
  'Sundarpatan',
  'Abateu uma grande fêmea de Iaque Selvagem com a munição Slug a 108,96 metros, garantindo o primeiro troféu da competição. O disparo foi feito com precisão, atingindo o pulmão direito do animal. Como estava sem o cachorro, o caçador teve grandes dificuldades para recuperar o animal, mas conseguiu com sucesso.'
from public.competitions
cross join public.players
where competitions.legacy_id = 'olho-de-aguia'
  and players.legacy_id = 'bode'
on conflict (legacy_id) do update
set
  competition_id = excluded.competition_id,
  winner_player_id = excluded.winner_player_id,
  edition = excluded.edition,
  trophy_date = excluded.trophy_date,
  weapon = excluded.weapon,
  reserve = excluded.reserve,
  details = excluded.details;

insert into public.trophies (
  legacy_id,
  competition_id,
  winner_player_id,
  edition,
  trophy_date,
  weapon,
  reserve,
  details
)
select
  'besta-impossivel-1-pardal',
  competitions.id,
  players.id,
  1,
  '2026-06-23'::date,
  'Besta Crosspoint CB-165 Supervisora',
  'Sundarpatan',
  'O primeiro título da modalidade veio com um disparo no peito de um Ganso Bravo em pleno voo a 92,40m de distância.'
from public.competitions
cross join public.players
where competitions.legacy_id = 'besta-impossivel'
  and players.legacy_id = 'pardal'
on conflict (legacy_id) do update
set
  competition_id = excluded.competition_id,
  winner_player_id = excluded.winner_player_id,
  edition = excluded.edition,
  trophy_date = excluded.trophy_date,
  weapon = excluded.weapon,
  reserve = excluded.reserve,
  details = excluded.details;

insert into public.trophies (
  legacy_id,
  competition_id,
  winner_player_id,
  edition,
  trophy_date,
  weapon,
  reserve,
  details
)
select
  'pistoleiro-do-oeste-1-pardal',
  competitions.id,
  players.id,
  1,
  '2026-06-23'::date,
  'Revólver Mangiafico 410 / 45 Colt de Aço Polido',
  'Sundarpatan',
  'O título inaugural da competição foi conquistado com um disparo certeiro a 115,11 metros no pulmão direito de um Carneiro Azul, garantindo a vitória.'
from public.competitions
cross join public.players
where competitions.legacy_id = 'pistoleiro-do-oeste'
  and players.legacy_id = 'pardal'
on conflict (legacy_id) do update
set
  competition_id = excluded.competition_id,
  winner_player_id = excluded.winner_player_id,
  edition = excluded.edition,
  trophy_date = excluded.trophy_date,
  weapon = excluded.weapon,
  reserve = excluded.reserve,
  details = excluded.details;

commit;
