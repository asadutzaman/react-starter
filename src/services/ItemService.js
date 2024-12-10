// src/services/ItemService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';


const getItems = (params) => axios.get(`${API_URL}/items`, { params });
const addItem = (item) => axios.post(`${API_URL}/items`, item);
const updateItem = (id, itemData) => axios.put(`${API_URL}/items/${id}`, itemData);
const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`); // DELETE for deletion
const getItemById = (id) => {
    return axios.get(`${API_URL}/items/${id}`);
};

export default {
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
};
