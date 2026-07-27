function createCrudController(Model, label) {
  return {
    async create(req, res) {
      try {
        const data = await Model.create(req.body);
        res.status(201).json({ message: `${label} created successfully`, data });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
    async getAll(req, res) {
      try {
        res.json(await Model.findAll({ order: [['id', 'DESC']] }));
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
    async updateById(req, res) {
      try {
        const data = await Model.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: `${label} not found` });
        await data.update(req.body);
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
