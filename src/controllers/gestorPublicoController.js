import { db } from '../plugins/bd.js'
import * as validacaoGestor from '../validacoes/validacaoGestor.js'

export async function pesquisarUsuario(req,res) {
  try{
    const data = {
      nomeUsuario: req.query.nome || null,
      cpfUsuario: req.query.cpf || null,
      cargoUsuario: req.query.cargo || null
    }

    const { nomeUsuario, cpfUsuario, cargoUsuario } = validacaoGestor.SchemaPesquisarUsuario.parse(data)

    const [resultado] = await db.query('CALL pesquisarUsuarios(?,?,?)', [nomeUsuario,cpfUsuario,cargoUsuario])
   
    const usuarios = resultado[0] || []

    if(usuarios.length === 0) return res.status(404).json({ message: 'Usuario não encontrado'})

    return res.status(200).json(usuarios)

  }catch(erro){
    console.error('Erro ao pesquisar usuario: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar usuario'})
  }
}

export async function visualizarUsuario(req,res) {
  try{
    const data = { cpf: req.body.cpf };

    const { cpf } = validacaoGestor.SchemaVisualizarUsuario.parse(data);

    const [usuarios] = await db.query('SELECT id_usuario FROM Usuario WHERE cpf_usuario = ?', [cpf])

    if (usuarios.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' })
    
    const idUsuario = usuarios[0].id_usuario

    const [resultado] = await db.query('CALL visualizarUsuario(?)', [idUsuario])

    const usuario = resultado[0] || []
  
    return res.status(200).json(usuario)

  }catch(erro){
    console.error('Erro ao visualizar usuario: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o usuario'})
  }
}

export async function promoverUsuario(req,res) {
  try{
    const data = {
      cpf: req.body.cpf,
      cargo: req.body.cargo,
      secretaria: req.body.secretaria,
      permissoes: req.body.permissoes 
    }

    const {cpf, cargo, secretaria, permissoes } = validacaoGestor.SchemaCriarUsuario.parse(data);

    await db.query(`
      UPDATE Usuario 
      SET cargo_usuario = ?,
      secretaria_usuario = ?
      WHERE cpf_usuario = ?`, [cargo , secretaria, cpf]);

    const [usuarios] = await db.query('SELECT id_usuario FROM Usuario WHERE cpf_usuario = ?', [cpf]);

    if (usuarios.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    const idUsuario = usuarios[0].id_usuario;

    await db.query('DELETE FROM PermissaoUsuario WHERE id_usuario = ?', [idUsuario]);

    const values = permissoes.map(permissao => [idUsuario, permissao]);

    await db.query('INSERT INTO PermissaoUsuario (id_usuario, permissao) VALUES ?', [values]);

    return res.status(200).json({ message: 'Usuario promovido'});

  }catch(erro){
    console.error('Erro ao promover usuario: ',erro)
    return res.status(500).send({ error: 'Erro ao promover o usuario'})
  }
}