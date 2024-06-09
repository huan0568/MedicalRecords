import { CommentDiagnose, MainImageDiagnose } from '@/components/patient/diagnose'
import { DetailPatient, ImageResults } from '@/components/patient/result'
import { patients } from '@/utils/fakeData'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

export default function DiagnosePatientPage() {
  const { id } = useParams<{ id: string }>()

  // get data of patient by id from api and set to form
  // in this case, I use a fake data
  const tempData = patients.data.find((patient) => patient.id === id)

  return (
    <section id='result-patient' className='pt-16'>
      <div className='relative px-4 bg-white rounded-xl shadow-pop'>
        <a href='/' className='inline-flex items-center gap-3 text-xl absolute-center-y text-sky-600 hover:scale-105'>
          <FaLongArrowAltLeft className='text-3xl' /> Quay lại
        </a>
        <h1 className='py-4 mb-4 text-xl font-bold text-right md:text-center text-sky-600 lg:text-2xl'>
          Chuẩn đoán bệnh nhân
        </h1>
      </div>
      <div className='gap-4 lg:flex'>
        <div className='h-full py-3 mb-4 bg-white lg:w-1/6 rounded-xl shadow-pop lg:mb-0'>
          <DetailPatient data={tempData as IPatient} />
        </div>
        <div className='flex-1 p-4 mb-4 h-[33rem] bg-white rounded-xl shadow-pop lg:mb-0'>
          <MainImageDiagnose images={tempData?.images} />
        </div>
        <div className='lg:w-1/5'>
          <ImageResults data={tempData as IPatient}
            
          />
          <CommentDiagnose data={tempData as IPatient} />
        </div>
      </div>
    </section>
  )
}
