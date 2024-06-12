import { CommentDiagnose, MainImageDiagnose } from '@/components/patient/diagnose'
import { DetailPatient, ImageResults } from '@/components/patient/result'
import { useState, useEffect } from 'react'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function DiagnosePatientPage() {
  const { id } = useParams<{ id: string }>()
  const [patientData, setPatientData] = useState<IPatient | null>(null)
  const [patientImages, setPatientImages] = useState<string[]>([])
  const [imageIds, setImageIds] = useState<string[]>([]) // State to store image IDs
  const [savedValues, setSavedValues] = useState<{ [key: string]: string }>({});
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientResponse = await axios.get(`http://localhost:3001/patients/find/${id}`)
        setPatientData(patientResponse.data)

        const imagesResponse = await axios.get(`http://localhost:3001/images/patient/${id}`)
        const images = imagesResponse.data.map((img: any) => {
          setImageIds((prevIds) => [...prevIds, img._id]); // Store image ID
          return `data:${img.contentType};base64,${arrayBufferToBase64(img.data.data)}`
        });
        setPatientImages(images)
        setCurrentImageId(imagesResponse.data[0]?._id); // Set initial image ID
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setPatientData(null)
        setPatientImages([])
      }
    }

    fetchPatientData()
  }, [id])

  // Function to convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

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
          {/* Render DetailPatient component with patientData */}
          {patientData ? <DetailPatient data={patientData} /> : null}
        </div>
        <div className='flex-1 p-4 mb-4 h-[33rem] bg-white rounded-xl shadow-pop lg:mb-0'>
          {/* Pass images and imageIds to MainImageDiagnose */}
          <MainImageDiagnose images={patientImages} imageIds={imageIds} id={id} setCurrentImageId={setCurrentImageId}/>
        </div>
        <div className='lg:w-1/5'>
          {/* Render ImageResults and CommentDiagnose components with patientData */}
          {patientData ? (
            <>
              <ImageResults data={patientData} savedValues={savedValues} setSavedValues={setSavedValues} />
              <CommentDiagnose data={patientData} savedValues={savedValues} currentImageId={currentImageId}/>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}






