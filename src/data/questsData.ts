// src/data/questsData.ts

export const courseDatabase = {
  1: { 
    description: "Bem-vindo ao treinamento Hackeando o Jogo Corporativo. Este módulo compila todo o conhecimento estratégico, Antes de aprender qualquer ferramenta, é preciso entender como funciona o ambiente corporativo. Neste módulo, o aluno desenvolve a mentalidade de um profissional de alto valor, aprendendo como agir, se comunicar e construir uma reputação positiva desde o primeiro dia.",
    videos: [
      "https://www.youtube.com/embed/gGDBPF0jOQw", // Aulão 1 (Vimeo)
      "/em-breve.png", // Aulão 2
      "/em-breve.png", // Aulão 3
    ],
    modules: [
      { title: "MÓDULO 1 - Mindset e Postura Corporativa", duration: "Vídeo Aula" },
      { title: "MÓDULO - 2 Currículo e LinkedIn", duration: "--:--" },
      { title: "MÓDULO - 3 Dominando Entrevistas", duration: "--:--" },
    ],
    link: null
  },
  2: { 
    description: "Aprenda a administrar seu dinheiro com inteligência. A educação financeira está relacionada ao desenvolvimento de hábitos que auxiliam na administração do dinheiro.",
    videos: [
      "/financeiro.mp4", 
      "/financeiroimg1.jpeg", 
      "https://www.youtube.com/embed/CB5zuxQl5ro", 
      "/conclusao.png" 
    ],
    modules: [
      { title: "Introdução à Educação Financeira", duration: "09:28" },
      { title: "A Riqueza na Prática (Quadrinhos)", duration: "Leitura" },
      { title: "Estratégias Avançadas (Vídeo)", duration: "07:15" },
      { title: "Missão Cumprida!", duration: "Recompensa" },
    ],
    link: "https://www.canva.com/design/DAHJ-sJGZYw/ukKKOXcnbhB0Tpo0OkB5-A/view" 
  }
}; 

export const initialCourses = [
  { id: 1, title: "Hackeando o Jogo Corporativo", progress: 0, xp: 500, status: "available", tag: "Carreira" },
  { id: 2, title: "Educação Financeira", progress: 0, xp: 400, status: "available", tag: "Finanças" },
];