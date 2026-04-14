-- ============================================================
--  SkiConnect — Station de ski intelligente
--  seed.sql — Données de test réalistes
-- ============================================================

USE skiconnect;

-- ------------------------------------------------------------
-- CATÉGORIES D'OBJETS CONNECTÉS
-- ------------------------------------------------------------
INSERT INTO categories_objets (nom, description, icone) VALUES
('Remontées mécaniques',  'Télésièges, télécabines et téléskis',                        'cable-car'),
('Enneigement',           'Canons à neige et sondes d\'enneigement',                    'snowflake'),
('Météorologie',          'Capteurs météo répartis sur la station',                     'cloud'),
('Éclairage & Énergie',   'Systèmes d\'éclairage de pistes et compteurs énergétiques',  'lightbulb'),
('Sécurité',              'Caméras de surveillance et détecteurs d\'avalanche',          'shield'),
('Services skieurs',      'Bornes de location, portiques d\'accès, bornes info',        'user'),
('Bâtiments',             'Thermostats et systèmes de chauffage des refuges et chalets','home');

-- ------------------------------------------------------------
-- OBJETS CONNECTÉS (10 objets variés)
-- ------------------------------------------------------------
INSERT INTO objets_connectes (id_unique, nom, description, marque, type, etat, connectivite, batterie, zone, categorie_id, derniere_interaction) VALUES
('TLS-001', 'Télésiège Sommet Express',     'Télésiège 6 places reliant la vallée au sommet à 2800m',          'Doppelmayr', 'telesiege',   'actif',       'LoRa',    NULL, 'Vallée → Sommet',   1, NOW() - INTERVAL 5 MINUTE),
('TLC-002', 'Télécabine des Aigles',        'Télécabine 8 places avec chauffage intérieur',                    'Poma',        'telecabine',  'actif',       'LoRa',    NULL, 'Village → Col',     1, NOW() - INTERVAL 12 MINUTE),
('TSK-003', 'Téléski Débutants',            'Téléski pour la zone d\'apprentissage',                           'Poma',        'teleski',     'maintenance', 'LoRa',    NULL, 'Zone verte',        1, NOW() - INTERVAL 2 HOUR),
('CAN-001', 'Canon à neige Piste Bleue 1',  'Canon haute performance, consommation optimisée',                 'TechnoAlpin', 'canon_neige', 'actif',       'Wi-Fi',   NULL, 'Piste Bleue 1',     2, NOW() - INTERVAL 30 MINUTE),
('CAN-002', 'Canon à neige Piste Rouge A',  'Canon à neige zone rouge, alimentation en eau de la retenue',    'TechnoAlpin', 'canon_neige', 'inactif',     'Wi-Fi',   NULL, 'Piste Rouge A',     2, NOW() - INTERVAL 1 HOUR),
('MET-001', 'Station Météo Sommet',         'Capteur météo principal installé à 2800m d\'altitude',            'Davis',       'meteo',       'actif',       'LoRa',    85,   'Sommet 2800m',      3, NOW() - INTERVAL 1 MINUTE),
('MET-002', 'Station Météo Mi-Piste',       'Capteur intermédiaire à 1900m',                                   'Davis',       'meteo',       'actif',       'LoRa',    72,   'Mi-piste 1900m',    3, NOW() - INTERVAL 2 MINUTE),
('CAM-001', 'Caméra Piste Noire 1',         'Caméra HD surveillance de la piste noire, vision nocturne',       'Axis',        'camera',      'actif',       'Wi-Fi',   NULL, 'Piste Noire 1',     5, NOW() - INTERVAL 3 MINUTE),
('DET-001', 'Détecteur Avalanche Secteur N','Capteur sismique et de pression pour la détection précoce',       'Wyssen',      'detecteur',   'actif',       'LoRa',    91,   'Secteur Nord',      5, NOW() - INTERVAL 5 MINUTE),
('THM-001', 'Thermostat Refuge du Sommet',  'Régulation thermique du refuge d\'altitude (capacité 80 pers.)', 'Honeywell',   'thermostat',  'actif',       'Wi-Fi',   NULL, 'Refuge Sommet',     7, NOW() - INTERVAL 8 MINUTE),
('THM-002', 'Thermostat Chalet École',      'Chauffage de l\'école de ski',                                    'Honeywell',   'thermostat',  'actif',       'Wi-Fi',   NULL, 'Chalet École',      7, NOW() - INTERVAL 15 MINUTE),
('ECL-001', 'Éclairage Piste Nocturne',     'Système LED pour ski de nuit, programmable par horaire',          'Philips',     'eclairage',   'inactif',     'Zigbee',  NULL, 'Piste Bleue 2',     4, NOW() - INTERVAL 6 HOUR),
('POR-001', 'Portique Accès Principal',     'Portique de contrôle forfaits à l\'entrée principale',            'Skidata',     'portique',    'actif',       'Wi-Fi',   NULL, 'Entrée principale', 6, NOW() - INTERVAL 2 MINUTE),
('BOR-001', 'Borne Location Matériel',      'Borne libre-service pour réservation et location de matériel',   'Intersport',  'borne',       'actif',       'Wi-Fi',   NULL, 'Espace location',   6, NOW() - INTERVAL 20 MINUTE);

-- ------------------------------------------------------------
-- ATTRIBUTS DYNAMIQUES DES OBJETS
-- ------------------------------------------------------------

-- Télésiège Sommet Express
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(1, 'vitesse',           '5.5',    'm/s'),
(1, 'debit',             '2400',   'pers/h'),
(1, 'nb_passages_jour',  '1843',   'passages'),
(1, 'temperature_ext',   '-4',     '°C'),
(1, 'vent',              '18',     'km/h');

-- Télécabine des Aigles
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(2, 'vitesse',           '6.0',    'm/s'),
(2, 'debit',             '1600',   'pers/h'),
(2, 'nb_passages_jour',  '972',    'passages'),
(2, 'temperature_int',   '18',     '°C');

-- Canon à neige Piste Bleue 1
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(4, 'consommation_eau',  '120',    'm³/h'),
(4, 'consommation_elec', '45',     'kW'),
(4, 'temperature_wet',   '-3.5',   '°C'),
(4, 'pression_eau',      '28',     'bar'),
(4, 'enneigement_zone',  '65',     'cm');

-- Station Météo Sommet
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(6, 'temperature',       '-8',     '°C'),
(6, 'vent_vitesse',      '32',     'km/h'),
(6, 'vent_direction',    'NO',     ''),
(6, 'visibilite',        '800',    'm'),
(6, 'enneigement',       '142',    'cm'),
(6, 'humidite',          '78',     '%');

-- Station Météo Mi-Piste
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(7, 'temperature',       '-4',     '°C'),
(7, 'vent_vitesse',      '12',     'km/h'),
(7, 'visibilite',        '2000',   'm'),
(7, 'enneigement',       '98',     'cm'),
(7, 'humidite',          '65',     '%');

-- Détecteur Avalanche
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(9, 'niveau_risque',     '2',      '/5'),
(9, 'derniere_alerte',   'aucune', ''),
(9, 'temperature_sol',   '-6',     '°C'),
(9, 'pression',          '1013',   'hPa');

-- Thermostat Refuge du Sommet
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(10, 'temperature_actuelle', '19',  '°C'),
(10, 'temperature_cible',    '21',  '°C'),
(10, 'mode',                 'automatique', ''),
(10, 'consommation_elec',    '8.2', 'kW'),
(10, 'taux_occupation',      '62',  '%');

-- Portique Accès Principal
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(13, 'passages_valides',   '1247',  'passages'),
(13, 'passages_refuses',   '14',    'passages'),
(13, 'forfaits_actifs',    '1233',  'forfaits');

-- Borne Location Matériel
INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES
(14, 'equipements_dispos', '43',   'équipements'),
(14, 'reservations_jour',  '28',   'réservations'),
(14, 'taux_occupation',    '65',   '%');

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
INSERT INTO services (nom, description, categorie, actif) VALUES
('État des pistes',          'Consultation en temps réel de l\'état et de l\'ouverture de chaque piste', 'information', TRUE),
('Météo de la station',      'Données météo en direct depuis les capteurs de la station',               'information', TRUE),
('Consommation énergétique', 'Suivi et visualisation de la consommation électrique globale',            'energie',     TRUE),
('Gestion des forfaits',     'Contrôle des accès et statistiques de fréquentation',                    'acces',       TRUE),
('Enneigement artificiel',   'Pilotage des canons à neige selon les conditions météo',                  'neige',       TRUE),
('Surveillance sécurité',    'Flux caméras et alertes détecteurs d\'avalanche',                        'securite',    TRUE),
('Location matériel',        'Réservation et suivi du matériel disponible en borne',                   'service',     TRUE),
('Alertes & Notifications',  'Système d\'alertes automatiques (vent fort, fermeture piste, etc.)',     'securite',    TRUE);

-- ------------------------------------------------------------
-- ASSOCIATIONS OBJETS ↔ SERVICES
-- ------------------------------------------------------------
INSERT INTO objets_services (objet_id, service_id) VALUES
(1,  1), -- Télésiège → État des pistes
(2,  1),
(3,  1),
(4,  5), -- Canon → Enneigement artificiel
(5,  5),
(6,  2), -- Météo sommet → Météo station
(7,  2),
(6,  8), -- Météo → Alertes
(8,  6), -- Caméra → Surveillance
(9,  6), -- Détecteur → Surveillance
(9,  8), -- Détecteur → Alertes
(10, 3), -- Thermostat → Consommation énergie
(11, 3),
(12, 3),
(13, 4), -- Portique → Gestion forfaits
(14, 7); -- Borne → Location matériel

-- ------------------------------------------------------------
-- UTILISATEURS (mots de passe = bcrypt de "Password123!")
-- Le hash ci-dessous correspond à "Password123!" via bcrypt rounds=10
-- À régénérer avec bcrypt dans votre code Node.js en prod
-- ------------------------------------------------------------
INSERT INTO users (pseudo, nom, prenom, email, password_hash, age, genre, date_naissance, type_membre, niveau, points, nb_connexions, nb_actions, est_valide) VALUES
('jean_ski',    'Dupont',   'Jean',    'jean.dupont@skiconnect.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 34, 'homme',  '1991-03-15', 'skieur',       'intermediaire', 2.75, 11, 22, TRUE),
('marie_piste', 'Martin',   'Marie',   'marie.martin@skiconnect.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 28, 'femme',  '1997-07-22', 'moniteur',     'avance',        5.50, 22, 44, TRUE),
('luc_pisteur', 'Bernard',  'Luc',     'luc.bernard@skiconnect.fr',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 41, 'homme',  '1984-11-08', 'pisteur',      'expert',        8.25, 33, 66, TRUE),
('sophie_tech', 'Leroy',    'Sophie',  'sophie.leroy@skiconnect.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 30, 'femme',  '1995-02-14', 'technicien',   'avance',        5.25, 21, 42, TRUE),
('tom_debutant','Petit',    'Thomas',  'thomas.petit@skiconnect.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 22, 'homme',  '2003-06-30', 'skieur',       'debutant',      0.75,  3,  6, TRUE),
('clara_ski',   'Moreau',   'Clara',   'clara.moreau@skiconnect.fr',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 26, 'femme',  '1999-09-05', 'skieur',       'debutant',      0.50,  2,  4, TRUE),
('pierre_resp', 'Girard',   'Pierre',  'pierre.girard@skiconnect.fr', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 47, 'homme',  '1978-12-20', 'responsable',  'expert',        9.00, 36, 72, TRUE),
('alice_mon',   'Rousseau', 'Alice',   'alice.rousseau@skiconnect.fr','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 32, 'femme',  '1993-04-18', 'moniteur',     'intermediaire', 3.00, 12, 24, TRUE);

-- ------------------------------------------------------------
-- HISTORIQUE CONNEXIONS (pour alimenter les stats)
-- ------------------------------------------------------------
INSERT INTO historique_connexions (user_id, type_action, detail, points_gagnes, timestamp) VALUES
-- jean_ski (id=1)
(1, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 1 DAY),
(1, 'consultation_objet', 'Station Météo Sommet',    0.50, NOW() - INTERVAL 1 DAY),
(1, 'consultation_objet', 'Télésiège Sommet Express',0.50, NOW() - INTERVAL 1 DAY),
(1, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 12 HOUR),
(1, 'consultation_objet', 'État des pistes',         0.50, NOW() - INTERVAL 12 HOUR),
-- marie_piste (id=2)
(2, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 2 DAY),
(2, 'consultation_objet', 'Canon à neige Piste Bleue 1', 0.50, NOW() - INTERVAL 2 DAY),
(2, 'consultation_objet', 'Caméra Piste Noire 1',   0.50, NOW() - INTERVAL 2 DAY),
(2, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 1 DAY),
(2, 'consultation_objet', 'Détecteur Avalanche',     0.50, NOW() - INTERVAL 1 DAY),
-- luc_pisteur (id=3)
(3, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 3 DAY),
(3, 'consultation_objet', 'Détecteur Avalanche Secteur N', 0.50, NOW() - INTERVAL 3 DAY),
(3, 'consultation_objet', 'Station Météo Sommet',    0.50, NOW() - INTERVAL 3 DAY),
(3, 'connexion',          NULL,                      0.25, NOW() - INTERVAL 2 DAY),
(3, 'consultation_objet', 'Caméra Piste Noire 1',   0.50, NOW() - INTERVAL 2 DAY);

-- ------------------------------------------------------------
-- HISTORIQUE DONNÉES OBJETS (séries temporelles sur 7 jours)
-- Station Météo Sommet — température toutes les 6h
-- ------------------------------------------------------------
INSERT INTO historique_objets (objet_id, cle, valeur, timestamp) VALUES
(6, 'temperature', '-10', NOW() - INTERVAL 7 DAY),
(6, 'temperature', '-12', NOW() - INTERVAL 6 DAY + INTERVAL 6 HOUR),
(6, 'temperature', '-9',  NOW() - INTERVAL 6 DAY),
(6, 'temperature', '-7',  NOW() - INTERVAL 5 DAY + INTERVAL 12 HOUR),
(6, 'temperature', '-11', NOW() - INTERVAL 5 DAY),
(6, 'temperature', '-13', NOW() - INTERVAL 4 DAY + INTERVAL 6 HOUR),
(6, 'temperature', '-8',  NOW() - INTERVAL 4 DAY),
(6, 'temperature', '-6',  NOW() - INTERVAL 3 DAY + INTERVAL 12 HOUR),
(6, 'temperature', '-9',  NOW() - INTERVAL 3 DAY),
(6, 'temperature', '-10', NOW() - INTERVAL 2 DAY + INTERVAL 6 HOUR),
(6, 'temperature', '-7',  NOW() - INTERVAL 2 DAY),
(6, 'temperature', '-8',  NOW() - INTERVAL 1 DAY + INTERVAL 12 HOUR),
(6, 'temperature', '-8',  NOW() - INTERVAL 1 DAY),
(6, 'temperature', '-8',  NOW());

-- Consommation énergie Thermostat Refuge — 7 jours
INSERT INTO historique_objets (objet_id, cle, valeur, timestamp) VALUES
(10, 'consommation_elec', '9.1',  NOW() - INTERVAL 7 DAY),
(10, 'consommation_elec', '8.8',  NOW() - INTERVAL 6 DAY),
(10, 'consommation_elec', '9.4',  NOW() - INTERVAL 5 DAY),
(10, 'consommation_elec', '10.2', NOW() - INTERVAL 4 DAY),
(10, 'consommation_elec', '9.7',  NOW() - INTERVAL 3 DAY),
(10, 'consommation_elec', '8.5',  NOW() - INTERVAL 2 DAY),
(10, 'consommation_elec', '8.2',  NOW() - INTERVAL 1 DAY),
(10, 'consommation_elec', '8.2',  NOW());

-- Fréquentation Portique (nb passages/jour)
INSERT INTO historique_objets (objet_id, cle, valeur, timestamp) VALUES
(13, 'passages_valides', '980',  NOW() - INTERVAL 7 DAY),
(13, 'passages_valides', '1120', NOW() - INTERVAL 6 DAY),
(13, 'passages_valides', '1340', NOW() - INTERVAL 5 DAY),
(13, 'passages_valides', '1050', NOW() - INTERVAL 4 DAY),
(13, 'passages_valides', '890',  NOW() - INTERVAL 3 DAY),
(13, 'passages_valides', '1480', NOW() - INTERVAL 2 DAY),
(13, 'passages_valides', '1560', NOW() - INTERVAL 1 DAY),
(13, 'passages_valides', '1247', NOW());

-- ------------------------------------------------------------
-- ACTUALITÉS / ÉVÉNEMENTS
-- ------------------------------------------------------------
INSERT INTO actualites (titre, contenu, categorie, visible) VALUES
('Ouverture de la piste Noire des Chamois',
 'Suite aux chutes de neige des derniers jours, la piste Noire des Chamois est désormais ouverte. Enneigement constaté : 140 cm au sommet.',
 'info', TRUE),

('Alerte vent fort ce vendredi',
 'Des rafales jusqu\'à 80 km/h sont attendues vendredi après-midi. Le télésiège Sommet Express sera temporairement suspendu entre 14h et 17h par mesure de sécurité.',
 'alerte', TRUE),

('Cours collectifs enfants — places disponibles',
 'L\'école de ski propose des créneaux libres pour les cours collectifs enfants (6-12 ans) ce week-end. Inscription directement sur la borne ou à l\'accueil.',
 'evenement', TRUE),

('Maintenance téléski débutants',
 'Le téléski de la zone verte est en maintenance préventive ce matin. Réouverture prévue à 13h.',
 'alerte', TRUE),

('Enneigement record cette semaine',
 '85 cm de neige fraîche sont tombés en 5 jours. La station affiche un enneigement total de 142 cm au sommet — le meilleur depuis 10 ans !',
 'meteo', TRUE),

('Soirée ski nocturne samedi 18 janvier',
 'La piste Bleue 2 sera éclairée de 19h à 22h samedi soir. Ambiance musicale et vin chaud au départ. Forfait nocturne en vente à l\'accueil.',
 'evenement', TRUE);

-- ------------------------------------------------------------
-- DEMANDES DE SUPPRESSION (exemples)
-- ------------------------------------------------------------
INSERT INTO demandes_suppression (objet_id, user_id, motif, statut) VALUES
(5, 2, 'Le Canon à neige Piste Rouge A est hors service depuis 3 semaines, aucune réparation planifiée.', 'en_attente');
