import React from 'react';

const plans = [
  {
    type: 'Subscriptions',
    options: [
      { images: 10, price: 299, perImage: 2.49 },
      { images: 50, price: 979, perImage: 1.63 },
      { images: 350, price: 1649, perImage: 0.39 },
    ],
  },
  {
    type: 'Packs',
    options: [
      { images: 5, price: 49, perImage: 9.80 },
      { images: 2, price: 29, perImage: 14.50 },
      { images: 25, price: 229, perImage: 9.16, bestValue: true },
    ],
  },
];

const Popup = ({ togglePopup }: { togglePopup: () => void }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg w-3/4 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Choose Plan</h2>
          <button onClick={togglePopup} className="text-gray-500 text-2xl">
            &times;
          </button>
        </div>
        <div className="mt-4">
          <div className="flex space-x-4">
            {plans.map((plan, index) => (
              <div key={index} className="w-1/2 p-2">
                <h3 className="font-semibold mb-2">{plan.type}</h3>
                {plan.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded mb-2"
                  >
                    <input type="radio" name={plan.type} className="mr-2" />
                    <div className="flex-grow">
                      <span>{option.images} images</span>
                      <div className="text-sm text-gray-500">${option.price}/yr</div>
                    </div>
                    <div className="text-sm">${option.perImage} per image</div>
                    {option.bestValue && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded ml-2 text-xs">
                        Best Value
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
