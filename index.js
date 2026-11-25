const express = require('express');
const app = express();
const { logger, notFound, errorHandler } = require('./middleware');
const appointmentsRouter = require('./routes/appointments');
const doctorsRouter = require('./routes/doctors');

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(logger);


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Private Hospital & Channeling Center REST API",
    student: {
      name: "Rathnayaka Mudiyanselage Maneesha Kalpani",
      nim: "20250040221",
      theme: "Private Hospital & Channeling Center"
    },
    version: "Express 5.x",
    endpoints: {
      root: "GET /",
      appointments: {
        listAll: "GET /appointments",
        searchByPatient: "GET /appointments/search?patient={name}",
        filterBySpecialtyOptional: "GET /appointments/specialty{/:name}",
        getSingle: "GET /appointments/:id",
        create: "POST /appointments",
        update: "PUT /appointments/:id",
        deleteProtected: "DELETE /appointments/:id (Requires header x-auth-token: hospital-secret-123)"
      },
      doctors: {
        listAll: "GET /doctors",
        getSingle: "GET /doctors/:id",
        create: "POST /doctors",
        update: "PUT /doctors/:id",
        delete: "DELETE /doctors/:id"
      },
      filesWildcard: "GET /files/*path (Express 5 named wildcard)"
    }
  });
});


app.use('/appointments', appointmentsRouter);

app.use('/doctors', doctorsRouter);


app.get('/files/*path', (req, res) => {
  const pathArray = Array.isArray(req.params.path)
    ? req.params.path
    : [req.params.path];

  res.status(200).json({
    success: true,
    message: "Express 5 wildcard path extracted successfully.",
    path: pathArray
  });
});

app.use(notFound);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` Hospital & Channeling Center API is running!`);
    console.log(` Student: Rathnayaka Mudiyanselage Maneesha Kalpani (NIM: 20250040221)`);
    console.log(` Environment: Express 5`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`================================================================`);
  });
}

module.exports = app;
