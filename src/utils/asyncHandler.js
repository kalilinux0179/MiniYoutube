const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        return await requestHandler(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: true,
            message: error.message,
        });
    }
};

// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((error) =>
//             next(error),
//         );
//     };
// };

export { asyncHandler };
