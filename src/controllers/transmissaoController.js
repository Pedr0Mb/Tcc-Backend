import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoTransmissao from '../validacoes/validacaoTransmissao.js'

export async function pesquisarTransmissao(req,res) {
  try{
    const data = {
      titulo: req.body.titulo || null,
      status: req.body.status || null
    }

    const { titulo, status } = validacaoTransmissao.SchemaPesquisarTransmissao.parse(data)

    const [resultado] = await db.query('CALL pesquisarTransmissao(?,?)', [titulo,status])

    const transmissoes = resultado[0] || [];

    if(transmissoes.length == 0) return res.status(404).json({ message: 'Transmissao não encontrada'})
  
    return res.status(201).json(transmissoes)

  }catch(error){
    console.error('Erro ao pesquisar Transmissao: ',error)
    return res.status(500).json({ error: 'Erro ao pesquisar Transmissao'})
  }
}

export async function visualizarTransmissao(req,res) {
  try{
    const data = { id: Number(req.params.id) }

    const { id } = validacaoTransmissao.SchemaVisualizarTransmissao.parse(data);

    const [resultado] = await db.query('CALL visualizarTransmissao(?)', [id])

    const transmissao = resultado[0] || []
  
    return res.status(201).json(transmissao)

  }catch(error){
    console.error('Erro ao visualizar Transmissao: ',error)
    return res.status(500).json({ error: 'Erro ao visualizar o Transmissao'})
  }
}

export async function criarTransmissao(req,res) {
  try{
      const idGestor = req.usuario.id

      const data = {
        titulo: req.body.titulo,
        subTitulo: req.body.subTitulo,
        dataInicio: new Date(req.body.dataInicio),
        breveDescritivo: req.body.breveDescritivo,
        link: req.body.link,
        imagem: req.body.midia || null,
      }

      const { titulo, subTitulo, dataInicio, breveDescritivo, link, imagem } = validacaoTransmissao.SchemaCriarTransmissao.parse(data);

      await db.query(
        `INSERT INTO Transmissao (
          titulo_transmissao,
          subTitulo_transmissao,
          status_transmissao,
          dataPublicacao_transmissao,
          dataInicio_transmissao,
          breveDescritivo_transmissao,
          link_transmissao,
          imagem_transmissao,
          id_usuario
          ) 
        VALUES (?, ?, 'Agendada', NOW(), ?, ?, ?, ?, ?)`,
          [titulo, subTitulo, dataInicio, breveDescritivo, link, imagem, idGestor]
        );

        await registrarAtividade('transmissao_criada', 'Transmissao criada', null, idGestor)

        return res.status(201).json({ message: 'Transmissao criada com sucesso'})

    }catch(error){
        console.error('Erro ao criar Transmissao: ',error)
        return res.status(500).json({ error: 'Erro ao criar Transmissao'})
    }
}

export async function alterarTransmissao(req,res) {
  try{
      const idGestor = req.usuario.id

      const data = {
        idTransmissao: Number(req.body.id),
        titulo: req.body.titulo,
        subTitulo: req.body.subTitulo,
        status: req.body.status,
        dataInicio: new Date(req.body.dataInicio),
        breveDescritivo: req.body.breveDescritivo,
        link: req.body.link,
        imagem: req.body.imagem || null,
      }

      const { idTransmissao, titulo, subTitulo, status, dataInicio, breveDescritivo, link, imagem } = validacaoTransmissao.SchemaAlterarTransmissao.parse(data);

        await db.query(
          `UPDATE Transmissao
          SET titulo_transmissao = ?,
          subTitulo_transmissao = ?,
          status_transmissao = ?,
          dataInicio_transmissao = ?,
          breveDescritivo_transmissao = ?,
          link_transmissao = ?,
          imagem_transmissao = ?,
          WHERE id_transmissao = ?`, 
          [titulo, subTitulo, status, dataInicio, breveDescritivo, link, imagem, idTransmissao]
        )

        await registrarAtividade('transmissao_alterada', 'Transmissao alterada', null, idGestor)
        
        return res.status(201).json({ message: 'Transmissao atualizada com sucesso'})
        
      }catch(error){
        console.error('Erro ao atualizar Transmissao: ',error)
        return res.status(500).json({ error: 'Erro ao atualizar Transmissao'})
      }
    }
    
    export async function deletarTransmissao(req,res) {
      try{
        const idGestor = req.usuario.id

        const data = { 
          id: Number(req.body.id), 
          motivoRemocao: req.body.motivoRemocao 
        }

        const { id, motivoRemocao } = validacaoTransmissao.SchemaDeletarTransmissao.parse(data);

        await db.query('DELETE FROM Transmissao WHERE id_transmissao = ?', [id])
        
        await registrarAtividade('transmissao_removida', motivoRemocao, null, idGestor)

        return res.status(201).json({ message: 'Transmissao deletada com sucesso'})

    }catch(error){
        console.error('Erro ao deletar Transmissao: ',error)
        return res.status(500).json({ error: 'Erro ao deletar Transmissao'})
    }
}