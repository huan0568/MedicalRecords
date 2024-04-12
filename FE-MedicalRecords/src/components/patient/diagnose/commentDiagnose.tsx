import { AddComment } from '@/components/dialogs'
import { useState } from 'react'

interface IProps {
  data: IPatient
}

export default function CommentDiagnose({ data }: IProps) {
  const [openComment, setOpenComment] = useState<boolean>(false)
  const [comment, setComment] = useState<string>(data.doctorComment || '')

  return (
    <section id='image-result' className='pt-2 bg-white rounded-xl shadow-pop'>
      <div className='justify-between gap-5 px-4 pb-2 mb-1 border-b-2 border-slate-400 flex-center-y'>
        <h1 className='text-xl font-bold'>Nhận xét</h1>
        <button
          onClick={() => setOpenComment(!openComment)}
          className='flex-shrink-0 px-4 py-2 font-bold text-white rounded-lg bg-sky-600 hover:scale-105'
        >
          {comment ? 'Thay đổi' : 'Thêm'}
        </button>
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
    </section>
  )
}
