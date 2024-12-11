import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Input, Form, Space, Pagination, notification, Popconfirm } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import ItemService from '../services/ItemService';
import { useNavigate } from 'react-router-dom';

const ItemComponent = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: 0 });
    const [editItem, setEditItem] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchItems();
    }, [currentPage, search, sortBy, sortDirection]);

    const fetchItems = async () => {
        try {
            const response = await ItemService.getItems({
                search,
                sortBy,
                sortDirection,
                page: currentPage,
            });

            if (response && response.data) {
                setItems(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalItems(response.data.total);
            } else {
                setItems([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
            setTotalItems(0);
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
        form.setFieldsValue(item);
        setDrawerVisible(true);
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

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const resetForm = () => {
        setNewItem({ name: '', description: '', price: 0 });
        setEditItem(null);
        form.resetFields();
        setDrawerVisible(false);
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
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Item List</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
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
                current={currentPage}
                total={totalItems}
                pageSize={5}
                onChange={handlePageChange}
                style={{ marginTop: 20 }}
            />

            {/* Drawer */}
            <Drawer
                title={editItem ? 'Edit Item' : 'Add Item'}
                visible={drawerVisible}
                onClose={resetForm}
                width={400}
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
            </Drawer>
        </div>
    );
};

export default ItemComponent;
