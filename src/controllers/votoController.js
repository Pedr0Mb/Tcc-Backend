import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function ListarVoto(req,res) {
    try{
        const [votos] = await db.query(
          `SELECT id_voto, 
          hash_voto, 
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
  const {idProposta} = req.body
  const idUsuario = req.usuario.id
    
  if(!idProposta ) return res.status(400).json({ message: 'Preencha todos os campos'})
      
  try{
      await db.query('CALL registrarVoto(?, ?)', [idUsuario, idProposta]);
        
    await registrarAtividade('voto_registrado','Voto registrado',null,idUsuario)
        
    return res.status(201).json({ message: 'Voto registrado com sucesso'})
        
  }catch(erro){
    console.error('Erro ao registrar voto: ',erro)
    return res.status(500).json({ error: 'Erro ao registrar voto'})
  }
}
    
