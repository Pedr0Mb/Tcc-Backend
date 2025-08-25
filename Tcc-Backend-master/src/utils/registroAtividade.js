import { db } from '../plugins/bd.js'

export async function registrarAtividade(tipo, descricao, link = null, idUsuario) {
    try {
        await db.query('INSERT INTO RegistroAtividade VALUES (null, ?, ?, ?, NOW(), ?)', [tipo, descricao, link, idUsuario]);
    
    } catch (error) {
        console.error('Erro ao registrar atividade:', error)
    }
}
