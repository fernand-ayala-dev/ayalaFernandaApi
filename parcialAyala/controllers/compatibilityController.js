import Compatibility from "../models/compatibilityModel.js";
import SignModel from "../models/signModel.js";
import mongoose from "mongoose";

const validSigns = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
 
];

const nameSigns = {
  aries: "aries",
  taurus: "tauro",
  gemini: "geminis",
  cancer: "cáncer",
  leo: "leo",
  virgo: "virgo",
  libra: "libra",
  scorpio: "escorpio",
  sagittarius: "sagitario",
  capricorn: "capricornio",
  aquarius: "acuario",
  pisces: "piscis",
 
};

const getCompatibility = async (req, res) => {
  try {
  
    const { sign1, sign2 } = req.params;
    const signA = sign1.toLowerCase().trim();
    const signB = sign2.toLowerCase().trim();

    if (!validSigns.includes(signA) || !validSigns.includes(signB)) {
      return res.status(400).json({
        error: "Uno o ambos signos no son válidos",
      });
    }

    const nameSignA = nameSigns[signA];
    const nameSignB = nameSigns[signB];  
    
    const signObjA = await SignModel.findOne({
      name: nameSignA,
    });
    const signObjB = await SignModel.findOne({
      name: nameSignB,
    });

   
    if (!signObjA || !signObjB) {
      return res.status(404).json({
        error: "Uno o ambos signos no existen en la colección Signos",
        signo1: nameSignA,
        signo2: nameSignB,
      });
    }

    const compatibility = await Compatibility.findOne({
      $or: [
        {
          sign1: signObjA._id,
          sign2: signObjB._id,
        },
        {
          sign1: signObjB._id,
          sign2: signObjA._id,
        },
      ],
    })
   
    if (!compatibility) {
      return res.status(404).json({
        error: "No existe información de compatibilidad entre estos signos",
      });
    }

    return res.status(200).json({
      source: "database",
      data: compatibility,
    });

  } catch (error) {   
    console.error(error);  

    return res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

const createCompatibility = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: "El cuerpo de la petición está vacío o no se recibió JSON",
      });
    }

    const {
      sign1,
      sign2,
      sex,
      confidentiality,
      communication,
      emotions,
      convictions,
      activity,
      summary,
    } = req.body;

    if (!sign1 || !sign2) {
      return res.status(400).json({
        error: "Debes indicar los dos signos",
      });
    }

    const signA = sign1.toLowerCase().trim();
    const signB = sign2.toLowerCase().trim();

    if (!validSigns.includes(signA) || !validSigns.includes(signB)) {
      return res.status(400).json({
        error: "Uno o ambos signos no son válidos",
      });
    }

    const nameSignA = nameSigns[signA];
    const nameSignB = nameSigns[signB];

    const signObjA = await SignModel.findOne({
      name: nameSignA,
    });

    const signObjB = await SignModel.findOne({
      name: nameSignB,
    });

    if (!signObjA || !signObjB) {
      return res.status(404).json({
        error: "Uno o ambos signos no existen en la colección Signos",
        sign1: nameSignA,
        sign2: nameSignB,
      });
    }

    const existe = await Compatibility.findOne({
      $or: [
        {
          sign1: signObjA._id,
          sign2: signObjB._id,
        },
        {
          sign1: signObjB._id,
          sign2: signObjA._id,
        },
      ],
    });

    if (existe) {
      return res.status(409).json({
        error: "La compatibilidad entre estos signos ya existe",
      });
    }

    const newCompatibility = new Compatibility({
      sign1: signObjA._id,
      sign2: signObjB._id,
      sex,
      confidentiality,
      communication,
      emotions,
      convictions,
      activity,
      summary,
    });

    await newCompatibility.save();

    return res.status(201).json({
      message: "Compatibilidad creada correctamente",

      data: newCompatibility,
    });
  } catch (error) {    

    console.error("MESSAGE:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
      errores: error.errors,
    });
  }
};
const updateCompatibility = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar el ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "El ID de la compatibilidad no es válido",
      });
    }

    // 2. Campos que se pueden actualizar
    const allowedFields = [
      "sex",
      "confidentiality",
      "communication",
      "emotions",
      "convictions",
      "activity",
      "summary",
    ];

    // 3. Preparar solamente los campos permitidos
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No se enviaron datos para actualizar",
      });
    }

    // 4. Buscar y actualizar
    const compatibility = await Compatibility.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!compatibility) {
      return res.status(404).json({
        error: "Compatibilidad no encontrada",
      });
    }

    return res.status(200).json({
      message: "Compatibilidad actualizada correctamente",
      data: compatibility,
    });

  } catch (error) {
    console.error("Error actualizando compatibilidad:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: "Los datos enviados no son válidos",
        detalle: error.message,
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};
const deleteCompatibility = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar el ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "El ID de la compatibilidad no es válido",
      });
    }

    // 2. Buscar y eliminar
    const compatibility = await Compatibility.findByIdAndDelete(id);

    if (!compatibility) {
      return res.status(404).json({
        error: "Compatibilidad no encontrada",
      });
    }

    return res.status(200).json({
      message: "Compatibilidad eliminada correctamente",
      data: compatibility,
    });

  } catch (error) {
    console.error("Error eliminando compatibilidad:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export {
  getCompatibility, createCompatibility, updateCompatibility, deleteCompatibility
}