const express = require('express');
const router = express.Router();

let doctors = [
  {
    id: 1,
    name: "Dr. Anura Bandara",
    specialty: "Cardiology",
    consultationFee: 4500,
    available: true
  },
  {
    id: 2,
    name: "Dr. Priyantha Senanayake",
    specialty: "Dermatology",
    consultationFee: 3500,
    available: true
  },
  {
    id: 3,
    name: "Dr. Malini Wickramasinghe",
    specialty: "Neurology",
    consultationFee: 5500,
    available: false
  },
  {
    id: 4,
    name: "Dr. Rohan Gunaratne",
    specialty: "Pediatrics",
    consultationFee: 3000,
    available: true
  },
  {
    id: 5,
    name: "Dr. Sandamali Jayakody",
    specialty: "Orthopedics",
    consultationFee: 4000,
    available: true
  }
];

// Auto-increment ID tracker for new doctors
let nextDoctorId = 6;


router.route('/')
  // GET /doctors - Retrieve list of all doctors
  .get((req, res) => {
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  })
  // POST /doctors - Create a new doctor
  .post((req, res) => {
    const { name, specialty, consultationFee, available } = req.body;

    // Validation using if/else
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'name' is required and must be a non-empty string."
      });
    }

    if (!specialty || typeof specialty !== 'string' || !specialty.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'specialty' is required and must be a non-empty string."
      });
    }

    if (consultationFee === undefined || typeof consultationFee !== 'number' || isNaN(consultationFee) || consultationFee < 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'consultationFee' is required and must be a non-negative number."
      });
    }

    if (available === undefined || typeof available !== 'boolean') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'available' is required and must be a boolean (true or false)."
      });
    }

    const newDoctor = {
      id: nextDoctorId++,
      name: name.trim(),
      specialty: specialty.trim(),
      consultationFee: Number(consultationFee),
      available: Boolean(available)
    };

    doctors.push(newDoctor);

    res.status(201).json({
      success: true,
      message: "Doctor added successfully.",
      data: newDoctor
    });
  });


router.route('/:id')
  // GET /doctors/:id - Retrieve single doctor
  .get(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const doctor = doctors.find(d => d.id === id);

    if (!doctor) {
      const error = new Error(`Doctor with ID ${req.params.id} was not found.`);
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  })
  // PUT /doctors/:id - Update existing doctor
  .put(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = doctors.findIndex(d => d.id === id);

    if (index === -1) {
      const error = new Error(`Doctor with ID ${req.params.id} was not found.`);
      error.status = 404;
      throw error;
    }

    const { name, specialty, consultationFee, available } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Validation Error: 'name' must be a non-empty string."
        });
      }
      doctors[index].name = name.trim();
    }

    if (specialty !== undefined) {
      if (typeof specialty !== 'string' || !specialty.trim()) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Validation Error: 'specialty' must be a non-empty string."
        });
      }
      doctors[index].specialty = specialty.trim();
    }

    if (consultationFee !== undefined) {
      if (typeof consultationFee !== 'number' || isNaN(consultationFee) || consultationFee < 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Validation Error: 'consultationFee' must be a non-negative number."
        });
      }
      doctors[index].consultationFee = Number(consultationFee);
    }

    if (available !== undefined) {
      if (typeof available !== 'boolean') {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Validation Error: 'available' must be a boolean (true or false)."
        });
      }
      doctors[index].available = Boolean(available);
    }

    res.status(200).json({
      success: true,
      message: `Doctor with ID ${id} updated successfully.`,
      data: doctors[index]
    });
  })
  // DELETE /doctors/:id - Delete doctor
  .delete(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = doctors.findIndex(d => d.id === id);

    if (index === -1) {
      const error = new Error(`Doctor with ID ${req.params.id} was not found.`);
      error.status = 404;
      throw error;
    }

    const [deletedDoctor] = doctors.splice(index, 1);

    res.status(200).json({
      success: true,
      message: `Doctor with ID ${id} deleted successfully.`,
      data: deletedDoctor
    });
  });

module.exports = router;
