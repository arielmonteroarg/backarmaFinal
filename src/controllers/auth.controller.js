import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import UserModel from '../daos/mongo/models/User.js';
import { transporter } from '../utils/email.js';
import bcrypt from 'bcrypt';

const { EMAIL, TOKEN_EXPIRES_IN,FRONT_URL,SECRET } = config;

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    const link = `${FRONT_URL}/api/auth/recover/${token}`;

    await transporter.sendMail({
      from: `"Soporte" <${EMAIL}>`,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic <a href="${link}">aquí</a> para restablecer tu contraseña</p> 
      <p>Usa Este Ruta Para Cambiar La Contraseña
      ${link}</p>`
    });

    res.json({ message: 'Correo enviado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};
