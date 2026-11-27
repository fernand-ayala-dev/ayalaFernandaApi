import UserModel from "../models/userModel.js";
import SignModel from "../models/signModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const postUser = async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body;

    if (!name || !email || !password || !birthDate) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const normalizedEmail= email.trim().toLowerCase();
    // Verificar si existe el email
    const existingUser = await UserModel.findOne({ email : normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    // Validar fecha
    const date = new Date(birthDate);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ msg: "Fecha de nacimiento inválida" });
    }

    // Obtener día y mes
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;

    // Buscar signos
    const signs = await SignModel.find();

    const sign = signs.find((item) => {
      const { startDay, startMonth, endDay, endMonth } =
        item.characteristics;

      const afterStart =
        month > startMonth || (month === startMonth && day >= startDay);

      const beforeEnd =
        month < endMonth || (month === endMonth && day <= endDay);

      if (startMonth <= endMonth) {
        return afterStart && beforeEnd;
      }

      return afterStart || beforeEnd;
    });

    if (!sign) {
      return res.status(404).json({
        msg: "No se encontró el signo zodiacal",
      });
    }
    const saltRound =10;
    const hashedPassword =await bcrypt.hash(password, saltRound);
    // Crear usuario
    const user = new UserModel({
      name : name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      birthDate,
      sign: sign._id,
    });

    const data = await user.save();

    return res.status(201).json({
      msg: "Usuario creado correctamente",
      data: {
        id: data._id,
        name: data.name,
        email: data.email,
        birthDate: data.birthDate,
        sign: sign.name,
        rol: data.rol,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "No se pudo guardar el usuario",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const {email, password} =req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "ingresa email y contraseña"
      });
    }

      const user = await UserModel.findOne({email: email.toLowerCase().trim()});

      if (!user) {
        return res.status(401).json({
          msg: "email o contraseña incorrecto",
        });
      }

      const passwordCorrect =await bcrypt.compare(password, user.password);

      if (!passwordCorrect) {
        return res.status(401).json({
          msg: "email o contraseña incorrecta",
        });
        
      }
      
      const token = jwt.sign({
        id: user._id,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
       {expiresIn: "2h"}

      );
      return res.status(200). json({
        msg: "Login correcto",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          rol: user.rol
      },
  });
    
    
  } catch (error) {
    console.error("ERROR EN LOGIN:", error);

    return res.status(500).json({
        msg: "Error al iniciar sesión",
    });
}
  
}

// Lista de usuarios: find()
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({ msg: "ok", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No se pudo obtener los usuarios" });
  }
};
// Usuario por ID: findById()
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar permisos
    if (req.user.rol !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        msg: "No tenés permiso para consultar este usuario",
      });
    }

    const user = await UserModel.findById(id)
       .select("-password")
    .populate("sign", "name");

    if (user) {
      return res.status(200).json({
        msg: "Usuario por ID",
        data: user,
      });
    }

    return res.status(404).json({
      msg: "No se encontró el usuario",
      data: {},
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Error en el servidor",
      data: {},
    });
  }
};
// Actualizar usuatio por ID: findByIdAndUpdate()
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Verificar que sea el dueño del perfil o administrador
    if (req.user.rol !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        msg: "No tenés permiso para modificar este usuario",
      });
    }

    // Buscar usuario
    const user = await UserModel.findById(id)
 

    if (!user) {
      return res.status(404).json({
        msg: "No se encontró el usuario",
      });
    }

    // Actualizar nombre
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ msg: "Nombre inválido" });
      }
      user.name = name.trim();
    }

    // Actualizar email
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ msg: "Email inválido" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await UserModel.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(400).json({
          msg: "El email ya está registrado",
        });
      }

      user.email = normalizedEmail;
    }

    // Actualizar contraseña
    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          msg: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        rol: user.rol,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "No se pudo actualizar el usuario",
    });
  }
};
//Eliminar usuario por ID:findByIdAndDelete()
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ msg: "Usuario Eliminado ", data: user._id });
    } else {
      res.status(404).json({ msg: "No se encontro el usuario", data: {} });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Tenemos un error :( en el servidor ", data: {} });
  }
};

export { postUser, loginUser,getUsers, getUserById, updateUserById, deleteUserById };
