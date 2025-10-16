// Script para popular o banco de dados Supabase
// Execute este arquivo uma vez após configurar o Supabase

console.log('🚀 Iniciando população do banco de dados...');

// ========================================
// PRODUTOS
// ========================================
const productsToInsert = [
  {
    id: 1,
    title: "Tela Privacy Nova",
    price: 90.00,
    original_price: 150.00,
    category: "all",
    type: "video",
    video_url: "imagens/new privacy.mp4",
    auto_delivery: true,
    has_model_selection: false,
    description: "✅ Tela Atualizada 2025 Quase Idêntica",
    download_links: {
      main: "https://drive.google.com/drive/folders/1emzV8VdfoskXkJiIKOj9Re3mkJAzwEpS?usp=sharing",
      backup: "https://drive.google.com/drive/folders/1emzV8VdfoskXkJiIKOj9Re3mkJAzwEpS?usp=sharing",
      instructions: "📋 Tela Privacy Nova completa: código fonte, assets, documentação, configuração de pixel e notificações"
    },
    active: true
  },
  {
    id: 2,
    title: "Tela OnlyFans",
    price: 90.00,
    original_price: 150.00,
    category: "hot",
    type: "video",
    video_url: "imagens/new onlyfans.mp4",
    auto_delivery: true,
    has_model_selection: false,
    description: "✅ Tela Atualizada 2025 Quase Idêntica",
    download_links: {
      main: "https://drive.google.com/drive/folders/1Fpz7hWKFSsjV_SkARftrqunFBMMzotzs?usp=sharing",
      backup: "https://drive.google.com/drive/folders/1Fpz7hWKFSsjV_SkARftrqunFBMMzotzs?usp=sharing",
      instructions: "📋 Tela OnlyFans completa: código fonte, assets, documentação, configuração de pixel e notificações"
    },
    active: true
  },
  {
    id: 3,
    title: "Tela Privacy Antiga",
    price: 65.00,
    original_price: 120.00,
    category: "hot",
    type: "video",
    video_url: "imagens/old privacy.mp4",
    auto_delivery: true,
    has_model_selection: false,
    description: "✅ Tela Escalada, Funcional mas no modelo Antigo",
    download_links: {
      main: "https://drive.google.com/drive/folders/1SDH-yXJqEgyMCpgGmNXwqgHvc2yyiJL2?usp=sharing",
      backup: "https://drive.google.com/drive/folders/1SDH-yXJqEgyMCpgGmNXwqgHvc2yyiJL2?usp=sharing",
      instructions: "📋 Tela Privacy Antiga completa: código fonte, assets, documentação, configuração de pixel e notificações"
    },
    active: true
  },
  {
    id: 4,
    title: "Landing Page [Modelo a km de você]",
    price: 12.90,
    category: "hot",
    type: "video",
    video_url: "imagens/lp editada.mp4",
    auto_delivery: true,
    has_model_selection: false,
    description: "🎯 Landing Page Personalizada e Profissional",
    download_links: {
      main: "https://drive.google.com/drive/folders/1d9gKDCHy-UX3g2Lz8J6MN4P5Q7R8S0T9?usp=sharing",
      backup: "https://drive.google.com/drive/folders/1d9gKDCHy-UX3g2Lz8J6MN4P5Q7R8S0T9?usp=sharing",
      instructions: "📋 Landing Page completa: HTML, CSS, JS e instruções de personalização"
    },
    active: true
  },
  {
    id: 5,
    title: "Corte de Fotos/Vídeos em Massa",
    price: 19.90,
    category: "all",
    image_url: "imagens/corte em massa.jpg",
    type: "background",
    auto_delivery: true,
    has_model_selection: false,
    description: "🎬 Ferramenta Profissional de Corte em Massa",
    download_links: {
      main: "https://drive.google.com/drive/folders/1e0hKDJIy-VX4h3Mz9K7NO5Q6R9S1U0V1?usp=sharing",
      backup: "https://drive.google.com/drive/folders/1e0hKDJIy-VX4h3Mz9K7NO5Q6R9S1U0V1?usp=sharing",
      instructions: "📋 Ferramenta de corte completa: app, tutorial e suporte"
    },
    active: true
  },
  {
    id: 6,
    title: "Encomenda Pessoal",
    price: 0,
    category: "all",
    image_url: "imagens/encomenda-pessoal.jpg",
    type: "image",
    auto_delivery: false,
    has_model_selection: false,
    description: "🎯 Solução Personalizada para Sua Operação",
    active: true
  },
  {
    id: 7,
    title: "Modelos Pra Escalar",
    price: 100.00,
    original_price: 180.00,
    category: "all",
    image_url: "imagens/Modelos-Escaladas.jpg",
    type: "background",
    auto_delivery: true,
    has_model_selection: true,
    description: "👥 Modelos Profissionais para Escalar Suas Vendas",
    active: true
  }
];

// ========================================
// MODELOS
// ========================================
const modelsToInsert = [
  {
    id: 1,
    name: "Catgirl",
    description: "Modelo Catgirl - Versão exclusiva",
    image_url: "carrossel/imagens/modelos/Catgirl.jpg",
    preview_images: {
      main: "carrossel/imagens/modelos/Catgirl.jpg",
      previews: [
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (1).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (2).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (3).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (4).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (5).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/catgirl (6).jpg"
      ]
    },
    has_video_call: false,
    category: "feminino",
    tags: ["catgirl", "feminino", "exclusivo"],
    active: true
  },
  {
    id: 2,
    name: "Paola Rosalina",
    description: "Modelo Paola Rosalina - Versão exclusiva",
    image_url: "carrossel/imagens/modelos/Paolarosalina.jpg",
    preview_images: {
      main: "carrossel/imagens/modelos/Paolarosalina.jpg",
      previews: [
        "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (1).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (2).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (3).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (4).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (5).jpg"
      ]
    },
    has_video_call: false,
    category: "feminino",
    tags: ["paola-rosalina", "feminino", "exclusivo"],
    active: true
  },
  {
    id: 3,
    name: "Latoxicasz",
    description: "Modelo Latoxicasz - Versão exclusiva",
    image_url: "carrossel/imagens/modelos/latoxicasz.jpg",
    preview_images: {
      main: "carrossel/imagens/modelos/latoxicasz.jpg",
      previews: [
        "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (1).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (2).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (3).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (4).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (5).jpg"
      ]
    },
    has_video_call: true,
    category: "feminino",
    tags: ["latoxicasz", "feminino", "exclusivo", "video-call"],
    active: true
  },
  {
    id: 4,
    name: "liiias",
    description: "Modelo liiias - Versão exclusiva",
    image_url: "carrossel/imagens/modelos/liiias.jpg",
    preview_images: {
      main: "carrossel/imagens/modelos/liiias.jpg",
      previews: [
        "carrossel/imagens/modelos/Modelos - Preview/liiias (1).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/liiias (2).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/liiias (3).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/liiias (4).jpg",
        "carrossel/imagens/modelos/Modelos - Preview/liiias (5).jpg"
      ]
    },
    has_video_call: false,
    category: "feminino",
    tags: ["liiias", "feminino", "exclusivo"],
    active: true
  }
];

// ========================================
// FUNÇÃO PARA POPULAR
// ========================================
async function populateDatabase() {
  try {
    console.log('📦 Inserindo produtos...');
    
    // Inserir produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id' })
      .select();

    if (productsError) throw productsError;
    console.log(`✅ ${products.length} produtos inseridos/atualizados`);

    console.log('👥 Inserindo modelos...');
    
    // Inserir modelos
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .upsert(modelsToInsert, { onConflict: 'id' })
      .select();

    if (modelsError) throw modelsError;
    console.log(`✅ ${models.length} modelos inseridos/atualizados`);

    console.log('🎉 Banco de dados populado com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - Produtos: ${products.length}`);
    console.log(`   - Modelos: ${models.length}`);

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  }
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('⏳ Aguardando 2 segundos para garantir que Supabase está carregado...');
    setTimeout(populateDatabase, 2000);
  });
} else {
  console.log('⏳ Aguardando 2 segundos para garantir que Supabase está carregado...');
  setTimeout(populateDatabase, 2000);
}


