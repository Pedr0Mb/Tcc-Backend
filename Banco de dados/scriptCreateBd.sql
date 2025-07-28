CREATE DATABASE participacaoCidadaBd;
USE participacaoCidadaBd;

CREATE TABLE Usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nm_usuario VARCHAR(100) NOT NULL,
  email_usuario VARCHAR(100) NOT NULL,
  senha_usuario TEXT NOT NULL,
  nivel_usuario VARCHAR(40) NOT NULL,
  cpf_usuario VARCHAR(11) NOT NULL,
  cargo_usuario VARCHAR(25) NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE (cpf_usuario)
);

INSERT INTO Usuario VALUES (null, 'adm', 'adm@gmail', '$2b$10$EnUaPQve1AoLkdMUwja2aubsEp/47g3y0uhX1Tkgi8VNgA0gx5Jq6', 'cidadao', '12345678601', "Administrador");

CREATE TABLE Votacao (
  id_votacao INT NOT NULL AUTO_INCREMENT,
  titulo_votacao VARCHAR(100) NOT NULL,
  descricao_votacao TEXT NOT NULL,
  dataInicio_votacao DATETIME NOT NULL,
  dataFim_votacao DATETIME NOT NULL,
  status_votacao VARCHAR(30) NOT NULL,
  resultado_votacao VARCHAR(100) DEFAULT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_votacao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Proposta (
  id_proposta INT NOT NULL AUTO_INCREMENT,
  titulo_proposta VARCHAR(100) NOT NULL,
  descricao_proposta TEXT NOT NULL,
  criador_proposta VARCHAR(100) NOT NULL,
  qtVotos_proposta INT NOT NULL DEFAULT 0,
  id_votacao INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_proposta),
  FOREIGN KEY (id_votacao) REFERENCES Votacao(id_votacao) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Voto (
  id_voto INT NOT NULL AUTO_INCREMENT,
  hash_voto VARCHAR(256) NOT NULL UNIQUE,
  data_voto DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  id_proposta INT NOT NULL,
  PRIMARY KEY (id_voto),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_proposta) REFERENCES Proposta(id_proposta) ON DELETE CASCADE
);

CREATE TABLE RegistroAtividade (
  id_registroAtividade INT NOT NULL AUTO_INCREMENT,
  tipo_atividade VARCHAR(45) NOT NULL,
  descricao_atividade TEXT,
  link_atividade TEXT,
  date_atividade DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_registroAtividade),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Noticia (
  id_noticia INT NOT NULL AUTO_INCREMENT,
  titulo_noticia VARCHAR(100) NOT NULL,
  dataPublicacao_noticia DATETIME NOT NULL,
  corpo_noticia TEXT NOT NULL,
  link_noticia TEXT NOT NULL,
  midia_noticia TEXT,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_noticia),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Transmissao (
  id_transmissao INT NOT NULL AUTO_INCREMENT,
  titulo_transmissao VARCHAR(100) NOT NULL,
  dataInicio_transmissao DATETIME NOT NULL,
  descricao_transmissao TEXT NOT NULL,
  link_transmissao TEXT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_transmissao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Pauta (
  id_pauta INT NOT NULL AUTO_INCREMENT ,
  titulo_pauta VARCHAR(100) NOT NULL,
  descricao_pauta TEXT NOT NULL,
  justificativa_pauta VARCHAR(100) NOT NULL,
  dataPublicacao_pauta DATETIME NOT NULL,
  status_pauta VARCHAR(25) NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_pauta),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Comentario (
  id_comentario INT NOT NULL AUTO_INCREMENT,
  texto_comentario TEXT NOT NULL,
  dataPublicacao_comentario DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  id_pauta INT NOT NULL,
  PRIMARY KEY (id_comentario),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_pauta) REFERENCES Pauta(id_pauta) ON DELETE CASCADE
);

CREATE TABLE Notificacao (
  id_notificacao INT NOT NULL AUTO_INCREMENT,
  titulo_notificacao VARCHAR(100) NOT NULL,
  tipo_notificacao VARCHAR(50) NOT NULL,
  conteudo_notificacao TEXT NOT NULL,
  dataEnvio_notificacao DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_notificacao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

