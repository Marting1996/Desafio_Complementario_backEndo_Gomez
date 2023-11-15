import EErrors from "../services/errors/enums.js";
export default (error, req, res, next) => {
    console.error(error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            res.status(400).send({
                status: "error",
                error: error.name,
                cause: error.cause
            })
    
        default:
            return res.send({status: "error", error: "Unhandled error"})
        break;    
    }
}