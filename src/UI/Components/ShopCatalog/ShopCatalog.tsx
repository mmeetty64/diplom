import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import 'flowbite';
import { Context } from '../../../Context/ContextWrapper'
import Service from '../../../Service/Service';
import { initFlowbite } from 'flowbite';

interface ICatalog {
  id: number;
  title: string;
  description: string;
  tokenPrice: number;
  shop: string;
  amount: number;
  created_at: number;
  status: boolean;
}

export const ShopCatalog = () => {
  const [catalog, setCatalog] = useState<ICatalog[]>([])
  const [action, setAction] = useState<number>(0)
  const navigation = useHistory();

  const {user, getTransact, transact} = useContext(Context);

  useEffect(() => {
    (async () => {
      const req: ICatalog[] = await Service.viewCatalog();
      setCatalog(req)
    })()
  }, [user, action])

    useEffect(() => {
      initFlowbite();
      import('flowbite');
    }, []);

  const viewDataHandler = (timestamp: number) =>{
    const date = new Date(timestamp*1000);

    // Получение различных частей даты
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Форматирование даты в строку (например, "YYYY-MM-DD HH:MM:SS")
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return(formattedDate); // Например, "2022-05-23 00:00:00"
    }

    const viewStatusHandler = (status: boolean) =>{
        let data = '';
        status == true ? 
        data = 'Активно'
        : data = 'Заморожено'
        return data;
    }

    const actionProduct = async(idProd: number, type: number) =>{
        if(type == 1){
            await Service.frozeProduct(idProd, user);
            alert('Продукт заморожен!');
        }
        if(type == 2){
            await Service.unfrozeProduct(idProd, user);
            alert('Продукт разморожен!');
        }
        setAction(action+1);
    }

    const actionProductHandler = (idProd: number, type: number) => {
        actionProduct(idProd, type).catch((error) => {
            alert('Произошла ошибка!');
        });
      };

      const createProductHandler = async(e: any) =>{
        e.preventDefault();
        const {target} = e
        let filePath = target[4].value;
        let fileName = filePath.split('\\').pop();
        let images= [fileName];
        console.log(images)
        
        try {
            await Service.createProduct(target[0].value, target[3].value, target[2].value, target[1].value, images, user)
            alert('Товар добавлен!');
            navigation.push('/ShopPanel')
          } catch (error) {
            console.error('Ошибка при добавлении товара', error);
            alert('Ошибка при добавлении товара');
          }
          setAction(action+1);  
    }

  return (
    <>
    <section className="p-3 sm:p-5">
    <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button id="defaultModalButton" data-modal-target="defaultModal" data-modal-toggle="defaultModal" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Добавить товар</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">ID</th>
                            <th scope="col" className="px-4 py-3">Название</th>
                            <th scope="col" className="px-4 py-3">Описание</th>
                            <th scope="col" className="px-4 py-3">Количество</th>
                            <th scope="col" className="px-4 py-3">Цена</th>
                            <th scope="col" className="px-4 py-3">Дата добавления</th>
                            <th scope="col" className="px-4 py-3">Статус</th>
                            <th scope="col" className="px-4 py-3">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            catalog.map((el) => {
                                if (el.shop.toLowerCase() != user.toLowerCase() ) return null;
                      
                                return (
                                    <tr className="border-b dark:border-gray-700">
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{el.id}</th>
                                    <td className="px-4 py-3">{el.title}</td>
                                    <td className="px-4 py-3">{el.description}</td>
                                    <td className="px-4 py-3">{el.amount}</td>
                                    <td className="px-4 py-3">{el.tokenPrice /10000} LED</td>
                                    <td className="px-4 py-3">{viewDataHandler(el.created_at)}</td>
                                    <td className="px-4 py-3">{viewStatusHandler(el.status)}</td>
                                    <td className="px-4 py-3 flex items-center justify-end">
                                    {
                                        el.status ?
                                        <button onClick={() => actionProductHandler(el.id, 1)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Заморозить
                                            </span>
                                        </button>
                                        : 
                                        <button onClick={() => actionProductHandler(el.id, 2)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Разморозить
                                            </span>
                                        </button>
                                    }
                                    
                                    </td>
                                </tr>
                                )
                              })
                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </section>
    <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Добавить товар
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form action="#" onSubmit={createProductHandler}>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Название</label>
                                <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Введите название"></input>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Количество</label>
                                <input type="number" name="amount" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Введите количество товара"></input>
                            </div>
                            <div>
                                <label htmlFor="tokenPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Цена</label>
                                <input type="number" name="tokenPrice" id="tokenPrice" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="100 LED"></input>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                                <textarea id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Введите описание товара"></textarea>                    
                            </div>
                            <div style={{width: "31.8vw"}}>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Загрузить картинку</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file"></input>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG.</p>
                            </div>
                        </div>
                        <button type="submit" className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Добавить товар
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}
