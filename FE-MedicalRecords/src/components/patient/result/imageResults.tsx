import React, { useEffect, useState } from 'react';
import { usePrediction } from '../../../pages/patient/PredictionContext';

// Define the default titles
const defaultTitles = ['Mild', 'Moderate', 'No_DR', 'Proliferate_DR', 'Severe', 'Diabetic Retinopathy'];

// Define a mapping object for lowercase titles to keys in predictionValues
const titleToKeyMapping: { [key: string]: string } = {
  mild: 'mild_value',
  moderate: 'moderate_value',
  no_dr: 'noDR_value',
  proliferate_dr: 'proliferateDR_value',
  severe: 'severe_value',
};

const ImageResults: React.FC = () => {
  const { predictionResults } = usePrediction();
  const [formattedPrediction, setFormattedPrediction] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const formatPrediction = () => {
      if (predictionResults && predictionResults.length > 0) {
        const values = defaultTitles.map((title) => {
          const key = titleToKeyMapping[title.toLowerCase()];
          return parseFloat(predictionResults[0][key] || 0);
        });

        const maxIndex = values.indexOf(Math.max(...values));

        const formattedData = defaultTitles.map((title, index) => {
          const key = titleToKeyMapping[title.toLowerCase()];
          const value = parseFloat(predictionResults[0][key] || '').toFixed(3);
          return (
            <div key={title} className='px-4 border-b flex-center-y border-slate-400'>
              <div className='w-32 flex-shrink-0'>
                <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>{title}</h4>
              </div>
              <p className="mr-2">{isNaN(parseFloat(value)) ? '' : value}</p>
              <div className='flex items-center ml-auto'>
                <div className={`flex-shrink-0 w-5 aspect-square rounded-full ${index === maxIndex ? 'bg-red-500' : 'bg-green-500'}`} />
              </div>
            </div>
          );
        });

        formattedData[formattedData.length - 1] = (
          <div key={defaultTitles[defaultTitles.length - 1]} className='px-4 border-b flex-center-y border-slate-400'>
            <div className='w-32 flex-shrink-0'>
              <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>{defaultTitles[defaultTitles.length - 1]}</h4>
            </div>
            <p className="mr-2">{defaultTitles[maxIndex]}</p>
            <div className='flex items-center ml-auto'>
              <div className={`flex-shrink-0 w-5 aspect-square rounded-full bg-gray-200`} />
            </div>
          </div>
        );

        setFormattedPrediction(formattedData);
      } else {
        // If no results, display empty table
        const emptyTable = defaultTitles.map((title) => (
          <div key={title} className='px-4 border-b flex-center-y border-slate-400'>
            <div className='w-32 flex-shrink-0'>
              <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>{title}</h4>
            </div>
            <p className="mr-2"></p>
            <div className='flex items-center ml-auto'>
              <div className={`flex-shrink-0 w-5 aspect-square rounded-full bg-gray-200`} />
            </div>
          </div>
        ));

        setFormattedPrediction(emptyTable);
      }
    };

    formatPrediction();
  }, [predictionResults]);

  return (
    <section id='image-result' className='pt-3 mb-4 bg-white rounded-xl shadow-pop'>
      <h1 className='px-4 pb-2 mb-2 text-xl font-bold text-center border-b-2 border-slate-400'>Kết quả ảnh</h1>
      {formattedPrediction.length > 0 ? formattedPrediction : (
        <div className='px-4 border-b flex-center-y border-slate-400'>
          <div className='w-32 flex-shrink-0'>
            <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>No results</h4>
          </div>
          <p className="mr-2"></p>
          <div className='flex items-center ml-auto'>
            <div className={`flex-shrink-0 w-5 aspect-square rounded-full bg-gray-200`} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageResults;

















