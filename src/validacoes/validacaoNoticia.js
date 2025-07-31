import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })
  
export const valPesquisarNoticia = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no máximo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
    .nullable()
    .optional(),
      
     tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde'])
    .nullable()
    .optional(),

     status: z
    .string({ required_error: mensagens.campo })
    .enum(['Ativo','Inativo'], {message: 'Opção de status invalido '})
    .nullable()
    .optional(),
})
    
export const valvisualizarNoticia = z.object({
    idComentario: idSchema
})

export const valCriarNoticia = z.object({
   titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no máximo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
      
     tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde'], {message: 'Opção de tema invalido '}),

    dataLimite: z
    .string()
    .refine(val => {
    const date = new Date(val);
    const now = new Date();
    now.setHours(0,0,0,0);
    return !isNaN(date.getTime()) && date > now;
    },{
    message: "A data deve ser maior que a data atual",
    }),

    breveDescritivo: z
    .string({ required_error: mensagens.campo})
    .min(30, {message: 'Breve descritivo deve conter no minímo 30 caracteres'})
    .max(256, {message: 'Breve descritivo deve conter no maximo 256 caracteres'}),

    link: z
    .string({required_error: mensagens.campo})
    .url({message: 'Link com formato invalido'}),

    

    idGestor: idSchema
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
