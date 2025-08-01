import Maquina from "../models/Maquina.js";

// Listar máquinas do usuário logado
export const listarMaquinas = async (req, res) => {
  try {
    const filtro = { usuario: req.user._id }; // Apenas as máquinas do usuário
    const { nome, tipo, dataInicial, dataFinal } = req.query;

    if (nome) filtro.nome = new RegExp(nome, "i");
    if (tipo) filtro.tipo = tipo;
    if (dataInicial || dataFinal) {
      filtro.data = {};
      if (dataInicial) filtro.data.$gte = new Date(dataInicial);
      if (dataFinal) filtro.data.$lte = new Date(dataFinal);
    }

    const maquinas = await Maquina.find(filtro).populate(
      "pontos",
      "nome sensor tipo temperatura vibracao"
    );
    res.json(maquinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar máquina vinculada ao usuário
export const criarMaquina = async (req, res) => {
  try {
    const nova = new Maquina({
      ...req.body,
      usuario: req.user._id, // ✅ Correto agora
    });

    const salva = await nova.save();
    res.status(201).json(salva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Atualizar máquina do usuário logado
export const atualizarMaquina = async (req, res) => {
  try {
    const atualizada = await Maquina.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user._id }, // garante que é dele
      req.body,
      { new: true }
    );

    if (!atualizada)
      return res
        .status(404)
        .json({ msg: "Máquina não encontrada ou sem permissão" });

    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar máquina do usuário logado
export const deletarMaquina = async (req, res) => {
  try {
    const deletada = await Maquina.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user._id,
    });

    if (!deletada)
      return res
        .status(404)
        .json({ msg: "Máquina não encontrada ou sem permissão" });

    res.json({ mensagem: "Máquina deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
