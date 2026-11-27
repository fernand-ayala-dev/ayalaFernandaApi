import SignModel from "../models/signModel.js";
import mongoose from "mongoose";

// Crear: Create()

const postSign = async (req, res) => {
  try {
    const { name, characteristics, personality, description, man, woman } =
      req.body;

    // Validar nombre
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "El nombre del signo es obligatorio",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    const signExists = await SignModel.findOne({
      name: normalizedName,
    });

    if (signExists) {
      return res.status(400).json({
        message: "El signo ya existe",
      });
    }

    // Crear signo
    const newSign = new SignModel({
      name: normalizedName,
      characteristics,
      personality,
      description,
      man,
      woman,
    });

    const savedSign = await newSign.save();

    return res.status(201).json({
      message: "Signo creado correctamente",
      data: savedSign,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Los datos del signo son inválidos",
      });
    }

    return res.status(500).json({
      message: "Error al crear el signo",
    });
  }
};

// Lista de signos: find()
const getSigns = async (req, res) => {
  try {
    const signs = await SignModel.find();

    res.status(200).json({
      message: "Signos obtenidos correctamente",
      data: signs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los signos",
      error: error.message,
    });
  }
};

// Signo por ID: findById()
const getSignById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "El ID del signo no es válido",
      });
    }
    const sign = await SignModel.findById(id);

    if (sign) {
      res.status(200).json({
        msg: `Resultado de busqueda Signo:  ${sign.name} `,
        data: sign,
      });
    } else {
      res
        .status(404)
        .json({ msg: "No se encontro el signo que buscas", data: {} });
    }

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Tenemos un error :( en el servidor ", data: {} });
  }
};
// Signo por name: findOne({ name: { $regex: `^${name}$`, $options: 'i' } })
const getSignByName = async (req, res) => {
  try {
    const name = req.params.name;
    //busca por name del signo , uso la expresion para que de name que se pasa no distinga entre mayusculas y minusculas
    //$regex
    const sign = await SignModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (sign) {
      res.status(200).json({
        msg: `Resultado de busqueda Signo:  ${sign.name} `,
        data: sign,
      });
    } else {
      res
        .status(404)
        .json({ msg: "No se encontro el signo que buscas", data: {} });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Tenemos un error :( en el servidor ", data: {} });
  }
};

//// Actualizar horoscopo por ID: findByIdAndUpdate()
const updateSignById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, characteristics, personality, description, man, woman } =
      req.body;

      if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "El ID del signo no es válido",
      });
    }
    const signo = await SignModel.findByIdAndUpdate(id, {
      name,
      characteristics,
      personality,
      description,
      man,
      woman,
    }, {
      new: true,
      runValidators: true,
    });

     if (!signo) {
      return res.status(404).json({
        msg: "No se encontró el signo",
      });
    }

    console.log({ signo });
    res.status(202).json({ msg: `Signo ${signo.name} Actualizado con éxito` , data: signo});
  } catch (error) {
     console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        msg: "Los datos del signo son inválidos",
      });
    }

    return res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};
//Eliminar horoscopo por ID:findByIdAndDelete()
const deleteSignById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
  return res.status(400).json({
    msg: "El ID del signo no es válido",
  });
}
    const signo = await SignModel.findByIdAndDelete(id);
    if (signo) {
      res.status(200).json({
        msg: `ok, Signo ${signo.name} Eliminado con éxito`,
        data: signo._id,
      });
    } else {
      res.status(404).json({ msg: "No se encontro el Signo", data: {} });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Tenemos un error :( en el servidor ", data: {} });
  }
};

export {
  postSign,
  getSigns,
  getSignById,
  getSignByName,
  updateSignById,
  deleteSignById,
};
