import type { EstruturaTraco } from "../types.js";

/** Lacunas finas que tabelas.ts ainda não estrutura em pares. */
export const RECURSOS_TABELA: Record<EstruturaTraco, Array<[string, string, string]>> = {
  esquizoide: [
    ["Profundidade", "Visão e criação", "Isolamento que vira prisão"],
    ["Intuição", "Antecipar o que outros não veem", "Fugir para o pensamento"],
    ["Originalidade", "Caminhos novos", "Dificuldade de se mostrar"],
    ["Sensibilidade", "Ler o ambiente com precisão", "Recuar antes do contato"],
  ],
  oral: [
    ["Empatia", "Cuidar e aquecer vínculos", "Dar demais e ficar vazio"],
    ["Generosidade", "Oferecer apoio real", "Esquecer de se sustentar"],
    ["Escuta", "Fazer o outro se sentir visto", "Medo de ficar sozinho"],
    ["Abertura", "Criar proximidade", "Dificuldade de receber"],
  ],
  psicopata: [
    ["Liderança", "Organizar e fazer avançar", "Controlar para não ser tocado"],
    ["Presença", "Influenciar com clareza", "Impaciência com o ritmo do outro"],
    ["Determinação", "Sustentar o caminho", "Esconder a fragilidade"],
    ["Visão", "Enxergar o próximo passo", "Usar a força como armadura"],
  ],
  masoquista: [
    ["Resistência", "Sustentar o que importa", "Aguentar além do saudável"],
    ["Lealdade", "Permanecer com verdade", "Ficar onde já pediu saída"],
    ["Comprometimento", "Entregar com constância", "Engolir o que precisa dizer"],
    ["Compaixão", "Acolher a dor do outro", "Negar o próprio espaço"],
  ],
  rigido: [
    ["Excelência", "Qualidade e dedicação", "Perfeccionismo que paralisa"],
    ["Organização", "Clareza e planejamento", "Controle excessivo"],
    ["Confiabilidade", "Fazer o que promete", "Dificuldade de pedir ajuda"],
    ["Comprometimento", "Sustentar o que importa", "Autocobrança constante"],
  ],
};

export const SOMBRA_TABELA: Record<EstruturaTraco, Array<[string, string]>> = {
  esquizoide: [
    ["Proteger o espaço interior", "Ficar longe demais das pessoas"],
    ["Pensar antes de sentir", "Adiar a vida real"],
    ["Observar com profundidade", "Parecer frio sem querer"],
    ["Criar mundos internos", "Não se deixar ser visto"],
  ],
  oral: [
    ["Cuidar do outro", "Se abandonar no caminho"],
    ["Buscar proximidade", "Depender demais do vínculo"],
    ["Dar generosamente", "Não conseguir receber"],
    ["Evitar a solidão", "Se perder no desejo de agradar"],
  ],
  psicopata: [
    ["Manter o controle", "Dificuldade de confiar"],
    ["Ser forte", "Esconder a necessidade de cuidado"],
    ["Avançar rápido", "Passar por cima do ritmo do outro"],
    ["Impressionar", "Sentir-se sozinho no alto"],
  ],
  masoquista: [
    ["Aguentar para não perder o vínculo", "Carregar o que já pesa demais"],
    ["Ser leal", "Não conseguir dizer não"],
    ["Evitar conflito", "Guardar ressentimento"],
    ["Fazer o que esperam", "Adiar o próprio desejo"],
  ],
  rigido: [
    ["Evitar erros", "Não se permitir experimentar"],
    ["Manter a compostura", "Dificuldade de se entregar"],
    ["Ser admirado", "Depender da validação"],
    ["Fazer tudo corretamente", "Viver sob cobrança constante"],
  ],
};

export const INTEGRACAO_TABELA: Record<EstruturaTraco, Array<[string, string]>> = {
  esquizoide: [
    ["Precisar sumir para se sentir seguro", "Estar presente em doses pequenas"],
    ["Só confiar na mente", "Deixar o corpo participar"],
    ["Guardar o mundo interior", "Compartilhar um pedaço com alguém seguro"],
  ],
  oral: [
    ["Precisar do outro para se encher", "Se sustentar também por dentro"],
    ["Dar sem pedir", "Pedir com clareza"],
    ["Temer a solidão", "Estar consigo sem se abandonar"],
  ],
  psicopata: [
    ["Precisar controlar", "Confiar em doses"],
    ["Esconder fragilidade", "Mostrar necessidade com segurança"],
    ["Liderar para não ser tocado", "Liderar e também receber"],
  ],
  masoquista: [
    ["Aguentar em silêncio", "Expressar o que pesa"],
    ["Dizer sim por medo", "Dizer não com gentileza"],
    ["Merecer prazer", "Permitir prazer sem prova"],
  ],
  rigido: [
    ["Precisar acertar", "Permitir-se o suficientemente bom"],
    ["Controlar o sentimento", "Nomear o que sente"],
    ["Fazer tudo sozinho", "Receber apoio"],
    ["Buscar reconhecimento", "Reconhecer o próprio valor"],
  ],
};
