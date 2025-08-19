import { db } from '../plugins/bd.js'
import * as validacaoGestor from '../validacoes/validacaoGestor.js'

export async function PesquisarUsuario(req,res) {
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

export async function VisualizarUsuario(req,res) {
  try{
    const data = { idUsuario: Number(req.params.id) };

    const { idUsuario } = validacaoGestor.SchemaVisualizarUsuario.parse(data);

    const [resultado] = await db.query('CALL visualizarUsuario(?)', [idUsuario])

    const usuario = resultado[0] || []
  
    return res.status(200).json(usuario)

  }catch(erro){
    console.error('Erro ao visualizar usuario: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o usuario'})
  }
}

export async function PromoverUsuario(req,res) {
  try{
    const data = { cpfUsuario: req.params.cpf };

    const { cpfUsuario } = validacaoGestor.SchemaPromoverUsuario.parse(data);

    await db.query('UPDATE Usuario SET cargo_usuario = ? WHERE id_usuario = ?', ['GestorPublico',cpfUsuario])
  
    return res.status(200).json({ message: 'Usuario promovido para Gestor Público'})

  }catch(erro){
    console.error('Erro ao promover usuario: ',erro)
    return res.status(500).send({ error: 'Erro ao promever o usuario'})
  }
}