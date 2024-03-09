
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post("/addEvent", async (req, res) => {
  const { date, eventname,location, description } = req.body; // Destructure the fields
  const newEvent = new Event({ date, eventname,location, description }); // Specify the fields explicitly
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/upcomingEvents', async (req, res) => {
  try {
    // Fetch events where the date is greater than or equal to today
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 });

    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/deleteOutdatedEvents", async (req, res) => {
  try {
    // Delete events where the date is less than the current date
    const result = await Event.deleteMany({ date: { $lt: new Date() } });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting outdated events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  try {
    // Find and delete the event by ID
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      // Event with the specified ID was not found
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(deletedEvent);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
