-- CERTIFICADO en media_archivos (registro ciudadano). Hawk / Emilio / Rodrigo
-- Si la subida del certificado responde 400, correr este script en MySQL.
USE db_media;
ALTER TABLE media_archivos
  MODIFY COLUMN tipo ENUM('PERFIL', 'REPORTE', 'CERTIFICADO') NOT NULL;
