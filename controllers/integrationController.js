const integrationService = require('../services/integrationService');

async function pushClinicalNotes(req, res) {
  try {
    const { queueEntryId, notes } = req.body;
    if (!queueEntryId || !notes) return res.status(400).json({ error: 'queueEntryId and notes required' });
    const result = await integrationService.pushClinicalNotes(queueEntryId, notes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDoctorSchedule(req, res) {
  try {
    const schedule = await integrationService.getDoctorSchedule(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Doctor schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { pushClinicalNotes, getDoctorSchedule };
