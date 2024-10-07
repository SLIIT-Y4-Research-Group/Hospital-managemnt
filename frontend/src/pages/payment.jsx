// Payment.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your actual publishable key

const Payment = ({ appointmentData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  const [cashDetails, setCashDetails] = useState({
    amount: '',
    payerName: '',
    payerEmail: '', // Added payerEmail state
    payerNIC: '',   // Added payerNIC state
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleCashChange = (e) => {
    const { name, value } = e.target;
    setCashDetails({ ...cashDetails, [name]: value });
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    const stripe = await stripePromise;

    try {
      let response;

      // Process Credit/Debit Card payment
      if (paymentMethod === 'card') {
        response = await axios.post('http://localhost:5000/api/payment', {
          amount: appointmentData.amount, // Set the appointment amount
        });
        const { clientSecret } = response.data;

        // Confirm card payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {
              number: cardDetails.number,
              exp_month: cardDetails.expMonth,
              exp_year: cardDetails.expYear,
              cvc: cardDetails.cvc,
            },
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        if (result.paymentIntent.status === 'succeeded') {
          alert('Payment succeeded!');
          onSuccess();
        }
      } 
      // Process Cash Payment
      else if (paymentMethod === 'cash') {
        // Implement cash payment logic here (e.g., store cash details)
        alert(`Cash payment received from ${cashDetails.payerName} for ${cashDetails.amount} units. Email: ${cashDetails.payerEmail}, NIC: ${cashDetails.payerNIC}`);
        onSuccess();
      } 
      // Process PayPal Payment
      else if (paymentMethod === 'paypal') {
        alert('You will be redirected to PayPal to complete your payment.');
        // This would typically involve redirecting the user to PayPal's checkout page
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="bg-white shadow-md rounded-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Cash Payment</option>
        </select>
      </div>

      {/* Card Payment Details */}
      {paymentMethod === 'card' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              name="number"
              required
              value={cardDetails.number}
              onChange={handleCardChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Month</label>
              <input
                type="text"
                name="expMonth"
                required
                placeholder="MM"
                value={cardDetails.expMonth}
                onChange={handleCardChange}
                className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Year</label>
              <input
                type="text"
                name="expYear"
                required
                placeholder="YYYY"
                value={cardDetails.expYear}
                onChange={handleCardChange}
                className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              name="cvc"
              required
              value={cardDetails.cvc}
              onChange={handleCardChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
        </>
      )}

      {/* Cash Payment Details */}
      {paymentMethod === 'cash' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              name="amount"
              required
              value={cashDetails.amount}
              onChange={handleCashChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payer Name</label>
            <input
              type="text"
              name="payerName"
              required
              value={cashDetails.payerName}
              onChange={handleCashChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payer Email</label>
            <input
              type="email"
              name="payerEmail"
              required
              value={cashDetails.payerEmail}
              onChange={handleCashChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payer NIC</label>
            <input
              type="text"
              name="payerNIC"
              required
              value={cashDetails.payerNIC}
              onChange={handleCashChange}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
        </>
      )}

      {/* PayPal Payment Button */}
      {paymentMethod === 'paypal' && (
        <div className="mt-4">
          <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
          <button
            type="button"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300"
            onClick={() => alert('PayPal integration coming soon!')}
          >
            Pay with PayPal
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default Payment;
