// src/components/ItemComponent.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, Space, Pagination, notification } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ItemService from '../services/ItemService';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const ItemComponent = () => {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [newItem, setNewItem] = useState({ name: '', description: '', price: 0 });
    const [editItem, setEditItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, [search, sortBy, sortDirection]);

    const fetchItems = async (url = '/items') => {
        try {
            const response = await ItemService.getItems({
                search,
                sortBy,
                sortDirection,
            });
            setItems(response.data.data);
            setPagination({
                prev: response.data.prev_page_url,
                next: response.data.next_page_url,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddOrUpdateItem = async (values) => {
        try {
            if (editItem) {
                const response = await ItemService.updateItem(editItem.id, values);
                setItems(items.map(item => (item.id === editItem.id ? response.data : item)));
                notification.success({
                    message: 'Success',
                    description: 'Item updated successfully.',
                });
            } else {
                const response = await ItemService.addItem(values);
                setItems([response.data, ...items]);
                notification.success({
                    message: 'Success',
                    description: 'Item added successfully.',
                });
            }
            resetForm();
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'There was an issue with your request.',
            });
        }
    };

    const handleEdit = (item) => {
        setNewItem(item);
        setEditItem(item);
        form.setFieldsValue(item); // Set form fields for editing
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await ItemService.deleteItem(id);
            setItems(items.filter(item => item.id !== id));
            notification.success({
                message: 'Success',
                description: 'Item deleted successfully.',
            });
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'Failed to delete item.',
            });
        }
    };

    const handleSearch = (e) => setSearch(e.target.value);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const resetForm = () => {
        setNewItem({ name: '', description: '', price: 0 });
        setEditItem(null);
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleView = (id) => {
        navigate(`/items/${id}`);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: () => handleSort('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: () => handleSort('price'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Item List</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Add Item
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search items..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={handleSearch}
                style={{ marginBottom: 20, maxWidth: 300 }}
            />

            {/* Table */}
            <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                pagination={false}
            />

            {/* Pagination */}
            <Pagination
                style={{ marginTop: 20 }}
                onChange={(page) => fetchItems(pagination[page])}
                disabled={!pagination.prev && !pagination.next}
            />

            {/* Modal */}
            <Modal
                title={editItem ? "Edit Item" : "Add Item"}
                visible={isModalVisible}
                onCancel={resetForm}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrUpdateItem}
                    initialValues={newItem}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editItem ? 'Update' : 'Save'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ItemComponent;
