export interface AreaDaVida {
  id: string
  titulo: string
  descricao: string
  icon: string
}

export interface FormData {
  nome: string
  dataNascimento: string
  plenitudeFelicidade: number
  espiritualidade: number
  saudeDisposicao: number
  desenvolvimentoIntelectual: number
  equilibrioEmocional: number
  familia: number
  desenvolvimentoAmoroso: number
  vidaSocial: number
  realizacaoProposito: number
  recursosFinanceiros: number
  contribuicaoSocial: number
  criatividadeHobbyDiversao: number
}

export const AREAS_DA_VIDA: AreaDaVida[] = [
  {
    id: 'plenitudeFelicidade',
    titulo: 'Plenitude e Felicidade',
    descricao: 'Como você avalia seu nível geral de felicidade e satisfação com a vida?',
    icon: 'Smile'
  },
  {
    id: 'espiritualidade',
    titulo: 'Espiritualidade',
    descricao: 'Qual é o seu nível de conexão espiritual e propósito maior?',
    icon: 'Sparkles'
  },
  {
    id: 'saudeDisposicao',
    titulo: 'Saúde e Disposição',
    descricao: 'Como está sua saúde física, energia e disposição no dia a dia?',
    icon: 'Activity'
  },
  {
    id: 'desenvolvimentoIntelectual',
    titulo: 'Desenvolvimento Intelectual',
    descricao: 'O quanto você tem investido em seu crescimento intelectual e aprendizado?',
    icon: 'Brain'
  },
  {
    id: 'equilibrioEmocional',
    titulo: 'Equilíbrio Emocional',
    descricao: 'Como você avalia sua capacidade de gerenciar emoções e manter o equilíbrio?',
    icon: 'Scale'
  },
  {
    id: 'familia',
    titulo: 'Família',
    descricao: 'Qual é a qualidade do seu relacionamento com sua família?',
    icon: 'Home'
  },
  {
    id: 'desenvolvimentoAmoroso',
    titulo: 'Relacionamento Amoroso',
    descricao: 'Se você está em um relacionamento: quanto sente que vivem amor, parceria e crescimento juntos? Se não está: quanto sente amor e abertura para viver um relacionamento saudável?',
    icon: 'Heart'
  },
  {
    id: 'vidaSocial',
    titulo: 'Vida Social',
    descricao: 'Qual é a qualidade das suas amizades e conexões sociais?',
    icon: 'Users'
  },
  {
    id: 'realizacaoProposito',
    titulo: 'Realização e Propósito',
    descricao: 'O quanto você sente que está realizando seu propósito de vida?',
    icon: 'Target'
  },
  {
    id: 'recursosFinanceiros',
    titulo: 'Recursos Financeiros',
    descricao: 'Como você avalia sua situação financeira e recursos materiais?',
    icon: 'Coins'
  },
  {
    id: 'contribuicaoSocial',
    titulo: 'Contribuição Social',
    descricao: 'O quanto você contribui para a sociedade e para o bem comum?',
    icon: 'Hand'
  },
  {
    id: 'criatividadeHobbyDiversao',
    titulo: 'Criatividade, Hobby e Diversão',
    descricao: 'Quanto tempo você dedica a atividades criativas, hobbies e diversão?',
    icon: 'Palette'
  }
]
