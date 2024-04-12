import defaultAvatar from '@/assets/default-avatar.png'
import { useState } from 'react'
import { AiOutlineMinus } from 'react-icons/ai'
import { GrPowerReset } from 'react-icons/gr'
import { IoAddOutline } from 'react-icons/io5'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface IProps {
  images?: IImages[]
}

export default function MainImage({ images }: IProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  console.log(images)

  return (
    <section id='main-image' className='h-full gap-2 md:flex'>
      <div className='flex w-full gap-2 mb-4 overflow-auto md:block md:w-40 md:mb-0'>
        {images?.length ? (
          images?.map((image, index) => (
            <div key={image.id} className='flex-shrink-0 image-container w-28 aspect-square'>
              <img
                onClick={() => setCurrentImageIndex(index)}
                src={image.url || defaultAvatar}
                alt=''
                className={`mb-2 image rounded-xl ${currentImageIndex === index && 'border-4 border-sky-600'}`}
              />
              <p
                className={`
              ${currentImageIndex === index ? 'bottom-1 w-[calc(100%-7.5px)] rounded-b-lg' : 'bottom-0 w-full rounded-b-xl'}
               text-center text-white bg-black bg-opacity-50 line-clamp-1 absolute-center-x`}
              >
                {image.title}
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
      </div>

      <div className='relative w-full bg-black rounded-lg flex-center'>
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
                <div className=' overflow-hidden w-[25rem] md:w-[30rem] lg:w-[25rem] bg-white rounded-lg image-container'>
                  <img
                    src={images?.[currentImageIndex]?.url || defaultAvatar}
                    alt=''
                    className='object-cover w-full h-full mx-auto '
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </section>
  )
}
