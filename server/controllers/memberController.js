const Member = require('../models/Member');
const { body, validationResult } = require('express-validator');


const createMember = async (req, res) => {

  try {
    const {
      name,
      registernumber,
      year,
      degree,
      about,
      certificate,
      internship
    } = req.body;

    if (!name || !registernumber || !year || !degree) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const member = new Member({
      name,
      registernumber,
      year,
      degree,
      about,
      certificate,
      internship,
      profileImage: req.file ? req.file.filename : null
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Register number already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMember = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('registernumber').optional().notEmpty().withMessage('Register number cannot be empty'),
  body('year').optional().notEmpty().withMessage('Year cannot be empty'),
  body('degree').optional().notEmpty().withMessage('Degree cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData = {
        ...req.body,
        ...(req.file && { profileImage: req.file.filename })
        };

        const member = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createMember, getMembers, getMemberById, updateMember, deleteMember };