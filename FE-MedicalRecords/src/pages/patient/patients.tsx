import { DeleteWarning, Diagnose } from '@/components/dialogs'
import SelectField from '@/components/forms/selectField'
import { useDebounce } from '@/components/hooks/useDebounce'
import useFilteredPatients from '@/components/hooks/useFilteredPatients'
import Pagination from '@/components/pagination'
import ListPatients from '@/components/patient/listPatients'
import { patients } from '@/utils/fakeData'
import { resultOptions } from '@/utils/filters'
import { toastError, toastSuccess } from '@/utils/toast'
import useHandleSetUrl from '@/utils/useHandleUrl'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoRefresh } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

export default function PatientPage() {
  const handleSetUrl = useHandleSetUrl()
  const [searchParams] = useSearchParams()

  async function fetchTest(){
    const res = await axios.get(`${import.meta.env.VITE_PUBLIC_API}/patients`)
    console.log(res.data)
  }


  useEffect(() => {
    fetchTest()
  },[])

  const keyword = searchParams.get('keyword') || ''
  const currentPage = searchParams.get('page') || 1

  const [search, setSearch] = useState<string>(keyword)
  const [selected, setSelected] = useState<IResultOptions>(resultOptions[0])
  const resultPatients = useFilteredPatients(selected, patients)

  const [openDeleteAlert, setOpenDeleteAlert] = useState<IOpenEditUser>({
    id: '',
    name: '',
    open: false
  })

  const [openDiagnose, setOpenDiagnose] = useState<boolean>(false)
  


  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = id || false
      if (res) {
        toastSuccess(`Xoá thành công bệnh nhân`)
      }
    } catch (error) {
      toastError((error as IError).error)
    }
  }, [])

  useDebounce(
    { search },
    300,
    async () => {
      if (!search) return
      handleSetUrl('keyword', search)
    },
    [search]
  )

  return (
    <section id='scroll' className='pt-16 pb-3'>
      <div className='p-4 bg-white rounded-2xl shadow-pop'>
        <h1 className='mb-4 text-2xl font-bold'>Danh sách bệnh nhân</h1>
        <div className='flex flex-col items-center gap-5 mb-4 lg:flex-row'>
          <div className='relative flex-1'>
            <input
              type='text'
              value={search}
              placeholder='Tìm kiếm bệnh nhân'
              className='w-full py-3 pl-4 pr-16 border-2 border-black rounded-xl'
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch className='text-3xl absolute-center-y right-5' />
          </div>
          <div className='flex-col sm:flex-row flex-center-y '>
            <SelectField setSelected={setSelected} selected={selected} resultOptions={resultOptions} />
            <button
              onClick={() => setSelected(resultOptions[0])}
              disabled={selected === resultOptions[0] ? true : false}
              className={`${selected === resultOptions[0] && 'cursor-not-allowed bg-opacity-55'}  flex-shrink-0 gap-3 px-4 py-2 mt-4 font-bold text-white sm:py-3 sm:mt-0 bg-rose-500 hover:scale-105 flex-center rounded-xl`}
            >
              <IoRefresh className='text-2xl' />
              Xóa bộ lọc
            </button>
          </div>
          <div className='flex-col sm:flex-row sm:gap-5 flex-center-y'>
            <button
              onClick={() => setOpenDiagnose(true)}
              className='flex-shrink-0 px-4 py-2 font-bold text-white rounded-xl bg-sky-600 sm:py-3 hover:scale-105'
            >
              Tiến hành chuẩn đoán
            </button>
            <a
              href='/add-patient'
              className='flex-shrink-0 px-4 py-2 mt-4 font-bold text-white rounded-xl sm:mt-0 bg-sky-600 sm:py-3 hover:scale-105'
            >
              Thêm bệnh nhân
            </a>
          </div>
        </div>

        <ListPatients patients={resultPatients} setOpenDeleteAlert={setOpenDeleteAlert} />

        <Diagnose openAlert={openDiagnose} setOpenAlert={() => setOpenDiagnose(!openDiagnose)} />

        <DeleteWarning
          title='bệnh nhân'
          openAlert={openDeleteAlert}
          setOpenAlert={() => setOpenDeleteAlert({ ...openDeleteAlert, open: false })}
          handleDelete={() => handleDelete(openDeleteAlert.id)}
        />

        <Pagination page={+currentPage} totalPage={resultPatients.totalPages} />
      </div>
    </section>
  )
}
