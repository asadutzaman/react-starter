// src/components/MainLayout.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider width={200}>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1">
                        <Link to="/">Items</Link>
                    </Menu.Item>
                    {/* Add more sidebar links as needed */}
                </Menu>
            </Sider>

            {/* Main Layout with Top Navbar and Content */}
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div style={{ marginLeft: '16px' }}>Your App Name</div>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
