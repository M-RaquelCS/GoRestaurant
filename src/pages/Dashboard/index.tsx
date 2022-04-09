import { useEffect, useState } from 'react';

import {api} from '../../services/api';

import {Header} from '../../components/Header';
import {Food, PlateProps} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';
import { toast } from 'react-toastify';


export function Dashboard(){

  const [foods, setFoods] = useState<PlateProps[]>([])
  const [editingFood, setEditingFood] = useState({} as PlateProps)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get('/foods').then(response => {
      setFoods(response.data);
    })
  }, [])

  async function handleAddFood(food: PlateProps){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);

    } catch (err) {
      toast.error('Erro na adição do prato');
    }
  }

  async function handleUpdateFood(food: PlateProps){

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
      toast.error('Erro na edição do prato');
    }
  }

  async function handleDeleteFood(id: number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);

  }

  function toggleModal(){
    setModalOpen(!modalOpen)
  }

  function toggleEditModal(){
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: PlateProps){
    setEditingFood(food)
    setEditModalOpen(true)
  }

  
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food ={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}