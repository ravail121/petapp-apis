const {authValidation} = require("../validations");
const authService = require("../services/auth.service");


exports.register = async(req, res) => {
  try {
    const { name, email, password } = req.body;

    // Data Validation
    const JoiSchema = authValidation.register;
    await JoiSchema.validateAsync({
      name,
      password,
      email,
    });

    res.json(await authService.register(name, email, password));
  } catch (err) {
    const { status } = err;
    const s = status ? status : "500";
    res.status(s).send({
      statusCode: err.statusCode,
      success: err.success,
      data : err.data,
      message: err.message,
    });
  }
}





// login User
exports.login = async (req, res) => {
  try {
    const { email , password } = req.body;

    // Data Validation
    const JoiSchema = authValidation.login;
    await JoiSchema.validateAsync({
      email,
      password
    });

    res.json(await authService.login(email , password));
  } catch (err) {
    console.log({ err });
    const { status } = err;
    const s = status ? status : "500";
    res.status(s).send({
      statusCode: err.statusCode,
      success: err.success,
      data : err.data,
      message: err.message,
    });
  }  
};

