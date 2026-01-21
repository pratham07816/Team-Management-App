const express = require('express');
const multer = require('multer');
const { createMember, getMembers, getMemberById, updateMember, deleteMember } = require('../controllers/memberController');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('profileImage'), createMember);
router.get('/', auth, getMembers);
router.get('/:id', auth, getMemberById);
router.put('/:id', auth, updateMember);
router.delete('/:id', auth, deleteMember);

module.exports = router;