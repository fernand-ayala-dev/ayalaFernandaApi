
import Horoscopo from "../models/horoscopoModel.js";
import mongoose from "mongoose";

// ==========================================
// SIGNOS VÁLIDOS
// ==========================================

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

// ==========================================
// FECHA ACTUAL
// ==========================================

const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

// ==========================================
// OBTENER HORÓSCOPO DIARIO O SEMANAL
// ==========================================

const getHoroscopo = async (sign, type) => {

    const today = getToday();

    // 1. BUSCAR EN MONGODB

    const horoscopoExistente = await Horoscopo.findOne({
        sign: sign,
        type: type,
        date: today,
    });

    if (horoscopoExistente) {
        console.log("Horóscopo encontrado en MongoDB");

        return {
            source: "database",
            data: horoscopoExistente,
        };
    }

    // 2. CONSULTAR FREEHOROSCOPEAPI

    const params = new URLSearchParams({
      lang: "es",
      sign: sign,
      
    });

    const url = `${process.env.HOROSCOPE_API}/get-horoscope/${type}?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.text();

        console.error("Error FreeHoroscopeAPI:", errorData);

        throw new Error(
            `Error al consultar FreeHoroscopeAPI: ${response.status}`
        );
    }

    const data = await response.json();

    console.log("Respuesta FreeHoroscopeAPI:", data);

    // 3. OBTENER TEXTO DEL HORÓSCOPO

    const text = data?.data?.horoscope;

    if (!text) {
        throw new Error(
            "La API no devolvió el texto del horóscopo"
        );
    }

    // 4. FECHA DE VENCIMIENTO

    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // 5. GUARDAR EN MONGODB

    const horoscopo = new Horoscopo({
        sign: sign,
        type: type,
        text: text,
        date: today,
        expiresAt: tomorrow,
    });

    await horoscopo.save();

    console.log("==================================");
    console.log("HORÓSCOPO GUARDADO EN MONGODB");
    console.log(horoscopo);
    console.log("==================================");

    // 6. DEVOLVER RESULTADO

    return {
        source: "api",
        data: horoscopo,
    };
};

// ==========================================
// HORÓSCOPO DIARIO
// GET /api/horoscopo/:sign
// ==========================================

const getHoroscopoBySign = async (req, res) => {

    try {

        let { sign } = req.params;

        sign = sign.toLowerCase().trim();

        if (!validSigns.includes(sign)) {
            return res.status(400).json({
                message: "Signo zodiacal inválido",
            });
        }

        const resultado = await getHoroscopo(sign, "daily");

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error horóscopo diario:", error);

        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ==========================================
// HORÓSCOPO SEMANAL
// GET /api/horoscopo/:sign/weekly
// ==========================================

const getWeeklyHoroscopo = async (req, res) => {

    try {

        let { sign } = req.params;

        sign = sign.toLowerCase().trim();

        if (!validSigns.includes(sign)) {
            return res.status(400).json({
                message: "Signo zodiacal inválido",
            });
        }

        const resultado = await getHoroscopo(sign, "weekly");

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("Error horóscopo semanal:", error);

        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ==========================================
// ELIMINAR HORÓSCOPO
// DELETE /api/horoscopo/:id
// ==========================================

const deleteHoroscopoById = async (req, res) => {

    try {

        const { id } = req.params;
if (!mongoose.isValidObjectId(id)) {
  return res.status(400).json({
    message: "El ID del horóscopo no es válido",
  });
}
        const horoscopo = await Horoscopo.findByIdAndDelete(id);

        if (!horoscopo) {
            return res.status(404).json({
                message: "Horóscopo no encontrado",
            });
        }

        return res.status(200).json({
            message: "Horóscopo eliminado correctamente",
            data: horoscopo,
        });

    } catch (error) {

        console.error("Error eliminando horóscopo:", error);

        return res.status(500).json({
            message: "Error al eliminar el horóscopo",
            error: error.message,
        });
    }
};

export {
   getToday, getHoroscopo, getHoroscopoBySign, getWeeklyHoroscopo, deleteHoroscopoById
}
