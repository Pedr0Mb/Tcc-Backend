import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function PesquisarTransmissao(req,res) {
  const {titulo ,status} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarTransmissao(?,?)', [titulo,status])

    const transmissoes = resultado[0] || [];

    if(transmissoes.length == 0) return res.status(404).json({ message: 'Transmissao não encontrada'})
  
    return res.status(200).json(transmissoes)

  }catch(erro){
    console.error('Erro ao pesquisar Transmissao: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar Transmissao'})
  }
}

export async function VisualizarTransmissao(req,res) {
  const id = req.params.id

  try{
    const [resultado] = await db.query('CALL visualizarTransmissao(?)', [id])

    const transmissao = resultado[0] || []
  
    return res.status(200).json(transmissao)

  }catch(erro){
    console.error('Erro ao visualizar Transmissao: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o Transmissao'})
  }
}

export async function CriarTransmissao(req,res) {
    const {titulo, subTitulo,  dataInicio, breveDescritivo, link, midia} = req.body
    const idGestor = req.usuario.id

    const dtInicio = new Date(dataInicio)

    try{
        await db.query(
          `INSERT INTO Transmissao (
            titulo_transmissao,
            subTitulo_transmissao,
            status_transmissao,
            dataPublicacao_transmissao,
            dataInicio_transmissao,
            breveDescritivo_transmissao,
            link_transmissao,
            midia_transmissao,
            id_usuario,) 
          VALUES (?, ?, 'Agendada', NOW(), ?, ?, ?, ?, ?)`,
          [titulo, subTitulo, dtInicio, breveDescritivo, link, midia, idGestor]
        );

        await registrarAtividade('transmissao_criada', 'Transmissao criada', null, idGestor)

        return res.status(200).json({ message: 'Transmissao criada com sucesso'})

    }catch(erro){
        console.error('Erro ao criar Transmissao: ',erro)
        return res.status(500).json({ error: 'Erro ao criar Transmissao'})
    }
}

export async function AlterarTransmissao(req,res) {
    const {titulo, subTitulo, status, dataInicio, breveDescritivo, link, midia} = req.body
    const idGestor = req.usuario.id

    const dtInicio = new Date(dataInicio)

    try{
        await db.query(
          `UPDATE Transmissao
          SET titulo_transmissao = ?,
          subTitulo_transmissao = ?,
          status_transmissao = ?,
          dataInicio_transmissao = ?,
          breveDescritivo_transmissao = ?,
          link_transmissao = ?,
          midia_transmissao = ?,
          WHERE id_transmissao = ?`, 
          [titulo, subTitulo, status, dtInicio, breveDescritivo, link, midia]
        )

        await registrarAtividade('transmissao_alterada', 'Transmissao alterada', null, idGestor)
        
        return res.status(200).json({ message: 'Transmissao atualizada com sucesso'})
        
      }catch(erro){
        console.error('Erro ao atualizar Transmissao: ',erro)
        return res.status(500).json({ error: 'Erro ao atualizar Transmissao'})
      }
    }
    
    export async function DeletarTransmissao(req,res) {
      const {id,motivoRemocao} = req.body
      const idGestor = req.usuario.id
      
      try{
        await db.query('DELETE FROM Transmissao WHERE id_transmissao = ?', [id])
        
        await registrarAtividade('transmissao_removida', motivoRemocao, null, idGestor)

        return res.status(200).json({ message: 'Transmissao deletada com sucesso'})

    }catch(erro){
        console.error('Erro ao deletar Transmissao: ',erro)
        return res.status(500).json({ error: 'Erro ao deletar Transmissao'})
    }
}