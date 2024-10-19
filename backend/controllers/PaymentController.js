import Payment from '../models/paymentModel.js';

export const addPayment = async (req, res) => {
    try {
        const { appointmentId, cardNumber, cardHolderName, expiryDate, cvv, amount } = req.body;

        // Create a new payment record
        const newPayment = new Payment({
            appointmentId,
            cardNumber,
            cardHolderName,
            expiryDate,
            cvv,
            amount,
        });

        await newPayment.save();

        res.status(201).json({ message: 'Payment added successfully', paymentId: newPayment._id });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ message: 'Failed to add payment', error: error.message });
    }
};
