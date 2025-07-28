/*Principais Selects do Banco de Dados*/

/*Usuários*/

DROP PROCEDURE IF EXISTS pesquisarUsuarios;
DELIMITER //
CREATE PROCEDURE pesquisarUsuarios(IN nomeUsuario VARCHAR(100), IN cpfUsuario VARCHAR(11), IN cargoUsuario VARCHAR(40))
BEGIN
    SELECT nm_usuario, cpf_usuario, email_usuario, cargo_usuario FROM Usuario
    WHERE (nomeUsuario IS NULL OR nm_usuario LIKE CONCAT('%', nomeUsuario, '%'))
      AND (cpfUsuario IS NULL OR cpf_usuario = cpfUsuario)
      AND (cargoUsuario IS NULL OR cargo_usuario = cargoUsuario)
    ORDER BY nm_usuario;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarUsuario;
DELIMITER //
CREATE PROCEDURE visualizarUsuario(IN idUsuario INT)
BEGIN
    SELECT * FROM Usuario WHERE id_usuario = idUsuario;
END //
DELIMITER ;

/*Votações*/

DROP PROCEDURE IF EXISTS pesquisarVotacoes;
DELIMITER //
CREATE PROCEDURE pesquisarVotacoes(IN tituloVotacao VARCHAR(100), IN statusVotacao VARCHAR(30), IN idVotacao INT)
BEGIN
    SELECT id_votacao, titulo_votacao, dataInicio_votacao, dataFim_votacao, status_votacao, resultado_votacao FROM Votacao
    WHERE (statusVotacao IS NULL OR status_votacao = statusVotacao)
      AND (idVotacao IS NULL OR id_votacao = idVotacao)
      AND (tituloVotacao IS NULL OR titulo_votacao LIKE CONCAT('%',tituloVotacao,'%'))
    ORDER BY dataInicio_votacao DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarVotacao;
DELIMITER //
CREATE PROCEDURE visualizarVotacao(IN p_idVotacao INT)
BEGIN
    SELECT id_votacao, titulo_votacao, descricao_votacao, dataInicio_votacao, dataFim_votacao, status_votacao, resultado_votacao
    FROM Votacao
    WHERE id_votacao = p_idVotacao;

    SELECT id_proposta, titulo_proposta, descricao_proposta, qtVotos_proposta
    FROM Proposta
    WHERE id_votacao = p_idVotacao
    ORDER BY qtVotos_proposta DESC;
END //
DELIMITER ;
/*Propostas*/

DROP PROCEDURE IF EXISTS visualizarProposta;
DELIMITER //
CREATE PROCEDURE visualizarProposta(IN idProposta INT)
BEGIN
    SELECT * FROM Proposta WHERE id_proposta = idProposta;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS pesquisarPropostas;
DELIMITER //
CREATE PROCEDURE pesquisarPropostas(IN tituloProposta VARCHAR(100), IN idVotacao INT)
BEGIN
    SELECT  id_proposta,
          titulo_proposta, 
          descricao_proposta, 
          criador_proposta, 
          qtVotos_proposta  FROM Proposta 
    WHERE (idVotacao IS NULL OR id_votacao = idVotacao)
    AND (tituloProposta IS NULL OR titulo_proposta LIKE CONCAT('%',tituloProposta,'%'))
    ORDER BY qtVotos_proposta DESC;
END //
DELIMITER ;

/*Noticias*/

DROP PROCEDURE IF EXISTS pesquisarNoticias;
DELIMITER //
CREATE PROCEDURE pesquisarNoticias(IN titulo VARCHAR(100), IN id_gestor INT)
BEGIN
    SELECT id_noticia, titulo_noticia, dataPublicacao_noticia, midia_noticia FROM Noticia
    WHERE (titulo IS NULL OR titulo_noticia LIKE CONCAT('%', titulo, '%'))
      AND (id_gestor IS NULL OR id_usuario = id_gestor)
    ORDER BY dataPublicacao_noticia DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarNoticias;
DELIMITER //
CREATE PROCEDURE visualizarNoticias(IN idNoticia INT)
BEGIN
    SELECT * FROM Noticia WHERE id_noticia = idNoticia;
END //
DELIMITER ;


/*Transmissões*/

DROP PROCEDURE IF EXISTS pesquisarTransmissao;
DELIMITER //
CREATE PROCEDURE pesquisarTransmissao(IN titulo VARCHAR(100), IN idusuario INT)
BEGIN
    SELECT id_transmissao, titulo_transmissao, dataPublicacao_transmissao FROM Transmissao
    WHERE (titulo IS NULL OR titulo_transmissao LIKE CONCAT('%', titulo, '%'))
      AND (idusuario IS NULL OR idusuario = id_usuario)
    ORDER BY dataPublicacao_transmissao DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarTransmissao;
DELIMITER //
CREATE PROCEDURE visualizarTransmissao(IN idTransmissao INT)
BEGIN
    SELECT * FROM Transmissao WHERE id_transmissao = idTransmissao;
END //
DELIMITER ;

/*Notificações*/

DROP PROCEDURE IF EXISTS pesquisarNotificacoes;
DELIMITER //
CREATE PROCEDURE pesquisarNotificacoes(IN idUsuario INT)
BEGIN
    SELECT * FROM Notificacao WHERE id_usuario = idUsuario ORDER BY dataEnvio_notificacao DESC;
END //
DELIMITER ;

/*Registro de Atividade*/

DROP PROCEDURE IF EXISTS visualizarHistorico;
DELIMITER //
CREATE PROCEDURE visualizarHistorico(IN idUsuario INT, IN data_inicio DATETIME, IN tipoAtividade VARCHAR(45))
BEGIN
    SELECT date_atividade, tipo_atividade, descricao_atividade, link_atividade FROM RegistroAtividade
    WHERE id_usuario = idUsuario
      AND (data_inicio IS NULL OR date_atividade BETWEEN data_inicio AND NOW())
      AND (tipoAtividade IS NULL OR tipo_atividade = tipoAtividade)
    ORDER BY date_atividade DESC;
END //
DELIMITER ;

/*Pautas*/

DROP PROCEDURE IF EXISTS pesquisarPautas;
DELIMITER //
CREATE PROCEDURE pesquisarPautas(IN idUsuario INT, IN tituloPauta VARCHAR(100))
BEGIN
    SELECT id_pauta, titulo_pauta, dataPublicacao_pauta, id_usuario FROM Pauta 
    WHERE (idUsuario IS NULL OR id_usuario = idUsuario)
      AND (tituloPauta IS NULL OR titulo_pauta LIKE CONCAT('%',tituloPauta,'%'))
    ORDER BY dataPublicacao_pauta DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarPauta;
DELIMITER //
CREATE PROCEDURE visualizarPauta(IN idPauta INT)
BEGIN
    SELECT 
        id_pauta, 
        titulo_pauta, 
        descricao_pauta, 
        justificativa_pauta, 
        dataPublicacao_pauta, 
        status_pauta
    FROM Pauta
    WHERE id_pauta = idPauta;

    SELECT 
        c.id_comentario, 
        c.texto_comentario, 
        c.dataPublicacao_comentario, 
        c.id_usuario AS autor_comentario
    FROM Comentario c
    WHERE c.id_pauta = idPauta
    ORDER BY c.dataPublicacao_comentario DESC;
END //
DELIMITER ;

/*Cometários*/

-- Procedure para pesquisar comentários
DROP PROCEDURE IF EXISTS visualizarComentario;
DELIMITER //
CREATE PROCEDURE visualizarComentario( IN idComentario INT)
BEGIN
  SELECT 
    id_comentario, texto_comentario, dataPublicacao_comentario, id_usuario, id_pauta
  FROM Comentario
  WHERE (idComentario IS NULL OR id_comentario = idComentario);
END //
DELIMITER ;

