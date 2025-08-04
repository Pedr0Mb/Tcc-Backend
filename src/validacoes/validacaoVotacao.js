import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })
  
export const valPesquisarVotacao = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
    .nullable()
    .optional(),
      
     tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde'],{message: 'Opção de tema invalido '})
    .nullable()
    .optional(),

     status: z
    .string({ required_error: mensagens.campo })
    .enum(['Agendada','Em andamento','Encerrada'], {message: 'Opção de status invalido '})
    .nullable()
    .optional(),
})
    
export const valvisualizarVotacao = z.object({
    idVotacao: idSchema
})

export const valCriarVotacao = z.object({
   titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no máximo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
      
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde'], {message: 'Opção de tema invalido '}),

    breveDescritivo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Breve descritivo deve conter no máximo 30 caractéres' })   
    .max(256, { message: 'Breve descritivo deve conter no máximo 256 caractéres' }),

    publicoAlvo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Público Alvo deve conter no máximo 30 caractéres' })   
    .max(256, { message: 'Público Alvo deve conter no máximo 256 caractéres' }),
    
    orcamento: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Orçamento deve conter no máximo 30 caractéres' })   
    .max(256, { message: 'Orçamento deve conter no máximo 256 caractéres' }),

    dataFim: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    breveDescritivo: z
    .string({ required_error: mensagens.campo})
    .min(30, {message: 'Breve descritivo deve conter no minímo 30 caracteres'})
    .max(256, {message: 'Breve descritivo deve conter no maximo 256 caracteres'}),

    resultado: z
    .string({ required_error: mensagens.campo})
    .max(100, {message: 'Resultado deve conter no maximo 100 caracteres'}),

    // Falta Validar as imagens e opções resposta
})

// Alterar as coisas em baixo
export const valterarVotacao = z.object({
  idNoticia: idSchema,
  
  titulo: z
  .string({ required_error: mensagens.campo })
  .min(10, { message: 'Titulo deve conter no máximo 10 caractéres' })   
  .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
    
   tema: z
  .string({ required_error: mensagens.campo })
  .enum(['Educação','Segurança','Cultura','Saúde'], {message: 'Opção de tema invalido '}),

  dataLimite: z
  .date({required_error: mensagens.campo})
  .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

  status: z
  .string({ required_error: mensagens.campo })
  .enum(['Ativo','Inativo'], {message: 'Opção de status invalido '}),
  
  breveDescritivo: z
  .string({ required_error: mensagens.campo})
  .min(30, {message: 'Breve descritivo deve conter no minímo 30 caracteres'})
  .max(256, {message: 'Breve descritivo deve conter no maximo 256 caracteres'}),

  link: z
  .string({required_error: mensagens.campo})
  .url({message: 'Link com formato invalido'}),

  // Falta Validar as imagens
})

export const valdeletarVotacao = z.object({
  idComentario: idSchema,

  motivoRemocao: z
  .string({ required_error: mensagens.campo})
  .min(30, {message: 'Motivo remoção deve conter no minímo 30 caracteres'})
  .max(256, {message: 'Motivo remoção deve conter no maximo 256 caracteres'}),
})
