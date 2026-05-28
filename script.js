const campos = [
  "curso", "orientador", "emailOrientador",
  "unidade", "cnpj", "enderecoUnidade", "cepUnidade", "bairroUnidade", "cidadeUnidade", "estadoUnidade",
  "representante", "cargoRepresentante", "telefoneUnidade", "emailUnidade",
  "supervisor", "funcaoSupervisor", "telefoneSupervisor", "emailSupervisor",
  "nomeEstudante", "periodoCurso", "prontuario", "rg", "cpf", "dataNascimento",
  "enderecoEstudante", "cepEstudante", "bairroEstudante", "cidadeEstudante", "estadoEstudante",
  "celularEstudante", "emailEstudante",
  "tipoEstagio", "pcd", "pcdEspecificar",
  "dataInicio", "dataFim", "periodoEstagio", "horaInicio", "horaFim", "conflitoAula",
  "estagioEm", "estagioEmOutro", "periodoCursoPlano", "cargaHoraria", "sinteseAtividades",
  "dataDocumento",
  "coordenadorCurso", "responsavelEstagios", "coordenadorInstitucional"
];

const nomesCampos = {
  curso: "Licenciatura em", orientador: "Professor(a) orientador(a)", emailOrientador: "E-mail do(a) orientador(a)",
  unidade: "Unidade de Ensino / Escola", cnpj: "CNPJ", enderecoUnidade: "Endereço da unidade", cepUnidade: "CEP da unidade",
  bairroUnidade: "Bairro da unidade", cidadeUnidade: "Cidade da unidade", estadoUnidade: "Estado da unidade",
  representante: "Representante legal", cargoRepresentante: "Cargo do representante legal", telefoneUnidade: "Telefone da unidade",
  emailUnidade: "E-mail da unidade", supervisor: "Supervisor(a)", funcaoSupervisor: "Função do(a) supervisor(a)",
  telefoneSupervisor: "Telefone do(a) supervisor(a)", emailSupervisor: "E-mail do(a) supervisor(a)", nomeEstudante: "Nome do(a) estudante",
  periodoCurso: "Período do curso", prontuario: "Prontuário", cpf: "CPF", dataNascimento: "Data de nascimento",
  enderecoEstudante: "Endereço do(a) estudante", cepEstudante: "CEP do(a) estudante", bairroEstudante: "Bairro do(a) estudante",
  cidadeEstudante: "Cidade do(a) estudante", estadoEstudante: "Estado do(a) estudante", celularEstudante: "Celular do(a) estudante",
  emailEstudante: "E-mail do(a) estudante", tipoEstagio: "Tipo de estágio", pcd: "Pessoa com deficiência", dataInicio: "Data inicial do estágio",
  dataFim: "Data final do estágio", diasSemana: "Dias da semana", periodoEstagio: "Período do estágio",
  horaInicio: "Horário de início", horaFim: "Horário de término", conflitoAula: "Conflito com horário de aula",
  estagioEm: "Área do estágio", periodoCursoPlano: "Período do curso no plano", cargaHoraria: "Carga horária (h)", sinteseAtividades: "Síntese das atividades",
  dataDocumento: "Documento válido a partir de",
  coordenadorCurso: "Coordenador(a) do Curso", responsavelEstagios: "Responsável pelo setor de Estágios", coordenadorInstitucional: "Coordenador(a) Institucional de Estágios"
};

const obrigatorios = campos.filter(c => !["rg", "pcdEspecificar", "estagioEmOutro"].includes(c));
const termosFicticios = ["xxx", "xxxx", "teste", "preencher", "selecione", "não sei", "nao sei", "a definir"];

function valor(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function somenteDigitos(texto) {
  return (texto || "").replace(/\D/g, "");
}

function marcarErro(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("erro");
}

function marcarErroDiasSemana() {
  const box = document.querySelector(".lista-dias");
  if (box) box.classList.add("erro");
}

function diasSemanaSelecionados() {
  return Array.from(document.querySelectorAll('input[name="diasSemana"]:checked')).map(el => el.value);
}

function textoDiasSemana() {
  const dias = diasSemanaSelecionados();
  return dias.join(", ");
}

function atualizarDataDocumento() {
  const campo = document.getElementById("dataDocumento");
  if (campo) campo.value = valor("dataInicio");
}

function aplicarApenasTexto(el) {
  el.value = el.value.replace(/[^A-Za-zÀ-ÿ\s'.-]/g, "").replace(/\s{2,}/g, " ");
}

function preencherSaida(id, texto = null) {
  document.querySelectorAll(`[data-out="${id}"]`).forEach(el => {
    el.textContent = texto === null ? (valor(id) || "[preencher]") : texto;
  });
}

function contemTextoFicticio(texto) {
  const normalizado = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return termosFicticios.some(t => normalizado.includes(t.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
}

function validarCPF(cpf) {
  const n = somenteDigitos(cpf);
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(n[i]) * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(n[i]) * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return d1 === parseInt(n[9]) && d2 === parseInt(n[10]);
}

function validarCNPJ(cnpj) {
  const n = somenteDigitos(cnpj);
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false;
  const calc = (base, pesos) => {
    const soma = base.split("").reduce((acc, dig, i) => acc + parseInt(dig) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const d1 = calc(n.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  const d2 = calc(n.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return d1 === parseInt(n[12]) && d2 === parseInt(n[13]);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validarCEP(cep) {
  return /^\d{5}-?\d{3}$/.test(cep) && somenteDigitos(cep).length === 8;
}

function validarTelefone(tel) {
  const n = somenteDigitos(tel);
  return /^\d{10,11}$/.test(n) && !/^(\d)\1+$/.test(n) && parseInt(n.slice(0, 2), 10) >= 11;
}

function parseDataBR(data) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (d.getFullYear() !== Number(m[3]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[1])) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseHora(hora) {
  const m = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function horasDiarias() {
  const ini = parseHora(valor("horaInicio"));
  const fim = parseHora(valor("horaFim"));
  return ini === null || fim === null ? null : (fim - ini) / 60;
}

function numeroCargaHoraria(id) {
  const m = valor(id).replace(",", ".").match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

function validarNomeCompleto(id, rotulo, erros) {
  const partes = valor(id).split(/\s+/).filter(Boolean);
  if (partes.length < 2) {
    erros.push(`${rotulo} deve conter nome completo.`);
    marcarErro(id);
  }
}

function validar() {
  atualizarDataDocumento();
  const erros = [];
  document.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("erro"));
  document.querySelectorAll("details.erro").forEach(el => el.classList.remove("erro"));

  obrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (el && !valor(id)) {
      erros.push(`Preencha o campo obrigatório: ${nomesCampos[id] || id}.`);
      marcarErro(id);
    }
  });

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && valor(id) && contemTextoFicticio(valor(id))) {
      erros.push(`O campo ${nomesCampos[id] || id} contém texto fictício ou provisório.`);
      marcarErro(id);
    }
  });

  if (!["Pedagogia", "Letras"].includes(valor("curso"))) {
    erros.push("Selecione o curso: Pedagogia ou Letras.");
    marcarErro("curso");
  }

  if (valor("cnpj") && !validarCNPJ(valor("cnpj"))) { erros.push("CNPJ inválido. Confira formato e dígitos verificadores."); marcarErro("cnpj"); }
  if (valor("cpf") && !validarCPF(valor("cpf"))) { erros.push("CPF inválido. Confira formato e dígitos verificadores."); marcarErro("cpf"); }
  ["cepUnidade", "cepEstudante"].forEach(id => { if (valor(id) && !validarCEP(valor(id))) { erros.push(`${nomesCampos[id]} deve ter 8 dígitos, no formato 00000-000.`); marcarErro(id); } });
  ["telefoneUnidade", "telefoneSupervisor", "celularEstudante"].forEach(id => { if (valor(id) && !validarTelefone(valor(id))) { erros.push(`${nomesCampos[id]} deve ter DDD e 10 ou 11 dígitos.`); marcarErro(id); } });
  ["emailOrientador", "emailUnidade", "emailSupervisor", "emailEstudante"].forEach(id => { if (valor(id) && !validarEmail(valor(id))) { erros.push(`${nomesCampos[id]} inválido.`); marcarErro(id); } });

  ["cidadeUnidade", "cidadeEstudante"].forEach(id => {
    if (/^selecione$/i.test(valor(id))) { erros.push(`${nomesCampos[id]} não pode permanecer como “Selecione”.`); marcarErro(id); }
  });

  document.querySelectorAll("[data-text-only]").forEach(el => {
    if (el.value && !/^[A-Za-zÀ-ÿ\s'.-]+$/.test(el.value)) {
      erros.push(`${nomesCampos[el.id] || el.id} deve conter apenas caracteres textuais.`);
      marcarErro(el.id);
    }
  });

  validarNomeCompleto("representante", "Representante legal", erros);
  validarNomeCompleto("supervisor", "Supervisor(a)", erros);
  validarNomeCompleto("nomeEstudante", "Nome do(a) estudante", erros);
  validarNomeCompleto("orientador", "Orientador(a)", erros);
  validarNomeCompleto("coordenadorCurso", "Coordenador(a) do Curso", erros);
  validarNomeCompleto("responsavelEstagios", "Responsável pelo setor de Estágios", erros);
  validarNomeCompleto("coordenadorInstitucional", "Coordenador(a) Institucional de Estágios", erros);

  if (valor("prontuario") && !/^SO[A-Za-z0-9]{5,}$/i.test(valor("prontuario"))) {
    erros.push("Prontuário inválido. Use o padrão institucional iniciado por SO, seguido de números e/ou letras.");
    marcarErro("prontuario");
  }

  const nascimento = parseDataBR(valor("dataNascimento"));
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  if (valor("dataNascimento") && (!nascimento || nascimento > hoje)) { erros.push("Data de nascimento inválida ou futura."); marcarErro("dataNascimento"); }

  const inicio = parseDataBR(valor("dataInicio"));
  const fim = parseDataBR(valor("dataFim"));
  if (valor("dataInicio") && !inicio) { erros.push("Data inicial do estágio inválida. Use dd/mm/aaaa."); marcarErro("dataInicio"); }
  if (valor("dataFim") && !fim) { erros.push("Data final do estágio inválida. Use dd/mm/aaaa."); marcarErro("dataFim"); }
  if (inicio && fim && inicio >= fim) { erros.push("A data inicial do estágio deve ser anterior à data final."); marcarErro("dataInicio"); marcarErro("dataFim"); }

  const iniHora = parseHora(valor("horaInicio"));
  const fimHora = parseHora(valor("horaFim"));
  if (valor("horaInicio") && iniHora === null) { erros.push("Horário de início inválido. Use 00:00."); marcarErro("horaInicio"); }
  if (valor("horaFim") && fimHora === null) { erros.push("Horário de término inválido. Use 00:00."); marcarErro("horaFim"); }
  if (iniHora !== null && fimHora !== null && fimHora <= iniHora) { erros.push("O horário final deve ser posterior ao horário inicial."); marcarErro("horaInicio"); marcarErro("horaFim"); }

  const diaria = horasDiarias();
  if (diaria !== null && diaria > 6) { erros.push("A jornada diária de estágio não pode ultrapassar 6 horas."); marcarErro("horaInicio"); marcarErro("horaFim"); }

  const dias = diasSemanaSelecionados().length;
  if (dias < 1) { erros.push("Selecione pelo menos um dia da semana."); marcarErroDiasSemana(); }
  if (diaria !== null && dias > 0 && diaria * dias > 30) { erros.push("A jornada semanal de estágio não pode ultrapassar 30 horas."); marcarErroDiasSemana(); }

  if (valor("conflitoAula") === "Sim") { erros.push("O horário do estágio não pode coincidir com o horário das aulas."); marcarErro("conflitoAula"); }

  if (iniHora !== null) {
    const periodo = valor("periodoEstagio");
    const coerente = (periodo === "matutino" && iniHora < 12 * 60) ||
      (periodo === "vespertino" && iniHora >= 12 * 60 && iniHora < 18 * 60) ||
      (periodo === "noturno" && iniHora >= 18 * 60);
    if (periodo && !coerente) { erros.push("O turno selecionado deve ser coerente com o horário informado: matutino/manhã, vespertino/tarde ou noturno/noite."); marcarErro("periodoEstagio"); marcarErro("horaInicio"); }
  }

  if (valor("pcd") === "Sim" && !valor("pcdEspecificar")) { erros.push("Especifique a deficiência quando a opção Pessoa com deficiência for Sim."); marcarErro("pcdEspecificar"); }
  if (valor("tipoEstagio") !== "Obrigatório") { erros.push("Para este formulário, o tipo de estágio deve permanecer como Obrigatório."); marcarErro("tipoEstagio"); }

  if (valor("estagioEm") === "Outros" && !valor("estagioEmOutro")) { erros.push("Informe o campo de estágio quando selecionar Outros."); marcarErro("estagioEmOutro"); }
  if (valor("estagioEm") && valor("estagioEm") !== "Outros" && !sintesesPorEstagio[valor("estagioEm")]) { erros.push("Selecione uma área de estágio válida."); marcarErro("estagioEm"); }

  const chPlano = Number(valor("cargaHoraria"));
  if (valor("cargaHoraria") && (!/^\d+$/.test(valor("cargaHoraria")) || chPlano <= 0)) { erros.push("Carga horária (h) deve conter apenas números inteiros positivos."); marcarErro("cargaHoraria"); }

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

  atualizarDataDocumento();
  campos.forEach(id => preencherSaida(id));
  preencherSaida("diasSemana", textoDiasSemana() || "[dia da semana]");
  preencherSaida("tipoEstagioMarcado", "[X] Obrigatório [ ] Não Obrigatório");

  const pcd = valor("pcd");
  preencherSaida("pcdMarcado", pcd === "Sim" ? "[X] Sim [ ] Não" : "[ ] Sim [X] Não");
  preencherSaida("pcdEspecificar", pcd === "Sim" ? ` — ${valor("pcdEspecificar")}` : "");

  const periodo = valor("periodoEstagio");
  const periodoMarcado = ["matutino", "vespertino", "noturno"].map(p => p === periodo ? `[X] ${p}` : `[ ] ${p}`).join(" ");
  preencherSaida("periodoEstagio", periodoMarcado);

  const estagioFinal = valor("estagioEm") === "Outros" ? valor("estagioEmOutro") : valor("estagioEm");
  preencherSaida("estagioEmFinal", estagioFinal || "[preencher]");

  setMensagem("Documento gerado com sucesso. Agora você pode imprimir ou salvar em PDF.", "ok");
  return true;
}

function imprimirDocumento() {
  if (gerarDocumento()) window.print();
}

function limparFormulario() {
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.type === "checkbox") el.checked = false;
    else if (el.id === "estadoUnidade" || el.id === "estadoEstudante") el.value = "SP";
    else if (el.id === "tipoEstagio") el.value = "Obrigatório";
    else if (el.id === "responsavelEstagios") el.value = "Andressa Rodrigues";
    else el.value = "";
    el.classList.remove("erro");
  });
  setMensagem("", "");
}

const sintesesPorEstagio = {
  "Educação Infantil": `a) Etapa de Observação: levantamento de informações para compreensão do espaço educativo, observação das relações pedagógicas, da rotina escolar, da organização dos tempos e espaços e das práticas voltadas à educação de bebês e crianças pequenas.\n\nb) Etapa de Participação/Intervenção: colaboração no desenvolvimento das ações pedagógicas, participação em atividades de cuidado e educação e apoio às propostas desenvolvidas pelos(as) professores(as).\n\nc) Etapa de Regência: planejamento e desenvolvimento de atividades pedagógicas adequadas à Educação Infantil, considerando as especificidades das crianças, seus direitos de aprendizagem e campos de experiência.`,
  "Anos Iniciais do Ensino Fundamental": `a) Etapa de Observação: acompanhamento da rotina escolar, das práticas pedagógicas, da organização da sala de aula, dos processos de alfabetização, letramento, avaliação e mediação das aprendizagens.\n\nb) Etapa de Participação/Intervenção: colaboração nas atividades propostas pelo(a) professor(a), apoio aos estudantes, participação em projetos e desenvolvimento de intervenções pedagógicas.\n\nc) Etapa de Regência: planejamento e realização de atividades de ensino nos anos iniciais do Ensino Fundamental, articulando teoria e prática e considerando os objetivos de aprendizagem.`,
  "Gestão": `a) Observação da organização administrativa e pedagógica da escola, incluindo rotina da gestão, planejamento institucional, reuniões, documentos escolares e relação com a comunidade.\n\nb) Participação em atividades de gestão escolar, acompanhamento de processos administrativos e pedagógicos e colaboração em ações institucionais.\n\nc) Desenvolvimento de proposta de intervenção relacionada à gestão democrática, organização escolar ou melhoria dos processos educativos.`,
  "Espaços não Escolares": `a) Observação do espaço educativo não escolar, sua organização, público atendido, objetivos institucionais e práticas socioeducativas.\n\nb) Participação nas atividades desenvolvidas pela instituição, colaborando com ações formativas, culturais, sociais ou educativas.\n\nc) Elaboração e desenvolvimento de proposta de intervenção pedagógica adequada ao contexto não escolar.`,
  "Mulheres Mil": `a) Observação das ações formativas desenvolvidas no âmbito do Programa Mulheres Mil, considerando seus objetivos, público atendido e organização pedagógica.\n\nb) Participação em atividades educativas, culturais e formativas voltadas à inclusão social, cidadania e formação das participantes.\n\nc) Desenvolvimento de proposta de intervenção articulada aos princípios do programa e às necessidades do grupo atendido.`,
  "LAPED": `a) Observação das atividades desenvolvidas no LAPED, considerando sua organização, objetivos, materiais, projetos e ações de apoio à formação docente.\n\nb) Participação em atividades de estudo, planejamento, organização de materiais pedagógicos e apoio a projetos formativos.\n\nc) Desenvolvimento de proposta de intervenção ou produção pedagógica vinculada às ações do laboratório.`,
  "NAPNE": `a) Observação das ações do NAPNE, considerando o acompanhamento de estudantes público-alvo da educação especial, recursos de acessibilidade e práticas inclusivas.\n\nb) Participação em atividades de apoio, planejamento e acompanhamento de ações inclusivas no contexto educacional.\n\nc) Desenvolvimento de proposta de intervenção voltada à acessibilidade, inclusão e permanência dos estudantes.`,
  "Biblioteca": `a) Observação da organização da biblioteca, de seus recursos, acervo, atendimento ao público e ações de incentivo à leitura.\n\nb) Participação em atividades de mediação de leitura, organização de acervo, apoio a projetos culturais e atendimento aos usuários.\n\nc) Desenvolvimento de proposta de intervenção voltada à formação de leitores, uso pedagógico da biblioteca ou promoção da leitura.`,
  "Laboratório de Tecnologia Assistiva": `a) Observação da organização do laboratório, dos recursos de tecnologia assistiva disponíveis e das demandas dos estudantes atendidos.\n\nb) Participação em atividades de apoio, adaptação de materiais, estudo de recursos acessíveis e acompanhamento de práticas inclusivas.\n\nc) Desenvolvimento de proposta de intervenção envolvendo tecnologia assistiva, acessibilidade e apoio aos processos de aprendizagem.`
};

function aplicarMascara(el) {
  const tipo = el.dataset.mask;
  let v = somenteDigitos(el.value);
  if (tipo === "cpf") el.value = v.slice(0,11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  if (tipo === "cnpj") el.value = v.slice(0,14).replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  if (tipo === "cep") el.value = v.slice(0,8).replace(/(\d{5})(\d{1,3})$/, "$1-$2");
  if (tipo === "data") el.value = v.slice(0,8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
  if (tipo === "hora") el.value = v.slice(0,4).replace(/(\d{2})(\d)/, "$1:$2");
  if (tipo === "telefone") {
    v = v.slice(0,11);
    el.value = v.length <= 10
      ? v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
      : v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }
  if (tipo === "rg") el.value = el.value.toUpperCase().replace(/[^0-9X.\-]/g, "").slice(0, 12);
}


function atualizarPreviaCampo(id) {
  if (id === "dataInicio") atualizarDataDocumento();
  if (id === "diasSemana") {
    preencherSaida("diasSemana", textoDiasSemana() || "[dia da semana]");
    return;
  }
  preencherSaida(id);
  if (id === "responsavelEstagios") preencherSaida("responsavelEstagios", "Andressa Rodrigues");
}

function atualizarPreviaCompleta() {
  atualizarDataDocumento();
  campos.forEach(id => atualizarPreviaCampo(id));
  preencherSaida("diasSemana", textoDiasSemana() || "[dia da semana]");
  preencherSaida("tipoEstagioMarcado", "[X] Obrigatório [ ] Não Obrigatório");
  const pcd = valor("pcd");
  preencherSaida("pcdMarcado", pcd === "Sim" ? "[X] Sim [ ] Não" : (pcd === "Não" ? "[ ] Sim [X] Não" : "[ ] Sim [ ] Não"));
  preencherSaida("pcdEspecificar", pcd === "Sim" ? ` — ${valor("pcdEspecificar")}` : "");
  const periodo = valor("periodoEstagio");
  const periodoMarcado = ["matutino", "vespertino", "noturno"].map(p => p === periodo ? `[X] ${p}` : `[ ] ${p}`).join(" ");
  preencherSaida("periodoEstagio", periodo ? periodoMarcado : "[matutino] [vespertino] [noturno]");
  const estagioFinal = valor("estagioEm") === "Outros" ? valor("estagioEmOutro") : valor("estagioEm");
  preencherSaida("estagioEmFinal", estagioFinal || "[preencher]");
}

document.addEventListener("DOMContentLoaded", () => {
  const tipoEstagio = document.getElementById("tipoEstagio");
  if (tipoEstagio) tipoEstagio.value = "Obrigatório";
  const resp = document.getElementById("responsavelEstagios");
  if (resp) resp.value = "Andressa Rodrigues";
  atualizarDataDocumento();

  document.querySelectorAll("[data-mask]").forEach(el => el.addEventListener("input", () => aplicarMascara(el)));
  document.querySelectorAll("[data-text-only]").forEach(el => el.addEventListener("input", () => aplicarApenasTexto(el)));
  const dataInicio = document.getElementById("dataInicio");
  if (dataInicio) dataInicio.addEventListener("input", atualizarDataDocumento);

  const estagioEm = document.getElementById("estagioEm");
  if (estagioEm) {
    estagioEm.addEventListener("change", function () {
      const campoSintese = document.getElementById("sinteseAtividades");
      if (!campoSintese) return;
      campoSintese.value = sintesesPorEstagio[this.value] || "";
      atualizarPreviaCompleta();
    });
  }

  document.querySelectorAll("input, select, textarea").forEach(el => {
    const evento = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evento, () => atualizarPreviaCompleta());
    if (el.tagName === "SELECT") el.addEventListener("change", () => atualizarPreviaCompleta());
  });

  atualizarPreviaCompleta();
});
