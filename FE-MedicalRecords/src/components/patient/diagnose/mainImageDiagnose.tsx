import defaultAvatar from '@/assets/default-avatar.png';
import { useState, useEffect } from 'react';
import { AiOutlineMinus } from 'react-icons/ai';
import { GrPowerReset } from 'react-icons/gr';
import { IoAddOutline } from 'react-icons/io5';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePrediction } from '../../../pages/patient/PredictionContext';

interface IProps {
  images?: string[];
  imageIds?: string[];
}

export default function MainImageDiagnose({ images, imageIds }: IProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const { setPrediction, fetchPredictionResults, setPredictionResults } = usePrediction();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (imageIds && imageIds[currentImageIndex]) {
          await fetchPredictionResults(imageIds[currentImageIndex]);
        }
      } catch (error) {
        console.error('Error fetching prediction results:', error);
      }
    };

    fetchData();
  }, [currentImageIndex, imageIds, fetchPredictionResults]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedImages(filesArray);
      setCurrentImageIndex(images?.length || 0);
    }
  };

  const handlePredict = async () => {
    try {
      let formData = new FormData();

      if (uploadedImages.length > 0) {
        formData.append('image', uploadedImages[currentImageIndex - (images?.length || 0)]);
      } else if (images?.length) {
        const imageId = imageIds?.[currentImageIndex];
        console.log('Image ID:', imageId);
        const response = await axios.get(images[currentImageIndex], { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        formData.append('image', blob, imageId);
      } else {
        toast.error('Please select an image to predict');
        return;
      }

      const response = await axios.post('http://localhost:5000/predict_retinopathy', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Prediction response:', response.data);

      const predictionValues = response.data.prediction[0];
      const categories = ['Mild', 'Moderate', 'No_DR', 'Proliferate_DR', 'Severe'];
      const maxIndex = predictionValues.indexOf(Math.max(...predictionValues));
      const diabeticRetinopathy = categories[maxIndex];

      const postResponse = await axios.post('http://localhost:3001/predictions/create', {
        id_image: imageIds?.[currentImageIndex],
        mild_value: predictionValues[0],
        moderate_value: predictionValues[1],
        noDR_value: predictionValues[2],
        proliferateDR_value: predictionValues[3],
        severe_value: predictionValues[4],
        diabetic_Retinopathy: diabeticRetinopathy,
      });

      console.log('Post prediction response:', postResponse.data);

      setPrediction(JSON.stringify(response.data.prediction));
      setPredictionResults([]);

      if (imageIds && imageIds[currentImageIndex]) {
        await fetchPredictionResults(imageIds[currentImageIndex]);
      }

      toast.success('Prediction successful');
    } catch (error) {
      console.error('Error predicting image:', error);
      toast.error('Error predicting image');
    }
  };

  return (
    <section id='main-image' className='h-full gap-2 md:flex'>
      <ToastContainer />
      <div className='flex w-full gap-2 mb-4 overflow-auto md:block md:w-40 md:mb-0'>
        {images?.length ? (
          images.map((image, index) => (
            <div key={index} className='flex-shrink-0 image-container w-28 aspect-square'>
              <img
                onClick={() => setCurrentImageIndex(index)}
                src={image || defaultAvatar}
                alt=''
                className={`mb-2 image rounded-xl ${currentImageIndex === index && 'border-4 border-sky-600'}`}
              />
              <p
                className={`
                ${currentImageIndex === index ? 'bottom-1 w-[calc(100%-7.5px)] rounded-b-lg' : 'bottom-0 w-full rounded-b-xl'}
                text-center text-white bg-black bg-opacity-50 line-clamp-1 absolute-center-x`}
              >
                {`Image ${index + 1}`}
              </p>
            </div>
          ))
        ) : (
          <div className='flex-shrink-0 image-container w-28 aspect-square'>
            <img src={defaultAvatar} alt='' className='mb-2 image rounded-xl' />
            <p
              className={`
              text-center text-white bottom-0 w-full rounded-b-xl bg-black bg-opacity-50 line-clamp-1 absolute-center-x`}
            >
              Không có ảnh
            </p>
          </div>
        )}
        {uploadedImages.map((file, index) => (
          <div key={index} className='flex-shrink-0 image-container w-28 aspect-square'>
            <img
              onClick={() => setCurrentImageIndex((images?.length || 0) + index)}
              src={URL.createObjectURL(file)}
              alt=''
              className={`mb-2 image rounded-xl ${currentImageIndex === (images?.length || 0) + index && 'border-4 border-sky-600'}`}
            />
          </div>
        ))}

        <div className='flex-shrink-0 image-container w-28 aspect-square'>
          <input type='file' accept='image/*' multiple onChange={handleFileSelect} className='hidden' id='upload-image' />
          <label htmlFor='upload-image' className='mb-2 image rounded-xl cursor-pointer'>
            <span className='flex items-center justify-center w-full h-full'>
              <IoAddOutline className='text-4xl text-gray-500' />
            </span>
          </label>
          <p className='text-center text-white bottom-0 w-full rounded-b-xl bg-black bg-opacity-50 line-clamp-1 absolute-center-x'>
            Tải lên
          </p>
        </div>
      </div>

      <div className='w-full'>
        <div className='relative bg-black rounded-lg flex-center'>
          <TransformWrapper initialScale={1}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className='z-10 bg-white border rounded-lg opacity-80 border-l-slate-400 absolute-center-x top-6'>
                  <button className='px-2' onClick={() => zoomIn()}>
                    <IoAddOutline className='text-2xl' />
                  </button>
                  <button className='px-2 py-2 border-x border-slate-400' onClick={() => zoomOut()}>
                    <AiOutlineMinus className='text-2xl' />
                  </button>
                  <button className='px-2' onClick={() => resetTransform()}>
                    <GrPowerReset className='text-2xl' />
                  </button>
                </div>
                <TransformComponent>
                  <div className='bg-white w-[19.5rem] md:w-[27.5rem] h-[19.5rem] md:h-[27.5rem] image-container'>
                    <img
                      src={
                        uploadedImages.length > 0 && currentImageIndex >= (images?.length || 0)
                          ? URL.createObjectURL(uploadedImages[currentImageIndex - (images?.length || 0)])
                          : images?.[currentImageIndex] || defaultAvatar
                      }
                      alt=''
                      className='object-cover w-full h-full mx-auto'
                    />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        <div className='mt-4 flex-center-x'>
          <button className='px-4 py-2 h-full font-bold text-white flex-shrink-0 rounded-lg bg-sky-600 sm:py-2.5 hover:scale-105' onClick={handlePredict}>
            Chuẩn đoán
          </button>
        </div>
      </div>
    </section>
  );
}







