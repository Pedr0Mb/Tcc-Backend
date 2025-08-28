import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

export const SchemaCriarUsuario = z.object({
    nome: z
    .string({ required_error: mensagens.campo })
    .max(150, { message: 'Nome deve conter no máximo 150 caractéres'}),
    
    email: z
    .string({ required_error: mensagens.campo })
    .email({ message: 'Email com formato inválido' })   
    .max(256, { message: 'Email deve conter no máximo 256 caractéres'}),

    senha: z
    .string({required_error: mensagens.campo})
    .min(6,{message: 'Senha deve ter no mínimo 6 caractéres'}),

    cpfUsuario: z
    .string({ required_error: mensagens.campo })
    .length(11, { message: "CPF deve conter 11 digitos" })
    .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" }),

    telefone: z
    .string({ required_error: mensagens.campo })
    .length(13, { message: "Telefone deve conter 13 digitos" })
    .regex(/^\d{11}$/, { message: "Telefone deve conter apenas números" })

})

export const SchemaLogarUsuario = z.object({
    cpfUsuario: z
    .string({ required_error: mensagens.campo })
    .length(11, { message: "CPF deve conter 11 digitos" })
    .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" }),

    senha: z
    .string({required_error: mensagens.campo})
    .min(6,{message: 'Senha deve ter no mínimo 6 caractéres'}),

})


