import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoVotacao from '../validacoes/validacaoVotacao.js'

export async function ListarVoto(req,res) {
    try{
        const [votos] = await db.query(
          `SELECT id_voto, 
          data_voto, 
          id_usuario 
          FROM Voto`
        )

        return res.status(200).json(votos)

    }catch(erro){
        console.error('Erro ao listar os votos:', erro)
        res.status(500).json({ error: 'Erro interno ao listar votos'})
    }
}

export async function RegistrarVoto(req,res) {
  try{
    const idUsuario = req.usuario.id

    const data = {idProposta: Number(req.body.idProposta)}

    const { idProposta } = validacaoVotacao.SchemaRegistrarVoto.parse(data);

    await db.query('CALL registrarVoto(?, ?)', [idUsuario, idProposta]);
        
    await registrarAtividade('voto_registrado','Voto registrado',null,idUsuario)
        
    return res.status(201).json({ message: 'Voto registrado com sucesso'})
        
  }catch(erro){
    console.error('Erro ao registrar voto: ',erro)
    return res.status(500).json({ error: 'Erro ao registrar voto'})
  }
}
    
