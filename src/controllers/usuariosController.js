import { db } from '../plugins/bd.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = 'chave'

export async function criarUsuario(req,res) {
    const { nome, senha, cpf, email, nivel } = req.body;

    if (!nome || !senha || !email || !cpf || !nivel) return res.status(400).json({ message: 'Preencha todos os campos'})
    
    if(senha.length < 6) return res.status(400).json({ message: 'Senha tem que ter no mínimo 6 caracteres'})

    try{
        const senhaCript = await bcrypt.hash(senha, 10);
        
        await db.query(
            `INSERT INTO Usuario (
            nm_usuario,
            email_usuario,
            senha_usuario,
            nivel_usuario,
            cpf_usuario,
            cargo_usuario ) 
            VALUES (?, ?, ?, ?, ?, 'cidadao')`,
            [nome, email, senhaCript, nivel, cpf]
        );

        return res.status(201).json({ message: 'Usuario Cadastrado Com sucesso'})

    }catch(error){
        console.error('Erro ao criar o usuario: ',error)
        return res.status(500).send({ error: 'Erro interno ao criar Usuario'})
    }
}

export async function LogarUsuario(req,res) {
    const { cpf, senha} = req.body

    try{
        if (!cpf || !senha){
            return res.status(400).json({ message: 'Preencha todos os campos'})
        }
    
         const [resultado] = await db.query('SELECT * FROM Usuario WHERE cpf_usuario = ?', [cpf])
    
        if (resultado.length === 0) return res.status(404).json({ message: 'Usuário não encontrado'});
    
         const usuario = resultado[0]
         const VerificarSenha = await bcrypt.compare(senha, usuario.senha_usuario)
    
         if (!VerificarSenha) return res.status(401).json({ message: 'Senha incorreta'})
        
         const token = jwt.sign(
            { id: usuario.id_usuario, cargo: usuario.cargo_usuario}, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
    
        return res.json({token});

    }catch(erro){
        console.error('Erro ao logar Usuario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao logar Usuario'})
    }
}

export async function VerMeuUsaurio(req,res) {
    const id = req.usuario.id

    try{
        const [resultado] = await db.query('CALL visualizarUsuario(?)',[id])

        const usuario = resultado[0] 
  
        return res.status(200).json(usuario)

    }catch(erro){
        console.error('Erro ao Visualizar Usuario: ',erro)
        return res.status(400).json({ error: 'Erro interno ao visualizar o Usuario'})
    }
}