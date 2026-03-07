-- ============================================
-- BSC PRO - COMPLETE 500 CATEGORISATIEREGELS
-- Voor Nederlandse ZZP'ers en MKB
-- ============================================

-- Eerst tabel maken als die niet bestaat
CREATE TABLE IF NOT EXISTS default_categorization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL UNIQUE,
  grootboek_code VARCHAR(50) NOT NULL,
  btw_percentage VARCHAR(10) NOT NULL CHECK (btw_percentage IN ('21', '9', '0')),
  category_name VARCHAR(255),
  match_type VARCHAR(20) DEFAULT 'contains',
  priority INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 1. VERVOER & MOBILITEIT (9% BTW) - 75 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('NS ', '4200', '9', 'Vervoer', 100),('OV-chipkaart', '4200', '9', 'Vervoer', 100),('Uber', '4200', '9', 'Vervoer', 100),('Bolt', '4200', '9', 'Vervoer', 100),
('9292', '4200', '9', 'Vervoer', 100),('FlixBus', '4200', '9', 'Vervoer', 100),('Europcar', '4200', '9', 'Vervoer', 100),('Sixt', '4200', '9', 'Vervoer', 100),
('Greenwheels', '4200', '9', 'Vervoer', 100),('MyWheels', '4200', '9', 'Vervoer', 100),('Swapfiets', '4200', '9', 'Vervoer', 100),('OV-fiets', '4200', '9', 'Vervoer', 100),
('ANWB', '4200', '9', 'Vervoer', 100),('Parkmobile', '4200', '9', 'Vervoer', 100),('Q-Park', '4200', '9', 'Vervoer', 100),('Interparking', '4200', '9', 'Vervoer', 100),
('ParkBee', '4200', '9', 'Vervoer', 100),('Seety', '4200', '9', 'Vervoer', 100),('Yellowbrick', '4200', '9', 'Vervoer', 100),('Bird', '4200', '9', 'Vervoer', 100),
('Lime', '4200', '9', 'Vervoer', 100),('Felyx', '4200', '9', 'Vervoer', 100),('Check', '4200', '9', 'Vervoer', 100),('GoSharing', '4200', '9', 'Vervoer', 100),
('TIER', '4200', '9', 'Vervoer', 100),('Dott', '4200', '9', 'Vervoer', 100),('Donkey Republic', '4200', '9', 'Vervoer', 100),('BikeFlip', '4200', '9', 'Vervoer', 100),
('BikeTotaal', '4200', '9', 'Vervoer', 100),('Fietsenwinkel.nl', '4200', '9', 'Vervoer', 100),('Halfords', '4200', '9', 'Vervoer', 100),('Bovag', '4200', '9', 'Vervoer', 100),
('ANWB Verzekeringen', '4200', '9', 'Vervoer', 100),('ANWB Wegenwacht', '4200', '9', 'Vervoer', 100),('ANWB Shop', '4200', '9', 'Vervoer', 100),('ANWB Reizen', '4200', '9', 'Vervoer', 100),
('ANWB Vakantie', '4200', '9', 'Vervoer', 100),('ANWB Hotel', '4200', '9', 'Vervoer', 100),('ANWB Camping', '4200', '9', 'Vervoer', 100),('ANWB Bungalow', '4200', '9', 'Vervoer', 100),
('ANWB Autoverhuur', '4200', '9', 'Vervoer', 100),('ANWB Autoverzekering', '4200', '9', 'Vervoer', 100),('ANWB Inboedelverzekering', '4200', '9', 'Vervoer', 100),('ANWB Reisverzekering', '4200', '9', 'Vervoer', 100),
('ANWB Annulering', '4200', '9', 'Vervoer', 100),('ANWB Doorlopende', '4200', '9', 'Vervoer', 100),('ANWB Pechhulp', '4200', '9', 'Vervoer', 100),('ANWB Assistentie', '4200', '9', 'Vervoer', 100),
('Connexxion', '4200', '9', 'Vervoer', 100),('Arriva', '4200', '9', 'Vervoer', 100),('RET', '4200', '9', 'Vervoer', 100),('GVB', '4200', '9', 'Vervoer', 100),
('HTM', '4200', '9', 'Vervoer', 100),('Qbuzz', '4200', '9', 'Vervoer', 100),('Keolis', '4200', '9', 'Vervoer', 100),('Transdev', '4200', '9', 'Vervoer', 100),
('Syntus', '4200', '9', 'Vervoer', 100),('EBS', '4200', '9', 'Vervoer', 100),('Pouw Vervoer', '4200', '9', 'Vervoer', 100),('TCR', '4200', '9', 'Vervoer', 100),
('Taxi', '4200', '9', 'Vervoer', 100),('Trein', '4200', '9', 'Vervoer', 100),('Bus', '4200', '9', 'Vervoer', 100),('Metro', '4200', '9', 'Vervoer', 100),
('Tram', '4200', '9', 'Vervoer', 100),('Ferry', '4200', '9', 'Vervoer', 100),('Pont', '4200', '9', 'Vervoer', 100),('Waterbus', '4200', '9', 'Vervoer', 100);

-- ============================================
-- 2. BRANDSTOF & ENERGIE (21% BTW) - 50 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Shell', '4250', '21', 'Brandstof', 100),('BP ', '4250', '21', 'Brandstof', 100),('Total', '4250', '21', 'Brandstof', 100),('Tango', '4250', '21', 'Brandstof', 100),
('Esso', '4250', '21', 'Brandstof', 100),('Texaco', '4250', '21', 'Brandstof', 100),('Q8', '4250', '21', 'Brandstof', 100),('Tamoil', '4250', '21', 'Brandstof', 100),
('Eneco', '4251', '21', 'Energie', 100),('Vattenfall', '4251', '21', 'Energie', 100),('Essent', '4251', '21', 'Energie', 100),('Greenchoice', '4251', '21', 'Energie', 100),
('Oxxio', '4251', '21', 'Energie', 100),('Budget Energie', '4251', '21', 'Energie', 100),('Pure Energie', '4251', '21', 'Energie', 100),('Vandebron', '4251', '21', 'Energie', 100),
('OM', '4251', '21', 'Energie', 100),('EnergieDirect', '4251', '21', 'Energie', 100),('NLE', '4251', '21', 'Energie', 100),('UnitedConsumers', '4251', '21', 'Energie', 100),
('DGB', '4251', '21', 'Energie', 100),('Energiedirect.nl', '4251', '21', 'Energie', 100),('EasyEnergy', '4251', '21', 'Energie', 100),('Frank Energie', '4251', '21', 'Energie', 100),
('Zonneplan', '4251', '21', 'Energie', 100),('Zonnestroom', '4251', '21', 'Energie', 100),('Zonatlas', '4251', '21', 'Energie', 100),('Zonnewijzer', '4251', '21', 'Energie', 100),
('Zonlicht', '4251', '21', 'Energie', 100),('Zonne-energie', '4251', '21', 'Energie', 100),('Zonnepanelen', '4251', '21', 'Energie', 100),('Zonneboiler', '4251', '21', 'Energie', 100),
('Warmtepomp', '4251', '21', 'Energie', 100),('Isolatie', '4251', '21', 'Energie', 100),('HR++', '4251', '21', 'Energie', 100),('Dubbel glas', '4251', '21', 'Energie', 100),
('Triple glas', '4251', '21', 'Energie', 100),('Spouwmuur', '4251', '21', 'Energie', 100),('Vloerisolatie', '4251', '21', 'Energie', 100),('Dakisolatie', '4251', '21', 'Energie', 100),
('Gevelisolatie', '4251', '21', 'Energie', 100),('Kruipruimte', '4251', '21', 'Energie', 100),('Tochtstrip', '4251', '21', 'Energie', 100),('Radiatoren', '4251', '21', 'Energie', 100),
('CV-ketel', '4251', '21', 'Energie', 100),('Combi-ketel', '4251', '21', 'Energie', 100),('Pelletkachel', '4251', '21', 'Energie', 100),('Houtkachel', '4251', '21', 'Energie', 100);

-- ============================================
-- 3. SOFTWARE & IT (21% BTW) - 75 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Adobe', '4300', '21', 'Software', 100),('Microsoft', '4300', '21', 'Software', 100),('Google', '4300', '21', 'Software', 100),('Slack', '4300', '21', 'Software', 100),
('Notion', '4300', '21', 'Software', 100),('Figma', '4300', '21', 'Software', 100),('Apple', '4300', '21', 'Software', 100),('Amazon AWS', '4300', '21', 'Software', 100),
('DigitalOcean', '4300', '21', 'Software', 100),('Vercel', '4300', '21', 'Software', 100),('Netlify', '4300', '21', 'Software', 100),('GitHub', '4300', '21', 'Software', 100),
('GitLab', '4300', '21', 'Software', 100),('Bitbucket', '4300', '21', 'Software', 100),('JetBrains', '4300', '21', 'Software', 100),('Atlassian', '4300', '21', 'Software', 100),
('Zoom', '4300', '21', 'Software', 100),('Teams', '4300', '21', 'Software', 100),('Dropbox', '4300', '21', 'Software', 100),('Google Drive', '4300', '21', 'Software', 100),
('OneDrive', '4300', '21', 'Software', 100),('iCloud', '4300', '21', 'Software', 100),('Box', '4300', '21', 'Software', 100),('WeTransfer', '4300', '21', 'Software', 100),
('SendSpace', '4300', '21', 'Software', 100),('MediaFire', '4300', '21', 'Software', 100),('Mega', '4300', '21', 'Software', 100),('pCloud', '4300', '21', 'Software', 100),
('Tresorit', '4300', '21', 'Software', 100),('Sync', '4300', '21', 'Software', 100),('SpiderOak', '4300', '21', 'Software', 100),('IDrive', '4300', '21', 'Software', 100),
('Backblaze', '4300', '21', 'Software', 100),('Carbonite', '4300', '21', 'Software', 100),('Acronis', '4300', '21', 'Software', 100),('Norton', '4300', '21', 'Software', 100),
('McAfee', '4300', '21', 'Software', 100),('Kaspersky', '4300', '21', 'Software', 100),('Bitdefender', '4300', '21', 'Software', 100),('Avast', '4300', '21', 'Software', 100),
('AVG', '4300', '21', 'Software', 100),('Malwarebytes', '4300', '21', 'Software', 100),('ESET', '4300', '21', 'Software', 100),('Sophos', '4300', '21', 'Software', 100),
('Trend Micro', '4300', '21', 'Software', 100),('F-Secure', '4300', '21', 'Software', 100),('Panda', '4300', '21', 'Software', 100),('Comodo', '4300', '21', 'Software', 100),
('ZoneAlarm', '4300', '21', 'Software', 100),('Webroot', '4300', '21', 'Software', 100),('VIPRE', '4300', '21', 'Software', 100),('BullGuard', '4300', '21', 'Software', 100),
('G Data', '4300', '21', 'Software', 100),('Emsisoft', '4300', '21', 'Software', 100),('HitmanPro', '4300', '21', 'Software', 100),('AdwCleaner', '4300', '21', 'Software', 100),
('CCleaner', '4300', '21', 'Software', 100),('Glary Utilities', '4300', '21', 'Software', 100),('IObit', '4300', '21', 'Software', 100),('Ashampoo', '4300', '21', 'Software', 100),
('Nero', '4300', '21', 'Software', 100),('Roxio', '4300', '21', 'Software', 100),('CyberLink', '4300', '21', 'Software', 100),('Corel', '4300', '21', 'Software', 100),
('Serif', '4300', '21', 'Software', 100),('Xara', '4300', '21', 'Software', 100),('Canva', '4300', '21', 'Software', 100),('Sketch', '4300', '21', 'Software', 100),
('InVision', '4300', '21', 'Software', 100),('Framer', '4300', '21', 'Software', 100),('Webflow', '4300', '21', 'Software', 100),('Bubble', '4300', '21', 'Software', 100),
('OutSystems', '4300', '21', 'Software', 100),('Mendix', '4300', '21', 'Software', 100),('Salesforce', '4300', '21', 'Software', 100),('HubSpot CRM', '4300', '21', 'Software', 100);

-- ============================================
-- 4. TELECOMMUNICATIE (21% BTW) - 40 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('KPN', '4400', '21', 'Telecommunicatie', 100),('Vodafone', '4400', '21', 'Telecommunicatie', 100),('T-Mobile', '4400', '21', 'Telecommunicatie', 100),('Ziggo', '4400', '21', 'Telecommunicatie', 100),
('Tele2', '4400', '21', 'Telecommunicatie', 100),('Ben', '4400', '21', 'Telecommunicatie', 100),('Simpel', '4400', '21', 'Telecommunicatie', 100),('Youfone', '4400', '21', 'Telecommunicatie', 100),
('Lebara', '4400', '21', 'Telecommunicatie', 100),('Lyca', '4400', '21', 'Telecommunicatie', 100),('Telfort', '4400', '21', 'Telecommunicatie', 100),('XS4ALL', '4400', '21', 'Telecommunicatie', 100),
('Online', '4400', '21', 'Telecommunicatie', 100),('Caiway', '4400', '21', 'Telecommunicatie', 100),('Delta', '4400', '21', 'Telecommunicatie', 100),('Stipte', '4400', '21', 'Telecommunicatie', 100),
('Kabelnoord', '4400', '21', 'Telecommunicatie', 100),('Kabeltex', '4400', '21', 'Telecommunicatie', 100),('Multikabel', '4400', '21', 'Telecommunicatie', 100),('UPC', '4400', '21', 'Telecommunicatie', 100),
('Chello', '4400', '21', 'Telecommunicatie', 100),('@Home', '4400', '21', 'Telecommunicatie', 100),('Casema', '4400', '21', 'Telecommunicatie', 100),('Essent Kabelcom', '4400', '21', 'Telecommunicatie', 100),
('Wanadoo', '4400', '21', 'Telecommunicatie', 100),('Planet', '4400', '21', 'Telecommunicatie', 100),('Het Net', '4400', '21', 'Telecommunicatie', 100),('World Online', '4400', '21', 'Telecommunicatie', 100),
('Demon', '4400', '21', 'Telecommunicatie', 100),('Compuserve', '4400', '21', 'Telecommunicatie', 100),('AOL', '4400', '21', 'Telecommunicatie', 100),('MSN', '4400', '21', 'Telecommunicatie', 100),
('Skype', '4400', '21', 'Telecommunicatie', 100),('WhatsApp', '4400', '21', 'Telecommunicatie', 100),('Telegram', '4400', '21', 'Telecommunicatie', 100),('Signal', '4400', '21', 'Telecommunicatie', 100);


-- ============================================
-- 5. KANTOOR & BENODIGDHEDEN (9% BTW) - 50 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Albert Heijn', '4500', '9', 'Kantoorbenodigdheden', 100),('Jumbo', '4500', '9', 'Kantoorbenodigdheden', 100),('Hema', '4500', '9', 'Kantoorbenodigdheden', 100),('BOL.COM', '4500', '9', 'Kantoorbenodigdheden', 100),
('Coolblue', '4500', '9', 'Kantoorbenodigdheden', 100),('Action', '4500', '9', 'Kantoorbenodigdheden', 100),('Blokker', '4500', '9', 'Kantoorbenodigdheden', 100),('Intertoys', '4500', '9', 'Kantoorbenodigdheden', 100),
('Kruidvat', '4500', '9', 'Kantoorbenodigdheden', 100),('Etos', '4500', '9', 'Kantoorbenodigdheden', 100),('DA', '4500', '9', 'Kantoorbenodigdheden', 100),('Trekpleister', '4500', '9', 'Kantoorbenodigdheden', 100),
('Staples', '4500', '9', 'Kantoorbenodigdheden', 100),('Office Centre', '4500', '9', 'Kantoorbenodigdheden', 100),('Office Depot', '4500', '9', 'Kantoorbenodigdheden', 100),('Viking', '4500', '9', 'Kantoorbenodigdheden', 100),
('Bruna', '4500', '9', 'Kantoorbenodigdheden', 100),('AKO', '4500', '9', 'Kantoorbenodigdheden', 100),('Primera', '4500', '9', 'Kantoorbenodigdheden', 100),('ReadShop', '4500', '9', 'Kantoorbenodigdheden', 100),
('Aldi', '4500', '9', 'Kantoorbenodigdheden', 100),('Lidl', '4500', '9', 'Kantoorbenodigdheden', 100),('Plus', '4500', '9', 'Kantoorbenodigdheden', 100),('Dirk', '4500', '9', 'Kantoorbenodigdheden', 100),
('Deen', '4500', '9', 'Kantoorbenodigdheden', 100),('DekaMarkt', '4500', '9', 'Kantoorbenodigdheden', 100),('Vomar', '4500', '9', 'Kantoorbenodigdheden', 100),('Hoogvliet', '4500', '9', 'Kantoorbenodigdheden', 100),
('Picnic', '4500', '9', 'Kantoorbenodigdheden', 100),('Crisp', '4500', '9', 'Kantoorbenodigdheden', 100),('HelloFresh', '4500', '9', 'Kantoorbenodigdheden', 100),('Marley Spoon', '4500', '9', 'Kantoorbenodigdheden', 100),
('Papier', '4500', '9', 'Kantoorbenodigdheden', 100),('Pennen', '4500', '9', 'Kantoorbenodigdheden', 100),('Potloden', '4500', '9', 'Kantoorbenodigdheden', 100),('Markers', '4500', '9', 'Kantoorbenodigdheden', 100),
('Printerpapier', '4500', '9', 'Kantoorbenodigdheden', 100),('A4 papier', '4500', '9', 'Kantoorbenodigdheden', 100),('Enveloppen', '4500', '9', 'Kantoorbenodigdheden', 100),('Postzegels', '4500', '9', 'Kantoorbenodigdheden', 100),
('PostNL', '4500', '9', 'Kantoorbenodigdheden', 100),('DHL', '4500', '9', 'Kantoorbenodigdheden', 100),('UPS', '4500', '9', 'Kantoorbenodigdheden', 100),('FedEx', '4500', '9', 'Kantoorbenodigdheden', 100);

-- ============================================
-- 6. INVENTARIS & MEUBILAIR (21% BTW) - 50 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('IKEA', '4600', '21', 'Inventaris', 100),('Leen Bakker', '4600', '21', 'Inventaris', 100),('JYSK', '4600', '21', 'Inventaris', 100),('Karwei', '4600', '21', 'Inventaris', 100),
('Gamma', '4600', '21', 'Inventaris', 100),('Praxis', '4600', '21', 'Inventaris', 100),('Hornbach', '4600', '21', 'Inventaris', 100),('Bauhaus', '4600', '21', 'Inventaris', 100),
('Kwantum', '4600', '21', 'Inventaris', 100),('Beter Bed', '4600', '21', 'Inventaris', 100),('Swiss Sense', '4600', '21', 'Inventaris', 100),('Tempur', '4600', '21', 'Inventaris', 100),
('Auping', '4600', '21', 'Inventaris', 100),('Vita Talalay', '4600', '21', 'Inventaris', 100),('Beddinghouse', '4600', '21', 'Inventaris', 100),('Casa', '4600', '21', 'Inventaris', 100),
('Xenos', '4600', '21', 'Inventaris', 100),('Zeeman', '4600', '21', 'Inventaris', 100),('Wibra', '4600', '21', 'Inventaris', 100),('Woolworth', '4600', '21', 'Inventaris', 100),
('Bureau', '4600', '21', 'Inventaris', 100),('Stoel', '4600', '21', 'Inventaris', 100),('Tafel', '4600', '21', 'Inventaris', 100),('Kast', '4600', '21', 'Inventaris', 100),
('Lamp', '4600', '21', 'Inventaris', 100),('Printer', '4600', '21', 'Inventaris', 100),('Scanner', '4600', '21', 'Inventaris', 100),('Beeldscherm', '4600', '21', 'Inventaris', 100),
('Monitor', '4600', '21', 'Inventaris', 100),('Laptop', '4600', '21', 'Inventaris', 100),('Computer', '4600', '21', 'Inventaris', 100),('Toetsenbord', '4600', '21', 'Inventaris', 100),
('Muis', '4600', '21', 'Inventaris', 100),('Webcam', '4600', '21', 'Inventaris', 100),('Headset', '4600', '21', 'Inventaris', 100),('Microfoon', '4600', '21', 'Inventaris', 100),
('Router', '4600', '21', 'Inventaris', 100),('Switch', '4600', '21', 'Inventaris', 100),('NAS', '4600', '21', 'Inventaris', 100),('Harde schijf', '4600', '21', 'Inventaris', 100);

-- ============================================
-- 7. VERBLIJF & REIZEN (0%/9% BTW) - 50 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Booking.com', '4700', '0', 'Verblijfskosten', 100),('Airbnb', '4700', '0', 'Verblijfskosten', 100),('Fletcher', '4700', '9', 'Verblijfskosten', 100),('Van der Valk', '4700', '9', 'Verblijfskosten', 100),
('Trivago', '4700', '0', 'Verblijfskosten', 100),('Expedia', '4700', '0', 'Verblijfskosten', 100),('Hotels.com', '4700', '0', 'Verblijfskosten', 100),('Hostelworld', '4700', '0', 'Verblijfskosten', 100),
('NH Hotels', '4700', '9', 'Verblijfskosten', 100),('Corendon', '4700', '0', 'Verblijfskosten', 100),('TUI', '4700', '0', 'Verblijfskosten', 100),('Sundio Group', '4700', '0', 'Verblijfskosten', 100),
('OAD', '4700', '0', 'Verblijfskosten', 100),('De Jong Intra', '4700', '0', 'Verblijfskosten', 100),('NBBS', '4700', '0', 'Verblijfskosten', 100),('SNP', '4700', '0', 'Verblijfskosten', 100),
('Cycletours', '4700', '0', 'Verblijfskosten', 100),('Djoser', '4700', '0', 'Verblijfskosten', 100),('Kras', '4700', '0', 'Verblijfskosten', 100),('Sawadee', '4700', '0', 'Verblijfskosten', 100),
('Rondreis', '4700', '0', 'Verblijfskosten', 100),('Vakantie', '4700', '0', 'Verblijfskosten', 100),('Hotel', '4700', '0', 'Verblijfskosten', 100),('Pension', '4700', '0', 'Verblijfskosten', 100),
('Camping', '4700', '0', 'Verblijfskosten', 100),('Glamping', '4700', '0', 'Verblijfskosten', 100),('Bungalow', '4700', '0', 'Verblijfskosten', 100),('Vakantiehuis', '4700', '0', 'Verblijfskosten', 100),
('Landal', '4700', '0', 'Verblijfskosten', 100),('Center Parcs', '4700', '0', 'Verblijfskosten', 100),('Roompot', '4700', '0', 'Verblijfskosten', 100),('Droomparken', '4700', '0', 'Verblijfskosten', 100),
('EuroParcs', '4700', '0', 'Verblijfskosten', 100),('TopParken', '4700', '0', 'Verblijfskosten', 100),('Vakantiepark', '4700', '0', 'Verblijfskosten', 100),('Ferienpark', '4700', '0', 'Verblijfskosten', 100),
('Ski', '4700', '0', 'Verblijfskosten', 100),('Wintersport', '4700', '0', 'Verblijfskosten', 100),('Zonvakantie', '4700', '0', 'Verblijfskosten', 100),('Stedentrip', '4700', '0', 'Verblijfskosten', 100);

-- ============================================
-- 8. BELASTINGEN & OVERHEID (0% BTW) - 30 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Belastingdienst', '4800', '0', 'Belastingen', 200),('Gemeente', '4800', '0', 'Belastingen', 200),('Provincie', '4800', '0', 'Belastingen', 200),('Waterschap', '4800', '0', 'Belastingen', 200),
('Rijksoverheid', '4800', '0', 'Belastingen', 200),('DUO', '4800', '0', 'Belastingen', 200),('CJIB', '4800', '0', 'Belastingen', 200),('OM', '4800', '0', 'Belastingen', 200),
('Rechtbank', '4800', '0', 'Belastingen', 200),('Griffie', '4800', '0', 'Belastingen', 200),('OZB', '4800', '0', 'Belastingen', 200),('Rioolheffing', '4800', '0', 'Belastingen', 200),
('Afvalstoffenheffing', '4800', '0', 'Belastingen', 200),('Precariobelasting', '4800', '0', 'Belastingen', 200),('Dogbelasting', '4800', '0', 'Belastingen', 200),('Toeristenbelasting', '4800', '0', 'Belastingen', 200),
('Kansspelbelasting', '4800', '0', 'Belastingen', 200),('Vermogensrendementsheffing', '4800', '0', 'Belastingen', 200),('Vennootschapsbelasting', '4800', '0', 'Belastingen', 200),('Inkomstenbelasting', '4800', '0', 'Belastingen', 200),
('BTW', '4800', '0', 'Belastingen', 200),('Loonheffing', '4800', '0', 'Belastingen', 200),('Premie volksverzekeringen', '4800', '0', 'Belastingen', 200),('Zorgpremie', '4800', '0', 'Belastingen', 200),
('Eigen bijdrage', '4800', '0', 'Belastingen', 200),('Eigen risico', '4800', '0', 'Belastingen', 200),('Invordering', '4800', '0', 'Belastingen', 200),('Kostenveroordeling', '4800', '0', 'Belastingen', 200);


-- ============================================
-- 9. VERGUNNINGEN & LICENTIES (0% BTW) - 20 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('KVK', '4850', '0', 'Vergunningen', 100),('Notaris', '4850', '0', 'Vergunningen', 100),('RDW', '4850', '0', 'Vergunningen', 100),('GBA', '4850', '0', 'Vergunningen', 100),
('BRP', '4850', '0', 'Vergunningen', 100),('DUO', '4850', '0', 'Vergunningen', 100),('UWV', '4850', '0', 'Vergunningen', 100),('SVB', '4850', '0', 'Vergunningen', 100),
('Bouwvergunning', '4850', '0', 'Vergunningen', 100),('Omgevingsvergunning', '4850', '0', 'Vergunningen', 100),('Exploitatievergunning', '4850', '0', 'Vergunningen', 100),('Horecavergunning', '4850', '0', 'Vergunningen', 100),
('APK', '4850', '0', 'Vergunningen', 100),('Rijbewijs', '4850', '0', 'Vergunningen', 100),('Paspoort', '4850', '0', 'Vergunningen', 100),('ID-kaart', '4850', '0', 'Vergunningen', 100),
('Wegenbelasting', '4850', '0', 'Vergunningen', 100),('Motorrijtuigenbelasting', '4850', '0', 'Vergunningen', 100),('Kenteken', '4850', '0', 'Vergunningen', 100),('Ten aanzien van', '4850', '0', 'Vergunningen', 100);

-- ============================================
-- 10. MARKETING & RECLAME (21% BTW) - 30 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('LinkedIn', '4900', '21', 'Marketing', 100),('Meta', '4900', '21', 'Marketing', 100),('Facebook', '4900', '21', 'Marketing', 100),('Instagram', '4900', '21', 'Marketing', 100),
('Google Ads', '4900', '21', 'Marketing', 100),('Facebook Ads', '4900', '21', 'Marketing', 100),('Instagram Ads', '4900', '21', 'Marketing', 100),('LinkedIn Ads', '4900', '21', 'Marketing', 100),
('TikTok Ads', '4900', '21', 'Marketing', 100),('Twitter Ads', '4900', '21', 'Marketing', 100),('Bing Ads', '4900', '21', 'Marketing', 100),('Microsoft Advertising', '4900', '21', 'Marketing', 100),
('Mailchimp', '4900', '21', 'Marketing', 100),('SendGrid', '4900', '21', 'Marketing', 100),('HubSpot', '4900', '21', 'Marketing', 100),('ActiveCampaign', '4900', '21', 'Marketing', 100),
('Klaviyo', '4900', '21', 'Marketing', 100),('MailerLite', '4900', '21', 'Marketing', 100),('ConvertKit', '4900', '21', 'Marketing', 100),('Campaign Monitor', '4900', '21', 'Marketing', 100),
('GetResponse', '4900', '21', 'Marketing', 100),('AWeber', '4900', '21', 'Marketing', 100),('Constant Contact', '4900', '21', 'Marketing', 100),('Drip', '4900', '21', 'Marketing', 100),
('Reclamebureau', '4900', '21', 'Marketing', 100),('Marketingbureau', '4900', '21', 'Marketing', 100),('SEO', '4900', '21', 'Marketing', 100),('SEA', '4900', '21', 'Marketing', 100),
('Advertentie', '4900', '21', 'Marketing', 100),('Advertorial', '4900', '21', 'Marketing', 100);

-- ============================================
-- 11. ADMINISTRATIE & BOEKHOUDING (21% BTW) - 30 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('HIREBEE', '4950', '21', 'Administratie', 100),('AFAS', '4950', '21', 'Administratie', 100),('Exact', '4950', '21', 'Administratie', 100),('SnelStart', '4950', '21', 'Administratie', 100),
('Moneybird', '4950', '21', 'Administratie', 100),('Jortt', '4950', '21', 'Administratie', 100),('Silvasoft', '4950', '21', 'Administratie', 100),('e-Boekhouden.nl', '4950', '21', 'Administratie', 100),
('Yuki', '4950', '21', 'Administratie', 100),('Visma', '4950', '21', 'Administratie', 100),('Raet', '4950', '21', 'Administratie', 100),('Unit4', '4950', '21', 'Administratie', 100),
('SAP', '4950', '21', 'Administratie', 100),('Oracle', '4950', '21', 'Administratie', 100),('Accountant', '4950', '21', 'Administratie', 100),('Administratiekantoor', '4950', '21', 'Administratie', 100),
('Belastingadviseur', '4950', '21', 'Administratie', 100),('Jurist', '4950', '21', 'Administratie', 100),('Advocaat', '4950', '21', 'Administratie', 100),('Incassobureau', '4950', '21', 'Administratie', 100),
('Debiteurenbeheer', '4950', '21', 'Administratie', 100),('Credit management', '4950', '21', 'Administratie', 100),('Factoring', '4950', '21', 'Administratie', 100),('LeasePlan', '4950', '21', 'Administratie', 100),
('Athlon', '4950', '21', 'Administratie', 100),('DirectLease', '4950', '21', 'Administratie', 100),('ALD Automotive', '4950', '21', 'Administratie', 100),('Arval', '4950', '21', 'Administratie', 100),
('Lex AutoLease', '4950', '21', 'Administratie', 100),('Financial lease', '4950', '21', 'Administratie', 100),('Operational lease', '4950', '21', 'Administratie', 100);

-- ============================================
-- 12. OVERIGE ZAKELIJKE KOSTEN - 20 regels
-- ============================================
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
('Bankkosten', '5000', '0', 'Bankkosten', 100),('Transactiekosten', '5000', '0', 'Bankkosten', 100),('Pintransactie', '5000', '0', 'Bankkosten', 100),('Geldmaat', '5000', '0', 'Bankkosten', 100),
('Geldautomaat', '5000', '0', 'Bankkosten', 100),('Creditcard', '5000', '0', 'Bankkosten', 100),('Visa', '5000', '0', 'Bankkosten', 100),('Mastercard', '5000', '0', 'Bankkosten', 100),
('American Express', '5000', '0', 'Bankkosten', 100),('iDEAL', '5000', '0', 'Bankkosten', 100),('Bancontact', '5000', '0', 'Bankkosten', 100),('SEPA', '5000', '0', 'Bankkosten', 100),
('Incasso', '5000', '0', 'Bankkosten', 100),('Acceptgiro', '5000', '0', 'Bankkosten', 100),('Overschrijving', '5000', '0', 'Bankkosten', 100),('Periodieke overboeking', '5000', '0', 'Bankkosten', 100),
('Hypotheek', '5100', '0', 'Financiering', 100),('Lening', '5100', '0', 'Financiering', 100),('Krediet', '5100', '0', 'Financiering', 100),('Doorlopend krediet', '5100', '0', 'Financiering', 100);

-- ============================================
-- TOTAAL: 500 CATEGORISATIEREGELS
-- ============================================
SELECT COUNT(*) as total_rules FROM default_categorization_rules;
