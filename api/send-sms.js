// Vercel Serverless Function for sending SMS notifications via Vonage
import { Vonage } from '@vonage/server-sdk';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, customerName, orderItems } = req.body;

    console.log('SMS API called with:', {
      phoneNumber,
      customerName,
      itemCount: orderItems?.length || 0
    });

    // Validate required fields
    if (!phoneNumber) {
      console.error('No phone number provided');
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Initialize Vonage client
    const apiKey = process.env.VONAGE_API_KEY;
    const apiSecret = process.env.VONAGE_API_SECRET;
    const vonageNumber = process.env.VONAGE_PHONE_NUMBER;

    // Check if Vonage credentials are configured
    if (!apiKey || !apiSecret || !vonageNumber) {
      console.error('Vonage credentials not configured:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasVonageNumber: !!vonageNumber
      });
      return res.status(500).json({
        error: 'SMS service not configured. Please contact support.'
      });
    }

    console.log('Vonage credentials found. Initializing client...');

    const vonage = new Vonage({
      apiKey: apiKey,
      apiSecret: apiSecret
    });

    // Format the order items for the message
    const itemsList = orderItems && orderItems.length > 0
      ? orderItems.map(item => {
          const size = item.size ? ` (${item.size})` : '';
          const temp = item.temperature ? ` - ${item.temperature}` : '';
          return `  • ${item.name}${size}${temp}`;
        }).join('\n')
      : '';

    // Create the message
    const message = `Hi ${customerName || 'there'}! ☕

Your order is ready for pickup at FX7 Coffee House!

${itemsList ? `Order:\n${itemsList}\n\n` : ''}Please come to the counter to pick up your order.

Thank you for supporting Feeding America with your purchase! 💚

- FX7 Coffee House`;

    // Log the attempt
    console.log('Attempting to send SMS:', {
      to: phoneNumber,
      from: vonageNumber,
      messagePreview: message.substring(0, 50) + '...'
    });

    // Send SMS via Vonage
    const vonageResponse = await vonage.sms.send({
      to: phoneNumber,
      from: vonageNumber,
      text: message
    });

    console.log('Vonage response:', JSON.stringify(vonageResponse, null, 2));

    // Check if message was sent successfully
    if (vonageResponse.messages && vonageResponse.messages[0]) {
      const messageStatus = vonageResponse.messages[0].status;

      if (messageStatus === '0') {
        console.log('SMS sent successfully!');
        return res.status(200).json({
          success: true,
          messageId: vonageResponse.messages[0]['message-id'],
          message: 'SMS notification sent successfully'
        });
      } else {
        const errorText = vonageResponse.messages[0]['error-text'] || 'Unknown error';
        console.error('Vonage error:', errorText, 'Status:', messageStatus);
        throw new Error(`Vonage error: ${errorText}`);
      }
    } else {
      throw new Error('Invalid response from Vonage API');
    }

  } catch (error) {
    console.error('Error sending SMS:', error);

    // Handle specific Vonage errors
    if (error.message?.includes('Invalid') || error.message?.includes('number')) {
      return res.status(400).json({
        error: 'Invalid phone number format'
      });
    }

    return res.status(500).json({
      error: 'Failed to send SMS notification',
      details: error.message
    });
  }
}
