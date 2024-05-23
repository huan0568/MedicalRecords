import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IPatient {
  id_patient: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  address: string;
  haveResult?: boolean;
}

interface IResFormat<T> {
  data: T[];
}

interface IOpenEditUser {
  open: boolean;
  id: string;
  name: string;
}

interface IProps {
  patients: IResFormat<IPatient>;
  setOpenDeleteAlert: React.Dispatch<React.SetStateAction<IOpenEditUser>>;
}

const ListPatients: React.FC<IProps> = ({ patients, setOpenDeleteAlert }) => {
  const [allPatients, setAllPatients] = useState<IPatient[]>(patients.data);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/patients');
        const mongoData: IPatient[] = response.data;

        // Transform MongoDB data to match the structure expected by the component
        const transformedMongoData = mongoData.map(patient => ({
          ...patient,
          id: patient.id_patient,
          haveResult: false, // Or any other logic to determine this field
        }));

        // Combine fetched patients with the existing patients from props
        setAllPatients([...transformedMongoData, ...patients.data]);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [patients.data]);

  return (
    <div className='w-[calc(100vw-1rem)] overflow-x-auto lg:w-full'>
      <div className='min-w-full border-2 border-r-0 border-black border-y-0 lg:border-2 rounded-xl'>
        <table className='table min-w-full px-10'>
          <thead>
            <tr>
              <th>Mã bệnh nhân</th>
              <th className='w-48'>Tên</th>
              <th className='w-60'>Email</th>
              <th className='w-32'>Số điện thoại</th>
              <th className='w-10'>Tuổi</th>
              <th>Địa chỉ</th>
              <th className='w-28'>Kết quả</th>
              <th className='w-32'>Tương tác</th>
            </tr>
          </thead>
          <tbody className=''>
            {allPatients.map((item) => (
              <tr className='text-center' key={item.id ?? item.id_patient}>
                <td className='font-bold'>{item.id}</td>
                <td className=''>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.age}</td>
                <td>{item.address}</td>
                <td>
                  <a
                    href={`/result-patient/${item.id ?? item.id_patient}`}
                    className={`${item.haveResult ? 'bg-green-600' : 'bg-rose-600 pointer-events-none cursor-not-allowed'} text-white py-3 rounded-lg px-4 font-bold hover:scale-105`}
                  >
                    {item.haveResult ? 'Đã có' : 'Chưa có'}
                  </a>
                </td>
                <td className=''>
                  <div className='gap-3.5 flex-center-y'>
                    <a
                      href={`/edit-patient/${item.id ?? item.id_patient}`}
                      className='block px-3 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:scale-105'
                    >
                      Sửa
                    </a>
                    <button
                      onClick={() =>
                        setOpenDeleteAlert({
                          open: true,
                          id: item.id ?? item.id_patient,
                          name: item.name,
                        })
                      }
                      className='block px-3 py-3 font-bold text-white rounded-lg bg-rose-600 hover:scale-105'
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPatients;

