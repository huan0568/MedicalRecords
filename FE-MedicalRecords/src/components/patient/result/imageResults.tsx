import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePrediction } from '../../../pages/patient/PredictionContext';

const defaultTitles = ['Mild', 'Moderate', 'No_DR', 'Proliferate_DR', 'Severe', 'Diabetic Retinopathy'];

const titleToKeyMapping: { [key: string]: string } = {
  mild: 'mild_value',
  moderate: 'moderate_value',
  no_dr: 'noDR_value',
  proliferate_dr: 'proliferateDR_value',
  severe: 'severe_value'
};

interface ImageResultsProps {
  isEdit?: boolean;
  savedValues: { [key: string]: string };
  setSavedValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const ImageResults: React.FC<ImageResultsProps> = ({ savedValues, isEdit, setSavedValues }) => {
  const { predictionResults } = usePrediction();
  const [formattedPrediction, setFormattedPrediction] = useState<JSX.Element[]>([]);
  const [checkedIndex, setCheckedIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log('Prediction Results:', predictionResults);
    if (predictionResults && predictionResults.length > 0) {
      const initialEditValues: { [key: string]: string } = {};
      defaultTitles.forEach((title) => {
        const key = titleToKeyMapping[title.toLowerCase()];
        initialEditValues[title] = parseFloat(predictionResults[0][key] || 0).toFixed(3);
      });
      setEditValues(initialEditValues);
      setSavedValues(initialEditValues);
    }
  }, [predictionResults, setSavedValues]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (predictionResults && predictionResults.length > 0) {
        const currentImageId = predictionResults[0].id_image;
        try {
          const response = await axios.get(`http://localhost:3001/feedbacks/image/${currentImageId}`);
          console.log('Feedback Response:', response.data);
          if (response.data && response.data.feedbacks && response.data.feedbacks.length > 0) {
            const feedback = response.data.feedbacks[0];
            const diabeticRetinopathyValue = feedback.diabetic_Retinopathy;
            const selectedIndex = defaultTitles.findIndex((title) => title.toLowerCase() === diabeticRetinopathyValue.toLowerCase());
            setCheckedIndex(selectedIndex + 1); // +1 to match index with checkbox options
          } else {
            setCheckedIndex(null); // No feedback found, reset checkbox selection
          }
        } catch (error) {
          console.error('Error fetching feedback:', error);
        }
      }
    };
    fetchFeedback();
  }, [predictionResults]);

  const handleEditChange = (title: string, value: string) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [title]: value
    }));
  };

  const handleSave = () => {
    console.log('Checked Index before save:', checkedIndex);
    const index = checkedIndex ? checkedIndex - 1 : 0; // Convert 1-based to 0-based index
    console.log('Index used for saving:', index);
    const newSavedValues = {
      ...editValues,
      'Diabetic Retinopathy': defaultTitles[index] || ''
    };
    setSavedValues(newSavedValues);
    setIsEditing(false);
  };

  const handleCheckboxClick = (index: number) => {
    console.log('Title clicked:', defaultTitles[index]);
    setCheckedIndex(index + 1); // Update checkedIndex for styling purposes
    handleEditChange('Diabetic Retinopathy', defaultTitles[index]); // Update editValues directly
  };

  useEffect(() => {
    const formatPrediction = () => {
      if (predictionResults && predictionResults.length > 0) {
        const values = defaultTitles.map((title) => {
          const key = titleToKeyMapping[title.toLowerCase()];
          return parseFloat(predictionResults[0][key] || 0);
        });

        const selectedDiabeticRetinopathyIndex = checkedIndex ? checkedIndex - 1 : values.indexOf(Math.max(...values));

        const formattedData = defaultTitles.map((title, index) => {
          const value = savedValues[title] || editValues[title] || '';

          return (
            <div key={title} className='px-4 border-b flex-center-y border-slate-400'>
              <div className='w-32 flex-shrink-0'>
                <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>{title}</h4>
              </div>
              {isEditing ? (
                <input
                  type='text'
                  className='mr-2 border border-gray-300 rounded w-20'
                  value={editValues[title]}
                  onChange={(e) => handleEditChange(title, e.target.value)}
                />
              ) : (
                <p className='mr-2'>{isNaN(parseFloat(value)) ? '' : value}</p>
              )}
              <div className='flex items-center ml-auto'>
                <div
                  className={`flex-shrink-0 w-5 aspect-square rounded-full ${index === selectedDiabeticRetinopathyIndex ? 'bg-red-500' : 'bg-green-500'}`}
                />
              </div>
              <input
                type='checkbox'
                className='ml-2 w-6 h-6'
                checked={checkedIndex === index + 1}
                onChange={() => {
                  setCheckedIndex(index + 1);
                  handleCheckboxClick(index); // Log title when checkbox is clicked
                }}
                disabled={!isEditing} // Enable checkbox only in editing mode
              />
            </div>
          );
        });

        setFormattedPrediction(formattedData);
      } else {
        // If no results, display empty table
        const emptyTable = defaultTitles.map((title, index) => (
          <div key={title} className='px-4 border-b flex-center-y border-slate-400'>
            <div className='w-32 flex-shrink-0'>
              <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>{title}</h4>
            </div>
            <p className='mr-2'></p>
            <div className='flex items-center ml-auto'> {/* Align to the right */}
              <div className={`flex-shrink-0 w-5 aspect-square rounded-full bg-gray-200`} />
              <input
                type='checkbox'
                className='ml-2 w-6 h-6'
                checked={checkedIndex === index + 1}
                onChange={() => {
                  setCheckedIndex(index + 1);
                  handleCheckboxClick(index); // Log title when checkbox is clicked
                }}
                disabled={!isEditing} // Enable checkbox only in editing mode
              />
            </div>
          </div>
        ));

        setFormattedPrediction(emptyTable);
      }
    };

    formatPrediction();
  }, [predictionResults, checkedIndex, isEditing, editValues, savedValues]);

  return (
    <section id='image-result' className='pt-3 mb-4 bg-white rounded-xl shadow-pop'>
      <div className='px-4 pb-2 mb-2 flex justify-between items-center border-b-2 border-slate-400'>
        <h1 className='text-xl font-bold'>Kết quả ảnh</h1>
        {isEdit && (
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className='flex-shrink-0 px-4 py-2 font-bold text-white rounded-lg bg-sky-600 hover:scale-105'
          >
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </button>
        )}
      </div>
      {formattedPrediction.length > 0 ? (
        formattedPrediction
      ) : (
        <div className='px-4 border-b flex-center-y border-slate-400'>
          <div className='w-32 flex-shrink-0'>
            <h4 className='py-2 mr-4 border-r border-slate-400 overflow-hidden'>No results</h4>
          </div>
          <p className='mr-2'></p>
          <div className='flex items-center ml-auto'> {/* Align to the right */}
            <div className={`flex-shrink-0 w-5 aspect-square rounded-full bg-gray-200`} />
            <input
              type='checkbox'
              className='ml-2 w-6 h-6'
              checked={checkedIndex === null}
              onChange={() => setCheckedIndex(null)}
              disabled={!isEditing} // Enable checkbox only in editing mode
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageResults;





