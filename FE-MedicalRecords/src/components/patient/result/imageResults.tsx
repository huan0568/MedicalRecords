interface IProps {
  data: IPatient
  isShow?: boolean
}
export default function ImageResults({ data, isShow }: IProps) {
  return (
    <section id='image-result' className='pt-3 mb-4 bg-white rounded-xl shadow-pop'>
      <h1 className='px-4 pb-2 mb-2 text-xl font-bold text-center border-b-2 border-slate-400'>Kết quả ảnh</h1>
      <h3 className='px-4 pb-2 text-lg text-center border-b-2 border-slate-400'>
        Bác sĩ: <strong> {data.doctor} </strong>
      </h3>

      {data.result.map((item) => (
        <div key={item.title} className='px-4 border-b flex-center-y border-slate-400'>
          <h4 className='w-16 py-2 mr-4 border-r border-slate-400'>{item.title}</h4>
          {isShow && (
            <div className='justify-between flex-1 flex-center-y'>
              <h4 className='text-lg'>{item.percent.toFixed(2)}%</h4>
              <div
                className={`${item.percent >= 50 ? 'bg-rose-500' : 'bg-green-500'} w-5 aspect-square rounded-full`}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
