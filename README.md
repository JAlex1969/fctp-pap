# Assistente de FCT e PAP (Ollama & RAG)

Este é um chatbot inteligente baseado em RAG (Retrieval-Augmented Generation) concebido para esclarecer dúvidas sobre a **FCT (Formação em Contexto de Trabalho)** e a **PAP (Prova de Aptidão Profissional)** de cursos profissionais.

O sistema permite carregar regulamentos em PDF e links úteis de escolas, indexando-os numa base de dados vetorial local (HNSWLib). O chatbot utiliza depois esses documentos como contexto para responder a perguntas com precisão, utilizando um modelo local através do Ollama.

## Definições
*   **FCT (Formação em Contexto de Trabalho)**: Estágio curricular obrigatório realizado em empresas da respetiva área de formação.
*   **PAP (Prova de Aptidão Profissional)**: Projeto final transdisciplinar onde o aluno aplica os conhecimentos adquiridos ao longo do curso, apresentado perante um júri.

## Funcionalidades

*   **Arquitetura RAG**: Pesquisa vetorial local para enriquecer as perguntas do utilizador com contexto escolar preciso.
*   **Ingestão de Conhecimento**: Carregamento de ficheiros PDF (como regulamentos de estágio) e links web públicos.
*   **LLM 100% Local**: Comunicação com o Ollama (ex: Llama 2 ou Mistral), garantindo privacidade total dos dados.
*   **Base de Dados Vetorial Persistente**: Armazenamento vetorial indexado no disco local com HNSWLib.
*   **Histórico de Conversa**: Memória baseada em sessões temporárias para manter o contexto do diálogo.
*   **Interface Web Premium**: Desenvolvido com React, Vite e Tailwind CSS (v4).

## Pré-requisitos

Certifique-se de que tem instalado na sua máquina:

*   **Node.js**: (versão 18 ou superior recomendada)
*   **Ollama**: Instale o [Ollama](https://ollama.com/) e inicie o serviço local (`ollama serve`).

### Modelo Recomendado
O backend está configurado por padrão para usar o modelo `llama2`. Descarregue-o primeiro via terminal:

```bash
ollama pull llama2
```

## Estrutura do Projeto

*   `client/`: Aplicação Frontend (React + Vite)
*   `server/`: Aplicação Backend (Node.js Express + LangChain)

## Instalação

1.  **Instalar dependências do Servidor (Backend):**
    ```bash
    cd server
    npm install
    ```

2.  **Instalar dependências do Cliente (Frontend):**
    ```bash
    cd ../client
    npm install
    ```

## Configuração

### Backend (.env)
Se pretender alterar o endereço do Ollama ou a porta de execução, crie ou altere o ficheiro `.env` em `server/`:

```env
PORT=3000
OLLAMA_BASE_URL=http://localhost:11434
```

## Execução

Deve iniciar ambos os serviços (Backend e Frontend):

1.  **Iniciar o Servidor Backend:**
    ```bash
    cd server
    npm start
    ```
    *O servidor estará a correr em http://localhost:3000.*

2.  **Iniciar o Cliente Frontend:**
    ```bash
    cd client
    npm run dev
    ```
    *A interface estará acessível em http://localhost:5173.*

## Guia de Utilização

1.  Aceda ao site em `http://localhost:5173`.
2.  **Carregar Documentação**: No menu superior, clique em "Base de Conhecimento". Submeta o regulamento da FCT/PAP da sua escola (PDF) ou adicione o link do regulamento.
3.  **Conversar**: Aceda ao Chat e coloque as suas questões (ex: *"O que acontece se faltar à FCT?"* ou *"Como é avaliada a PAP?"*). O assistente utilizará os documentos carregados para gerar a resposta em português.
