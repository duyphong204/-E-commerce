import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: unknown) => void;
  onError: (error: unknown) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError }) => {
  const clientId = import.meta.env.VITE_PAY_URL || "";

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: parseFloat(String(amount)).toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(_data, actions) => {
          if (actions.order) {
            return actions.order.capture().then(onSuccess);
          }
          return Promise.resolve();
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
