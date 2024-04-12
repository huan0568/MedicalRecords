interface IProps {
  data: IPatient
}

export default function CommentDoctor({ data }: IProps) {
  return (
    <section id='image-result' className='py-2 bg-white p- rounded-xl shadow-pop'>
      <h1 className='px-4 pb-2 mb-1 text-xl font-bold text-center border-b-2 border-slate-400'>Nhận xét</h1>
      {data.doctorComment ? (
        <p className={`${Number(data.doctorComment?.length) >= 138 ? 'pl-2' : 'pl-4'} h-28 overflow-y-auto pt-1.5`}>
          {data.doctorComment}
        </p>
      ) : (
        <p className='pt-1.5 text-center'>Bác sĩ chưa có nhận xét</p>
      )}
    </section>
  )
}
