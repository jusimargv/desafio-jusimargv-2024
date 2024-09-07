/**
 * Classe que representa a lógica de alocação de animais em recintos de um zoológico.
 * Esta classe é responsável por analisar a compatibilidade dos animais com os recintos existentes
 * e determinar quais recintos são viáveis para a adição de novos animais com base em várias regras.
 */
class RecintosZoo {
    /**
     * Construtor da classe RecintosZoo. Inicializa os recintos e as informações sobre animais aceitos.
     */
    constructor() {
        // Dados dos recintos existentes
        this.recintos = [
            { id: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { id: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { id: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { id: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { id: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] }
        ];

        // Informações sobre os animais aceitos, incluindo tamanho, biomas compatíveis e se são carnívoros
        this.animaisAceitos = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    /**
     * Analisa os recintos para verificar quais são viáveis para acomodar o novo lote de animais.
     * @param {string} animal - A espécie do animal a ser adicionado.
     * @param {number} quantidade - A quantidade de animais a ser adicionada.
     * @returns {Object} - Um objeto contendo erros e a lista de recintos viáveis.
     */
    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é aceito
        if (!this.animaisAceitos[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        // Verifica se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const especieInfo = this.animaisAceitos[animal];
        const tamanhoTotal = especieInfo.tamanho * quantidade;
        let recintosViaveis = [];

        // Analisa cada recinto para verificar se é viável
        this.recintos.forEach(recinto => {
            const espacoLivreAtual = recinto.tamanhoTotal - this.calculaEspacoOcupado(recinto.animais);
            const podeAdicionarAnimal = this.verificaCompatibilidade(recinto, animal, quantidade);

            // Verifica se o recinto é adequado
            if (
                especieInfo.biomas.some(bioma => recinto.bioma.includes(bioma)) &&
                espacoLivreAtual >= tamanhoTotal + this.calculaEspacoExtra(recinto, animal) &&
                podeAdicionarAnimal
            ) {
                recintosViaveis.push({
                    recinto,
                    espacoLivre: espacoLivreAtual - (tamanhoTotal + this.calculaEspacoExtra(recinto, animal))
                });
            }
        });

        // Ordena os recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.recinto.id - b.recinto.id);

        // Formata a lista de recintos viáveis
        recintosViaveis = recintosViaveis.map(rv => `Recinto ${rv.recinto.id} (espaço livre: ${rv.espacoLivre} total: ${rv.recinto.tamanhoTotal})`);

        // Retorna o resultado
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }

    /**
     * Calcula o espaço total ocupado pelos animais em um recinto.
     * @param {Array} animais - Lista de animais presentes no recinto.
     * @returns {number} - O espaço total ocupado pelos animais.
     */
    calculaEspacoOcupado(animais) {
        return animais.reduce((total, animal) => total + (animal.quantidade * animal.tamanho), 0);
    }

    /**
     * Verifica se o novo animal é compatível com os animais já existentes no recinto.
     * @param {Object} recinto - O recinto onde o novo animal será adicionado.
     * @param {string} novoAnimal - A espécie do novo animal.
     * @param {number} quantidade - A quantidade de novos animais.
     * @returns {boolean} - Retorna verdadeiro se o novo animal pode ser adicionado, falso caso contrário.
     */
    verificaCompatibilidade(recinto, novoAnimal, quantidade) {
        const especieInfo = this.animaisAceitos[novoAnimal];

        for (const animal of recinto.animais) {
            const animalInfo = this.animaisAceitos[animal.especie];

            // Verifica se há incompatibilidade entre carnívoros e outras espécies
            if (especieInfo.carnivoro || animalInfo.carnivoro) {
                if (animal.especie !== novoAnimal) {
                    return false;
                }
            }

            // Verifica a compatibilidade do hipopótamo com o bioma
            if (novoAnimal === 'HIPOPOTAMO' || animal.especie === 'HIPOPOTAMO') {
                if (recinto.bioma !== 'savana e rio') {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Calcula o espaço extra necessário para a convivência de mais de uma espécie no recinto.
     * @param {Object} recinto - O recinto onde o novo animal será adicionado.
     * @param {string} novoAnimal - A espécie do novo animal.
     * @returns {number} - O espaço extra necessário.
     */
    calculaEspacoExtra(recinto, novoAnimal) {
        return recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === novoAnimal) ? 1 : 0;
    }
}

// Exporta a classe RecintosZoo para uso externo
export { RecintosZoo as RecintosZoo };
