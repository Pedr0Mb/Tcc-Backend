DELIMITER //
CREATE PROCEDURE registrarVoto (IN p_id_usuario INT, IN p_id_pcoesResposta INT)
BEGIN
    DECLARE voto_existente INT;

    START TRANSACTION;

    SELECT COUNT(*) INTO voto_existente FROM Voto WHERE id_usuario = p_id_usuario AND id_opcoesResposta = p_id_opcoesResposta;

    IF voto_existente > 0 THEN
    
        INSERT INTO Voto (data_voto, id_usuario, id_opcoesResposta) VALUES (NOW(), p_id_usuario, p_id_proposta);

        UPDATE OpcoesResposta SET qtVotos_proposta = qtVotos_proposta + 1 WHERE id_opcoesResposta = p_id_opcoesResposta;
    
    END IF;
    COMMIT;
END;
//
DELIMITER ;

