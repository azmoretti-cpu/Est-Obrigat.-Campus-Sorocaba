const campos = [
  "curso", "orientador", "emailOrientador",
  "unidade", "cnpj", "enderecoUnidade", "cepUnidade", "bairroUnidade", "cidadeUnidade", "estadoUnidade",
  "representante", "cargoRepresentante", "telefoneUnidade", "emailUnidade",
  "supervisor", "funcaoSupervisor", "telefoneSupervisor", "emailSupervisor",
  "nomeEstudante", "periodoCurso", "prontuario", "rg", "cpf", "dataNascimento",
  "enderecoEstudante", "cepEstudante", "bairroEstudante", "cidadeEstudante", "estadoEstudante",
  "celularEstudante", "emailEstudante",
  "tipoEstagio", "pcd", "pcdEspecificar",
  "dataInicio", "dataFim", "diasSemana", "periodoEstagio", "horaInicio", "horaFim",
  "estagioEm", "estagioEmOutro", "periodoCursoPlano", "cargaHoraria", "sinteseAtividades", "totalCargaHoraria",
  "diaDocumento", "mesDocumento", "anoDocumento",
  "coordenadorCurso", "responsavelEstagios", "coordenadorInstitucional"
];

const obrigatorios = campos.filter(c => c !== "pcdEspecificar" && c !== "estagioEmOutro");

function valor(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function preencherSaida(id, texto = null) {
  document.querySelectorAll(`[data-out="${id}"]`).forEach(el => {
    el.textContent = texto === null ? (valor(id) || "[preencher]") : texto;
  });
}

function validar() {
  const erros = [];
  document.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("erro"));

  obrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (el && !valor(id)) {
      erros.push(`Preencha o campo obrigatório: ${id}.`);
      el.classList.add("erro");
    }
  });

  if (valor("estagioEm") === "Outros" && !valor("estagioEmOutro")) {
    erros.push("Informe o campo de estágio em Outros.");
    document.getElementById("estagioEmOutro").classList.add("erro");
  }

  return erros;
}

function setMensagem(texto, tipo) {
  const box = document.getElementById("mensagens");
  if (!box) return;
  box.className = `mensagens ${tipo || ""}`;
  box.innerHTML = texto;
}

function gerarDocumento() {
  const erros = validar();

  if (erros.length) {
    setMensagem("<strong>Revise antes de gerar:</strong><br>" + erros.join("<br>"), "erro");
    return false;
  }

  campos.forEach(id => preencherSaida(id));

  const tipo = valor("tipoEstagio");
  preencherSaida(
    "tipoEstagioMarcado",
    tipo === "Obrigatório"
      ? "[X] Obrigatório [ ] Não Obrigatório"
      : "[ ] Obrigatório [X] Não Obrigatório"
  );

  const pcd = valor("pcd");
  preencherSaida("pcdMarcado", pcd === "Sim" ? "[X] Sim [ ] Não" : "[ ] Sim [X] Não");
  preencherSaida("pcdEspecificar", pcd === "Sim" ? ` — ${valor("pcdEspecificar")}` : "");

  const periodo = valor("periodoEstagio");
  const periodoMarcado = ["matutino", "vespertino", "noturno"]
    .map(p => p === periodo ? `[X] ${p}` : `[ ] ${p}`)
    .join(" ");

  preencherSaida("periodoEstagio", periodoMarcado);

  const estagioFinal =
    valor("estagioEm") === "Outros" ? valor("estagioEmOutro") : valor("estagioEm");

  preencherSaida("estagioEmFinal", estagioFinal || "[preencher]");

  setMensagem("Documento gerado com sucesso. Agora você pode imprimir ou salvar em PDF.", "ok");
  return true;
}

function imprimirDocumento() {
  if (gerarDocumento()) {
    window.print();
  }
}

function limparFormulario() {
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.id === "estadoUnidade" || el.id === "estadoEstudante") {
      el.value = "SP";
    } else {
      el.value = "";
    }
    el.classList.remove("erro");
  });

  setMensagem("", "");
}
const sintesesPorEstagio = {
  "Educação Infantil": `a) Etapa de Observação: levantamento de informações para compreensão do espaço educativo, observação das relações pedagógicas, da rotina escolar, da organização dos tempos e espaços e das práticas voltadas à educação de bebês e crianças pequenas.

b) Etapa de Participação/Intervenção: colaboração no desenvolvimento das ações pedagógicas, participação em atividades de cuidado e educação e apoio às propostas desenvolvidas pelos(as) professores(as).

c) Etapa de Regência: planejamento e desenvolvimento de atividades pedagógicas adequadas à Educação Infantil, considerando as especificidades das crianças, seus direitos de aprendizagem e campos de experiência.`,

  "Anos Iniciais do Ensino Fundamental": `a) Etapa de Observação: acompanhamento da rotina escolar, das práticas pedagógicas, da organização da sala de aula, dos processos de alfabetização, letramento, avaliação e mediação das aprendizagens.

b) Etapa de Participação/Intervenção: colaboração nas atividades propostas pelo(a) professor(a), apoio aos estudantes, participação em projetos e desenvolvimento de intervenções pedagógicas.

c) Etapa de Regência: planejamento e realização de atividades de ensino nos anos iniciais do Ensino Fundamental, articulando teoria e prática e considerando os objetivos de aprendizagem.`,

  "Gestão": `a) Observação da organização administrativa e pedagógica da escola, incluindo rotina da gestão, planejamento institucional, reuniões, documentos escolares e relação com a comunidade.

b) Participação em atividades de gestão escolar, acompanhamento de processos administrativos e pedagógicos e colaboração em ações institucionais.

c) Desenvolvimento de proposta de intervenção relacionada à gestão democrática, organização escolar ou melhoria dos processos educativos.`,

  "Espaços não Escolares": `a) Observação do espaço educativo não escolar, sua organização, público atendido, objetivos institucionais e práticas socioeducativas.

b) Participação nas atividades desenvolvidas pela instituição, colaborando com ações formativas, culturais, sociais ou educativas.

c) Elaboração e desenvolvimento de proposta de intervenção pedagógica adequada ao contexto não escolar.`,

  "Mulheres Mil": `a) Observação das ações formativas desenvolvidas no âmbito do Programa Mulheres Mil, considerando seus objetivos, público atendido e organização pedagógica.

b) Participação em atividades educativas, culturais e formativas voltadas à inclusão social, cidadania e formação das participantes.

c) Desenvolvimento de proposta de intervenção articulada aos princípios do programa e às necessidades do grupo atendido.`,

  "LAPED": `a) Observação das atividades desenvolvidas no LAPED, considerando sua organização, objetivos, materiais, projetos e ações de apoio à formação docente.

b) Participação em atividades de estudo, planejamento, organização de materiais pedagógicos e apoio a projetos formativos.

c) Desenvolvimento de proposta de intervenção ou produção pedagógica vinculada às ações do laboratório.`,

  "NAPNE": `a) Observação das ações do NAPNE, considerando o acompanhamento de estudantes público-alvo da educação especial, recursos de acessibilidade e práticas inclusivas.

b) Participação em atividades de apoio, planejamento e acompanhamento de ações inclusivas no contexto educacional.

c) Desenvolvimento de proposta de intervenção voltada à acessibilidade, inclusão e permanência dos estudantes.`,

  "Biblioteca": `a) Observação da organização da biblioteca, de seus recursos, acervo, atendimento ao público e ações de incentivo à leitura.

b) Participação em atividades de mediação de leitura, organização de acervo, apoio a projetos culturais e atendimento aos usuários.

c) Desenvolvimento de proposta de intervenção voltada à formação de leitores, uso pedagógico da biblioteca ou promoção da leitura.`,

  "Laboratório de Tecnologia Assistiva": `a) Observação da organização do laboratório, dos recursos de tecnologia assistiva disponíveis e das demandas dos estudantes atendidos.

b) Participação em atividades de apoio, adaptação de materiais, estudo de recursos acessíveis e acompanhamento de práticas inclusivas.

c) Desenvolvimento de proposta de intervenção envolvendo tecnologia assistiva, acessibilidade e apoio aos processos de aprendizagem.`
};

document.getElementById("estagioEm").addEventListener("change", function () {
  const tipoSelecionado = this.value;
  const campoSintese = document.getElementById("sinteseAtividades");

  if (sintesesPorEstagio[tipoSelecionado]) {
    campoSintese.value = sintesesPorEstagio[tipoSelecionado];
  } else {
    campoSintese.value = "";
  }
});
