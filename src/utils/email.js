import nodemailer from 'nodemailer';
import config from "../config/index.js";


const { EMAIL, PASS } = config;
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass:PASS,
  },
});

export async function sendPurchaseMail({ to, ticket }) {
    const html = `
      <h1>Gracias por tu compra</h1>
      <p><strong>Código de Ticket:</strong> ${ticket.code}</p>
      <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
      <p><strong>Total:</strong> $${ticket.amount}</p>
      <p><strong>Cantidad de productos:</strong> ${ticket.quantity}</p>
    `;
  
    await transporter.sendMail({
      from: `Ecommerce <${EMAIL}>`,
      to,
      subject: 'Tu ticket de compra',
      html
    });
  }

export const sendRecoveryMail = async ({ to, token }) => {
  const html = `
    <h2>Recuperación de contraseña</h2>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href=\"${process.env.FRONT_URL}/recover/${token}\">${process.env.FRONT_URL}/recover/${token}</a>
  `;

  return transporter.sendMail({
    from: `Soporte <${process.env.EMAIL}>`,
    to,
    subject: 'Recuperación de contraseña',
    html,
  });
};
