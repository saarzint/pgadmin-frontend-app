import React from 'react';
import { Coins } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
          <Coins size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-darkest">
            Currency Converter
          </h3>
          <p className="text-xs text-neutral-gray">
            Powered by Wise.com
          </p>
        </div>
      </div>

      <div className="flex justify-center bg-gray-50 rounded-xl p-4">
        <iframe
          title="Currency Converter"
          src="https://wise.com/gb/currency-converter/fx-widget/converter?sourceCurrency=INR&targetCurrency=EUR"
          height="490"
          width="340"
          frameBorder="0"
          allowTransparency={true}
          className="border-0 rounded-lg"
        />
      </div>
    </div>
  );
};

export default CurrencyConverter;
