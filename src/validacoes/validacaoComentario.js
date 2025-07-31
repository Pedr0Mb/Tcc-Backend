import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message: 'Id deve ter valor positivo' })

export const valvisualizarComentario = z.object({
  idComentario: idSchema
})

export const valCriarComentario = z.object({
  texto: z
    .string({ required_error: mensagens.campo })
    .max(256, { message: 'Texto deve conter no máximo 256 caractéres' }),

  idPauta: idSchema
})

export const valAlterarComentario = z.object({
  texto: z
    .string({ required_error: mensagens.campo })
    .max(256, { message: 'Texto deve conter no máximo 256 caractéres' }),
  
  idComentario: idSchema
})

export const valDeletarComentario = z.object({
  motivoRemocao: z
    .string({ required_error: mensagens.campo })
    .max(256, { message: 'Motivo Remoção deve conter no máximo 256 caractéres' }),

  idComentario: idSchema
})
