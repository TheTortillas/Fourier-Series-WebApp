const maximaService = require('../services/maxima.service');

exports.calculateTrigonometric = (req, res) => {
  const { funcion, periodo } = req.body;
  maximaService.computeTrigonometric(funcion, periodo)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.calculateComplex = (req, res) => {
  const { funcion, periodo } = req.body;
  maximaService.computeComplex(funcion, periodo)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
};