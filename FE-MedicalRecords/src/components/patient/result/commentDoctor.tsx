import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddComment } from '@/components/dialogs';
import { toast } from 'react-toastify';

interface IProps {
  data: IPatient;
  savedValues: { [key: string]: string };
  currentImageId: string | null;
}

const CommentDoctor: React.FC<IProps> = ({ data, savedValues, currentImageId }) => {
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [confirmClicked, setConfirmClicked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(data.doctorComment || '');

  useEffect(() => {
    console.log('Received saved values:', savedValues);
    console.log('Current image ID:', currentImageId);
    console.log('Comment:', comment);
  }, [savedValues, currentImageId, comment]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (currentImageId) {
        try {
          const response = await axios.get(`http://localhost:3001/feedbacks/image/${currentImageId}`);
          console.log('Full response:', response);
          if (response.data && response.data.feedbacks && response.data.feedbacks.length > 0) {
            console.log('Fetched feedback:', response.data.feedbacks[0].feedback);
            setComment(response.data.feedbacks[0].feedback || '');
          } else {
            console.log('No feedback found for this image');
            setComment(''); // Reset comment to empty string when no feedback is found
          }
        } catch (error) {
          console.error('Error fetching feedback:', error);
        }
      } else {
        setComment(''); // Reset comment to empty string if currentImageId is null
      }
    };
    fetchFeedback();
  }, [currentImageId]);

  const handleSaveFeedback = async () => {
    if (!currentImageId) {
      toast.error('No image selected');
      return;
    }

    const feedbackData = {
      id_image: currentImageId,
      mild_value: Number(savedValues.Mild),
      moderate_value: Number(savedValues.Moderate),
      noDR_value: Number(savedValues.No_DR),
      proliferateDR_value: Number(savedValues.Proliferate_DR),
      severe_value: Number(savedValues.Severe),
      diabetic_Retinopathy: savedValues['Diabetic Retinopathy'],
      feedback: comment,
    };

    try {
      const response = await axios.post('http://localhost:3001/feedbacks/create', feedbackData);
      if (response.status >= 200 && response.status < 300) {
        toast.success('Feedback saved successfully');
      } else {
        toast.error('Failed to save feedback');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Error saving feedback');
    }
  };

  const handleConfirm = () => {
    setConfirmClicked(true);
    handleSaveFeedback();
  };

  return (
    <section id='image-result' className='pt-2 bg-white rounded-xl shadow-pop'>
      <div className='justify-between gap-5 px-4 pb-2 mb-1 border-b-2 border-slate-400 flex-center-y'>
        <h1 className='text-xl font-bold'>Nhận xét</h1>
      </div>

      {comment ? (
        <p className={`${Number(comment?.length) >= 138 ? 'pl-2' : 'pl-4'} h-28 overflow-y-auto pt-1.5`}>{comment}</p>
      ) : (
        <p className='py-1.5 text-center'>Bác sĩ chưa có nhận xét</p>
      )}

      <AddComment
        comment={comment}
        setComment={setComment}
        openComment={openComment}
        setOpenComment={() => setOpenComment(!openComment)}
      />

      {confirmClicked && <p className='text-center mt-2 text-gray-500'>Feedback confirmed</p>}
    </section>
  );
};

export default CommentDoctor;


