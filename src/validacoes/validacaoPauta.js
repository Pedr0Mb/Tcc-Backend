import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })

export const SchemaPesquisarPauta = z.object({
    titulo: z
    .string({ required_error: mensagens.campo }) 
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
    .nullable()
    .optional(),
      
     status: z
    .string({ required_error: mensagens.campo })
    .enum(['Ativo','Inativo'], {message: 'Opção de status invalido '})
    .nullable()
    .optional(),
})

export const SchemaVisualizarPauta = z.object({
    idPauta: idSchema
})

export const SchemaCriarPauta = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),

    descricao: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Descricão deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Descricão deve conter no máximo 50 caractéres' }),

    justificativa: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Justificativa deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Justificativa deve conter no máximo 50 caractéres' }),

    dataLimite: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    // Falta Validar as imagens
})

export const SchemaAlterarPauta = z.object({
    idPauta: idSchema,

    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),

    descricao: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Descricão deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Descricão deve conter no máximo 50 caractéres' }),

    justificativa: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Justificativa deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Justificativa deve conter no máximo 50 caractéres' }),

    dataLimite: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    status: z
    .string({ required_error: mensagens.campo })
    .enum(['Ativo','Inativo'], {message: 'Opção de status invalido '})
    
    // Falta Validar as imagens
})

export const SchemaDeletarPauta = z.object({
    idPauta: idSchema,
  
    motivoRemocao: z
    .string({ required_error: mensagens.campo})
    .min(30, {message: 'Motivo remoção deve conter no mínimo 30 caracteres'})
    .max(256, {message: 'Motivo remoção deve conter no maximo 256 caracteres'}),
  })
  

