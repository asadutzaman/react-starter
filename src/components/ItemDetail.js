// src/components/ItemDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography } from 'antd';
import ItemService from '../services/ItemService';

const { Title, Paragraph } = Typography;

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await ItemService.getItemById(id);
                setItem(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching item:', error);
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Card title="Item Details" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={4}>{item.name}</Title>
            <Paragraph>{item.description}</Paragraph>
            <Paragraph>Price: ${item.price}</Paragraph>
        </Card>
    );
};

export default ItemDetail;
