export default function OrderDetailsPage({ params }) {
  const { orderId } = params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h1>
        <p className="text-gray-700 mb-6">Displaying details for Order ID: <span className="font-semibold">{orderId}</span></p>
        <p className="text-gray-500">This is a placeholder for your order details. In a real application, you would fetch and display actual order information here.</p>
      </div>
    </div>
  );
}
