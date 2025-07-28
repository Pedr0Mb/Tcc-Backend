import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function ListarTransmissoes(req,res) {
    try {
    const [transmissoes] = await db.query(
      `SELECT id_transmissao,
      titulo_transmissao, 
      dataPublicacao_transmissao, 
      descricao_transmissao, 
      link_transmissao 
      FROM Transmissao`
    )
    
    return res.status(200).json(transmissoes)

  } catch (erro) {
    console.error('Erro ao listar as notícias:', erro)
    res.status(500).json({ error: 'Erro interno ao listar notícias'})
  }
}

export async function PesquisarTransmissao(req,res) {
  const {titulo ,idUsuario} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarTransmissao(?,?)', [titulo,idUsuario])

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
    const {titulo, dataInicio, descricao, link} = req.body
    const idGestor = req.usuario.id

    if(!titulo || !dataInicio || !descricao || !link) return res.status(400).json({ message: 'Preencha todos os campos'})

    try{
        await db.query(
          `INSERT INTO Transmissao (
          titulo_transmissao,
          dataPublicacao_transmissao,
          descricao_transmissao,
          link_transmissao,
          id_usuario) 
          VALUES (?, ?, ?, ?, ?)`,
          [titulo, dataInicio, descricao, link, idGestor]
        );

        await registrarAtividade('transmissao_criada', 'Transmissao criada', null, idGestor)

        return res.status(200).json({ message: 'Transmissao criada com sucesso'})

    }catch(erro){
        console.error('Erro ao criar Transmissao: ',erro)
        return res.status(500).json({ error: 'Erro ao criar Transmissao'})
    }
}

export async function AlterarTransmissao(req,res) {
    const {id,titulo,dataInicio,descricao, link} = req.body
    const idGestor = req.usuario.id

    if(!id || !titulo || !dataInicio || !descricao || !link) return res.status(400).send({ message: 'Preencha todos os campos'})

    try{
        await db.query(
          `UPDATE Transmissao
          SET titulo_transmissao = ?, 
          dataInicio_transmissao = ?, 
          descricao_transmissao = ?, 
          link_transmissao = ? 
          WHERE id_transmissao = ?`, 
          [titulo, dataInicio, descricao,link,id]
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