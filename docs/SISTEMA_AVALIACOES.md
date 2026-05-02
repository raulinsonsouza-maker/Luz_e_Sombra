# 📊 SISTEMA DE AVALIAÇÕES - Roda da Vida

## ✅ Como Funciona

O sistema **SEMPRE CRIA uma nova avaliação** e **NUNCA sobrescreve** as antigas.

---

## 🎯 Objetivo

Medir o desempenho e evolução do usuário ao longo do tempo através de múltiplas avaliações.

---

## 📝 Fluxo Completo

### 1. Primeira Avaliação
```
Login (primeiro acesso)
  ↓
Redireciona automaticamente para /avaliacao
  ↓
Preenche 12 áreas da vida (1-10)
  ↓
[Enviar Avaliação]
  ↓
API cria NOVA avaliação no banco
  ↓
Marca primeiroAcesso = false
  ↓
Mostra resultado
```

### 2. Avaliações Subsequentes
```
Usuário clica [Fazer Nova Avaliação]
  ↓
Vai para /avaliacao
  ↓
Preenche 12 áreas novamente
  ↓
[Enviar Avaliação]
  ↓
API cria NOVA avaliação (adiciona, não sobrescreve!)
  ↓
Mostra resultado
  ↓
Pode comparar com avaliações anteriores
```

---

## 🔄 Armazenamento

### Banco de Dados (Prisma)
```prisma
model Avaliacao {
  id              Int      @id @default(autoincrement())
  usuarioId       Int
  dataAvaliacao   DateTime @default(now())
  
  // 12 áreas (1-10)
  plenitudeFelicidade         Int
  espiritualidade             Int
  saudeDisposicao             Int
  // ... outras 9 áreas
  
  usuario         Usuario  @relation(fields: [usuarioId], onDelete: Cascade)
}
```

### Cada Avaliação Tem:
- ✅ ID único
- ✅ Data/hora da avaliação
- ✅ Associação ao usuário
- ✅ 12 notas (áreas da vida)
- ✅ Nunca é deletada (a menos que o usuário seja deletado)

---

## 📈 Evolução e Comparação

### Histórico (`/historico`)

Mostra TODAS as avaliações do usuário:

#### 1. Comparação Lado a Lado
```
┌─────────────────────┐  ┌─────────────────────┐
│   Mais Recente      │  │    Anterior         │
│   01/11/2025        │  │    15/10/2025       │
│   Média: 7.5        │  │    Média: 6.8       │
└─────────────────────┘  └─────────────────────┘
        ↑                         
    +0.7 pontos (↑ 10.3%)
```

#### 2. Evolução por Área
```
Plenitude e Felicidade:  7 → 8  (↑ +1)
Espiritualidade:         6 → 7  (↑ +1)
Saúde:                   5 → 5  (= 0)
Família:                 9 → 8  (↓ -1)
...
```

#### 3. Lista de Todas as Avaliações
```
┌─────────────────────────────────┐
│ 📅 01/11/2025 - Média: 7.5      │
│    [Ver Resultado]              │
├─────────────────────────────────┤
│ 📅 15/10/2025 - Média: 6.8      │
│    [Ver Resultado]              │
├─────────────────────────────────┤
│ 📅 01/10/2025 - Média: 6.2      │
│    [Ver Resultado]              │
└─────────────────────────────────┘
```

---

## 💾 Garantia de Armazenamento

### Código da API (`app/api/avaliacoes/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  // ...
  
  // SEMPRE CRIA UMA NOVA (create, não update!)
  const avaliacao = await prisma.avaliacao.create({
    data: {
      usuarioId,
      plenitudeFelicidade: body.plenitudeFelicidade,
      // ... todas as 12 áreas
    },
  })
  
  return NextResponse.json(avaliacao)
}
```

**✅ Usa `create` = SEMPRE adiciona nova**  
**❌ Não usa `update` = NUNCA sobrescreve**

---

## 📊 Benefícios

### Para o Usuário:
- ✅ Ver evolução ao longo do tempo
- ✅ Identificar áreas que melhoraram
- ✅ Identificar áreas que pioraram
- ✅ Motivação visual do progresso
- ✅ Histórico completo sempre disponível

### Para o Sistema:
- ✅ Dados para análise de tendências
- ✅ Métricas de engajamento
- ✅ Identificar padrões de uso
- ✅ Gerar insights personalizados

---

## 🎯 Exemplos de Uso

### Caso 1: Usuário Faz Avaliação Mensal
```
Janeiro:   Média 6.5
Fevereiro: Média 7.0  (+0.5) ✅
Março:     Média 7.3  (+0.3) ✅
Abril:     Média 7.1  (-0.2) ⚠️
Maio:      Média 7.8  (+0.7) ✅

Tendência: Crescimento positivo!
```

### Caso 2: Acompanhar Área Específica
```
Saúde e Disposição:
Janeiro:   5
Fevereiro: 6  ↑
Março:     7  ↑
Abril:     8  ↑
Maio:      8  =

Insight: Melhora constante em 4 meses!
```

---

## 🔍 Verificações Técnicas

### 1. Testar Criação de Múltiplas Avaliações

```bash
# Fazer 3 avaliações seguidas
1. Login
2. /avaliacao → Preencher → Enviar (Avaliação 1)
3. / → [Nova Avaliação]
4. /avaliacao → Preencher → Enviar (Avaliação 2)
5. / → [Nova Avaliação]
6. /avaliacao → Preencher → Enviar (Avaliação 3)

# Verificar histórico
7. /historico → Deve mostrar 3 avaliações
```

### 2. Verificar Banco de Dados

```bash
npx prisma studio
# Abrir tabela "Avaliacao"
# Ver todas as entradas do usuário
# Cada uma com ID e data diferentes
```

---

## 📈 Futuras Melhorias Possíveis

### Gráficos de Evolução
```
Gráfico de linha mostrando média ao longo do tempo
Gráfico de barras comparando áreas
Gráfico radar animado da evolução
```

### Insights Automáticos
```
"Sua saúde melhorou 40% nos últimos 3 meses!"
"Área com mais crescimento: Espiritualidade (+3 pontos)"
"Sugestão: Dar atenção à Vida Social (estável há 2 meses)"
```

### Metas e Objetivos
```
Usuário define meta: "Quero chegar a 8 em Saúde"
Sistema acompanha progresso
Celebra quando alcançar
```

---

## ✅ RESUMO

| Característica | Status |
|---|---|
| **Criar nova avaliação** | ✅ SIM |
| **Sobrescrever antiga** | ❌ NÃO |
| **Armazenar todas** | ✅ SIM |
| **Ver histórico** | ✅ SIM |
| **Comparar evolução** | ✅ SIM |
| **Identificar tendências** | ✅ SIM |
| **Medir desempenho** | ✅ SIM |

---

## 🚀 ESTÁ FUNCIONANDO!

O sistema JÁ está configurado para:
- ✅ Criar nova avaliação a cada vez
- ✅ Nunca sobrescrever
- ✅ Armazenar histórico completo
- ✅ Mostrar evolução
- ✅ Comparar resultados

**Está PRONTO para medir o desempenho ao longo do tempo!** 🎉
