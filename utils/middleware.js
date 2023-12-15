export function errorHandler(error, request, response, next) {
	console.error(error.message);

	switch (error.name) {
		case 'CastError': {
			return response.status(400).send({ error: 'malformatted id' });
		}
		case 'ValidationError': {
			return response.status(400).json({ error: error.message });
		}
		case 'JsonWebTokenError': {
			return response.status(401).json({
				error: 'invalid token',
			});
		}
		case 'TokenExpiredError': {
			return response.status(401).json({
				error: 'token expired',
			});
		}
	}

	next(error);
}
