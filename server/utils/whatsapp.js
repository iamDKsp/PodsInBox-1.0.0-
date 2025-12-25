import { WHATSAPP_NUMBER } from '../config/jwt.js';

export const generateWhatsAppLink = (order) => {
    const items = order.items.map(item =>
        `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🛒 *Novo Pedido - Pods in Box*

📋 *Pedido #${order.id}*

*Cliente:* ${order.customerName}
*Telefone:* ${order.customerEmail}

*Itens:*
${items}

💰 *Total: R$ ${order.total.toFixed(2)}*

🏠 *Endereço de entrega:*
${order.address || 'A combinar'}

Aguardo confirmação do pagamento para envio! 🚀`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};
