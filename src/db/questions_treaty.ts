
import { Question } from '../types';

export const questionsTreaty: Question[] = [
    {
        id: "t001",
        theme: "psicofarmacologia",
        subtheme: "Antipsicóticos",
        statement: "De acordo com o Tratado de Psiquiatria da ABP (2022), a risperidona é um antipsicótico atípico que passa a se comportar como típico a partir de qual dose?",
        options: {
            A: "3mg",
            B: "4mg",
            C: "8mg",
            D: "6mg",
            E: "9mg"
        },
        correctAnswer: "D",
        difficulty: 2,
        explanation: {
            correct: "A risperidona apresenta um perfil de bloqueio dopaminérgico dose-dependente. Em doses superiores a 6mg/dia, a ocupação dos receptores D2 atinge níveis similares aos dos antipsicóticos típicos, aumentando significativamente o risco de sintomas extrapiramidais.",
            keyConcepts: ["Risperidona", "Dose-dependência", "Perfil Atípico vs Típico"],
            examTip: "Lembre-se do limiar de 6mg para a perda da 'atipicidade' da risperidona."
        },
        itemAnalysis: {
            A: "Incorreta. Dose dentro da faixa terapêutica atípica usual.",
            B: "Incorreta. Dose dentro da faixa terapêutica atípica usual.",
            C: "Incorreta. Embora já se comporte como típico, o limiar inferior descrito é menor.",
            D: "Correta. Estudos de ocupação de receptor indicam que acima de 6mg há saturação de D2 > 80%, aumentando risco de SEP e perdendo características atípicas.",
            E: "Incorreta. Dose muito acima do limiar."
        },
        tags: ["Tratado 2022", "Psicofarmacologia", "Antipsicóticos"]
    },
    {
        "id": "t002",
        "theme": "geral",
        "subtheme": "Estatística",
        "statement": "De acordo com o Tratado de Psiquiatria da ABP (2022), no contexto de metanálises e ensaios clínicos, o 'd de Cohen' é uma medida padronizada de tamanho de efeito. Como é classificada a magnitude de um efeito quando o valor de d é 0,50?",
        "options": {
            "A": "Insignificante",
            "B": "Pequeno",
            "C": "Médio",
            "D": "Grande",
            "E": "Muito Grande"
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "Segundo a tabela de classificação de Cohen apresentada no Tratado (Quadro 5.2): d=0,20 é Pequeno; d=0,50 é Médio; d=0,80 é Grande.",
            "keyConcepts": ["Estatística", "Tamanho de Efeito", "Cohen's d"],
            "examTip": "Memorize os marcos: 0.2 (P), 0.5 (M), 0.8 (G)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Valores < 0.2 seriam irrelevantes.",
            "B": "Incorreta. Corresponde a d=0,20.",
            "C": "Correta. O valor 0,50 é o marco padrão para efeito de magnitude MÉDIA.",
            "D": "Incorreta. Corresponde a d=0,80.",
            "E": "Incorreta. Valores > 1.0 ou > 0.8 dependendo da referência, mas 0.5 é médio."
        },
        "tags": ["Tratado 2022", "Estatística", "Metodologia"]
    },
    {
        "id": "t003",
        "theme": "neurociencias",
        "subtheme": "Neuroanatomia",
        "statement": "O lobo da ínsula desempenha funções complexas e integra o sistema límbico. Segundo o Tratado de Psiquiatria da ABP (2022), além de coordenar emoções, a ínsula é responsável por qual sentido específico, cuja perda pode ocorrer em lesões dessa região?",
        "options": {
            "A": "Olfato",
            "B": "Visão periférica",
            "C": "Paladar",
            "D": "Audição",
            "E": "Equilíbrio"
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O Tratado descreve que o lobo da ínsula é responsável pelo paladar e que suas alterações podem levar à perda desse sentido (ageusia/disgeusia), além do envolvimento em processos emocionais.",
            "keyConcepts": ["Ínsula", "Paladar", "Neuroanatomia"],
            "examTip": "Ínsula = Nojo/Emoção + Paladar."
        },
        "itemAnalysis": {
            "A": "Incorreta. Olfato está ligado ao bulbo olfatório e córtex piriforme (uncus), não primariamente à ínsula.",
            "B": "Incorreta. Lobo occipital.",
            "C": "Correta. A ínsula contém o córtex gustativo primário.",
            "D": "Incorreta. Lobo temporal (giro de Heschl).",
            "E": "Incorreta. Sistema vestibular/Cerebelo."
        },
        "tags": ["Tratado 2022", "Neuroanatomia"]
    },
    {
        "id": "t004",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Consciência e Atitude",
        "statement": "Na avaliação psicopatológica da atitude do paciente perante o examinador, o Tratado de Psiquiatria da ABP descreve diversos tipos de comportamento. Assinale a alternativa que define corretamente a 'atitude gliscroide':",
        "options": {
            "A": "O paciente aceita passivamente todas as demandas.",
            "B": "O comportamento é viscoso, grudento, tentando prolongar o contato indefinidamente.",
            "C": "O paciente tenta impor sua vontade por ameaças ou chantagem.",
            "D": "O paciente exibe comportamento infantil ou pueril.",
            "E": "O paciente tenta ocultar ou disfarçar um sintoma presente."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Atitude Gliscroide é definida no Tratado como aquela em que o paciente é 'viscoso', 'grudento', e tenta prolongar indefinidamente o contato com o examinador. Comum na epilepsia (personalidade gliscroide).",
            "keyConcepts": ["Psicopatologia", "Atitude", "Gliscroide"],
            "examTip": "Gliscroide = Grudento (Viscosidade)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Define atitude Submissa.",
            "B": "Correta. Definição literal de gliscroide.",
            "C": "Incorreta. Define atitude Manipuladora.",
            "D": "Incorreta. Define atitude Pueril.",
            "E": "Incorreta. Define Dissimulação."
        },
        "tags": ["Tratado 2022", "Psicopatologia", "Exame Psíquico"]
    },
    {
        "id": "t005",
        "theme": "neurociencias",
        "subtheme": "Neuroanatomia",
        "statement": "Existe uma diferenciação funcional importante entre as sub-regiões do córtex pré-frontal. De acordo com o Tratado de Psiquiatria da ABP (2022), enquanto o córtex pré-frontal ventromedial está implicado no controle de emoções e afeto, o córtex pré-frontal dorsolateral (CPFDL) está primariamente envolvido com:",
        "options": {
            "A": "Regulação do ciclo sono-vigília.",
            "B": "Controle motor fino.",
            "C": "Funções executivas e memória.",
            "D": "Processamento visual primário.",
            "E": "Reconhecimento facial."
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto afirma explicitamente: '...o córtex pré-frontal dorsolateral está envolvido nas funções executivas, associadas a aprendizagem, memória e execução de atividades'.",
            "keyConcepts": ["Córtex Pré-Frontal", "Dorsolateral", "Funções Executivas"],
            "examTip": "Dorsolateral = Executivo/Racional. Ventromedial = Emocional/Quente."
        },
        "itemAnalysis": {
            "A": "Incorreta. Hipotálamo/Tronco.",
            "B": "Incorreta. Córtex motor/Pré-motor.",
            "C": "Correta. O CPFDL é o centro das funções executivas (planejamento, memória de trabalho).",
            "D": "Incorreta. Occipital.",
            "E": "Incorreta. Giro fusiforme (temporal)."
        },
        "tags": ["Tratado 2022", "Neuroanatomia"]
    },
    {
        "id": "t006",
        "theme": "dependencia_quimica",
        "subtheme": "Estimulantes",
        "statement": "Segundo dados epidemiológicos citados no Tratado de Psiquiatria da ABP (2022), referentes ao levantamento LENAD II, existe uma diferença significativa de gênero no consumo de cocaína na vida. Qual a prevalência aproximada relatada para homens versus mulheres?",
        "options": {
            "A": "5% em homens vs 1,3% em mulheres.",
            "B": "10% em homens vs 5% em mulheres.",
            "C": "Prevalências idênticas (cerca de 3%).",
            "D": "1,3% em homens vs 5% em mulheres.",
            "E": "20% em homens vs 10% em mulheres."
        },
        "correctAnswer": "A",
        "difficulty": 3,
        "explanation": {
            "correct": "A pesquisa aponta que 3,1% consumiram alguma vez na vida, com maior prevalência em homens (5%) do que em mulheres (1,3%).",
            "keyConcepts": ["Epidemiologia", "Cocaína", "LENAD II"],
            "examTip": "Homens usam cerca de 3-4x mais cocaína que mulheres segundo os dados nacionais."
        },
        "itemAnalysis": {
            "A": "Correta. Dados extraídos do texto (5% vs 1,3%).",
            "B": "Incorreta. Exagerado.",
            "C": "Incorreta. Texto diz explicitamente que homens > mulheres.",
            "D": "Incorreta. Invertido.",
            "E": "Incorreta. Muito exagerado."
        },
        "tags": ["Tratado 2022", "Dependência Química", "Epidemiologia"]
    },
    {
        "id": "t007",
        "theme": "dependencia_quimica",
        "subtheme": "Estimulantes",
        "statement": "A história do uso da cocaína é marcada por mudanças regulatórias significativas. De acordo com o histórico apresentado no Tratado de Psiquiatria da ABP (2022), qual foi o ato legislativo norte-americano de 1914 que baniu o uso da cocaína (equiparando-a a narcóticos como morfina e heroína) devido a relatos de dependência e efeitos colaterais?",
        "options": {
            "A": "Lei Seca (Volstead Act).",
            "B": "Pure Food and Drug Act.",
            "C": "Harrison Narcotics Act.",
            "D": "Controlled Substances Act.",
            "E": "Marihuana Tax Act."
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O Harrison Narcotics Act de 1914 foi o marco regulatório que proibiu o uso não médico de cocaína nos EUA, classificando-a como narcótico.",
            "keyConcepts": ["História da Psiquiatria", "Cocaína", "Legislação"],
            "examTip": "1914 = Harrison Act = Proibição da Cocaína."
        },
        "itemAnalysis": {
            "A": "Incorreta. Proibição do álcool (1919).",
            "B": "Incorreta. Lei de rotulagem anterior (1906).",
            "C": "Correta. Harrison Narcotics Act (1914) baniu cocaína/opiáceos.",
            "D": "Incorreta. Lei de 1970 (Nixon).",
            "E": "Incorreta. Lei de 1937 sobre maconha."
        },
        "tags": ["Tratado 2022", "Dependência Química", "História"]
    },
    {
        "id": "t008",
        "theme": "transtornos_humor",
        "subtheme": "Depressão Maior",
        "statement": "A neurobiologia da depressão envolve múltiplos sistemas de neurotransmissão. Segundo o Tratado de Psiquiatria da ABP (2022), estudos de espectroscopia por ressonância magnética (MRS) têm demonstrado consistentemente a REDUÇÃO dos níveis corticais (especialmente pré-frontais e occipitais) de qual neurotransmissor inibitório em pacientes deprimidos?",
        "options": {
            "A": "Glutamato",
            "B": "GABA (Ácido Gama-Aminobutírico)",
            "C": "Dopamina",
            "D": "Acetilcolina",
            "E": "Glicina"
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "O texto cita estudos (Sanacora et al., 1999; Hasler et al., 2007) que mostram redução dos níveis de GABA (e também glutamato/glutamina) em pacientes com depressão maior.",
            "keyConcepts": ["Neurobiologia", "Depressão", "GABA"],
            "examTip": "Depressão = Déficit de Inibição (GABA baixo) + Excitotoxicidade/Déficit Glial (Glutamato alterado)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Glutamato também pode estar reduzido (pool glial), mas a questão foca no inibitório clássico.",
            "B": "Correta. GABA é o principal inibitório e está reduzido na depressão.",
            "C": "Incorreta. MRS não mede dopamina diretamente com facilidade; foco é aminoácidos.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Depressão"]
    },
    {
        "id": "t009",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Esquizofrenia",
        "statement": "No manejo da esquizofrenia resistente ao tratamento, a clozapina é o padrão-ouro. Contudo, cerca de 40-70% dos pacientes podem não responder adequadamente mesmo à clozapina (resistência à clozapina). De acordo com as evidências de metanálises citadas no Tratado de Psiquiatria da ABP (2022), qual estratégia de AUGMENTAÇÃO (potencialização) da clozapina possui evidência favorável descrita?",
        "options": {
            "A": "Associação com carbamazepina.",
            "B": "Augmentação com ECT (Eletroconvulsoterapia).",
            "C": "Uso concomitante de altas doses de benzodiazepínicos.",
            "D": "Associação com anticolinérgicos.",
            "E": "Troca imediata por olanzapina."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto referente à esquizofrenia resistente cita metanálises (Wang et al., 2018) apoiando a augmentação de clozapina com ECT como uma estratégia baseada em evidências para casos resistentes.",
            "keyConcepts": ["Esquizofrenia Resistente", "Clozapina", "ECT"],
            "examTip": "Clozapina falhou? Pensar em ECT ou estratégias combinadas (mas ECT tem evidência forte)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Carbamazepina reduz nível de clozapina (indutor CYP) e aumenta risco de agranulocitose.",
            "B": "Correta. ECT + Clozapina é uma estratégia validada para 'ultra-resistência'.",
            "C": "Incorreta. Sedação excessiva sem benefício antipsicótico claro a longo prazo.",
            "D": "Incorreta. Piora cognitiva e risco de íleo paralítico.",
            "E": "Incorreta. Se não respondeu a clozapina, olanzapina raramente funciona (downgrade)."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Esquizofrenia"]
    },
    {
        "id": "t010",
        "theme": "saude_publica",
        "subtheme": "Sociologia e Cultura",
        "statement": "Conceitos das ciências sociais têm sido integrados à psiquiatria para melhor compreensão dos determinantes de saúde. O Tratado de Psiquiatria da ABP (2022) destaca o conceito de 'competência estrutural' (Structural Competency). O que esse conceito propõe?",
        "options": {
            "A": "Capacidade do médico de realizar exames neurológicos estruturais.",
            "B": "Habilidade de gerir a estrutura física de hospitais psiquiátricos.",
            "C": "Reconhecimento de como estruturas sociais, econômicas e políticas produzem estigma e desigualdade em saúde.",
            "D": "Competência em prescrever tratamentos baseados puramente na estrutura molecular dos fármacos.",
            "E": "Capacidade de estruturar o tempo da sessão terapêutica adequadamente."
        },
        "correctAnswer": "C",
        "difficulty": 3,
        "explanation": {
            "correct": "O conceito de Competência Estrutural (Metzl & Hansen, 2014, citado no Tratado) refere-se à capacidade dos profissionais de saúde de reconhecer e intervir sobre as forças estruturais (racismo, economia, política) que determinam sintomas e doenças.",
            "keyConcepts": ["Saúde Pública", "Competência Estrutural", "Determinantes Sociais"],
            "examTip": "Estrutural aqui = Estrutura Social (não anatômica)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Interpretação literal errônea.",
            "B": "Incorreta. Gestão hospitalar.",
            "C": "Correta. Definição precisa de Competência Estrutural.",
            "D": "Incorreta. Farmacologia.",
            "E": "Incorreta. Técnica psicoterápica."
        },
        "tags": ["Tratado 2022", "Saúde Pública", "Sociologia"]
    },
    {
        "id": "t011",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Psicofarmacologia na Infância",
        "statement": "No tratamento farmacológico de esquizofrenia em crianças e adolescentes, as diretrizes buscam equilibrar eficácia e efeitos adversos metabólicos. Segundo revisões recentes citadas no Tratado (Pagsberg et al., 2017), houve uma tendência de redução na prescrição de primeira linha de qual antipsicótico específico devido ao seu perfil metabólico desfavorável nessa população?",
        "options": {
            "A": "Aripiprazol",
            "B": "Ziprasidona",
            "C": "Olanzapina",
            "D": "Lurasidona",
            "E": "Haloperidol"
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto menciona a redução da prescrição de olanzapina como primeira linha em primeiro episódio psicótico/jovens devido ao ganho de peso e risco metabólico (Nguyen et al., 2020/Pagsberg et al.).",
            "keyConcepts": ["Psiquiatria Infantil", "Antipsicóticos", "Síndrome Metabólica"],
            "examTip": "Olanzapina = Ganho de Peso = Evitar em crianças como 1ª opção se possível."
        },
        "itemAnalysis": {
            "A": "Incorreta. Perfil metabólico neutro, frequentemente 1ª linha.",
            "B": "Incorreta. Perfil neutro.",
            "C": "Correta. Eficaz, mas evitada como 1ª escolha por ganho de peso intenso em jovens.",
            "D": "Incorreta. Perfil neutro.",
            "E": "Incorreta. Efeitos motores são a preocupação, não metabólicos primariamente."
        },
        "tags": ["Tratado 2022", "Psiquiatria Infantil", "Psicofarmacologia"]
    },
    {
        "id": "t012",
        "theme": "transtornos_ansiedade",
        "subtheme": "Transtorno de Estresse Pós-Traumático (TEPT)",
        "statement": "O DSM-5 trouxe mudanças significativas nos critérios diagnósticos do TEPT. Segundo o Tratado de Psiquiatria da ABP (2022), uma nota importante no 'Critério A' (Exposição) especifica que a exposição a através de mídia eletrônica, televisão ou filmes:",
        "options": {
            "A": "Conta como critério diagnóstico se o conteúdo for extremamente violento.",
            "B": "É considerada critério A apenas para crianças menores de 6 anos.",
            "C": "Não se aplica como critério A, exceto quando tal exposição estiver relacionada ao trabalho.",
            "D": "É suficiente para o diagnóstico se a exposição for repetida por mais de 30 dias.",
            "E": "Nunca pode ser considerada para fins diagnósticos."
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O DSM-5 e o Tratado explicitam: 'o Critério A4 não se aplica à exposição por meio de mídia eletrônica... a menos que tal exposição esteja relacionada ao trabalho' (ex: policiais analisando provas de abuso).",
            "keyConcepts": ["TEPT", "Critério A", "DSM-5"],
            "examTip": "Ver TV não causa TEPT (para fins de diagnóstico), a menos que seja seu trabalho (ex: moderador de conteúdo)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Violência na TV não conta.",
            "B": "Incorreta. Regra geral.",
            "C": "Correta. Exceção laboral (trabalho).",
            "D": "Incorreta. Duração não muda o critério do evento.",
            "E": "Incorreta. Existe a exceção laboral."
        },
        "tags": ["Tratado 2022", "TEPT", "Diagnóstico"]
    },
    {
        "id": "t013",
        "theme": "transtornos_humor",
        "subtheme": "Transtorno Bipolar",
        "statement": "O Lítio continua sendo um pilar no tratamento do Transtorno Bipolar. Além de sua estabilização do humor, o Tratado de Psiquiatria da ABP destaca um efeito 'antissuicida' único. Estudos citados no texto correlacionam inclusive a presença natural de lítio na água potável com:",
        "options": {
            "A": "Aumento das taxas de hipotireoidismo subclínico.",
            "B": "Redução nas taxas de suicídio na população geral daquela região.",
            "C": "Nenhuma alteração observável nos desfechos de saúde pública.",
            "D": "Aumento na incidência de anomalia de Ebstein.",
            "E": "Melhora apenas nos índices de criminalidade, sem efeito no suicídio."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O Tratado menciona estudos que apontam reduções nas taxas de suicídio em populações gerais vivendo em áreas com maiores concentrações (mesmo que baixas/traços) de lítio na água.",
            "keyConcepts": ["Lítio", "Suicídio", "Psicofarmacologia"],
            "examTip": "Lítio na água = Menos Suicídio (efeito populacional)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Efeito colateral clínico, mas o destaque epidemiológico é o suicídio.",
            "B": "Correta. Correlação inversa observada.",
            "C": "Incorreta.",
            "D": "Incorreta. Ebstein é risco teratogênico em dose terapêutica na gestação.",
            "E": "Incorreta. O foco é suicídio."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Lítio"]
    },
    {
        "id": "t014",
        "theme": "psicoterapia",
        "subtheme": "Sexualidade",
        "statement": "No tratamento das disfunções sexuais, as abordagens combinam farmacologia e psicoterapia. Para a Disfunção Erétil, o Tratado de Psiquiatria aponta como medicamentos de PRIMEIRA escolha:",
        "options": {
            "A": "Injeções intracavernosas de alprostadil.",
            "B": "Testosterona injetável.",
            "C": "Antidepressivos tricíclicos.",
            "D": "Inibidores da fosfodiesterase tipo 5 (PDE-5).",
            "E": "Ansiolíticos benzoadiazepínicos."
        },
        "correctAnswer": "D",
        "difficulty": 1,
        "explanation": {
            "correct": "Os inibidores da PDE-5 (como sildenafila, tadalafila) são citados textualmente como a primeira escolha farmacológica para recuperar e manter a resposta erétil.",
            "keyConcepts": ["Sexualidade", "Disfunção Erétil", "Farmacologia"],
            "examTip": "Primeira linha para DE = Inibidores de PDE-5."
        },
        "itemAnalysis": {
            "A": "Incorreta. Segunda/Terceira linha.",
            "B": "Incorreta. Apenas se houver hipogonadismo comprovado.",
            "C": "Incorreta. Podem piorar a função sexual.",
            "D": "Correta. Padrão ouro inicial.",
            "E": "Incorreta. Podem causar disfunção erétil."
        },
        "tags": ["Tratado 2022", "Sexualidade", "Psicofarmacologia"]
    },
    {
        "id": "t015",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "TDAH",
        "statement": "As intervenções psicossociais são fundamentais no TDAH. De acordo com o Tratado de Psiquiatria da ABP (2022), qual intervenção específica se apresenta entre as 'mais eficazes' para auxiliar crianças na organização e manejo de sintomas, muitas vezes incorporada à psicoeducação?",
        "options": {
            "A": "Treinamento Parental (Treinamento de Pais).",
            "B": "Psicanálise Clássica.",
            "C": "Ludoterapia não-diretiva.",
            "D": "Dieta de restrição de corantes.",
            "E": "Neurofeedback isolado."
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto afirma que 'programas de treinamento parental se apresentam entre as intervenções psicossociais mais eficazes no tratamento do TDAH', focando no manejo de sintomas e organização.",
            "keyConcepts": ["TDAH", "Psicoterapia", "Treinamento Parental"],
            "examTip": "Criança com TDAH -> Treinar os Pais é intervenção chave (Padrão Ouro psicossocial)."
        },
        "itemAnalysis": {
            "A": "Correta. Alta evidência de eficácia.",
            "B": "Incorreta. Menor evidência para sintomas nucleares.",
            "C": "Incorreta. Menor evidência comparativa.",
            "D": "Incorreta. Intervenção dietética (controverso/menor efeito).",
            "E": "Incorreta. Evidência ainda debatida/menor que comportamental."
        },
        "tags": ["Tratado 2022", "Psiquiatria Infantil", "TDAH"]
    },
    {
        "id": "t016",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Transtornos do Desenvolvimento",
        "statement": "O DSM-5 reorganizou os Transtornos Globais do Desenvolvimento. Uma mudança importante citada no Tratado de Psiquiatria da ABP foi a RETIRADA de uma condição específica da categoria de Transtorno do Espectro Autista (TEA), por esta possuir etiologia genética conhecida e clara. Que condição é essa?",
        "options": {
            "A": "Síndrome de Asperger.",
            "B": "Transtorno Desintegrativo da Infância.",
            "C": "Síndrome de Rett.",
            "D": "Autismo Atípico.",
            "E": "Síndrome de Tourette."
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto explica que 'a síndrome de Rett foi retirada dessa categoria [TEA], considerando as evidências que indicam tratar-se de uma síndrome genética com etiologia conhecida' (MECP2). Asperger e outros foram fundidos no TEA.",
            "keyConcepts": ["DSM-5", "TEA", "Síndrome de Rett"],
            "examTip": "Rett saiu do TEA no DSM-5 (é genética/neurológica). Asperger entrou no TEA (fusionado)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Foi incorporada ao TEA.",
            "B": "Incorreta. Foi incorporada ao TEA.",
            "C": "Correta. Excluída por ser doença genética distinta.",
            "D": "Incorreta. Incorporada.",
            "E": "Incorreta. Nunca foi TGD (é transtorno de tique)."
        },
        "tags": ["Tratado 2022", "Psiquiatria Infantil", "Diagnóstico"]
    },
    {
        "id": "t017",
        "theme": "transtornos_alimentares",
        "subtheme": "Anorexia Nervosa",
        "statement": "O DSM-5 subtipifica a Anorexia Nervosa em dois tipos principais. De acordo com o Tratado de Psiquiatria da ABP (2022), qual característica define o 'Tipo Compulsão Alimentar/Purgação' (Binge-Eating/Purging Type)?",
        "options": {
            "A": "Perda de peso puramente por dieta e exercício excessivo nos últimos 3 meses.",
            "B": "Presença de episódios recorrentes de compulsão alimentar ou comportamento purgativo (vômitos, laxantes) nos últimos 3 meses.",
            "C": "Índice de Massa Corporal (IMC) abaixo de 15 kg/m².",
            "D": "Ausência de amenorreia (que deixou de ser critério obrigatório).",
            "E": "Início tardio, após os 25 anos de idade."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O DSM-5 divide a Anorexia em: 1) Tipo Restritivo (apenas dieta/jejum/exercício) e 2) Tipo Compulsão/Purgação (apresentou episódios de binge ou purgação nos últimos 3 meses).",
            "keyConcepts": ["Anorexia Nervosa", "Subtipos", "Diagnóstico"],
            "examTip": "Tem vômito/laxante ou compulsão? É tipo Purgativo. Só para de comer? É tipo Restritivo."
        },
        "itemAnalysis": {
            "A": "Incorreta. Define o Tipo Restritivo.",
            "B": "Correta. Critério definidor do subtipo purgativo.",
            "C": "Incorreta. Define gravidade (Extrema), não o subtipo.",
            "D": "Incorreta. Amenorreia realmente caiu, mas não define o subtipo.",
            "E": "Incorreta. Não define subtipo."
        },
        "tags": ["Tratado 2022", "Transtornos Alimentares", "Diagnóstico"]
    },
    {
        "id": "t018",
        "theme": "transtornos_alimentares",
        "subtheme": "Outros Transtornos Alimentares",
        "statement": "O Transtorno Alimentar Restritivo/Evitativo (TARE ou ARFID) foi introduzido no DSM-5. Segundo o Tratado de Psiquiatria da ABP, qual é a DIFERENÇA fundamental que distingue o TARE da Anorexia Nervosa?",
        "options": {
            "A": "No TARE, não há perda de peso significativa.",
            "B": "No TARE, não há distorção da imagem corporal nem medo de ganhar peso.",
            "C": "O TARE ocorre exclusivamente em crianças menores de 7 anos.",
            "D": "O TARE envolve necessariamente rituais de contagem de calorias.",
            "E": "O TARE é tratado exclusivamente com cirurgia gástrica."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O critério diferencial chave é que no TARE/ARFID a restrição alimentar NÃO é motivada por preocupação com peso/forma corporal ou distorção da imagem (Critério C da Anorexia está ausente). A motivação é sensorial, falta de interesse ou medo de consequências aversivas (engasgo).",
            "keyConcepts": ["TARE", "ARFID", "Anorexia Nervosa", "Diagnóstico Diferencial"],
            "examTip": "TARE = Não come por 'chatiche'/medo de engasgar/textura. Anorexia = Não come para não engordar."
        },
        "itemAnalysis": {
            "A": "Incorreta. Pode haver perda de peso grave e desnutrição no TARE.",
            "B": "Correta. Ausência de preocupação com peso/corpo é o marco diferencial.",
            "C": "Incorreta. Pode persistir ou iniciar na idade adulta.",
            "D": "Incorreta. Isso é típico de Anorexia.",
            "E": "Incorreta. Tratamento é nutricional/comportamental."
        },
        "tags": ["Tratado 2022", "Transtornos Alimentares", "Diagnóstico"]
    },
    {
        "id": "t019",
        "theme": "psicofarmacologia",
        "subtheme": "Estabilizadores de Humor",
        "statement": "A Carbamazepina é um estabilizador de humor clássico. Contudo, seu perfil de eficácia possui nuances. De acordo com o Tratado de Psiquiatria da ABP (2022), para qual fase do Transtorno Bipolar a carbamazepina NÃO possui evidência sólida de eficácia superior ao placebo, sendo não recomendada como monoterpia de primeira linha para essa fase?",
        "options": {
            "A": "Mania Aguda.",
            "B": "Estados Mistos.",
            "C": "Depressão Bipolar Aguda.",
            "D": "Profilaxia de Mania.",
            "E": "Epilepsia Lóbulo Temporal (comorbidade)."
        },
        "correctAnswer": "C",
        "difficulty": 3,
        "explanation": {
            "correct": "O texto afirma: 'Revisão da literatura não identificou estudos que mostrem superioridade da carbamazepina quando comparada ao placebo para tratamento de depressão bipolar'. Sua eficácia é consolidada para Mania.",
            "keyConcepts": ["Carbamazepina", "Depressão Bipolar", "Psicofarmacologia"],
            "examTip": "Carbamazepina = Ótima para Mania, Ruim/Sem evidência para Depressão."
        },
        "itemAnalysis": {
            "A": "Incorreta. Eficaz (embora 2ª linha por tolerabilidade).",
            "B": "Incorreta. Pode ser usada.",
            "C": "Correta. Falta evidência de eficácia.",
            "D": "Incorreta. Tem eficácia profilática.",
            "E": "Incorreta. É anticonvulsivante eficaz."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Transtorno Bipolar"]
    },
    {
        "id": "t020",
        "theme": "geral",
        "subtheme": "Estatística",
        "statement": "No contexto da Medicina Baseada em Evidências, o NNT (Número Necessário para Tratar) é uma medida clínica crucial. Segundo a definição apresentada no capítulo de estatística do Tratado, como é calculado o NNT?",
        "options": {
            "A": "É o inverso da Redução Absoluta do Risco (1 / RAR).",
            "B": "É o inverso do Risco Relativo (1 / RR).",
            "C": "É a diferença entre o Risco no grupo controle e o Risco no grupo intervenção.",
            "D": "É o produto do Odds Ratio pela prevalência.",
            "E": "É a raiz quadrada do tamanho da amostra."
        },
        "correctAnswer": "A",
        "difficulty": 3,
        "explanation": {
            "correct": "O NNT é calculado como o inverso da Redução Absoluta do Risco (RAR). Se a RAR é 14,5% (0.145), o NNT é 1/0.145 = 6.9 (aprox 7). Indica quantos pacientes tratar para evitar 1 desfecho ruim.",
            "keyConcepts": ["Estatística", "NNT", "Epidemiologia Clínica"],
            "examTip": "NNT = 1 / (RiscoControle - RiscoTratamento). Quanto menor o NNT, melhor o remédio."
        },
        "itemAnalysis": {
            "A": "Correta. Fórmula clássica.",
            "B": "Incorreta.",
            "C": "Incorreta. Isso calcula o RAR, não o NNT.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Estatística", "Metodologia"]
    },
    {
        "id": "t021",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Escalas de Avaliação",
        "statement": "O uso de escalas padronizadas auxilia na objetividade da avaliação psiquiátrica. O Tratado de Psiquiatria cita a 'Young Mania Rating Scale' (YMRS) e a 'Edinburgh Postnatal Depression Scale' (EPDS). A EPDS foi validada no Brasil (Santos et al./Malloy-Diniz et al.) especificamente para rastreio de:",
        "options": {
            "A": "Depressão em idosos (Geriátrica).",
            "B": "Depressão no período pós-parto (puerperal).",
            "C": "Mania em adolescentes.",
            "D": "Déficit cognitivo em esquizofrenia.",
            "E": "Risco de suicídio em emergência."
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "A Edinburgh Postnatal Depression Scale (EPDS) é o instrumento padrão-ouro para rastreio de depressão pós-parto, citada no capítulo de avaliação neuropsicológica.",
            "keyConcepts": ["Escalas", "Depressão Pós-Parto", "EPDS"],
            "examTip": "Edinburgh = Pós-parto."
        },
        "itemAnalysis": {
            "A": "Incorreta. Escala de Yesavage (GDS).",
            "B": "Correta. Objetivo primário da escala.",
            "C": "Incorreta. YMRS é para mania (mas Young não é especifica de adolescentes puros).",
            "D": "Incorreta. BACS/MATRICS.",
            "E": "Incorreta. C-SSRS ou outras."
        },
        "tags": ["Tratado 2022", "Diagnóstico", "Escalas"]
    },
    {
        "id": "t022",
        "theme": "transtornos_humor",
        "subtheme": "Depressão Maior",
        "statement": "Aaron Beck, em seus estudos seminais sobre a depressão, desafiou as teorias vigentes da época. Segundo o Tratado de Psiquiatria da ABP, ao analisar os sonhos de pacientes deprimidos comparados aos de não deprimidos, o que Beck surpreendentemente observou (o que chamou de 'paradoxo masoquista')?",
        "options": {
            "A": "Pacientes deprimidos expressavam mais hostilidade contra os outros em seus sonhos.",
            "B": "Pacientes deprimidos tinham menos hostilidade e retratavam a si mesmos de forma negativa (autoimagem negativa).",
            "C": "Não havia diferença no conteúdo dos sonhos, apenas na frequência.",
            "D": "Os sonhos de deprimidos eram invariavelmente pesadelos sobre morte.",
            "E": "A insônia impedia a maioria dos pacientes de recordarem seus sonhos."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Beck observou que, ao contrário da teoria psicanalítica da época (raiva voltada para dentro), os pacientes deprimidos mostravam MENOS hostilidade nos sonhos, mas se retratavam consistentemente como vítimas ou fracassados (autoimagem negativa).",
            "keyConcepts": ["Terapia Cognitiva", "Aaron Beck", "Sonhos"],
            "examTip": "Beck = Tríade Cognitiva Negativa. Nos sonhos, o deprimido é o 'perdedor', não o 'agressor'."
        },
        "itemAnalysis": {
            "A": "Incorreta. Era o oposto do esperado.",
            "B": "Correta. Base da teoria cognitiva (visão negativa de si).",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicoterapia", "História"]
    },
    {
        "id": "t023",
        "theme": "transtornos_ansiedade",
        "subtheme": "TEPT",
        "statement": "A fisiopatologia do Transtorno de Estresse Pós-Traumático (TEPT) envolve a desregulação de sistemas de resposta ao estresse. De acordo com o Tratado de Psiquiatria, qual estrutura cerebral límbica é hiperativada pela noradrenalina em situações de medo, facilitando a consolidação de memórias traumáticas no hipocampo?",
        "options": {
            "A": "Córtex Pré-Frontal Dorsolateral.",
            "B": "Amígdala.",
            "C": "Núcleo Accumbens.",
            "D": "Tálamo Anterior.",
            "E": "Cerebelo."
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "A amígdala é a estrutura chave no processamento do medo. A noradrenalina a estimula, e ela (amígdala) ativa o hipocampo para consolidar a memória do trauma. No TEPT, há uma falha na inibição da amígdala pelo córtex pré-frontal.",
            "keyConcepts": ["Neurobiologia", "TEPT", "Amígdala"],
            "examTip": "TEPT = Amígdala 'ligada' no máximo (Medo) + Pré-frontal 'desligado' (Falta de freio)."
        },
        "itemAnalysis": {
            "A": "Incorreta. O córtex pré-frontal geralmente inibe a amígdala (falha no TEPT).",
            "B": "Correta. Centro do medo e processamento emocional.",
            "C": "Incorreta. Sistema de recompensa.",
            "D": "Incorreta. Relé sensorial.",
            "E": "Incorreta. Coordenação motora."
        },
        "tags": ["Tratado 2022", "Neurociências", "TEPT"]
    },
    {
        "id": "t024",
        "theme": "psicofarmacologia",
        "subtheme": "Cannabis Medicinal",
        "statement": "O Canabidiol (CBD) tem ganhado destaque terapêutico. Segundo o Tratado de Psiquiatria da ABP, qual é o principal mecanismo de ação proposto para o CBD no sistema endocanabinoide, diferenciando-o do THC?",
        "options": {
            "A": "Agonista total potente dos receptores CB1.",
            "B": "Antagonista competitivo irreversível de CB2.",
            "C": "Modulador alostérico negativo ou agonista inverso fraco de receptores CB1 (não psicomimético).",
            "D": "Inibidor da recaptação de serotonina.",
            "E": "Bloqueador de canais de sódio voltagem-dependentes."
        },
        "correctAnswer": "C",
        "difficulty": 3,
        "explanation": {
            "correct": "O CBD não ativa o receptor CB1 como o THC (que é agonista parcial e causa 'barato'). O CBD atua como antagonista/modulador alostérico negativo, o que explica sua falta de efeitos psicotomiméticos e possível efeito antipsicótico.",
            "keyConcepts": ["Canabidiol", "Mecanismo de Ação", "Psicofarmacologia"],
            "examTip": "THC = Agonista CB1 (Dá barato/Psicose). CBD = Antagonista/Modulador (Acalma/Antipsicótico)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Mecanismo do THC (parcial) ou sintéticos (K2/Spice).",
            "B": "Incorreta.",
            "C": "Correta. Perfil complexo mas funcionalmente 'freia' o sistema ou não o ativa diretamente.",
            "D": "Incorreta. Tem efeito em 5HT1A, mas a questão foca no sistema endocanabinoide.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Cannabis"]
    },
    {
        "id": "t025",
        "theme": "dependencia_quimica",
        "subtheme": "Opioides",
        "statement": "A Buprenorfina é uma opção farmacológica para o tratamento da dependência de opioides. Qual é a característica farmacodinâmica e farmacocinética distintiva deste fármaco descrita no Tratado?",
        "options": {
            "A": "É um antagonista puro como a naloxona, usado apenas em overdose.",
            "B": "É um agonista total mu (μ) de curta duração.",
            "C": "É um agonista parcial mu (μ), com alta afinidade e lenta dissociação (longa duração de ação).",
            "D": "É administrada exclusivamente por via intravenosa devido à hepatotoxicidade.",
            "E": "Não possui teto de efeito respiratório (alto risco de overdose).",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "A buprenorfina é um agonista parcial (efeito teto, segurança), mas tem altíssima afinidade pelo receptor e se dissocia lentamente, o que permite dosagem menos frequente e bloqueio de outros opioides (efeito antagonista funcional).",
            "keyConcepts": ["Buprenorfina", "Dependência de Opioides", "Agonista Parcial"],
            "examTip": "Buprenorfina = Agonista Parcial + Alta Afinidade ('Gruda e não solta, mas não ativa tudo')."
        },
        "itemAnalysis": {
            "A": "Incorreta. É agonista parcial.",
            "B": "Incorreta. Metadona é agonista total.",
            "C": "Correta. Definição precisa.",
            "D": "Incorreta. Via sublingual é a padrão (baixa biodisponibilidade oral).",
            "E": "Incorreta. Tem efeito teto para depressão respiratória (segura)."
        },
        "tags": ["Tratado 2022", "Dependência Química", "Psicofarmacologia"]
    },
    {
        "id": "t026",
        "theme": "neurociencias",
        "subtheme": "Neurocirurgia/Estimulação",
        "statement": "A Estimulação Cerebral Profunda (DBS) é uma técnica estabelecida para Doença de Parkinson. Segundo o Tratado de Psiquiatria, qual núcleo cerebral é o alvo clássico da DBS para tratar os sintomas motores do Parkinson, com evidência robusta de eficácia?",
        "options": {
            "A": "Núcleo Accumbens.",
            "B": "Núcleo Subtalâmico (STN).",
            "C": "Amígdala Basolateral.",
            "D": "Giro do Cíngulo Anterior.",
            "E": "Hipocampo.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O Núcleo Subtalâmico (STN) e o Globo Pálido Interno (GPi) são os alvos primários para DBS em Parkinson. O texto cita estudos (Vitek et al.) sobre DBS do núcleo subtalâmico.",
            "keyConcepts": ["DBS", "Parkinson", "Neurocirurgia"],
            "examTip": "DBS em Parkinson = Núcleo Subtalâmico (STN)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Alvo investigado para TOC/Adicção.",
            "B": "Correta. Alvo motor clássico.",
            "C": "Incorreta.",
            "D": "Incorreta. Alvo para Depressão.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Neurocirurgia"]
    },
    {
        "id": "t027",
        "theme": "psicoterapia",
        "subtheme": "Sexualidade",
        "statement": "Fatores hormonais influenciam a função sexual. De acordo com o Tratado de Psiquiatria da ABP, além da testosterona e estrogênio, outros hormônios/fatores podem afetar a resposta sexual. O uso de contraceptivos orais, por exemplo, foi associado em alguns estudos (Panzer et al., 2006) ao aumento de qual proteína, que pode reduzir a testosterona livre e afetar a libido?",
        "options": {
            "A": "Albumina.",
            "B": "Globulina Ligadora de Hormônios Sexuais (SHBG).",
            "C": "Ferritina.",
            "D": "Prolactina.",
            "E": "Cortisol.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "Contraceptivos orais aumentam a síntese hepática de SHBG. O SHBG se liga à testosterona com alta afinidade, reduzindo a fração livre (bioativa), o que pode contribuir para baixa libido em algumas mulheres.",
            "keyConcepts": ["Fisiologia Sexual", "Hormônios", "SHBG"],
            "examTip": "Pílula -> Aumenta SHBG -> Rouba Testosterona Livre -> Pode baixar libido."
        },
        "itemAnalysis": {
            "A": "Incorreta. Liga testosterona, mas com baixa afinidade.",
            "B": "Correta. Principal regulador da fração livre.",
            "C": "Incorreta.",
            "D": "Incorreta. Prolactina alta inibe o eixo, mas o mecanismo da pílula citado é via SHBG.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sexualidade", "Endocrinologia"]
    },
    {
        "id": "t028",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Esquizofrenia",
        "statement": "Estudos sobre o Canabidiol (CBD) na esquizofrenia têm mostrado resultados promissores. Segundo revisão citada no Tratado (Hoch et al.), o CBD associado a antipsicóticos demonstrou melhora em qual domínio sintomatológico, diferenciando-se do placebo?",
        "options": {
            "A": "Sintomas Positivos (Delírios/Alucinações).",
            "B": "Apenas efeitos motores extrapiramidais.",
            "C": "Ganho de peso (aumentou o apetite).",
            "D": "Sintomas Negativos exclusivamente.",
            "E": "Não houve qualquer diferença em relação ao placebo.",
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto cita que um ensaio clínico mostrou que a associação de CBD melhorou os sintomas positivos quando comparado ao grupo placebo. (Embora estudos mais recentes debatam isso, o texto do Tratado afirma esse achado específico).",
            "keyConcepts": ["Canabidiol", "Esquizofrenia", "Tratamento"],
            "examTip": "CBD na Esquizofrenia = Potencial antipsicótico (Sintomas Positivos)."
        },
        "itemAnalysis": {
            "A": "Correta. De acordo com o texto extraído.",
            "B": "Incorreta.",
            "C": "Incorreta. CBD tende a reduzir apetite ou ser neutro comparado a antipsicóticos.",
            "D": "Incorreta. Embora seja um alvo de interesse, o texto especificou 'sintomas positivos'.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Esquizofrenia"]
    },
    {
        "id": "t029",
        "theme": "transtornos_alimentares",
        "subtheme": "Anorexia Nervosa",
        "statement": "Anorexia Nervosa (AN) apresenta alta mortalidade. Além da perda de peso evidente, o diagnóstico envolve aspectos cognitivos. O 'Critério B' do DSM-5 para AN refere-se a:",
        "options": {
            "A": "Restrição da ingestão calórica levando a peso significativamente baixo.",
            "B": "Medo intenso de ganhar peso ou de se tornar gordo, ou comportamento persistente que interfere no ganho de peso.",
            "C": "Perturbação no modo como o próprio peso ou forma corporal são vivenciados (distorção de imagem).",
            "D": "Amenorreia por pelo menos 3 ciclos consecutivos.",
            "E": "Episódios de compulsão alimentar.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "Critério A = Restrição/Baixo Peso. Critério B = Medo Intenso de engordar/Comportamento anti-ganho de peso. Critério C = Distorção de Imagem. Critério D (Amenorreia) foi abolido.",
            "keyConcepts": ["Anorexia Nervosa", "Critérios Diagnósticos", "DSM-5"],
            "examTip": "Critério B = O medo fóbico de gordura."
        },
        "itemAnalysis": {
            "A": "Incorreta. Esse é o Critério A.",
            "B": "Correta. Definição do Critério B.",
            "C": "Incorreta. Esse é o Critério C.",
            "D": "Incorreta. Abolido.",
            "E": "Incorreta. Define o subtipo ou a Bulimia."
        },
        "tags": ["Tratado 2022", "Transtornos Alimentares", "Diagnóstico"]
    },
    {
        "id": "t030",
        "theme": "psicogeriatria",
        "subtheme": "Demência",
        "statement": "No tratamento da Doença de Alzheimer, os inibidores da acetilcolinesterase (IAChE) são fundamentais. Entre os fármacos disponíveis (donepezila, rivastigmina, galantamina), qual deles possui a particularidade farmacológica de também inibir significativamente a enzima butirilcolinesterase (BChE)?",
        "options": {
            "A": "Donepezila.",
            "B": "Rivastigmina.",
            "C": "Galantamina.",
            "D": "Memantina.",
            "E": "Tacrina.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto explica que a Rivastigmina é um inibidor 'pseudo-reversível' que inibe tanto a Acetilcolinesterase (AChE) quanto a Butirilcolinesterase (BChE). Donepezila e Galantamina são seletivos para AChE.",
            "keyConcepts": ["Psicogeriatria", "Alzheimer", "Rivastigmina"],
            "examTip": "Rivastigmina = Dupla Inibição (AChE + BChE)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Seletivo AChE.",
            "B": "Correta. Inibe ambas.",
            "C": "Incorreta. Seletivo AChE (+ modulação nicotínica).",
            "D": "Incorreta. Antagonista NMDA.",
            "E": "Incorreta. Tacrina fazia isso, mas não é mais usada (hepatotóxica); questão foca nos disponíveis."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Psicofarmacologia"]
    },
    {
        "id": "t031",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "TDAH",
        "statement": "O estudo MTA (Multimodal Treatment Study of Children with ADHD) é um marco na literatura do TDAH. Sobre os resultados de longo prazo (seguimentos de 3, 8 e 16 anos), o Tratado de Psiquiatria da ABP destaca que:",
        "options": {
            "A": "A superioridade da medicação se manteve inalterada e robusta por 16 anos.",
            "B": "Os grupos tenderam a convergir em termos de desfecho clínico, desaparecendo a vantagem inicial clara da medicação.",
            "C": "A terapia comportamental isolada mostrou-se superior à medicação no longo prazo.",
            "D": "O grupo de manejo comunitário teve os melhores desfechos funcionais.",
            "E": "Todas as crianças remitiram dos sintomas na vida adulta.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "O texto nota que nos seguimentos de longo prazo (onde o tratamento não foi mais controlado/randomizado), as diferenças entre os grupos desapareceram ('tenderam a convergir'). Isso reflete a perda do controle experimental e a complexidade da evolução natural.",
            "keyConcepts": ["TDAH", "Estudo MTA", "Evolução"],
            "examTip": "MTA: Curto prazo = Remedio ganha. Longo prazo = Empate (convergência dos grupos)."
        },
        "itemAnalysis": {
            "A": "Incorreta. A vantagem clara foi nos primeiros 14 meses.",
            "B": "Correta. Achado clássico do follow-up do MTA.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta. TDAH persiste em boa parte dos casos."
        },
        "tags": ["Tratado 2022", "Psiquiatria Infantil", "TDAH"]
    },
    {
        "id": "t032",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Esquizofrenia",
        "statement": "Os sintomas cognitivos da esquizofrenia têm sido cada vez mais valorizados. Segundo o Tratado de Psiquiatria da ABP (2022), alguns autores chegam a sugerir que a esquizofrenia deveria ser definida como uma 'doença cognitiva'. Sobre esses sintomas, é CORRETO afirmar:",
        "options": {
            "A": "São secundários aos sintomas positivos e desaparecem quando as alucinações cessam.",
            "B": "Atingem apenas a memória de longo prazo, preservando as funções executivas.",
            "C": "São importantes preditores das dificuldades cotidianas (funcionalidade) e persistem mesmo na remissão dos sintomas positivos.",
            "D": "Não respondem a nenhuma intervenção, nem mesmo reabilitação.",
            "E": "São causados exclusivamente pelo uso crônico de antipsicóticos.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto destaca que os sintomas cognitivos (atenção, memória, funções executivas) são 'importantes preditores das dificuldades cotidianas' e 'mesmo quando há a remissão dos sintomas positivos, permanecem dificuldades'.",
            "keyConcepts": ["Esquizofrenia", "Cognição", "Prognóstico"],
            "examTip": "Esquizofrenia: Alucinação vai embora com remédio, mas o Déficit Cognitivo fica (e é ele que atrapalha o trabalho/estudo)."
        },
        "itemAnalysis": {
            "A": "Incorreta. São domínios independentes e mais estáveis.",
            "B": "Incorreta. Funções executivas são as mais afetadas.",
            "C": "Correta. Maior impacto funcional.",
            "D": "Incorreta. Reabilitação cognitiva ajuda.",
            "E": "Incorreta. Estão presentes antes do tratamento."
        },
        "tags": ["Tratado 2022", "Esquizofrenia", "Psicopatologia"]
    },
    {
        "id": "t033",
        "theme": "psicofarmacologia",
        "subtheme": "Estabilizadores de Humor",
        "statement": "A Lamotrigina é amplamente usada no Transtorno Bipolar, mas exige cuidados dermatológicos. Qual é a recomendação do Tratado de Psiquiatria da ABP (2022) em relação ao manejo do rash cutâneo benigno versus grave (Síndrome de Stevens-Johnson)?",
        "options": {
            "A": "Manter a medicação e associar corticoide e anti-histamínico.",
            "B": "Reduzir a dose pela metade e observar por 48 horas.",
            "C": "Interromper imediatamente a medicação ao primeiro sinal de rash, pois clinicamente é difícil distinguir inicialmente o benigno do grave.",
            "D": "O rash só preocupa se surgir após 6 meses de uso.",
            "E": "A Lamotrigina não causa rash; o problema é exclusivo da Carbamazepina.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto afirma: 'O grande dilema do clínico passa por definir em qual momento a medicação deve ser suspensa, pois, de início, não há como saber se o rash será benigno ou sinal da SSJ... a medicação deve ser interrompida imediatamente'.",
            "keyConcepts": ["Lamotrigina", "Efeitos Adversos", "Dermatologia"],
            "examTip": "Deu Rash com Lamotrigina? PARA TUDO. (Não pague pra ver)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Risco de vida.",
            "B": "Incorreta. Risco de progressão rápida.",
            "C": "Correta. Conduta de segurança padrão.",
            "D": "Incorreta. Ocorre nas primeiras 8 semanas (1ª a 8ª).",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Segurança"]
    },
    {
        "id": "t034",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Genética",
        "statement": "Na investigação etiológica da Deficiência Intelectual (DI) e do Transtorno do Espectro Autista (TEA), o Tratado de Psiquiatria menciona que a combinação de duas técnicas genéticas fornece um diagnóstico em pelo menos 25% dos pacientes. Quais são elas?",
        "options": {
            "A": "Cariótipo com Banda G e PCR para X-Frágil.",
            "B": "Microarray Cromossômico (CMA) e Sequenciamento Completo do Exoma (WES).",
            "C": "Dosagem de CPK e Ressonância Magnética.",
            "D": "Teste do Pezinho ampliado.",
            "E": "Eletroencefalograma e Sequenciamento de Sanger.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "O texto cita: 'Vários estudos demonstraram que uma combinação de CMA [Chromosomal Microarray Analysis] e WES [Whole Exome Sequencing] fornece um diagnóstico genético em pelo menos 25% dos pacientes'. O CMA é frequentemente o primeiro teste (para CNVs).",
            "keyConcepts": ["Genética", "TEA", "Deficiência Intelectual"],
            "examTip": "Investigação Genética Moderna = Microarray (CMA) + Exoma (WES)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Cariótipo tem baixa resolução para microdeleções.",
            "B": "Correta. Padrão ouro atual na investigação.",
            "C": "Incorreta. Inespecíficos.",
            "D": "Incorreta. Triagem neonatal (metabólica).",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Genética", "Psiquiatria Infantil"]
    },
    {
        "id": "t035",
        "theme": "psicoterapia",
        "subtheme": "Relação Médico-Paciente",
        "statement": "Michael Balint, psicanalista húngaro-britânico, cunhou uma frase célebre sobre a prática médica citada no Tratado. Segundo Balint, qual é o 'remédio mais usado em medicina'?",
        "options": {
            "A": "O paracetamol.",
            "B": "O próprio médico.",
            "C": "O tempo.",
            "D": "A esperança.",
            "E": "O placebo.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "A citação exata é: 'O remédio mais usado em medicina é o próprio médico, o qual, como os demais medicamentos, precisa ser conhecido em sua posologia, reações colaterais e toxicidade'.",
            "keyConcepts": ["Relação Médico-Paciente", "Michael Balint", "Grupos Balint"],
            "examTip": "Balint = O médico é o remédio."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Conceito central dos Grupos Balint.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Humanidades", "História"]
    },
    {
        "id": "t036",
        "theme": "psicogeriatria",
        "subtheme": "Demência Frontotemporal",
        "statement": "O tratamento farmacológico da Demência Frontotemporal (DFT) é desafiador e visa controle de sintomas. Segundo o Tratado de Psiquiatria, qual classe de medicamentos demonstrou, em alguns estudos (como Swartz et al., Lebert et al.), eficácia na redução de sintomas comportamentais (desinibição, impulsividade, compulsões)?",
        "options": {
            "A": "Inibidores da Acetilcolinesterase (IAChE) como donepezila.",
            "B": "Inibidores Seletivos da Recaptação de Serotonina (ISRS).",
            "C": "Estimulantes (Metilfenidato).",
            "D": "Benzodiazepínicos em altas doses.",
            "E": "Memantina (em monoterapia).",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto aponta que ISRSs (como paroxetina, fluvoxamina) e trazodona mostraram benefícios em sintomas comportamentais. Já os IAChE (donepezila) e Memantina tiveram resultados negativos ou controversos (piora comportamental foi relatada com donepezila).",
            "keyConcepts": ["Demência Frontotemporal", "Tratamento", "ISRS"],
            "examTip": "DFT = Problema de Comportamento -> Tentar ISRS (Serotonina regula impulso). Não usar anticolinesterásico (Donepezila) pois não falta acetilcolina e pode piorar."
        },
        "itemAnalysis": {
            "A": "Incorreta. Estudos negativos ou de piora.",
            "B": "Correta. Opção para manejo comportamental.",
            "C": "Incorreta. Piora agitação.",
            "D": "Incorreta. Piora cognição/desinibição.",
            "E": "Incorreta. Texto cita estudos negativos."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Psicofarmacologia"]
    },
    {
        "id": "t037",
        "theme": "geral",
        "subtheme": "Reforma Psiquiátrica",
        "statement": "A história das instituições psiquiátricas é complexa. O Tratado cita o Bethlem Royal Hospital ('Bedlam') em Londres como:",
        "options": {
            "A": "O primeiro hospital a abolir o uso de correntes, fundado por Pinel.",
            "B": "O hospital psiquiátrico mais antigo do mundo em funcionamento contínuo (origem em 1247).",
            "C": "Um exemplo de instituição moderna criada no pós-guerra.",
            "D": "Um centro exclusivamente para tratamento de epilepsia.",
            "E": "O local onde foi realizada a primeira lobotomia.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto afirma: 'Um dos hospitais psiquiátricos mais respeitados e o mais antigo em funcionamento no mundo, o Bethlem Royal Hospital, de Londres, remonta suas origens ao ano de 1247'.",
            "keyConcepts": ["História da Psiquiatria", "Hospitais", "Bethlem"],
            "examTip": "Bethlem (Bedlam) = O mais antigo (desde 1247)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Pinel foi na Salpêtrière/Bicêtre (França).",
            "B": "Correta. Marco histórico.",
            "C": "Incorreta. Idade Média.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "História", "Instituições"]
    },
    {
        "id": "t038",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Diagnóstico",
        "statement": "O desenvolvimento do diagnóstico médico passa por estágios (I a IV). Segundo o modelo citado no Tratado, a Psiquiatria encontra-se majoritariamente em qual estágio diagnóstico, caracterizado pela identificação de síndromes com história natural conhecida, mas sem fisiopatologia ou etiologia totalmente estabelecida?",
        "options": {
            "A": "Estágio I (Pré-sindrômico / Sintomático).",
            "B": "Estágio II (Sindrômico).",
            "C": "Estágio III (Fisiopatológico).",
            "D": "Estágio IV (Etiológico).",
            "E": "Estágio V (Molecular precce).",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A maioria dos transtornos psiquiátricos (como Depressão, TDAH, Esquizofrenia) são definidos por critérios sindrômicos (conjuntos de sinais e sintomas com curso previsível), sem marcadores biológicos definitivos (Estágio III) ou etiologia conhecida (Estágio IV).",
            "keyConcepts": ["Nosologia", "Diagnóstico", "Epistemologia"],
            "examTip": "Psiquiatria hoje = Síndromes (Estágio II). O DSM é um manual de síndromes, não de doenças etiológicas."
        },
        "itemAnalysis": {
            "A": "Incorreta. Já passamos da fase de sintoma único.",
            "B": "Correta. Onde estamos hoje.",
            "C": "Incorreta. Existem avanços, mas não definem o diag. clínico padrão.",
            "D": "Incorreta. Raros casos (ex: Rett, D. Huntington) são estagio IV, mas saíram da psiquiatria 'pura'.",
            "E": "Incorreta. Não existe esse estágio no modelo citado."
        },
        "tags": ["Tratado 2022", "Psicopatologia", "Diagnóstico"]
    },
    {
        "id": "t039",
        "theme": "geral",
        "subtheme": "Psicologia Médica",
        "statement": "Pacientes clínicos (no hospital geral) frequentemente apresentam queixas emocionais. O Tratado discute a influência da personalidade e do significado da doença. Quando um paciente percebe sua doença como 'punição' ou 'ameaça', isso:",
        "options": {
            "A": "Diminui a probabilidade de reações psicológicas adversas.",
            "B": "Aumenta a adesão ao tratamento médico de forma consistente.",
            "C": "Aumenta a probabilidade de eclosão de reações psicológicas / sintomas psiquiátricos.",
            "D": "É um sinal de bom prognóstico e resiliência.",
            "E": "Indica necessariamente um Transtorno Delirante.",
        },
        "correctAnswer": "C",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto afirma: 'Qualquer desses sentimentos exibidos pelo paciente [doença como perda, ameaça ou punição] aumenta a probabilidade de aparição de reações psicológicas' (sofrimento mental).",
            "keyConcepts": ["Psicologia Médica", "Enfrentamento", "Coping"],
            "examTip": "Significado da Doença: Se o paciente acha que é castigo -> Piora o sofrimento mental."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta. Frequentemente diminui ou gera comportamento de esquiva.",
            "C": "Correta. Fator de risco psicopatológico.",
            "D": "Incorreta. É fator de vulnerabilidade.",
            "E": "Incorreta. É uma interpretação cultural/psicológica comum, não necessariamente um delírio."
        },
        "tags": ["Tratado 2022", "Interconsulta", "Psicologia Médica"]
    },
    {
        "id": "t040",
        "theme": "neurociencias",
        "subtheme": "Neurobiologia",
        "statement": "Nos transtornos de ansiedade, diversos sistemas de neurotransmissores estão alterados. No Transtorno de Ansiedade Generalizada (TAG), o Tratado aponta uma alteração nos receptores de GABA-A. Qual é essa alteração?",
        "options": {
            "A": "Aumento da densidade (Up-regulation) no hipocampo.",
            "B": "Redução (Down-regulation) dos receptores GABA-A frontocorticais.",
            "C": "Mutação genética que torna o receptor insensível aos benzodiazepínicos.",
            "D": "Hiperatividade compensatória no cerebelo.",
            "E": "Nenhuma alteração no sistema GABAérgico foi identificada.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "Em uma tabela sobre neurotransmissores, o texto cita para TAG: 'Receptores GABA-A frontocorticais reduzidos'. Isso condiz com a hipoatividade inibitória e a ansiedade crônica.",
            "keyConcepts": ["Neurobiologia", "TAG", "GABA"],
            "examTip": "TAG = Pouco freio no Córtex (GABA Reduzido)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Citado especificamente.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Ansiedade"]
    },
    {
        "id": "t041",
        "theme": "etica_forense_legal",
        "subtheme": "Suicídio",
        "statement": "A epidemiologia do suicídio no Brasil mostra padrões específicos. Segundo dados do Ministério da Saúde citados no Tratado, qual é o método de suicídio mais frequente utilizado tanto por homens quanto por mulheres no país?",
        "options": {
            "A": "Intoxicação exógena (envenenamento/medicamentos).",
            "B": "Arma de fogo.",
            "C": "Enforcamento.",
            "D": "Precipitação de altura.",
            "E": "Afogamento.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto estatístico informa: 'No Brasil, o principal é o enforcamento, tanto para homens quanto para mulheres (66,1 e 47%, respectivamente)'.",
            "keyConcepts": ["Suicídio", "Epidemiologia", "Brasil"],
            "examTip": "Brasil = Enforcamento é o método #1 disparado."
        },
        "itemAnalysis": {
            "A": "Incorreta. É o segundo para mulheres, mas não o primeiro.",
            "B": "Incorreta. Comum nos EUA, menos no Brasil.",
            "C": "Correta. Predominante na realidade brasileira.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Suicídio", "Epidemiologia"]
    },
    {
        "id": "t042",
        "theme": "urgencias_psiquiatricas",
        "subtheme": "Suicídio e Antidepressivos",
        "statement": "A relação entre uso de antidepressivos e risco de suicídio é complexa, especialmente em jovens. Segundo o Tratado de Psiquiatria da ABP, qual é a conclusão clínica predominante sobre este tema?",
        "options": {
            "A": "O uso de antidepressivos aumenta o risco absoluto de suicídio em todas as faixas etárias, contraindicando seu uso.",
            "B": "A relação se mostrou contraditória, mas a melhora dos sintomas é protetora e sobrepõe o risco; a vigilância deve ser ampliada nos primeiros 30 dias.",
            "C": "Não há nenhum risco documentado de piora da ideação suicida com antidepressivos.",
            "D": "O risco existe apenas com tricíclicos, não com ISRS.",
            "E": "A FDA retirou o 'box warning' sobre suicídio devido à falta de evidências."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto afirma: 'Apesar de a literatura sugerir a associação... tal relação se mostrou contraditória: a melhora dos sintomas é protetora e sobrepõe o risco. Porém... é importante que se amplie a vigilância... nos primeiros 30 dias'.",
            "keyConcepts": ["Suicídio", "Psicofarmacologia", "Segurança"],
            "examTip": "Antidepressivo protege mais do que mata, mas vigie o primeiro mês (ativação)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Equilíbrio risco/benefício.",
            "C": "Incorreta. O risco de ativação/ideação existe (FDA Box Warning).",
            "D": "Incorreta.",
            "E": "Incorreta. O aviso permanece."
        },
        "tags": ["Tratado 2022", "Suicídio", "Psicofarmacologia"]
    },
    {
        "id": "t043",
        "theme": "psicogeriatria",
        "subtheme": "Avaliação Cognitiva",
        "statement": "Em psicogeriatria, a escolha do teste de rastreio cognitivo deve considerar a escolaridade. O Tratado de Psiquiatria cita o Teste do Desenho do Relógio (TDR) como tendo uma vantagem específica em relação a outros testes como o MEEM. Qual é essa vantagem?",
        "options": {
            "A": "Avalia exclusivamente a memória episódica.",
            "B": "Sofre pouca influência do grau de escolaridade e é de fácil aplicação.",
            "C": "É o único teste capaz de diagnosticar Lewy Body Dementia.",
            "D": "Requer equipamento computadorizado para aplicação.",
            "E": "Não avalia funções executivas, apenas praxia."
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto destaca: 'O TDR é de fácil aplicação e sofre pouca influência do grau de escolaridade', tornando-o útil em populações com níveis educacionais variados.",
            "keyConcepts": ["Psicometria", "Teste do Relógio", "Escolaridade"],
            "examTip": "Teste do Relógio = Bom para baixa escolaridade + Avalia Executiva/Praxia."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Vantagem chave citada.",
            "C": "Incorreta. Sensível, mas não patognomônico único.",
            "D": "Incorreta. Papel e caneta.",
            "E": "Incorreta. Avalia função executiva fortemente."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Diagnóstico"]
    },
    {
        "id": "t044",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Desenvolvimento",
        "statement": "A puberdade envolve dois processos hormonais independentes: Adrenarca e Gonadarca. Segundo o Tratado, qual evento hormonal marca a Adrenarca (que se inicia por volta dos 6 anos)?",
        "options": {
            "A": "Ativação pulsátil do GnRH hipotalâmico.",
            "B": "Aumento dos andrógenos adrenais (DHEA, DHEA-S) responsáveis por pelos axilares/pubianos.",
            "C": "Pico de LH e FSH pela hipófise.",
            "D": "Início da espermatogênese e ovulação.",
            "E": "Fechamento das epífises ósseas."
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Adrenarca = Despertar da Adrenal (Suprarrenal) -> DHEA/S -> Pelos. Gonadarca = Despertar da Gônada (via GnRH/LH/FSH) -> Mama/Testículo/Menstruação.",
            "keyConcepts": ["Desenvolvimento", "Puberdade", "Endocrinologia"],
            "examTip": "Adrenarca (Adrenal) = Pelos. Gonadarca (Gônada) = Ciclo/Reprodução."
        },
        "itemAnalysis": {
            "A": "Incorreta. Isso é Gonadarca.",
            "B": "Correta. Definição de Adrenarca.",
            "C": "Incorreta. Gonadarca.",
            "D": "Incorreta. Gonadarca.",
            "E": "Incorreta. Fim da puberdade."
        },
        "tags": ["Tratado 2022", "Fisiologia", "Infância"]
    },
    {
        "id": "t045",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Neurobiologia",
        "statement": "Teorias modernas sobre a esquizofrenia focam na conectividade cerebral. O Tratado descreve a doença como resultado de 'falhas integrativas na conectividade neuronal'. Essa desconexão é descrita como sendo primordialmente de natureza:",
        "options": {
            "A": "Anatômica macroscópica (atrofia lobar severa visível a olho nu).",
            "B": "Funcional (dinâmica entre regiões corticais) mais do que estrutural pura.",
            "C": "Eletrolítica (falha na bomba de sódio-potássio).",
            "D": "Vascular (micro-infartos difusos).",
            "E": "Infecciosa (viral).",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "O texto sugere que a esquizofrenia é 'mais bem explicada em termos funcionais – como alterações na dinâmica de diferentes regiões corticais... – do que em termos estruturais ou anatômicos'.",
            "keyConcepts": ["Esquizofrenia", "Conectividade", "Neuroimagem"],
            "examTip": "Esquizofrenia = Disconectividade Funcional (o 'software' de integração falha, mesmo que o 'hardware' pareça ok)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Ênfase na conectividade funcional.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Esquizofrenia"]
    },
    {
        "id": "t046",
        "theme": "saude_publica",
        "subtheme": "Políticas de Saúde",
        "statement": "Uma auditoria do Tribunal de Contas da União (TCU) na Rede de Saúde Mental (CAPS), citada no Tratado, apontou diversas deficiências graves. Entre os achados de 2010 em SP, qual foi uma das críticas estruturais significativas?",
        "options": {
            "A": "Excesso de psiquiatras e falta de psicólogos.",
            "B": "Financiamento excessivo que gerava desperdício.",
            "C": "Falta de retaguarda para internação psiquiátrica (42%) e emergências (31%), além de falta de pessoal.",
            "D": "Os CAPS funcionavam 24h porém sem pacientes.",
            "E": "A rede era perfeita, sem falhas apontadas."
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto cita uma avaliação de 85 CAPS em SP que evidenciou 'falta de retaguarda para internação psiquiátrica... e para emergências... falta de pessoal (70%)...'.",
            "keyConcepts": ["Saúde Pública", "CAPS", "Gestão"],
            "examTip": "Crítica ao modelo: CAPS isolado sem retaguarda de leito/emergência falha na crise."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Correta. Dados reais da auditoria citada.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Saúde Pública", "Gestão"]
    },
    {
        "id": "t047",
        "theme": "geral",
        "subtheme": "História da Psiquiatria",
        "statement": "A psicocirurgia tem uma história controversa. Egas Moniz ganhou o Nobel pela leucotomia pré-frontal. Posteriormente, Walter Freeman e James Watts modificaram a técnica para torná-la mais acessível (e infame), utilizando qual via de acesso?",
        "options": {
            "A": "Via Transnasal (pelo nariz).",
            "B": "Via Transorbitária (pela órbita ocular, o 'picador de gelo').",
            "C": "Via Occipital.",
            "D": "Craniotomia aberta ampla.",
            "E": "Via Endovascular.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto descreve: 'Freeman e Watts desenvolveram uma alternativa... a intervenção passou a ser realizada por via transorbitária'. Esta técnica ficou famosa pela facilidade e uso indiscriminado.",
            "keyConcepts": ["História", "Psicocirurgia", "Lobotomia"],
            "examTip": "Moniz = Leucótomo/Álcool (Nobel). Freeman = Transorbitária (Picador de Gelo/Infame)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. A famosa lobotomia transorbitária.",
            "C": "Incorreta.",
            "D": "Incorreta. Freeman queria evitar a cirurgia aberta complexa.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "História", "Tratamentos Biológicos"]
    },
    {
        "id": "t048",
        "theme": "psicoterapia",
        "subtheme": "Entrevista Psiquiátrica",
        "statement": "Na técnica de entrevista, a postura do médico é fundamental. O Tratado adverte contra o 'distanciamento afetivo excessivo' (frieza). Segundo o texto, qual é o efeito prático negativo dessa postura no paciente?",
        "options": {
            "A": "O paciente se torna dependente do médico.",
            "B": "O paciente melhora mais rápido por não criar vínculo.",
            "C": "O paciente percebe o médico como alguém que não se importa, omitindo detalhes fundamentais ou abandonando o tratamento.",
            "D": "Aumenta a precisão diagnóstica pela objetividade.",
            "E": "Reduz o risco de transferência erótica.",
        },
        "correctAnswer": "C",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto alerta que a frieza 'costuma ter efeito contrário... o paciente... pode deixar de fornecer certas informações ou transmiti-las vagamente, omitindo detalhes'.",
            "keyConcepts": ["Entrevista", "Relação Médico-Paciente", "Semiologia"],
            "examTip": "Médico frio -> Paciente não conta tudo -> Diagnóstico errado."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Correta. Prejuízo na coleta de dados e adesão.",
            "D": "Incorreta. A objetividade sem vínculo perde dados subjetivos essenciais.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Semiologia", "Prática Clínica"]
    },
    {
        "id": "t049",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Tratamento",
        "statement": "Existem centros especializados em casos refratários. O Tratado cita a NPU (National Psychosis Unit) no Reino Unido, liderada por Sir Robin Murray, cuja missão declarada é:",
        "options": {
            "A": "Curar os incuráveis.",
            "B": "Realizar eutanásia em casos terminais.",
            "C": "Promover a desospitalização total.",
            "D": "Testar novos psicodélicos exclusivamente.",
            "E": "Treinar apenas enfermeiros psiquiátricos.",
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto cita explicitamente: 'Sua missão é curar os incuráveis', focando em casos graves de esquizofrenia resistentes a tratamento.",
            "keyConcepts": ["Esquizofrenia Resistente", "NPU", "Robin Murray"],
            "examTip": "NPU = Centro de Excelência para casos 'perdidos' (Curar os incuráveis)."
        },
        "itemAnalysis": {
            "A": "Correta. Frase de efeito citada.",
            "B": "Incorreta.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Esquizofrenia", "Instituições"]
    },
    {
        "id": "t050",
        "theme": "urgencias_psiquiatricas",
        "subtheme": "Epidemiologia",
        "statement": "A epidemiologia do suicídio em idosos (60-69 anos) no período de 20 anos analisado mostrou um padrão preocupante quando comparado a outras causas de mortalidade (como doenças cardíacas), segundo o Tratado. Qual foi esse padrão?",
        "options": {
            "A": "As taxas de suicídio caíram na mesma proporção que as doenças cardíacas.",
            "B": "Enquanto a mortalidade por doenças clínicas (AVC, coração) caiu significativamente, houve tendência de AUMENTO nas taxas de suicídio.",
            "C": "O suicídio desapareceu como causa de morte nessa faixa etária.",
            "D": "O suicídio aumentou apenas em mulheres, caindo nos homens.",
            "E": "As taxas permaneceram estagnadas.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto relata: 'houve uma redução significativa nas taxas de mortalidade por doença cerebrovascular... ao mesmo tempo em que houve uma tendência de aumento significativo nas taxas de suicídio'.",
            "keyConcepts": ["Suicídio", "Idosos", "Epidemiologia"],
            "examTip": "Medicina evoluiu e trata o coração (menos morte física), mas a saúde mental piorou (mais suicídio em idosos)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. O paradoxo da saúde moderna.",
            "C": "Incorreta.",
            "D": "Incorreta. Aumentou em ambos.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Suicídio", "Psicogeriatria"]
    },
    {
        "id": "t051",
        "theme": "neurociencias",
        "subtheme": "Neurobiologia da Ansiedade",
        "statement": "Diferentes transtornos de ansiedade apresentam assinaturas neurobiológicas distintas. Segundo a Tabela 23.3 do Tratado, em qual transtorno de ansiedade observa-se especificamente uma 'redução do GABA no tálamo'?",
        "options": {
            "A": "Transtorno de Pânico (TP).",
            "B": "Transtorno de Ansiedade Generalizada (TAG).",
            "C": "Fobia Social (Transtorno de Ansiedade Social).",
            "D": "Agorafobia sem Pânico.",
            "E": "Fobia Específica de Sangue-Injeção.",
        },
        "correctAnswer": "C",
        "difficulty": 3,
        "explanation": {
            "correct": "A tabela associa 'Redução do GABA no tálamo' à Fobia Social. Para TAG, a alteração é em receptores GABA frontocorticais.",
            "keyConcepts": ["Neurobiologia", "Fobia Social", "GABA"],
            "examTip": "Fobia Social = GABA baixo no Tálamo. TAG = GABA baixo no Córtex."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Correta. Dado específico da tabela.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Ansiedade"]
    },
    {
        "id": "t052",
        "theme": "geral",
        "subtheme": "Metodologia Científica",
        "statement": "Na ética da pesquisa clínica, a randomização só é aceitável quando existe uma dúvida genuína na comunidade científica sobre qual tratamento é superior ou mais seguro. Como o Tratado de Psiquiatria (e a bioética em geral) denomina esse estado de incerteza honesta e profissional?",
        "options": {
            "A": "Placebo Effect.",
            "B": "Equipoise (Equilíbrio Clínico).",
            "C": "Duplo-Cego.",
            "D": "Consentimento Livre e Esclarecido.",
            "E": "Viés de Seleção.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Equipoise (ou 'Clinical Equipoise') é o princípio ético que justifica a randomização: se não sabemos qual braço é melhor, é ético 'sortear' o paciente. Se soubéssemos que um é superior, seria antiético dar o inferior.",
            "keyConcepts": ["Bioética", "Pesquisa Clínica", "Equipoise"],
            "examTip": "Randomizar só pode se houver Dúvida (Equipoise)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Termo técnico preciso.",
            "C": "Incorreta. Método de mascaramento.",
            "D": "Incorreta. Requisito legal, não o princípio da incerteza.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Pesquisa", "Ética"]
    },
    {
        "id": "t053",
        "theme": "neurociencias",
        "subtheme": "Estimulação Magnética",
        "statement": "A Estimulação Magnética Transcraniana (EMT/TMS) evoluiu historicamente. Segundo o Tratado, qual pesquisador é creditado, em 1985, pela demonstração da estimulação magnética não invasiva do córtex motor humano, marcando o início da era moderna da TMS?",
        "options": {
            "A": "Egas Moniz.",
            "B": "Barker (Anthony Barker).",
            "C": "Pascual-Leone.",
            "D": "Freud.",
            "E": "Penfield.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "Barker et al. (1985) publicaram no Lancet o uso de um estimulador magnético para despolarizar o córtex motor sem dor (diferente da estimulação elétrica transcraniana antiga que doía muito).",
            "keyConcepts": ["EMT", "História", "Neurofisiologia"],
            "examTip": "1985 = Barker = TMS moderna."
        },
        "itemAnalysis": {
            "A": "Incorreta. Psicocirurgia.",
            "B": "Correta. Citado no texto.",
            "C": "Incorreta. Importante pesquisador atual, mas Barker foi o pioneiro de 85.",
            "D": "Incorreta.",
            "E": "Incorreta. Mapeamento cortical invasivo."
        },
        "tags": ["Tratado 2022", "História", "Neurociências"]
    },
    {
        "id": "t054",
        "theme": "transtornos_ansiedade",
        "subtheme": "TEPT",
        "statement": "No modelo cognitivo-comportamental e de condicionamento do TEPT, o comportamento de 'evitação' (evitar locais ou pensamentos ligados ao trauma) desempenha um papel paradoxal na manutenção do transtorno. Por quê?",
        "options": {
            "A": "Porque aumenta a exposição a novos traumas.",
            "B": "Porque impede a 'extinção' do condicionamento (o paciente não aprende que o estímulo agora é seguro).",
            "C": "Porque a evitação gera atrofia muscular.",
            "D": "Porque reduz excessivamente a ansiedade, tornando o paciente apático.",
            "E": "Porque esgota a reserva de serotonina.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A evitação alivia a ansiedade no curto prazo (reforço negativo), mas impede o processo de habituação e extinção da memória traumática. O paciente nunca 'testa' a realidade para ver que o perigo passou.",
            "keyConcepts": ["TEPT", "TCC", "Extinção"],
            "examTip": "Evitação = Alívio imediato + Manutenção da doença a longo prazo (Impede a cura/extinção)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Mecanismo central da manutenção do TEPT.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicoterapia", "TEPT"]
    },
    {
        "id": "t055",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Neurobiologia",
        "statement": "Estudos modernos, como o B-SNIP, buscam classificar psicoses baseados em biomarcadores (biotipos) e não apenas sintomas. O Tratado cita que essa abordagem identificou grupos biológicos que:",
        "options": {
            "A": "Correspondem exatamente aos diagnósticos do DSM-5 (Biotipo 1 = Esquizofrenia, Biotipo 2 = Bipolar).",
            "B": "Cruzam as fronteiras diagnósticas tradicionais (um mesmo biotipo inclui pacientes com esquizofrenia e bipolar).",
            "C": "São baseados exclusivamente em níveis de dopamina sérica.",
            "D": "Não mostram correlação com déficits cognitivos.",
            "E": "Provam que a esquizofrenia não existe.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "Os 'biotipos' identificados por neuroimagem/eletrofisiologia não respeitam as caixas do DSM. Eles abrangem pacientes de diferentes categorias clínicas (Esquizofrenia, Esquizoafetivo, Bipolar Psicótico), sugerindo uma biologia comum transdiagnóstica.",
            "keyConcepts": ["RDoC", "Biotipos", "Psiquiatria de Precisão"],
            "examTip": "Biotipos > Diagnósticos DSM (A biologia não leu o manual)."
        },
        "itemAnalysis": {
            "A": "Incorreta. A grande descoberta é que NÃO correspondem.",
            "B": "Correta. Abordagem transdiagnóstica.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Pesquisa"]
    },
    {
        "id": "t056",
        "theme": "psicofarmacologia",
        "subtheme": "Impulsividade",
        "statement": "No tratamento do Transtorno Explosivo Intermitente (TEI), o algoritmo de Felthous e Stanford citado no Tratado propõe uma diferenciação. Para episódios de agressão menos graves (Critério A1: agressão verbal/física sem dano), a primeira escolha medicamentosa recomendada é:",
        "options": {
            "A": "Haloperidol.",
            "B": "Fluoxetina (ISRS).",
            "C": "Clonazepam.",
            "D": "Eletroconvulsoterapia.",
            "E": "Clozapina.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Para agressividade impulsiva leve/moderada (TEI), os ISRS (como fluoxetina) são primeira linha devido ao papel da serotonina no controle inibitório. Para agressão grave (dano físico), estabilizadores (lítio/anticonvulsivantes) podem ser preferidos.",
            "keyConcepts": ["TEI", "Impulsividade", "Psicofarmacologia"],
            "examTip": "Explosivo 'Leve' (grita/quebra copo) -> Fluoxetina. Explosivo 'Grave' (bate/fere) -> Estabilizador."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Melhora o 'freio' serotonérgico.",
            "C": "Incorreta. Risco de desinibição paradoxal.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Impulsividade"]
    },
    {
        "id": "t057",
        "theme": "transtornos_alimentares",
        "subtheme": "Bulimia Nervosa",
        "statement": "O DSM-5 alterou a frequência mínima exigida para o diagnóstico de Bulimia Nervosa em relação ao DSM-IV. Atualmente, para fechar o diagnóstico, os episódios de compulsão alimentar e comportamentos compensatórios devem ocorrer, em média, pelo menos:",
        "options": {
            "A": "2 vezes por semana por 3 meses.",
            "B": "1 vez por semana por 3 meses.",
            "C": "Diariamente por 1 mês.",
            "D": "1 vez por mês por 6 meses.",
            "E": "3 vezes por semana por 1 mês.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O DSM-5 reduziu o limiar para incluir mais pacientes que clinicamente precisavam de tratamento. A regra agora é '1x por semana durante 3 meses'. (No DSM-IV era 2x/sem).",
            "keyConcepts": ["Bulimia Nervosa", "DSM-5", "Diagnóstico"],
            "examTip": "Bulimia DSM-5 = 1x/semana (ficou mais 'fácil' diagnosticar)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Era o critério antigo (DSM-IV).",
            "B": "Correta. Critério atual.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Diagnóstico", "Alterações DSM-5"]
    },
    {
        "id": "t058",
        "theme": "urgencias_psiquiatricas",
        "subtheme": "Organização de Serviços",
        "statement": "Na Rede de Atenção às Urgências no Brasil, a 'Sala de Estabilização' tem um papel específico definido por portaria ministerial. Ela é destinada a:",
        "options": {
            "A": "Internação de longa permanência (até 30 dias).",
            "B": "Estabilização de pacientes críticos/graves por curto período, até a transferência ou alta.",
            "C": "Psicoterapia de grupo para pacientes leves.",
            "D": "Triagem administrativa apenas, sem recursos médicos.",
            "E": "Atendimento exclusivo de gestantes.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "A Sala de Estabilização é um componente da rede de urgência para garantir suporte vital e estabilização hemodinâmica/clínica temporária enquanto se define o destino (internação ou observação), não sendo unidade de internação.",
            "keyConcepts": ["Políticas de Saúde", "Urgência", "Organização"],
            "examTip": "Sala de Estabilização = Suporte de Vida Temporário (Não é leito de enfermaria)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Definição ministerial.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Saúde Pública", "Urgência"]
    },
    {
        "id": "t059",
        "theme": "transtornos_humor",
        "subtheme": "Depressão",
        "statement": "A epidemiologia do primeiro episódio depressivo mostra um pico de incidência em uma fase específica da vida. Segundo o Tratado, embora possa ocorrer em qualquer idade, cerca de 40% dos primeiros episódios ocorrem:",
        "options": {
            "A": "Após os 60 anos.",
            "B": "Antes dos 20 anos.",
            "C": "Entre 40 e 50 anos (crise da meia-idade).",
            "D": "Na infância pré-escolar (antes dos 5 anos).",
            "E": "Exclusivamente no puerpério.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O texto afirma que '40% dos indivíduos com o primeiro episódio depressivo ocorrendo antes dos 20 anos', com a média de início no começo da vida adulta (24-25 anos).",
            "keyConcepts": ["Epidemiologia", "Depressão", "Curso Clínico"],
            "examTip": "Depressão é cada vez mais uma doença de jovens (início precoce é comum)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Dado epidemiológico relevante.",
            "C": "Incorreta.",
            "D": "Incorreta. Raro.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Epidemiologia", "Depressão"]
    },
    {
        "id": "t060",
        "theme": "psicoterapia",
        "subtheme": "Sexualidade",
        "statement": "Ao avaliar queixas sexuais em adultos jovens ou inexperientes, o Tratado recomenda cautela. Dificuldades transitórias de ereção ou lubrificação no início da vida sexual:",
        "options": {
            "A": "Devem ser imediatamente medicadas com inibidores da fosfodiesterase-5.",
            "B": "São compreensíveis e geralmente refletem inexperiência/ansiedade, não necessariamente uma disfunção sexual patológica.",
            "C": "Indicam homossexualidade latente.",
            "D": "Sugerem disfunção hormonal grave (hipogonadismo).",
            "E": "Requerem cirurgia corretiva.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O texto destaca que 'Jovens ou principiantes podem apresentar, de forma temporária, dificuldades... o que é compreensível e não significa disfunção, mas inexperiência'. Diagnosticar disfunção precocemente pode ser iatrogênico.",
            "keyConcepts": ["Sexualidade", "Diagnóstico Diferencial", "Ciclo de Vida"],
            "examTip": "Jovem 'falhando' na primeira vez = Ansiedade/Inexperiência (Normalizar antes de patologizar)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Medicalização desnecessária.",
            "B": "Correta. Abordagem prudente.",
            "C": "Incorreta. Mito.",
            "D": "Incorreta. Raro.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sexualidade", "Clínica"]
    },
    {
        "id": "t061",
        "theme": "geral",
        "subtheme": "Estigma e Sociologia",
        "statement": "Erving Goffman (1963), autor clássico sobre Estigma, diferencia o indivíduo 'desacreditado' do 'desacreditável'. Qual é a principal diferença citada no Tratado?",
        "options": {
            "A": "O desacreditado tem uma condição visível/evidente (não pode esconder), enquanto o desacreditável tem uma condição oculta (segredo) que pode ser revelada.",
            "B": "Desacreditado é quem cometeu crime; desacreditável é quem apenas pensou.",
            "C": "Desacreditado é pobre; desacreditável é rico.",
            "D": "O desacreditável sofre mais preconceito que o desacreditado.",
            "E": "Não há diferença, são sinônimos.",
        },
        "correctAnswer": "A",
        "difficulty": 3,
        "explanation": {
            "correct": "Desacreditado = Estigma na cara (ex: obesidade grave, deformidade, cadeira de rodas). O desafio é lidar com a tensão da interação. Desacreditável = Estigma invisível (ex: HIV+, transtorno mental compensado, ex-presidiário). O desafio é o controle da informação (contar ou não contar?).",
            "keyConcepts": ["Estigma", "Goffman", "Sociologia"],
            "examTip": "Quem esconde o segredo é 'Desacreditável' (pode vir a ser desacreditado se descobrirem)."
        },
        "itemAnalysis": {
            "A": "Correta. Definição sociológica clássica.",
            "B": "Incorreta.",
            "C": "Incorreta.",
            "D": "Incorreta. Sofrem pressões diferentes (visibilidade vs medo da descoberta).",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sociologia", "Estigma"]
    },
    {
        "id": "t062",
        "theme": "neurociencias",
        "subtheme": "Neuroanatomia",
        "statement": "O Circuito de Papez é fundamental para a compreensão das emoções e da memória. Segundo a descrição clássica e o Tratado, qual é a estrutura que conecta o Hipocampo aos Corpos Mamilares?",
        "options": {
            "A": "Fórnix.",
            "B": "Feixe Mamilo-Talâmico.",
            "C": "Cíngulo.",
            "D": "Estria Terminal.",
            "E": "Cápsula Interna.",
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "O fluxo clássico é: Hipocampo -> Fórnix -> Corpos Mamilares -> Trato Mamilotalâmico -> Núcleo Anterior do Tálamo -> Cíngulo.",
            "keyConcepts": ["Neuroanatomia", "Circuito de Papez", "Memória"],
            "examTip": "Hipocampo 'foge' pelo Fórnix."
        },
        "itemAnalysis": {
            "A": "Correta. Principal via eferente do hipocampo.",
            "B": "Incorreta. Conecta corpo mamilar ao tálamo.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Anatomia"]
    },
    {
        "id": "t063",
        "theme": "transtornos_alimentares",
        "subtheme": "Anorexia Nervosa",
        "statement": "A gravidade da Anorexia Nervosa no DSM-5 baseia-se no Índice de Massa Corporal (IMC). Um IMC < 15 kg/m² define um quadro de gravidade:",
        "options": {
            "A": "Leve.",
            "B": "Moderada.",
            "C": "Grave.",
            "D": "Extrema.",
            "E": "Crítica.",
        },
        "correctAnswer": "D",
        "difficulty": 3,
        "explanation": {
            "correct": "Classificação de gravidade (adultos): Leve (≥17), Moderada (16-16.99), Grave (15-15.99), Extrema (<15).",
            "keyConcepts": ["Anorexia Nervosa", "IMC", "Gravidade"],
            "examTip": "Abaixo de 15 é Extremo. Entre 15 e 16 é Grave."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Incorreta.",
            "D": "Correta. Classificação oficial do DSM-5.",
            "E": "Incorreta. Termo não usado na classificação oficial, embora clinicamente correto."
        },
        "tags": ["Tratado 2022", "Diagnóstico", "Classificação"]
    },
    {
        "id": "t064",
        "theme": "neurociencias",
        "subtheme": "Sono e Vigília",
        "statement": "A narcolepsia está classicamente associada à deficiência de um neuropeptídeo produzido no hipotálamo lateral, responsável pela manutenção da vigília. Qual é esse neuropeptídeo?",
        "options": {
            "A": "Melatonina.",
            "B": "GABA.",
            "C": "Hipocretina (Orexina).",
            "D": "Adenosina.",
            "E": "Substância P.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "A Hipocretina (ou Orexina) estabiliza o estado de vigília. Sua perda (destruição autoimune dos neurônios no hipotálamo lateral) causa a instabilidade do sono REM e a sonolência excessiva da Narcolepsia Tipo 1.",
            "keyConcepts": ["Sono", "Narcolepsia", "Neurofisiologia"],
            "examTip": "Narcolepsia = Falta de Orexina/Hipocretina."
        },
        "itemAnalysis": {
            "A": "Incorreta. Promove sono (cycadaiano).",
            "B": "Incorreta. Promove sono (VLPO).",
            "C": "Correta. Promove vigília.",
            "D": "Incorreta. Acumula e gera pressão de sono.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sono", "Neurociências"]
    },
    {
        "id": "t065",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Atenção",
        "statement": "No exame psíquico da atenção, o termo 'Hiperprosexia' refere-se a:",
        "options": {
            "A": "Abolição total da atenção.",
            "B": "Estado de atenção exacerbada, com tendência a deter-se indefinidamente sobre certos objetos com surpreendente infatigabilidade.",
            "C": "Incapacidade de fixar a atenção em qualquer estímulo (desatenção grave).",
            "D": "Atenção flutuante normal.",
            "E": "Perda de memória recente.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Hiperprosexia é o aumento global da atenção (vigilância), mas geralmente com labilidade (muda o foco rápido) ou tenacidade extrema (fixa e não solta). O Tratado cita como 'atenção exacerbada... com insólita infatigabilidade'. Comum em estados maníacos ou de intoxicação por estimulantes.",
            "keyConcepts": ["Psicopatologia", "Atenção", "Exame Psíquico"],
            "examTip": "Hiperprosexia = Excesso de atenção (mesmo que improdutiva)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Aprosexia.",
            "B": "Correta. Definição clássica.",
            "C": "Incorreta. Hipoprosexia.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicopatologia", "Semiologia"]
    },
    {
        "id": "t066",
        "theme": "transtornos_humor",
        "subtheme": "Neuroimagem",
        "statement": "A 'Depressão Vascular' ou depressão de início tardio (após os 60 anos) está fortemente associada a qual achado de neuroimagem estrutural, segundo o Tratado?",
        "options": {
            "A": "Atrofia isolada do cerebelo.",
            "B": "Hiperintensidades na substância branca (leucoaraioe) periventricular e profunda.",
            "C": "Aumento do volume da amígdala.",
            "D": "Calcificações nos núcleos da base (Doença de Fahr).",
            "E": "Ausência de corpo caloso.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A depressão de início tardio tem forte correlação com doença microvascular cerebral, visualizada na RM como hiperintensidades na substância branca (T2/FLAIR). Isso corrobora a hipótese vascular.",
            "keyConcepts": ["Depressão Vascular", "Neuroimagem", "Psicogeriatria"],
            "examTip": "Idoso deprimido pela 1ª vez? Olhe a Substância Branca (Microangiopatia)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Marcador de doença de pequenos vasos.",
            "C": "Incorreta. Geralmente há atrofia ou normalidade.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Neuroimagem"]
    },
    {
        "id": "t067",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Genética",
        "statement": "O modelo genético atual mais aceito para a Esquizofrenia é o de uma doença:",
        "options": {
            "A": "Monogênica Mendeliana (um gene dominante causa a doença).",
            "B": "Oligogênica (poucos genes de grande efeito).",
            "C": "Poligênica/Complexa (centenas/milhares de variantes comuns de pequeno efeito + variantes raras).",
            "D": "Exclusivamente ambiental (não há herdabilidade).",
            "E": "Mitocondrial materna.",
        },
        "correctAnswer": "C",
        "difficulty": 1,
        "explanation": {
            "correct": "A esquizofrenia é o protótipo de doença complexa poligênica. O GWAS (Genome-Wide Association Studies) identificou centenas de loci, cada um contribuindo com um risco minúsculo (Odds Ratio ~1.05-1.1), que somados (Score Poligênico) explicam parte da herdabilidade.",
            "keyConcepts": ["Genética", "Esquizofrenia", "Poligênico"],
            "examTip": "Não existe 'O Gene' da Esquizofrenia. Existem milhares."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Correta. Modelo atual (Threshold model).",
            "D": "Incorreta. Herdabilidade é ~80%.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Genética", "Esquizofrenia"]
    },
    {
        "id": "t068",
        "theme": "psicofarmacologia",
        "subtheme": "Antipsicóticos",
        "statement": "A Quetiapina é um antipsicótico atípico com ampla faixa de dosagem. Para o tratamento eficaz da Esquizofrenia (efeito antipsicótico pleno), o Tratado indica que a dose alvo usual deve situar-se entre:",
        "options": {
            "A": "25 a 100 mg/dia.",
            "B": "100 a 200 mg/dia.",
            "C": "400 a 800 mg/dia.",
            "D": "1.000 a 2.000 mg/dia.",
            "E": "10 a 20 mg/dia.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "Doses baixas de Quetiapina (25-100mg) agem basicamente como anti-histamínico (sedativo). Para ocupar receptores D2 e ter efeito antipsicótico, são necessárias doses elevadas (400-800mg). Doses intermediárias (300mg) são usadas em depressão bipolar.",
            "keyConcepts": ["Psicofarmacologia", "Quetiapina", "Doses"],
            "examTip": "Quetiapina para psicose = 'Dose de Cavalo' (>400mg). 25mg é só para dormir."
        },
        "itemAnalysis": {
            "A": "Incorreta. Dose hipnótica.",
            "B": "Incorreta. Subterapêutica para psicose.",
            "C": "Correta. Faixa terapêutica antipsicótica.",
            "D": "Incorreta. Acima do recomendado.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Prática Clínica"]
    },
    {
        "id": "t069",
        "theme": "neurociencias",
        "subtheme": "Estimulação (tDCS)",
        "statement": "Na Estimulação Transcraniana por Corrente Contínua (tDCS), a polaridade do eletrodo determina o efeito na excitabilidade cortical subjacente. De modo geral e simplificado:",
        "options": {
            "A": "A estimulação Anodal aumenta a excitabilidade (despolariza), enquanto a Catodal diminui (hiperpolariza).",
            "B": "A estimulação Anodal diminui a excitabilidade, enquanto a Catodal aumenta.",
            "C": "Ambas sempre aumentam a excitabilidade.",
            "D": "Ambas sempre inibem o córtex.",
            "E": "A tDCS não altera a excitabilidade, apenas o fluxo sanguíneo.",
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "Regra geral da tDCS: Anodo (+) -> Despolariza soma/dendritos -> Facilita disparo (Aumenta excitabilidade). Catodo (-) -> Hiperpolariza -> Dificulta disparo (Diminui excitabilidade/Inibição). Existem exceções e não-linearidades, mas essa é a regra básica do Tratado.",
            "keyConcepts": ["tDCS", "Neurofisiologia", "Estimulação"],
            "examTip": "Anodo = Ativa (Excita). Catodo = Acalma (Inibe)."
        },
        "itemAnalysis": {
            "A": "Correta. Princípio básico.",
            "B": "Incorreta. Inverso.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Neuroestimulação"]
    },
    {
        "id": "t070",
        "theme": "geral",
        "subtheme": "Conceitos Básicos",
        "statement": "Em psicometria, o conceito de 'Precisão' (ou Fidedignidade/Confiabilidade) refere-se a:",
        "options": {
            "A": "A capacidade do teste de medir o que ele se propõe a medir (validade).",
            "B": "A consistência e estabilidade dos escores do teste em diferentes mensurações (livre de erro de medida).",
            "C": "A padronização das normas do teste para a população local.",
            "D": "A sensibilidade do teste para detectar casos positivos.",
            "E": "A especificidade do teste para excluir não-casos.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Precisão (Reliability) é sobre consistência. Se eu aplicar o teste hoje e amanhã (teste-reteste), o resultado é o mesmo? Se sim, é preciso. Validade (Validity) é se ele mede o construto correto (ex: mede depressão ou ansiedade?).",
            "keyConcepts": ["Psicometria", "Fidedignidade", "Validade"],
            "examTip": "Relógio que marca sempre hora errada tem Alta Precisão (consistente) mas Baixa Validade (errado)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Isso é Validade.",
            "B": "Correta. Isso é Precisão/Fidedignidade.",
            "C": "Incorreta. Normatização.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicometria", "Diagnóstico"]
    },
    {
        "id": "t071",
        "theme": "transtornos_personalidade",
        "subtheme": "Comportamento Sexual Compulsivo",
        "statement": "No ciclo do Comportamento Sexual Compulsivo, após a consumação do ato (que traz alívio ou prazer imediato), frequentemente ocorre uma fase disfórica caracterizada por:",
        "options": {
            "A": "Aumento da libido e busca imediata por novo parceiro.",
            "B": "Sentimentos de vergonha, culpa e arrependimento.",
            "C": "Amnésia dissociativa total do ato.",
            "D": "Catatonia.",
            "E": "Euforia maníaca sustentada.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O ciclo típico de compulsão/adicção envolve: Gatilho -> Tensão -> Ato -> Alívio Imediato -> Culpa/Vergonha/Arrependimento -> Tensão (reinício). O texto cita que o prazer é 'comumente substituído por uma sensação de vergonha e arrependimento'.",
            "keyConcepts": ["Sexualidade", "Compulsão", "Ciclo Adictivo"],
            "examTip": "O 'day after' da compulsão é a Culpa."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Característica marcante do sofrimento egodistônico.",
            "C": "Incorreta. Raro.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sexualidade", "Impulsividade"]
    },
    {
        "id": "t072",
        "theme": "saude_publica",
        "subtheme": "Reforma Psiquiátrica",
        "statement": "O fenômeno histórico em que o fechamento de leitos psiquiátricos, sem a criação adequada de serviços comunitários substitutivos, leva ao aumento da população de doentes mentais no sistema prisional ou em situação de rua é denominado:",
        "options": {
            "A": "Desinstitucionalização Eficaz.",
            "B": "Transinstitucionalização.",
            "C": "Reabilitação Psicossocial.",
            "D": "Hospitalocentrismo.",
            "E": "Terapia Moral.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Transinstitucionalização descreve a transferência do paciente de uma instituição (hospital) para outra (prisão/abrigo) devido à falta de suporte, e não uma verdadeira integração na comunidade (Desinstitucionalização).",
            "keyConcepts": ["Saúde Pública", "História", "Transinstitucionalização"],
            "examTip": "Saiu do Hospital -> Foi pra Prisão = Transinstitucionalização."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Termo consagrado na literatura (ex: Lamb).",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Saúde Pública", "Política"]
    },
    {
        "id": "t073",
        "theme": "psicofarmacologia",
        "subtheme": "Espectro TOC",
        "statement": "No tratamento farmacológico do Transtorno Disbórfico Corporal (TDC), o Tratado destaca a eficácia de uma classe específica de medicamentos, frequentemente exigindo doses mais altas do que para depressão. Qual é essa classe?",
        "options": {
            "A": "Benzodiazepínicos.",
            "B": "Inibidores Seletivos da Recaptação de Serotonina (ISRS).",
            "C": "Antipsicóticos Típicos.",
            "D": "Estabilizadores de Humor.",
            "E": "Anticolinesterásicos.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Assim como no TOC, o TDC responde bem aos ISRS (ex: fluoxetina), muitas vezes necessitando de doses elevadas e tempo maior de latência para resposta.",
            "keyConcepts": ["TDC", "Psicofarmacologia", "ISRS"],
            "examTip": "TOC e TDC = ISRS em dose alta."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Base do tratamento.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "TDC"]
    },
    {
        "id": "t074",
        "theme": "neurociencias",
        "subtheme": "Genética",
        "statement": "Na genética psiquiátrica moderna, o termo CNV (Copy Number Variation) ou Variação do Número de Cópias refere-se a:",
        "options": {
            "A": "Mutações pontuais de um único nucleotídeo (SNP).",
            "B": "Deleções ou duplicações de segmentos de DNA (geralmente > 1kb) que alteram o número de cópias de genes.",
            "C": "Alterações epigenéticas (metilação) sem mudança na sequência.",
            "D": "Trissomia do cromossomo 21.",
            "E": "Sequenciamento de RNA viral.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "CNVs são alterações estruturais onde trechos do genoma são deletados (ficando com 1 cópia ou 0) ou duplicados (3 ou mais cópias). São fatores de risco importantes (e muitas vezes raros/de novo) para autismo e esquizofrenia.",
            "keyConcepts": ["Genética", "CNV", "Esquizofrenia"],
            "examTip": "CNV = Pedaço faltando ou sobrando (Deleção/Duplicação)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Isso é SNP.",
            "B": "Correta. Definição precisa.",
            "C": "Incorreta. Epigenética.",
            "D": "Incorreta. Aneuploidia (embora mude número de cópias, CNV geralmente refere-se a segmentos subcromossômicos).",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Genética", "Biologia Molecular"]
    },
    {
        "id": "t075",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Parafilias",
        "statement": "O diagnóstico diferencial entre Transtorno Voyeurista e comportamento de espiar no Transtorno da Personalidade Antissocial baseia-se principalmente:",
        "options": {
            "A": "Na idade do indivíduo.",
            "B": "Na motivação: no Voyeurista há excitação sexual específica pelo ato de observar, enquanto no Antissocial o ato visa poder, violação ou oportunidade, sem o padrão preferencial de excitação voyeurista.",
            "C": "No uso de binóculos (exclusivo do voyeurista).",
            "D": "Na presença de alucinações.",
            "E": "Não há diferença, são a mesma patologia.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A distinção crucial é a motivação sexual. O voyeurista se excita com o ato de ver o outro nu/íntimo sem consentimento. O antissocial pode espiar para roubar, intimidar ou por desrespeito normas, sem que isso seja sua preferência sexual primária.",
            "keyConcepts": ["Parafilias", "Diagnóstico Diferencial", "Forense"],
            "examTip": "Voyeur quer prazer sexual. Antissocial quer vantagem ou quebrar regra."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Critério do DSM-5.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sexualidade", "Diagnóstico"]
    },
    {
        "id": "t076",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Desenvolvimento",
        "statement": "Reflexos primitivos (como o de Moro ou Preensão Palmar) estão presentes ao nascimento e desaparecem gradualmente. A persistência desses reflexos além da idade esperada (ex: além dos 6 meses) geralmente indica:",
        "options": {
            "A": "Desenvolvimento cognitivo superior (superdotação).",
            "B": "Disfunção neurológica ou comprometimento do desenvolvimento motor central.",
            "C": "Autismo leve.",
            "D": "TDAH.",
            "E": "Maturação precoce do lobo frontal.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A inibição dos reflexos primitivos ocorre pela maturação das vias corticais inibitórias. Sua persistência (ou reaparecimento) sinaliza que essas vias (trato piramidal/córtex) não estão funcionando ou amadurecendo corretamente.",
            "keyConcepts": ["Neurologia Infantil", "Desenvolvimento", "Reflexos"],
            "examTip": "Reflexo primitivo que não some = Cérebro não amadureceu (Alerta Vermelho)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Sinal de alerta neurológico.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta. Indicaria imaturidade, não maturação."
        },
        "tags": ["Tratado 2022", "Infância", "Neurologia"]
    },
    {
        "id": "t077",
        "theme": "psicogeriatria",
        "subtheme": "Demência",
        "statement": "A Memantina, um antagonista dos receptores NMDA, tem indicação formal aprovada para o tratamento da Doença de Alzheimer em qual estágio?",
        "options": {
            "A": "Prevenção primária (antes dos sintomas).",
            "B": "Comprometimento Cognitivo Leve (CCL).",
            "C": "Fase Leve apenas.",
            "D": "Fases Moderada a Grave.",
            "E": "Apenas em estágios terminais (paliativo).",
        },
        "correctAnswer": "D",
        "difficulty": 2,
        "explanation": {
            "correct": "A Memantina é indicada para DA moderada a grave. Não há evidência robusta de benefício na fase leve (onde se usam anticolinesterásicos isolados). Na moderada/grave, pode-se combinar.",
            "keyConcepts": ["Alzheimer", "Psicofarmacologia", "Memantina"],
            "examTip": "Memantina = Moderada/Grave. Leve = Anticolinesterásico."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Incorreta.",
            "D": "Correta. Indicação de bula e diretrizes.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Tratamento"]
    },
    {
        "id": "t078",
        "theme": "dependencia_quimica",
        "subtheme": "Álcool",
        "statement": "Na Síndrome de Abstinência Alcoólica (SAA), os sintomas autonômicos e tremores geralmente atingem seu pico de intensidade em qual intervalo de tempo após a interrupção do uso?",
        "options": {
            "A": "2 a 4 horas.",
            "B": "24 a 36 horas.",
            "C": "7 a 10 dias.",
            "D": "30 dias.",
            "E": "Imediatamente (5 minutos).",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A abstinência alcoólica inicia-se em 6-8h, mas o pico dos sintomas típicos (tremores, instabilidade autonômica, risco de convulsão) ocorre geralmente entre 24h e 36h.",
            "keyConcepts": ["Abstinência", "Álcool", "Emergência"],
            "examTip": "O 'dia seguinte' difícil vira o 'segundo dia' insuportável (Pico 24-36h)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Muito cedo (início).",
            "B": "Correta. Pico clássico.",
            "C": "Incorreta. Já deve ter resolvido ou evoluído para complicações tardias.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Dependência Química", "Urgência"]
    },
    {
        "id": "t079",
        "theme": "urgencias_psiquiatricas",
        "subtheme": "Agitação Psicomotora",
        "statement": "No manejo da agitação psicomotora, se a contenção verbal falhar e o paciente aceitar medicação, a via de administração preferencial (pela segurança e dignidade) é:",
        "options": {
            "A": "Intravenosa (IV).",
            "B": "Oral (VO).",
            "C": "Intramuscular (IM) forçada.",
            "D": "Intratecal.",
            "E": "Inalatória.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "Sempre que possível, deve-se oferecer e priorizar a medicação oral. É menos traumática, preserva a aliança terapêutica e tem absorção mais previsível que a IM errática em paciente agitado (embora IM seja necessária se houver recusa/risco iminente).",
            "keyConcepts": ["Agitação", "Manejo", "Ética"],
            "examTip": "Boca antes da Agulha."
        },
        "itemAnalysis": {
            "A": "Incorreta. Risco alto em paciente agitado.",
            "B": "Correta. Primeira escolha farmacológica se aceita.",
            "C": "Incorreta. Apenas se recusa/risco.",
            "D": "Incorreta.",
            "E": "Incorreta. (Loxapina inalatória existe nos EUA, mas regra geral é VO). "
        },
        "tags": ["Tratado 2022", "Urgência", "Manejo Clínico"]
    },
    {
        "id": "t080",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "TDAH",
        "statement": "Neuropsicologicamente, o TDAH está frequentemente associado a déficits nas Funções Executivas. Dentre estas, uma das mais afetadas, responsável por manter informações 'online' para processamento, é a:",
        "options": {
            "A": "Memória de Longo Prazo.",
            "B": "Memória de Trabalho (Operacional).",
            "C": "Gnosia Visual.",
            "D": "Praxia Construtiva.",
            "E": "Linguagem Receptiva.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A Memória de Trabalho (Working Memory) é um componente central das funções executivas e frequentemente deficitária no TDAH, dificultando o planejamento, sequenciamento e manutenção do foco em tarefas complexas.",
            "keyConcepts": ["TDAH", "Neuropsicologia", "Funções Executivas"],
            "examTip": "TDAH esquece o que ia fazer no meio do caminho = Falha na Memória de Trabalho."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Déficit 'core' do TDAH.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neuropsicologia", "TDAH"]
    },
    {
        "id": "t081",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Desenvolvimento",
        "statement": "A 'Teoria da Mente' (Theory of Mind), que se desenvolve significativamente entre os 3 e 5 anos, é a capacidade de:",
        "options": {
            "A": "Resolver equações matemáticas mentais.",
            "B": "Compreender que os outros possuem estados mentais, crenças e intenções diferentes das suas próprias.",
            "C": "Telepatia.",
            "D": "Memorizar mapas.",
            "E": "Controlar esfíncteres.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Teoria da Mente é a base da cognição social: entender que o outro pensa diferente de mim. Sua ausência ou prejuízo é um marco do Espectro Autista.",
            "keyConcepts": ["Desenvolvimento", "Teoria da Mente", "Cognição Social"],
            "examTip": "Saber que o outro pode ser enganado ou ter uma crença falsa = Teoria da Mente."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Definição central.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicologia do Desenvolvimento", "Cognição"]
    },
    {
        "id": "t082",
        "theme": "neurociencias",
        "subtheme": "Neuroestimulação",
        "statement": "A Fotobiomodulação Transcraniana (tPBM) é uma técnica experimental de neuromodulação. Segundo as hipóteses atuais citadas no Tratado, seu principal mecanismo de ação envolve a absorção de luz (infravermelho próximo) por qual organela celular, estimulando a produção de ATP?",
        "options": {
            "A": "Mitocôndrias (Citocromo C Oxidase).",
            "B": "Retículo Endoplasmático Rugoso.",
            "C": "Lisossomos.",
            "D": "Núcleo Celular (Receptores Histônicos).",
            "E": "Complexo de Golgi.",
        },
        "correctAnswer": "A",
        "difficulty": 3,
        "explanation": {
            "correct": "A tPBM usa luz para estimular os fotoceptores nas mitocôndrias (especificamente a enzima Citocromo C Oxidase), teoricamente aumentando a respiração celular e a produção de energia (ATP) nos neurônios.",
            "keyConcepts": ["Neuroestimulação", "Mitocôndria", "Pesquisa"],
            "examTip": "Luz na Cabeça = Energia na Mitocôndria."
        },
        "itemAnalysis": {
            "A": "Correta. Mecanismo proposto.",
            "B": "Incorreta.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Inovação"]
    },
    {
        "id": "t083",
        "theme": "neurociencias",
        "subtheme": "Genética",
        "statement": "A Epigenética diferencia-se da Genética clássica por estudar mecanismos que:",
        "options": {
            "A": "Alteram a sequência de bases do DNA (mutações).",
            "B": "Alteram a expressão gênica (fenótipo) sem alterar a sequência de DNA subjacente (como metilação e acetilação de histonas).",
            "C": "São herdados exclusivamente pela linhagem paterna.",
            "D": "Não sofrem influência do ambiente.",
            "E": "Envolvem apenas o RNA mensageiro.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Epigenética é o estudo das mudanças na função do gene que são herdáveis (mitótica ou meioticamente) e reversíveis, mas que não envolvem mudanças na sequência do DNA (ex: o ambiente 'liga ou desliga' o gene via metilação).",
            "keyConcepts": ["Genética", "Epigenética", "Ambiente"],
            "examTip": "Epigenética = Software (expressão) mudando sem trocar o Hardware (DNA)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Isso é mutação/polimorfismo.",
            "B": "Correta. Definição central.",
            "C": "Incorreta.",
            "D": "Incorreta. O ambiente é o principal gatilho.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Genética", "Neurobiologia"]
    },
    {
        "id": "t084",
        "theme": "esquizofrenia_psicose",
        "subtheme": "Neurobiologia",
        "statement": "Na neurobiologia da Esquizofrenia, os sintomas negativos e cognitivos são frequentemente associados a disfunções (hipofrontalidade) em qual sistema de neurotransmissão e região cerebral?",
        "options": {
            "A": "Excesso de Dopamina na via Mesolímbica.",
            "B": "Déficit de Dopamina na via Mesocortical (Pré-frontal).",
            "C": "Excesso de Serotonina na Rafe.",
            "D": "Déficit de Acetilcolina no Núcleo Basal de Meynert.",
            "E": "Excesso de Noradrenalina no Locus Coeruleus.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A hipótese dopaminérgica revisada postula: 1) Excesso de DA na via Mesolímbica = Sintomas Positivos (Alucinações). 2) Falta de DA na via Mesocortical (Pré-frontal) = Sintomas Negativos e Cognitivos.",
            "keyConcepts": ["Esquizofrenia", "Dopamina", "Neuroanatomia"],
            "examTip": "Sintoma Positivo = Muita Dopamina (Límbico). Sintoma Negativo = Pouca Dopamina (Cortical)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Causa sintomas positivos.",
            "B": "Correta. Causa hipofrontalidade/sintomas negativos.",
            "C": "Incorreta.",
            "D": "Incorreta. Demência.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Esquizofrenia"]
    },
    {
        "id": "t085",
        "theme": "transtornos_ansiedade",
        "subtheme": "TEPT - História",
        "statement": "Historicamente, o diagnóstico de Transtorno de Estresse Pós-Traumático (TEPT) foi oficializado e estruturado (influenciado pelos estudos com veteranos do Vietnã) em qual edição do DSM?",
        "options": {
            "A": "DSM-I (1952).",
            "B": "DSM-II (1968).",
            "C": "DSM-III (1980).",
            "D": "DSM-IV (1994).",
            "E": "DSM-5 (2013).",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "O DSM-III (1980) foi um marco ao incluir o TEPT como entidade nosográfica oficial, legitimando o sofrimento dos veteranos e vítimas de traumas civis, superando noções vagas como 'neurose de guerra'.",
            "keyConcepts": ["História", "TEPT", "DSM"],
            "examTip": "TEPT nasceu oficialmente no DSM-III (Pós-Vietnã)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Falava em 'Reação Grosso Estresse'.",
            "B": "Incorreta.",
            "C": "Correta. Marco histórico.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "História", "Diagnóstico"]
    },
    {
        "id": "t086",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Sono - Exames",
        "statement": "A Actigrafia é um método de avaliação do sono que utiliza um dispositivo semelhante a um relógio (acelerômetro). Sua principal vantagem clínica em relação à Polissonografia (PSG) é:",
        "options": {
            "A": "Diagnosticar apneia do sono com precisão.",
            "B": "Monitorar o ciclo sono-vigília por longos períodos (semanas) no ambiente natural do paciente, avaliando ritmos circadianos.",
            "C": "Registrar a atividade elétrica cerebral (EEG).",
            "D": "Detectar movimentos periódicos de pernas durante o sono REM.",
            "E": "Substituir a PSG em todos os casos de insônia.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A actigrafia estima o sono pelo movimento. Embora menos precisa que a PSG para estadiamento, ela permite ver o padrão de sono real do paciente em casa por 14 dias ou mais, sendo ideal para distúrbios de ritmo circadiano e insônia crônica.",
            "keyConcepts": ["Sono", "Exames Complementares", "Actigrafia"],
            "examTip": "Actigrafia = Diário de sono tecnológico (Vê o ritmo de vários dias)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Não mede fluxo aéreo.",
            "B": "Correta. Principal indicação.",
            "C": "Incorreta. Actígrafo não tem EEG.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Sono", "Diagnóstico"]
    },
    {
        "id": "t087",
        "theme": "dependencia_quimica",
        "subtheme": "Estimulantes",
        "statement": "Segundo dados epidemiológicos brasileiros (como o LNUD) citados no Tratado, o uso de Cocaína e Crack apresenta qual padrão demográfico predominante?",
        "options": {
            "A": "Maior prevalência em mulheres e idosos.",
            "B": "Maior prevalência em homens, sendo o uso de crack frequentemente subestimado em inquéritos domiciliares (população de rua).",
            "C": "Uso exclusivamente endovenoso na atualidade.",
            "D": "Prevalência zero na região Sul.",
            "E": "Acomete mais ricos que pobres em relação ao crack.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O uso de cocaína é mais prevalente no sexo masculino. Pesquisas domiciliares falham em captar a população em situação de rua ou institucionalizada, onde o uso de crack é concentrado, gerando subnotificação.",
            "keyConcepts": ["Epidemiologia", "Dependência Química", "Cocaína"],
            "examTip": "Homens usam mais. Crack é 'invisível' nas pesquisas de porta em porta."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Dado epidemiológico clássico.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta. Crack tem forte associação com vulnerabilidade social."
        },
        "tags": ["Tratado 2022", "Epidemiologia", "Saúde Pública"]
    },
    {
        "id": "t088",
        "theme": "geral",
        "subtheme": "Psicometria",
        "statement": "Na teoria clássica dos testes, a 'Consistência Interna' (frequentemente medida pelo Alfa de Cronbach) avalia:",
        "options": {
            "A": "Se o teste correlaciona com o padrão-ouro (Validade de Critério).",
            "B": "O grau em que os diferentes itens do mesmo teste medem o mesmo construto (homogeneidade do teste).",
            "C": "A estabilidade temporal (Teste-Reteste).",
            "D": "A concordância entre dois avaliadores diferentes (Interobservador).",
            "E": "A capacidade preditiva do teste.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Consistência interna verifica se as perguntas 'conversam entre si'. Se eu estou medindo depressão, todas as perguntas devem apontar para depressão. Um Alfa alto (>0.7) indica boa consistência.",
            "keyConcepts": ["Psicometria", "Estatística", "Fidedignidade"],
            "examTip": "Alfa de Cronbach = Coerência interna dos itens."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Definição de consistência interna.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicometria", "Pesquisa"]
    },
    {
        "id": "t089",
        "theme": "psicopatologia_diagnostico",
        "subtheme": "Dissociação e Cultura",
        "statement": "Para diferenciar um Transtorno Dissociativo (de Identidade ou Transe) de rituais culturais/religiosos de possessão (aceitos culturalmente), o critério fundamental do DSM-5 é:",
        "options": {
            "A": "A presença de amnésia (sempre patológica).",
            "B": "O uso de substâncias alucinógenas.",
            "C": "Se o estado causa sofrimento clinicamente significativo ou prejuízo social/funcional e se é não desejado/involuntário fora do contexto ritual.",
            "D": "A duração do transe (se > 1 hora é patológico).",
            "E": "A religião específica (algumas são consideradas patológicas por definição).",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "Fenômenos de transe são normais em muitos contextos culturais. Só vira transtorno se causar sofrimento, prejuízo ou ocorrer de forma involuntária e indesejada fora do momento apropriado.",
            "keyConcepts": ["Dissociação", "Transcultural", "Diagnóstico"],
            "examTip": "Cultura não é doença. Doença precisa ter Sofrimento/Prejuízo."
        },
        "itemAnalysis": {
            "A": "Incorreta. Pode haver amnésia em rituais.",
            "B": "Incorreta.",
            "C": "Correta. Critério geral de transtorno mental.",
            "D": "Incorreta.",
            "E": "Incorreta. Preconceito."
        },
        "tags": ["Tratado 2022", "Cultura", "Diagnóstico"]
    },
    {
        "id": "t090",
        "theme": "psicofarmacologia",
        "subtheme": "Sexualidade",
        "statement": "A Flibanserina é um fármaco aprovado (embora com controvérsias e uso restrito) para o tratamento de qual disfunção sexual, segundo o Tratado?",
        "options": {
            "A": "Disfunção Erétil em idosos.",
            "B": "Ejaculação Precoce.",
            "C": "Transtorno do Interesse/Excitação Sexual Feminino (Desejo Hipoativo) em mulheres na pré-menopausa.",
            "D": "Anorgasmia induzida por ISRS.",
            "E": "Priapismo.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "A Flibanserina (agonista 5-HT1A/antagonista 5-HT2A) foi aprovada pelo FDA e no Brasil especificamente para mulheres na pré-menopausa com baixo desejo sexual (Desejo Hipoativo) que causa sofrimento.",
            "keyConcepts": ["Psicofarmacologia", "Sexualidade Feminina", "Flibanserina"],
            "examTip": "Flibanserina = 'Viagra rosa' (mas age no cérebro/desejo, não no fluxo sanguíneo) para mulheres pré-menopausa."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta.",
            "C": "Correta. Indicação de bula.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Saúde da Mulher"]
    },
    {
        "id": "t091",
        "theme": "psicofarmacologia",
        "subtheme": "Estabilizadores de Humor",
        "statement": "Sobre a farmacocinética do Lítio e seus riscos de longo prazo: sua excreção é quase exclusivamente _________, o que exige monitoramento constante da função _________.",
        "options": {
            "A": "Hepática / do Fígado.",
            "B": "Renal / dos Rins.",
            "C": "Biliar / da Vesícula.",
            "D": "Pulmonar / dos Pulmões.",
            "E": "Sudorípara / da Pele.",
        },
        "correctAnswer": "B",
        "difficulty": 1,
        "explanation": {
            "correct": "O Lítio não é metabolizado pelo fígado. É um íon excretado pelos rins, competindo com o sódio. Toxicidade crônica pode levar a diabetes insipidus nefrogênico e doença renal crônica.",
            "keyConcepts": ["Lítio", "Farmacocinética", "Nefrotoxicidade"],
            "examTip": "Lítio ama o Rim (e pode destruir o Rim). Valproato ama o Fígado."
        },
        "itemAnalysis": {
            "A": "Incorreta. Valproato/Carbamazepina são hepáticos.",
            "B": "Correta. Excreção renal > 95%.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicofarmacologia", "Segurança"]
    },
    {
        "id": "t092",
        "theme": "neurociencias",
        "subtheme": "Neuroplasticidade",
        "statement": "Tanto a Eletroconvulsoterapia (ECT) quanto os antidepressivos crônicos parecem compartilhar um mecanismo neurobiológico final comum relacionado à neuroplasticidade. Qual fator neurotrófico tem sua expressão aumentanda no hipocampo por esses tratamentos?",
        "options": {
            "A": "Cortisol.",
            "B": "BDNF (Fator Neurotrófico Derivado do Cérebro).",
            "C": "Dopamina.",
            "D": "Beta-amiloide.",
            "E": "Substância P.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A 'hipótese neurotrófica' sugere que a depressão envolve atrofia hipocampal e que os tratamentos eficazes (ECT, Lítio, ISRS) aumentam a expressão de BDNF, promovendo a neurogênese e sinaptogênese.",
            "keyConcepts": ["Neurociências", "BDNF", "Tratamento"],
            "examTip": "Tratar Depressão = Dar 'adubo' (BDNF) para o cérebro crescer."
        },
        "itemAnalysis": {
            "A": "Incorreta. Cortisol geralmente diminui/normaliza.",
            "B": "Correta. Marcador central de neuroplasticidade.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Mecanismo de Ação"]
    },
    {
        "id": "t093",
        "theme": "urgencias_psiquiatricas",
        "subtheme": "Suicídio",
        "statement": "O 'paradoxo de gênero' no comportamento suicida refere-se ao fato epidemiológico de que:",
        "options": {
            "A": "Mulheres tentam e completam mais suicídio que homens.",
            "B": "Homens tentam mais, mas mulheres completam mais.",
            "C": "Mulheres tentam mais (maior morbidade), mas homens completam mais (maior letalidade).",
            "D": "Não há diferença entre gêneros.",
            "E": "Homens só tentam suicídio na velhice.",
        },
        "correctAnswer": "C",
        "difficulty": 1,
        "explanation": {
            "correct": "Globalmente, as mulheres apresentam taxas de tentativa de suicídio cerca de 3 vezes maiores que os homens. Contudo, os homens morrem por suicídio cerca de 3 a 4 vezes mais que as mulheres, devido à escolha de métodos mais violentos e letais.",
            "keyConcepts": ["Suicídio", "Epidemiologia", "Gênero"],
            "examTip": "Mulher tenta mais. Homem morre mais."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Incorreta. Inverso.",
            "C": "Correta. Paradoxo clássico.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Epidemiologia", "Emergência"]
    },
    {
        "id": "t094",
        "theme": "dependencia_quimica",
        "subtheme": "Genética do Álcool",
        "statement": "O 'Asian Flush' (rubor facial após beber) é um fator de proteção genético contra o alcoolismo comum em populações asiáticas. Isso ocorre devido a uma deficiência na enzima _________, que leva ao acúmulo tóxico de _________.",
        "options": {
            "A": "Álcool Desidrogenase (ADH) / Etanol.",
            "B": "Aldeído Desidrogenase (ALDH) / Acetaldeído.",
            "C": "CYP450 / Metanol.",
            "D": "MAO-A / Tiramina.",
            "E": "GABA / Glutamato.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "Quem tem deficiência de ALDH não consegue quebrar o Acetaldeído (metabólito tóxico do álcool que causa náusea, rubor, taquicardia). Esse mal-estar imediato funciona como um 'disulfiram natural', protegendo contra o desenvolvimento da dependência.",
            "keyConcepts": ["Álcool", "Metabolismo", "Genética"],
            "examTip": "Falta ALDH -> Acumula Acetaldeído -> Passa mal (Proteção)."
        },
        "itemAnalysis": {
            "A": "Incorreta. ADH transforma álcool em acetaldeído.",
            "B": "Correta. Mecanismo do flush.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Dependência Química", "Neurobiologia"]
    },
    {
        "id": "t095",
        "theme": "etica_forense_legal",
        "subtheme": "Imputabilidade",
        "statement": "No Código Penal Brasileiro, o indivíduo considerado 'Semi-imputável' (aquele que, por perturbação da saúde mental, tinha capacidade reduzida de entender ou determinar-se) está sujeito a:",
        "options": {
            "A": "Isenção total de pena (absolvição imprópria).",
            "B": "Pena integral, sem redução.",
            "C": "Condenação com redução da pena (de 1/3 a 2/3), podendo esta ser substituída por medida de segurança (tratamento) se houver periculosidade.",
            "D": "Pena de morte.",
            "E": "Multa apenas.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "A semi-imputabilidade (ex: fronteiriços, alguns casos de dependência ou transtornos de personalidade graves) não isenta de culpa, mas reduz a reprovabilidade (culpabilidade), levando à redução da pena e possível tratamento.",
            "keyConcepts": ["Forense", "Imputabilidade", "Legislação"],
            "examTip": "Inimputável = Isento (Medida de Segurança). Semi-imputável = Redução de Pena."
        },
        "itemAnalysis": {
            "A": "Incorreta. Isso é para o Inimputável.",
            "B": "Incorreta. Isso é para o Imputável.",
            "C": "Correta. Artigo 26 parágrafo único.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Forense", "Lei"]
    },
    {
        "id": "t096",
        "theme": "psicogeriatria",
        "subtheme": "Demência de Lewy",
        "statement": "Para o diagnóstico de provável Demência com Corpos de Lewy, além do declínio cognitivo, quais são as características clínicas centrais (Core Features)?",
        "options": {
            "A": "Afasia, Apraxia e Agnosia.",
            "B": "Flutuação da cognição/atenção, Alucinações Visuais recorrentes e Sintomas de Parkinsonismo espontâneo.",
            "C": "Coreia de Huntington e Alteração de personalidade.",
            "D": "Incontinência urinária, Marcha magnética e Demência (Tríade de Hakim).",
            "E": "Hiperoralidade e Comportamento social desinibido.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "A tríade clássica da DLB é: Flutuação (o paciente 'acende e apaga'), Alucinações Visuais (bem formadas, animais/pessoas) e Parkinsonismo (rigidez/bradicinesia). O Transtorno Comportamental do Sono REM também é um biomarcador forte.",
            "keyConcepts": ["Demência", "Lewy", "Diagnóstico"],
            "examTip": "Lewy = Ver bicho (alucinação) + Tremer (parkinson) + Flutuar."
        },
        "itemAnalysis": {
            "A": "Incorreta. Típico de Alzheimer.",
            "B": "Correta. Critérios do Consórcio DLB.",
            "C": "Incorreta.",
            "D": "Incorreta. Hidrocefalia de Pressão Normal.",
            "E": "Incorreta. Demência Frontotemporal."
        },
        "tags": ["Tratado 2022", "Psicogeriatria", "Sinais Clínicos"]
    },
    {
        "id": "t097",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Adolescência",
        "statement": "A tendência ao comportamento de risco na adolescência é explicada neurobiologicamente pelo 'descompasso' (mismatch) maturacional entre:",
        "options": {
            "A": "O Hemisfério Esquerdo e Direito.",
            "B": "O Sistema Límbico (recompensa/emoção) que amadurece cedo, e o Córtex Pré-Frontal (controle inibitório) que só amadurece tardiamente (~25 anos).",
            "C": "O Cerebelo e o Tronco Cerebral.",
            "D": "A Substância Cinzenta e a Branca.",
            "E": "A Serotonina e a Dopamina.",
        },
        "correctAnswer": "B",
        "difficulty": 2,
        "explanation": {
            "correct": "O 'cérebro adolescente' tem um acelerador potente (striatum/amígdala buscando prazer/emoção) e um freio ainda em construção (pré-frontal). Isso predispõe a riscos, impulsividade e uso de drogas.",
            "keyConcepts": ["Adolescência", "Neurodesenvolvimento", "Impulsividade"],
            "examTip": "Adolescente = Motor de Ferrari (Límbico) + Freio de Bicicleta (Pré-frontal)."
        },
        "itemAnalysis": {
            "A": "Incorreta.",
            "B": "Correta. Teoria do Dual Systems Model.",
            "C": "Incorreta.",
            "D": "Incorreta.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Neurociências", "Desenvolvimento"]
    },
    {
        "id": "t098",
        "theme": "psiquiatria_infantojuvenil",
        "subtheme": "Marcos do Desenvolvimento",
        "statement": "No desenvolvimento infantil típico, por volta dos 9 meses de idade, espera-se que a criança adquira qual habilidade motora fina importante?",
        "options": {
            "A": "Desenhar um círculo.",
            "B": "Preensão em pinça (polegar-indicador).",
            "C": "Empilhar 6 cubos.",
            "D": "Transferir objetos de uma mão para outra (ocorre aos 6m).",
            "E": "Usar tesoura.",
        },
        "correctAnswer": "B",
        "difficulty": 3,
        "explanation": {
            "correct": "A pinça (pincer grasp) madura surge aos 9-10 meses. Antes disso a preensão é palmar (grosseira). É um marco de refinamento motor e neurológico.",
            "keyConcepts": ["Desenvolvimento", "Neurologia Infantil", "Marcos"],
            "examTip": "9 meses = Pinça (pegar migalha do chão) + Engatinhar."
        },
        "itemAnalysis": {
            "A": "Incorreta. 3 anos.",
            "B": "Correta. Marco clássico.",
            "C": "Incorreta. 18-24 meses.",
            "D": "Incorreta. 5-6 meses.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Infância", "Desenvolvimento"]
    },
    {
        "id": "t099",
        "theme": "psicogeriatria",
        "subtheme": "Diagnóstico",
        "statement": "O Miniexame do Estado Mental (MEEM) é amplamente usado, mas apresenta limitações. Sua principal fraqueza no contexto de diagnóstico precoce é:",
        "options": {
            "A": "Baixa sensibilidade para detecção de Comprometimento Cognitivo Leve (CCL) e demências em fases muito iniciais, especialmente em pacientes com alta escolaridade.",
            "B": "Impossibilidade de aplicar em analfabetos.",
            "C": "Não avalia memória.",
            "D": "Exige ressonância magnética concomitante.",
            "E": "Demora mais de 1 hora para aplicar.",
        },
        "correctAnswer": "A",
        "difficulty": 2,
        "explanation": {
            "correct": "O MEEM tem 'efeito teto'. Pacientes com alta reserva cognitiva ou CCL pontuam normal (28, 29, 30) mesmo estando doentes. Testes como o MoCA (Montreal Cognitive Assessment) são mais sensíveis para essa fase.",
            "keyConcepts": ["MEEM", "Diagnóstico", "Psicogeriatria"],
            "examTip": "MEEM é ruim para Leves e 'Inteligentes' (Alta escolaridade mascara)."
        },
        "itemAnalysis": {
            "A": "Correta. Principal crítica ao MEEM.",
            "B": "Incorreta. Existem pontos de corte ajustados, embora seja difícil.",
            "C": "Incorreta. Avalia sim.",
            "D": "Incorreta.",
            "E": "Incorreta. É rápido (5-10 min)."
        },
        "tags": ["Tratado 2022", "Psicometria", "Demência"]
    },
    {
        "id": "t100",
        "theme": "psicoterapia",
        "subtheme": "Transtornos Dissociativos",
        "statement": "O tratamento de primeira linha para o Transtorno Dissociativo de Identidade (TDI), visando a integração das identidades ou a cooperação entre elas, é:",
        "options": {
            "A": "Antipsicóticos em dose plena.",
            "B": "Eletroconvulsoterapia de manutenção.",
            "C": "Psicoterapia orientada ao trauma (frequentemente em três fases: segurança, processamento do trauma, reintegração).",
            "D": "Hipnose para apagar as memórias.",
            "E": "Benzodiazepínicos crônicos.",
        },
        "correctAnswer": "C",
        "difficulty": 2,
        "explanation": {
            "correct": "Não existe pílula para TDI. O tratamento é psicoterapêutico, longo e complexo, focado em estabelecer segurança, processar as memórias traumáticas que geraram a dissociação e integrar os estados de personalidade.",
            "keyConcepts": ["Dissociação", "Psicoterapia", "TDI"],
            "examTip": "TDI se trata falando (Terapia de Trauma)."
        },
        "itemAnalysis": {
            "A": "Incorreta. Ajudam em sintomas, não na causa.",
            "B": "Incorreta.",
            "C": "Correta. Padrão ouro.",
            "D": "Incorreta. Hipnose pode ser usada para acessar, não apagar.",
            "E": "Incorreta."
        },
        "tags": ["Tratado 2022", "Psicoterapia", "Trauma"]
    }
];
