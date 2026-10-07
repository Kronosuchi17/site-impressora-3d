export type BranchId = "conserto" | "manutencao" | "troca";

export type ServiceItem = { name: string; desc: string; price: number };

export type Part = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  symptoms: { label: string; branch: BranchId }[];
  branches: Record<BranchId, ServiceItem[]>;
};

export const BRAND = "LayerFix";
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "5500000000000";

export const BRANCHES: { id: BranchId; label: string; sub: string }[] = [
  { id: "conserto", label: "Conserto", sub: "Parou, falha ou imprime errado" },
  { id: "manutencao", label: "Manutenção", sub: "Revisão preventiva e calibração" },
  { id: "troca", label: "Troca de peças", sub: "Peça nova instalada e testada" },
];

export const parts: Part[] = [
  {
    slug: "hotend",
    name: "Hotend e bico",
    tagline: "Onde o filamento derrete.",
    intro:
      "Entupimento, vazamento e temperatura instável nascem aqui. Diagnosticamos o conjunto inteiro e devolvemos o fluxo perfeito.",
    symptoms: [
      { label: "Bico entupido", branch: "conserto" },
      { label: "Filamento vaza no bloco", branch: "conserto" },
      { label: "Temperatura oscila", branch: "troca" },
      { label: "Peças com fiapos", branch: "manutencao" },
    ],
    branches: {
      conserto: [
        { name: "Desentupimento completo", desc: "Desmontagem, limpeza a quente e teste de extrusão.", price: 80 },
        { name: "Correção de vazamento (leak)", desc: "Reaperto, vedação e recalibração de PID.", price: 120 },
        { name: "Reparo de fiação do aquecedor", desc: "Solda, reforço e proteção dos cabos.", price: 90 },
      ],
      manutencao: [
        { name: "Limpeza e relubrificação do conjunto", desc: "Cold pull, limpeza do heatbreak e ventoinhas.", price: 70 },
        { name: "Calibração PID e temperatura", desc: "Ajuste fino para PLA, PETG, ABS e TPU.", price: 60 },
      ],
      troca: [
        { name: "Bico de latão ou aço endurecido", desc: "0.2 a 0.8 mm, instalado e testado.", price: 70 },
        { name: "Heatbreak + barrel", desc: "Peça nova com vedação correta.", price: 140 },
        { name: "Termistor e cartucho aquecedor", desc: "Substituição e validação de leitura.", price: 110 },
        { name: "Kit hotend completo 24V", desc: "Conjunto novo com ventoinha, instalado e calibrado.", price: 320 },
      ],
    },
  },
  {
    slug: "extrusora",
    name: "Extrusora",
    tagline: "Empurra o filamento com precisão.",
    intro:
      "Subextrusão, estalos e filamento mordido indicam desgaste. Revisamos engrenagem, tensão e motor.",
    symptoms: [
      { label: "Estala e pula passos", branch: "conserto" },
      { label: "Filamento mordido", branch: "troca" },
      { label: "Subextrusão", branch: "manutencao" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de tensão e alinhamento", desc: "Ajuste de mola, rolamento e alinhamento do fluxo.", price: 70 },
        { name: "Reparo do motor da extrusora", desc: "Teste de bobinas, conector e corrente do driver.", price: 130 },
      ],
      manutencao: [
        { name: "Limpeza e calibração de e-steps", desc: "Medição real e ajuste no firmware.", price: 60 },
        { name: "Lubrificação e revisão geral", desc: "Engrenagens, alavanca e tubo PTFE.", price: 60 },
      ],
      troca: [
        { name: "Engrenagem de aço endurecido", desc: "Mais mordida, menos desgaste.", price: 90 },
        { name: "Extrusora dual gear", desc: "Upgrade completo de tração.", price: 190 },
        { name: "Tubo PTFE (Bowden)", desc: "Tubo novo cortado e encaixado.", price: 60 },
      ],
    },
  },
  {
    slug: "mesa",
    name: "Mesa aquecida",
    tagline: "A primeira camada decide tudo.",
    intro:
      "Peças que soltam, mesa torta ou que não esquenta: nivelamos, trocamos e deixamos a aderência impecável.",
    symptoms: [
      { label: "Não aquece", branch: "conserto" },
      { label: "Peças soltam da mesa", branch: "manutencao" },
      { label: "Mesa empenada", branch: "troca" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de aquecimento da mesa", desc: "Diagnóstico de termistor, fio e MOSFET.", price: 120 },
        { name: "Reparo de cabo da mesa", desc: "Troca de cabo fadigado e conectores.", price: 90 },
      ],
      manutencao: [
        { name: "Nivelamento e calibração de Z", desc: "Mesa plana, offset correto e malha de nivelamento.", price: 70 },
        { name: "Troca de molas e rodízios", desc: "Nivelamento estável por mais tempo.", price: 70 },
      ],
      troca: [
        { name: "Placa de vidro ou PEI flexível", desc: "Instalação e ajuste de Z.", price: 140 },
        { name: "Mesa aquecida nova", desc: "Peça nova com fiação e teste térmico.", price: 220 },
        { name: "Sensor de nivelamento (BLTouch ou similar)", desc: "Instalação e configuração de firmware.", price: 250 },
      ],
    },
  },
  {
    slug: "movimento",
    name: "Eixos e correias",
    tagline: "Movimento preciso em X, Y e Z.",
    intro:
      "Camadas deslocadas, ruídos e trepidação vêm da mecânica. Alinhamos, tensionamos e trocamos o que estiver gasto.",
    symptoms: [
      { label: "Camadas deslocadas", branch: "manutencao" },
      { label: "Ruído ou trepidação", branch: "manutencao" },
      { label: "Carro trava", branch: "conserto" },
      { label: "Rodas gastas", branch: "troca" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de eixo travado", desc: "Desempeno, limpeza e realinhamento.", price: 120 },
        { name: "Reparo do fuso Z", desc: "Linearidade e acoplamento.", price: 110 },
      ],
      manutencao: [
        { name: "Tensionamento e alinhamento", desc: "Correias e quadro no esquadro.", price: 70 },
        { name: "Lubrificação de eixos", desc: "Graxa correta em fusos e guias.", price: 60 },
      ],
      troca: [
        { name: "Correias GT2 e polias", desc: "Peças novas e tensão calibrada.", price: 90 },
        { name: "Rodas V-slot / rolamentos lineares", desc: "Elimina folgas no carro.", price: 110 },
        { name: "Conversão para guia linear", desc: "Upgrade de precisão e silêncio.", price: 320 },
      ],
    },
  },
  {
    slug: "placa",
    name: "Placa-mãe",
    tagline: "O cérebro da impressora.",
    intro:
      "Reinícios, drivers queimados e displays mortos. Reparamos em nível de componente ou trocamos por uma placa silenciosa.",
    symptoms: [
      { label: "Reinicia sozinha", branch: "conserto" },
      { label: "Driver queimado", branch: "conserto" },
      { label: "Quero silenciar", branch: "troca" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de placa em bancada", desc: "Diagnóstico, solda e teste de cada driver.", price: 180 },
        { name: "Recuperação de bootloader", desc: "Regravação e restauração de firmware.", price: 120 },
      ],
      manutencao: [
        { name: "Atualização de firmware", desc: "Marlin ou Klipper configurado para o seu modelo.", price: 100 },
        { name: "Limpeza e checagem de conectores", desc: "Evita falhas intermitentes.", price: 60 },
      ],
      troca: [
        { name: "Placa silenciosa 32 bits", desc: "Drivers TMC, instalação e firmware.", price: 380 },
        { name: "Driver de motor TMC2209", desc: "Mais silêncio e mais torque.", price: 130 },
        { name: "Instalação de Klipper", desc: "Placa de comando + configuração.", price: 450 },
      ],
    },
  },
  {
    slug: "fonte",
    name: "Fonte e cabos",
    tagline: "Energia estável, segurança total.",
    intro:
      "Fonte fraca ou conector derretido são risco real. Testamos, trocamos e reforçamos a parte elétrica.",
    symptoms: [
      { label: "Liga e desliga", branch: "conserto" },
      { label: "Conector esquentando", branch: "troca" },
      { label: "Quero mais segurança", branch: "manutencao" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de fonte", desc: "Testes de carga e substituição de componentes.", price: 120 },
        { name: "Conector derretido", desc: "Recuperação de bornes e fios.", price: 90 },
      ],
      manutencao: [
        { name: "Revisão elétrica completa", desc: "Terra, bornes, fusível e fiação.", price: 90 },
        { name: "Instalação de proteção térmica", desc: "Reduz risco de superaquecimento.", price: 150 },
      ],
      troca: [
        { name: "Fonte 24V nova", desc: "Mais potência, menos tempo de aquecimento.", price: 230 },
        { name: "Chicote e conectores", desc: "Fiação nova com bitola adequada.", price: 110 },
      ],
    },
  },
  {
    slug: "display",
    name: "Display e firmware",
    tagline: "A sua interface com a máquina.",
    intro:
      "Tela apagada, botões travados ou firmware ultrapassado: recuperamos o controle da sua impressora.",
    symptoms: [
      { label: "Tela apagada", branch: "conserto" },
      { label: "Botão ou encoder falha", branch: "troca" },
      { label: "Firmware desatualizado", branch: "manutencao" },
    ],
    branches: {
      conserto: [
        { name: "Reparo de display", desc: "Cabo, conector e diagnóstico de tela.", price: 90 },
        { name: "Reparo de encoder", desc: "Limpeza e troca de contato.", price: 70 },
      ],
      manutencao: [
        { name: "Atualização e backup de firmware", desc: "Marlin com mesh e filament runout.", price: 100 },
        { name: "Recalibração completa", desc: "Passos, fluxo, retração e Z-offset.", price: 80 },
      ],
      troca: [
        { name: "Display novo", desc: "LCD 12864 ou touch, instalado.", price: 180 },
        { name: "Tela touch (upgrade)", desc: "Interface moderna com firmware ajustado.", price: 340 },
      ],
    },
  },
];

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
