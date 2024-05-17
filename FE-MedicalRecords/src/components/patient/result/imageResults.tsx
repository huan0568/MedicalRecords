import React from 'react';
import { usePrediction } from '../../../pages/patient/PredictionContext';

// Define the default titles
const defaultTitles = ['Mild', 'Moderate', 'No_DR', 'Proliferate_DR', 'Severe', 'Diabetic Retinopathy'];

interface IProps {
  isShow?: boolean;
}

const ImageResults: React.FC<IProps> = ({ isShow }) => {
  const { prediction } = usePrediction();
  
  // Function to format the prediction values with corresponding titles
  const formatPrediction = (title:string, index:number) => {
    // Remove the condition that checks for !prediction
    const predictionValues = prediction.slice(2, -2).split(',').map(parseFloat); // Adjust slicing to include all values correctly
    const maxIndex = predictionValues.indexOf(Math.max(...predictionValues)); // Find the index of the maximum value
    const maxTitle = defaultTitles[maxIndex]; // Get the corresponding title with the maximum value
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-slate-400">
        {/* Adjust the width of the title */}
        <div className='col-span-3 flex-shrink-0 w-full px-2 '>
          <h4 className='mr-4 '>{title}</h4>
        </div>
        {/* Render the prediction value for each title */}
        
      <div className="col-span-3 border-x border-stale-400 flex-center pr-2 py-2">
      {title === 'Diabetic Retinopathy' ? (
          <p className="mr-2"> {maxTitle}</p> // Display the title with the maximum value
        ) : (
          <>
            <p className="mr-2">{predictionValues[index] ? predictionValues[index].toFixed(3) : ''}</p> 
            {/* Render the green dot */}
            <div className='flex items-center ml-auto'>
              <div className={`flex-shrink-0 w-5 aspect-square rounded-full ${index === maxIndex ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
          </>
        )}
      </div>
          <div className="col-span-1 flex-center">
          <input type="checkbox"
            className='w-5 h-5'
          />
          </div>
      </div>
    )
  }
  
  return (
    <section id='image-result' className='pt-3 mb-4 bg-white rounded-xl shadow-pop'>
      <h1 className='px-4 pb-2 mb-2 text-xl font-bold text-center border-b-2 border-slate-400'>Kết quả ảnh</h1>

      {/* Render formatted prediction values */}
      {
        defaultTitles.map((title, index) => {
          return formatPrediction(title, index)
            
        })
      }
    </section>
  );
};

export default ImageResults;















