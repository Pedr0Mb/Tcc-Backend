import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message: mensagens.dado })

export const valPesquisarUsuario = z.object({
    nomeUsuario: z
    .string({ required_error: mensagens.campo })
    .max(150, { message: mensagens.dado })
    .nullable()
    .optional(),

     cpfUsuario: z
    .string({ required_error: mensagens.campo })
    .length(11, { message: mensagens.dado })
    .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" })
    .nullable()
    .optional(),

    cargoUsuario: z
    .string({ required_error: mensagens.campo })
    .max(25, { message: mensagens.dado })
    .nullable()
    .optional()
})

export const valVisualizarUsuario = z.object({
  idUsuario: idSchema
})

export const valPromoverUsuario = z.object({
  idUsuario: idSchema
})

