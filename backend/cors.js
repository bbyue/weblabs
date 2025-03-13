const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        console.warn(`Warning: Request from origin "${origin}" is not allowed by CORS policy.`);
        callback(new Error('Not allowed by CORS'), false); 
      }
    },
    methods: ['GET', 'POST'], 
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  app.use((err, req, res, next) => { //todo убрать в cors
    if (err.message === 'Not allowed by CORS') {
      return res.status(403).json({ message: 'Origin not permitted by CORS policy.' });
    }
    next(err); 
  });