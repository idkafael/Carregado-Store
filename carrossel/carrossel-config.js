// Configurações do Carrossel de Modelos - Versão Organizada
const CARROSSEL_MODELOS_CONFIG = {
    // Informações do produto
    produto: {
        id: 6,
        nome: "Modelos Pra Escalar",
        preco: "R$ 45,00",
        categoria: "all",
        imagem: "imagens/Modelos-Escaladas.jpg",
        tipo: "background",
        entregaAutomatica: true,
        temSelecaoModelos: true
    },

    // Configurações do carrossel
    carrossel: {
        maxModelosVisiveis: 3,
        larguraSlide: 320,
        duracaoAnimacao: 400,
        autoplay: false,
        intervaloAutoplay: 5000,
        mostrarPontos: true,
        mostrarSetas: true,
        loopInfinito: false,
        tecladoHabilitado: true,
        touchHabilitado: true,
        responsivo: {
            desktop: {
                breakpoint: 1024,
                maxModelosVisiveis: 3,
                larguraSlide: 320
            },
            tablet: {
                breakpoint: 768,
                maxModelosVisiveis: 2,
                larguraSlide: 280
            },
            mobile: {
                breakpoint: 480,
                maxModelosVisiveis: 1,
                larguraSlide: 250
            }
        }
    },

    // Dados dos modelos - Cada modelo com foto única
    modelos: [
        {
            id: 1,
            nome: "Catgirl",
            imagem: "carrossel/imagens/modelos/Catgirl.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/catgirl (1).jpg",
            miniatura: "carrossel/imagens/modelos/Catgirl.jpg",
            descricao: "Modelo Catgirl - Versão exclusiva",
            categoria: "feminino",
            tags: ["catgirl", "feminino", "exclusivo"],
            destaque: true,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/13D_yv1GjEkeFZoAaJQmXcvHcmaRnSxkl?usp=sharing",
            especificacoes: {
                estilo: "Catgirl",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        },
        {
            id: 2,
            nome: "Paola Rosalina", 
            imagem: "carrossel/imagens/modelos/Paolarosalina.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (1).jpg",
            miniatura: "carrossel/imagens/modelos/Paolarosalina.jpg",
            descricao: "Modelo Paola Rosalina - Versão exclusiva",
            categoria: "feminino",
            tags: ["paola-rosalina", "feminino", "exclusivo"],
            destaque: true,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/1pHGHl8hQs-ZJJsqOK-6qKRehbDyc58CU?usp=sharing",
            especificacoes: {
                estilo: "Paola Rosalina",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        },
        {
            id: 3,
            nome: "Latoxicasz",
            imagem: "carrossel/imagens/modelos/latoxicasz.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (1).jpg",
            miniatura: "carrossel/imagens/modelos/latoxicasz.jpg",
            descricao: "Modelo Latoxicasz - Versão exclusiva",
            categoria: "feminino",
            tags: ["latoxicasz", "feminino", "exclusivo"],
            destaque: false,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/18_5x8WAeClrsIY_GYQZ9WcnFD_jb9DW0?usp=sharing",
            especificacoes: {
                estilo: "Latoxicasz",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        },
        {
            id: 4,
            nome: "liiias",
            imagem: "carrossel/imagens/modelos/liiias.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/liiias (1).jpg",
            miniatura: "carrossel/imagens/modelos/liiias.jpg",
            descricao: "Modelo liiias - Versão exclusiva",
            categoria: "feminino",
            tags: ["liiias", "feminino", "exclusivo"],
            destaque: false,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/1oVrfho-WngLSzX-Fdx4IGXtNCQnoYwix?usp=sharing",
            especificacoes: {
                estilo: "liiias",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        },
        {
            id: 5,
            nome: "Latoxicasz (2)",
            imagem: "carrossel/imagens/modelos/latoxicasz.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (2).jpg",
            miniatura: "carrossel/imagens/modelos/latoxicasz.jpg",
            descricao: "Modelo Latoxicasz - Versão 2",
            categoria: "feminino",
            tags: ["latoxicasz", "feminino", "versao2"],
            destaque: false,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/18_5x8WAeClrsIY_GYQZ9WcnFD_jb9DW0?usp=sharing",
            especificacoes: {
                estilo: "Latoxicasz",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        },
        {
            id: 6,
            nome: "liiias (2)",
            imagem: "carrossel/imagens/modelos/liiias.jpg",
            imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/liiias (2).jpg",
            miniatura: "carrossel/imagens/modelos/liiias.jpg",
            descricao: "Modelo liiias - Versão 2",
            categoria: "feminino",
            tags: ["liiias", "feminino", "versao2"],
            destaque: true,
            preco: 0,
            downloadLink: "https://drive.google.com/drive/folders/1oVrfho-WngLSzX-Fdx4IGXtNCQnoYwix?usp=sharing",
            especificacoes: {
                estilo: "liiias",
                adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
            }
        }
    ],

    // Configurações de interface
    interface: {
        cores: {
            primaria: "#25D366",
            secundaria: "#1ea952",
            destaque: "#ffffff",
            fundo: "#1a1a1a",
            fundoCard: "#2a2a2a",
            textoPrimario: "#ffffff",
            textoSecundario: "#cccccc",
            borda: "#333333",
            hover: "rgba(37, 211, 102, 0.2)",
            selecionado: "#25D366"
        },
        fontes: {
            principal: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            tamanhos: {
                titulo: "24px",
                subtitulo: "18px",
                corpo: "16px",
                pequeno: "14px",
                botao: "16px"
            },
            pesos: {
                normal: 400,
                medio: 500,
                negrito: 700,
                extraNegrito: 800
            }
        },
        espacamento: {
            pequeno: "10px",
            medio: "20px",
            grande: "30px",
            extraGrande: "40px"
        },
        bordasArredondadas: {
            pequeno: "8px",
            medio: "12px",
            grande: "15px",
            redondo: "50%"
        },
        sombras: {
            leve: "0 4px 15px rgba(0, 0, 0, 0.1)",
            medio: "0 8px 25px rgba(0, 0, 0, 0.2)",
            pesado: "0 15px 35px rgba(0, 0, 0, 0.3)",
            brilho: "0 0 20px rgba(37, 211, 102, 0.3)"
        }
    },

    // Configurações de animação
    animacoes: {
        transicaoSlide: "cubic-bezier(0.4, 0, 0.2, 1)",
        transicaoHover: "all 0.3s ease",
        transicaoFade: "opacity 0.3s ease",
        transicaoEscala: "transform 0.3s ease",
        efeitoBounce: "bounce 2s ease-in-out infinite",
        efeitoShimmer: "shimmer 3s ease-in-out infinite",
        efeitoPulse: "pulse 2s ease-in-out infinite"
    },

    // Configurações de performance
    performance: {
        carregamentoPreguicoso: true,
        preCarregarProximo: 1,
        otimizacaoImagem: true,
        delayDebounce: 300,
        delayThrottle: 100
    },

    // Configurações de acessibilidade
    acessibilidade: {
        labelsAria: {
            carrossel: "Carrossel de modelos",
            anterior: "Modelo anterior",
            proximo: "Próximo modelo",
            selecionar: "Selecionar modelo",
            selecionado: "Modelo selecionado"
        },
        atalhosTeclado: {
            setaEsquerda: "Modelo anterior",
            setaDireita: "Próximo modelo",
            enter: "Selecionar modelo",
            escape: "Fechar carrossel"
        },
        gerenciamentoFoco: true,
        suporteLeitorTela: true
    },

    // Configurações de integração
    integracao: {
        idProduto: 6,
        salvarSelecao: true,
        rastrearAnalytics: true,
        habilitarCompartilhamento: false,
        redesSociais: {
            facebook: false,
            instagram: false,
            twitter: false
        }
    }
};

// Função para detectar automaticamente modelos disponíveis (sem repetições)
function detectarModelosDisponiveis() {
    return new Promise((resolve) => {
        if (CARROSSEL_MODELOS_CONFIG && CARROSSEL_MODELOS_CONFIG.modelos) {
            // Remover duplicatas baseado no nome do modelo
            const modelosUnicos = removerModelosDuplicados(CARROSSEL_MODELOS_CONFIG.modelos);
            resolve(modelosUnicos);
        } else {
            // Fallback para modelos básicos únicos
            const modelosBasicos = [
                {
                    id: 1,
                    nome: "Catgirl",
                    imagem: "carrossel/imagens/modelos/Catgirl.jpg",
                    imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/catgirl (1).jpg",
                    categoria: "feminino",
                    tags: ["catgirl", "feminino", "exclusivo"]
                },
                {
                    id: 2,
                    nome: "Paola Rosalina",
                    imagem: "carrossel/imagens/modelos/Paolarosalina.jpg",
                    imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/paolarosalina (1).jpg",
                    categoria: "feminino",
                    tags: ["paola-rosalina", "feminino", "exclusivo"]
                },
                {
                    id: 3,
                    nome: "Latoxicasz",
                    imagem: "carrossel/imagens/modelos/latoxicasz.jpg",
                    imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/latoxicasz (1).jpg",
                    categoria: "feminino",
                    tags: ["latoxicasz", "feminino", "exclusivo"]
                },
                {
                    id: 4,
                    nome: "liiias",
                    imagem: "carrossel/imagens/modelos/liiias.jpg",
                    imagemPreview: "carrossel/imagens/modelos/Modelos - Preview/liiias (1).jpg",
                    categoria: "feminino",
                    tags: ["liiias", "feminino", "exclusivo"]
                }
            ];
            resolve(modelosBasicos);
        }
    });
}

// Função para remover modelos duplicados
function removerModelosDuplicados(modelos) {
    const modelosUnicos = [];
    const nomesUsados = new Set();
    const imagensUsadas = new Set();
    
    for (const modelo of modelos) {
        const nomeModelo = modelo.nome || modelo.name;
        const imagemModelo = modelo.imagem || modelo.image;
        
        // Verificar se o nome ou a imagem já foram usados
        if (!nomesUsados.has(nomeModelo) && !imagensUsadas.has(imagemModelo)) {
            modelosUnicos.push(modelo);
            nomesUsados.add(nomeModelo);
            imagensUsadas.add(imagemModelo);
        }
    }
    
    console.log(`Modelos únicos detectados: ${modelosUnicos.length} (removidas ${modelos.length - modelosUnicos.length} duplicatas)`);
    return modelosUnicos;
}

// Função para adicionar novos modelos facilmente
function adicionarNovoModelo(nomeModelo, categoria = "feminino") {
    const novoModelo = {
        id: Date.now(), // ID único baseado no timestamp
        nome: nomeModelo,
        imagem: `carrossel/imagens/modelos/${nomeModelo.toLowerCase()}.jpg`,
        imagemPreview: `carrossel/imagens/modelos/Modelos - Preview/${nomeModelo.toLowerCase()}-preview.jpg`,
        miniatura: `carrossel/imagens/modelos/${nomeModelo.toLowerCase()}.jpg`,
        descricao: `Modelo ${nomeModelo} - Versão exclusiva`,
        categoria: categoria,
        tags: [nomeModelo.toLowerCase(), categoria, "exclusivo"],
        destaque: false,
        preco: 0,
        especificacoes: {
            estilo: nomeModelo,
            adequado_para: ["E-commerce", "Marketing", "Produtos Femininos"]
        }
    };
    
    // Adicionar ao array de modelos na configuração (sem duplicatas)
    if (CARROSSEL_MODELOS_CONFIG && CARROSSEL_MODELOS_CONFIG.modelos) {
        // Verificar se o modelo já existe
        const modeloExiste = CARROSSEL_MODELOS_CONFIG.modelos.some(modelo => 
            (modelo.nome || modelo.name) === nomeModelo ||
            (modelo.imagem || modelo.image) === novoModelo.imagem
        );
        
        if (!modeloExiste) {
            CARROSSEL_MODELOS_CONFIG.modelos.push(novoModelo);
            console.log(`Novo modelo adicionado: ${nomeModelo}`);
        } else {
            console.log(`Modelo já existe: ${nomeModelo}`);
        }
    }
    
    return novoModelo;
}

// Função para adicionar nova versão de um modelo existente
function adicionarVersaoModelo(nomeModeloBase, numeroVersao) {
    const modeloBase = CARROSSEL_MODELOS_CONFIG.modelos.find(m => m.nome === nomeModeloBase);
    if (!modeloBase) {
        console.error(`Modelo base "${nomeModeloBase}" não encontrado`);
        return null;
    }
    
    const novaVersao = {
        id: Date.now(),
        nome: `${nomeModeloBase} (${numeroVersao})`,
        imagem: modeloBase.imagem,
        imagemPreview: modeloBase.imagemPreview.replace(/\(\d+\)/, `(${numeroVersao})`),
        miniatura: modeloBase.miniatura,
        descricao: `Modelo ${nomeModeloBase} - Versão ${numeroVersao}`,
        categoria: modeloBase.categoria,
        tags: [...modeloBase.tags.slice(0, -1), `versao${numeroVersao}`],
        destaque: false,
        preco: 0,
        especificacoes: {
            estilo: nomeModeloBase,
            adequado_para: modeloBase.especificacoes.adequado_para
        }
    };
    
    // Adicionar ao array de modelos na configuração
    CARROSSEL_MODELOS_CONFIG.modelos.push(novaVersao);
    
    return novaVersao;
}

// Funções utilitárias para o carrossel
const CARROSSEL_UTILS = {
    // Obter configuração por breakpoint
    obterConfigPorBreakpoint: function(largura) {
        const { responsivo } = CARROSSEL_MODELOS_CONFIG.carrossel;
        
        if (largura >= responsivo.desktop.breakpoint) {
            return responsivo.desktop;
        } else if (largura >= responsivo.tablet.breakpoint) {
            return responsivo.tablet;
        } else {
            return responsivo.mobile;
        }
    },

    // Obter modelo por ID
    obterModeloPorId: function(id) {
        return CARROSSEL_MODELOS_CONFIG.modelos.find(modelo => modelo.id === id);
    },

    // Obter modelos por categoria
    obterModelosPorCategoria: function(categoria) {
        return CARROSSEL_MODELOS_CONFIG.modelos.filter(modelo => modelo.categoria === categoria);
    },

    // Obter modelos em destaque
    obterModelosDestaque: function() {
        return CARROSSEL_MODELOS_CONFIG.modelos.filter(modelo => modelo.destaque);
    },

    // Gerar fallback para imagem
    obterFallbackImagem: function(caminhoImagem) {
        return caminhoImagem || "imagens/Modelos-Escaladas.jpg";
    },

    // Validar se imagem existe
    validarImagem: function(caminhoImagem) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = caminhoImagem;
        });
    },

    // Função debounce
    debounce: function(func, espera) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, espera);
        };
    },

    // Função throttle
    throttle: function(func, limite) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limite);
            }
        };
    }
};

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CARROSSEL_MODELOS_CONFIG,
        CARROSSEL_UTILS
    };
} else {
    window.CARROSSEL_MODELOS_CONFIG = CARROSSEL_MODELOS_CONFIG;
    window.CARROSSEL_UTILS = CARROSSEL_UTILS;
}
