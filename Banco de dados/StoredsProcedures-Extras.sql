DELIMITER //
CREATE PROCEDURE registrarVoto (IN p_hash_voto VARCHAR(256), IN p_id_usuario INT, IN p_id_proposta INT)
BEGIN
    DECLARE voto_existente INT;

    START TRANSACTION;

    SELECT COUNT(*) INTO voto_existente FROM Voto WHERE hash_voto = p_hash_voto;

    IF voto_existente > 0 THEN
    
        INSERT INTO Voto (hash_voto, data_voto, id_usuario, id_proposta) VALUES (p_hash_voto, NOW(), p_id_usuario, p_id_proposta);

        UPDATE Proposta SET qtVotos_proposta = qtVotos_proposta + 1 WHERE id_proposta = p_id_proposta;
    
    END IF;
    COMMIT;
END;
//
DELIMITER ;
