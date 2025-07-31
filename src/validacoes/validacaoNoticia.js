import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message: mensagens.dado })
  
export const valPesquisarNoticia = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: mensagens.dado })   
    .max(100, { message: mensagens.dado })
    .nullable()
    .optional(),
      
    idGestor: idSchema.nullable().optional()
})
    
export const valvisualizarNoticia = z.object({
    idComentario: idSchema
})

export const valCriarNoticia = z.object({
  titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: mensagens.dado })
    .max(100, { message: mensagens.dado }),

   corpo: z
    .string({ required_error: mensagens.campo })
    .min(150, {message: mensagens.dado}),

    link: z
    .string({ required_error: mensagens.campo }),

    midia: z
    .string({ required_error: mensagens.campo })
    .nullable()
    .optional(),

  idComentario: idSchema
})

export const valterarNoticia = z.object({
  titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: mensagens.dado })
    .max(100, { message: mensagens.dado }),

   corpo: z
    .string({ required_error: mensagens.campo })
    .min(150, {message: mensagens.dado}),

    link: z
    .string({ required_error: mensagens.campo }),

    midia: z
    .string({ required_error: mensagens.campo })
    .nullable()
    .optional(),

  idComentario: idSchema
})
