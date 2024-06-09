import AddForm from '@/components/patient/form/addForm'
import ImageUploadItem from '@/components/patient/form/imageUpload'
import { toastError, toastSuccess } from '@/utils/toast'
import { useRef, useState } from 'react'
import { BsImages } from 'react-icons/bs'
import { FaLongArrowAltLeft } from 'react-icons/fa'

export interface FormData {
  name: string
  phone: string
  email: string
  age: number
  address: string
  images: File[]
}

export default function AddPatientPage() {
  const [files, setFiles] = useState<File[]>([])

  const handleAdd = async (data: FormData) => {
    try {
      // Generate a random 6-digit number
      const id_patient = Math.floor(100000 + Math.random() * 900000);
  
      const patientData = {
        id_patient,
        name: data.name,
        phone: data.phone,
        email: data.email,
        age: data.age,
        address: data.address
      };
  
      const response = await fetch('http://localhost:3001/patients/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
  
      if (!response.ok) {
        const errorData: { error: string } = await response.json();
        throw new Error(errorData.error);
      }
  
      if (files.length) {
        const uploadPromises = files.map((file) => {
          const imageFormData = new FormData();
          imageFormData.append('id_patient', String(id_patient));
          imageFormData.append('image_eyes', file);

          return fetch('http://localhost:3001/images/upload', {
            method: 'POST',
            body: imageFormData,
          });
        });

        const imageResponses = await Promise.all(uploadPromises);

        imageResponses.forEach(async (response) => {
          if (!response.ok) {
            const errorData: { error: string } = await response.json();
            throw new Error(errorData.error);
          }
        });
      }
  
      toastSuccess('Thêm bệnh nhân thành công');
    } catch (error) {
      toastError((error as Error).message);
    }
  };  

  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(newFiles)
    }
  }

  const handleRemoveImageUpload = (index: number) => () => {
    setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index))
  }

  return (
    <section id='add-patient' className='pt-16'>
      <div className='relative px-4 bg-white rounded-xl shadow-pop'>
        <a href='/' className='inline-flex items-center gap-3 text-xl absolute-center-y text-sky-600 hover:scale-105'>
          <FaLongArrowAltLeft className='text-3xl' /> Quay lại
        </a>
        <h1 className='py-4 mb-4 text-xl font-bold text-right md:text-center text-sky-600 lg:text-2xl'>
          Thêm bệnh nhân
        </h1>
      </div>

      <div className='gap-4 lg:flex'>
        <div className='flex-[2] h-full py-4 mb-4 bg-white rounded-xl shadow-pop lg:mb-0'>
          <h1 className='px-4 pb-4 mb-2 text-xl font-bold border-b-4 text-sky-600 border-slate-400'>
            Thông tin cá nhân
          </h1>
          <AddForm setFiles={setFiles} files={files} handle={handleAdd} />
        </div>
        <div className='flex-[3] py-2 bg-white shadow-pop rounded-xl'>
          <input
            type='file'
            className='hidden'
            id='file'
            name='file'
            accept='image/*, video/*'
            multiple
            onChange={handleChangeUpload}
            ref={inputRef}
          />
          <div className='flex items-end justify-between px-4 pb-2 border-b-4 border-slate-400'>
            <h2 className='mb-2 text-xl font-bold'>Ảnh đã tải lên</h2>
            <button
              type='button'
              onClick={handleUpload}
              className='gap-4 px-3 py-3 text-white flex-center-y hover:scale-105 rounded-xl bg-sky-600'
            >
              <p>Tải ảnh</p>
              <BsImages className='text-2xl' />
            </button>
          </div>
          <div className='px-4 '>
            {files.length ? (
              <ImageUploadItem images={files} onRemove={handleRemoveImageUpload} />
            ) : (
              <p className='mt-5 text-xl'>Không có ảnh nào được đăng tải</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}





