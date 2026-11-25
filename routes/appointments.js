
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

let appointments = [
  {
    id: 1,
    patientName: "Kamal Perera",
    doctorName: "Dr. Anura Bandara",
    specialty: "Cardiology",
    fee: 4500,
    status: "Confirmed"
  },
  {
    id: 2,
    patientName: "Nimali Silva",
    doctorName: "Dr. Priyantha Senanayake",
    specialty: "Dermatology",
    fee: 3500,
    status: "Scheduled"
  },
  {
    id: 3,
    patientName: "Sunil Shantha",
    doctorName: "Dr. Malini Wickramasinghe",
    specialty: "Neurology",
    fee: 5500,
    status: "Completed"
  },
  {
    id: 4,
    patientName: "Chathuri Fernando",
    doctorName: "Dr. Anura Bandara",
    specialty: "Cardiology",
    fee: 4500,
    status: "Pending"
  },
  {
    id: 5,
    patientName: "Kasun Jayawardena",
    doctorName: "Dr. Rohan Gunaratne",
    specialty: "Pediatrics",
    fee: 3000,
    status: "Confirmed"
  }
];

let nextAppointmentId = 6;


router.route('/')
  // GET /appointments - Return all appointments
  .get((req, res) => {
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  })
  // POST /appointments - Create a new appointment with validation using if/else
  .post((req, res) => {
    const { patientName, doctorName, specialty, fee, status } = req.body;

    // Validate patientName
    if (!patientName || typeof patientName !== 'string' || !patientName.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'patientName' is required and must be a non-empty string."
      });
    }

    // Validate doctorName
    if (!doctorName || typeof doctorName !== 'string' || !doctorName.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'doctorName' is required and must be a non-empty string."
      });
    }

    // Validate specialty
    if (!specialty || typeof specialty !== 'string' || !specialty.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'specialty' is required and must be a non-empty string."
      });
    }

    // Validate fee
    if (fee === undefined || typeof fee !== 'number' || isNaN(fee) || fee < 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'fee' is required and must be a non-negative number."
      });
    }

    // Validate status
    if (!status || typeof status !== 'string' || !status.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'status' is required and must be a non-empty string (e.g., 'Scheduled', 'Confirmed', 'Pending')."
      });
    }

    // Create and save new appointment object
    const newAppointment = {
      id: nextAppointmentId++,
      patientName: patientName.trim(),
      doctorName: doctorName.trim(),
      specialty: specialty.trim(),
      fee: Number(fee),
      status: status.trim()
    };

    appointments.push(newAppointment);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully.",
      data: newAppointment
    });
  });


router.get('/search', (req, res) => {
  const { patient } = req.query;

  if (!patient || !patient.trim()) {
    return res.status(200).json({
      success: true,
      message: "No patient search query provided. Returning all appointments.",
      count: appointments.length,
      data: appointments
    });
  }

  const queryLower = patient.trim().toLowerCase();
  const matched = appointments.filter(a =>
    a.patientName.toLowerCase().includes(queryLower)
  );

  res.status(200).json({
    success: true,
    query: patient,
    count: matched.length,
    data: matched
  });
});


router.get('/specialty{/:name}', (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(200).json({
      success: true,
      message: "No specialty specified in optional parameter. Returning all appointments.",
      count: appointments.length,
      data: appointments
    });
  }

  const targetSpecialty = name.trim().toLowerCase();
  const filtered = appointments.filter(a =>
    a.specialty.toLowerCase() === targetSpecialty
  );

  res.status(200).json({
    success: true,
    specialty: name,
    count: filtered.length,
    data: filtered
  });
});


router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const appointment = appointments.find(a => a.id === id);

  if (!appointment) {
    const error = new Error(`Appointment with ID ${req.params.id} was not found.`);
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});


router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {
    const error = new Error(`Appointment with ID ${req.params.id} was not found.`);
    error.status = 404;
    throw error;
  }

  const { patientName, doctorName, specialty, fee, status } = req.body;

  // Validate and update fields if provided
  if (patientName !== undefined) {
    if (typeof patientName !== 'string' || !patientName.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'patientName' must be a valid non-empty string."
      });
    }
    appointments[index].patientName = patientName.trim();
  }

  if (doctorName !== undefined) {
    if (typeof doctorName !== 'string' || !doctorName.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'doctorName' must be a valid non-empty string."
      });
    }
    appointments[index].doctorName = doctorName.trim();
  }

  if (specialty !== undefined) {
    if (typeof specialty !== 'string' || !specialty.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'specialty' must be a valid non-empty string."
      });
    }
    appointments[index].specialty = specialty.trim();
  }

  if (fee !== undefined) {
    if (typeof fee !== 'number' || isNaN(fee) || fee < 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'fee' must be a valid non-negative number."
      });
    }
    appointments[index].fee = Number(fee);
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !status.trim()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation Error: 'status' must be a valid non-empty string."
      });
    }
    appointments[index].status = status.trim();
  }

  res.status(200).json({
    success: true,
    message: `Appointment with ID ${id} updated successfully.`,
    data: appointments[index]
  });
});


router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {
    const error = new Error(`Appointment with ID ${req.params.id} was not found.`);
    error.status = 404;
    throw error;
  }

  const [deletedAppointment] = appointments.splice(index, 1);

  res.status(200).json({
    success: true,
    message: `Appointment with ID ${id} deleted successfully.`,
    data: deletedAppointment
  });
});

module.exports = router;
