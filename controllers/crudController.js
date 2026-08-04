function createCrudController(Model, label, calculate = (data) => data) {
  return {
    async create(req, res) {
      try {
        const data = await Model.create(calculate(req.body));
        res.status(201).json({ message: `${label} created successfully`, data });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
    async getAll(req, res) {
      try {
        const where = {}
        if (req.query.external_id) {
          where.external_id = req.query.external_id
        }
        res.json(await Model.findAll({ where, order: [['id', 'DESC']] }));
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    async getById(req, res) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: `${label} not found` });
        res.json(data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
    async getByExternalId(req, res) {
      try {
        const data = await Model.findOne({ where: { external_id: req.params.externalId } });
        if (!data) return res.status(404).json({ message: `${label} not found` });
        res.json(data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
    async updateById(req, res) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: `${label} not found` });
        await data.update(calculate({ ...data.toJSON(), ...req.body }));
        res.json({ message: `${label} updated successfully`, data });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
    async deleteById(req, res) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: `${label} not found` });
        await data.destroy();
        res.json({ message: `${label} deleted successfully` });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
}

module.exports = createCrudController;
