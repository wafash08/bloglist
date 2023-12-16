import jwt from 'jsonwebtoken';

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

export function tokenExtractor(request, response, next) {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '');
	} else {
		request.token = null;
	}
	next();
}

export function userExtractor(request, response, next) {
	const authorizedUser = jwt.verify(request.token, process.env.SECRET);

	if (authorizedUser) {
		request.user = authorizedUser;
	} else {
		request.user = null;
	}

	next();
}
